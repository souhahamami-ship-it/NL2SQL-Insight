import requests
from services.schema_service import get_schema

schema = get_schema()

def generate_sql(question: str): 
    prompt = f"""
You are an expert Microsoft SQL Server (T-SQL) developer.

Your task is to generate exactly ONE valid SQL Server SELECT query that answers the user's question.

Database
--------
AdventureWorks2022

Available Schema
----------------
{schema}

Known Relationships
-------------------
Production.Product.ProductSubcategoryID = Production.ProductSubcategory.ProductSubcategoryID

Production.ProductSubcategory.ProductCategoryID = Production.ProductCategory.ProductCategoryID

Production.ProductInventory.ProductID = Production.Product.ProductID

Sales.SalesOrderHeader.CustomerID = Sales.Customer.CustomerID

Sales.Customer.PersonID = Person.Person.BusinessEntityID

Sales.SalesOrderHeader.SalesOrderID = Sales.SalesOrderDetail.SalesOrderID

Sales.SalesOrderDetail.ProductID = Production.Product.ProductID

Restrictions
------------
Use ONLY the tables and columns contained in the provided schema.

Never:
- invent a table
- invent a column
- invent a relationship
- assume missing information

If the user's request cannot be answered using ONLY the provided schema, return exactly:

SELECT 'Unable to answer with available schema.' AS Message;

SQL Rules
---------
1. Generate ONLY one SELECT statement.
2. Never generate:
   - INSERT
   - UPDATE
   - DELETE
   - DROP
   - ALTER
   - CREATE
   - TRUNCATE
   - EXEC
   - MERGE
3. Never use SELECT *.
4. Return only the required columns.
5. Use Microsoft SQL Server (T-SQL) syntax only.
6. Use TOP instead of LIMIT.
7. Never use MySQL, PostgreSQL, Oracle or SQLite syntax.
8. Use explicit INNER JOIN or LEFT JOIN.
9. Always qualify tables with their schema.
10. Always prefix every column with its table alias.
11. Never use implicit joins.
12. Use descriptive column aliases.
13. Use ORDER BY whenever ranking or ordering is requested.
14. Use GROUP BY whenever aggregate functions are mixed with non-aggregated columns.
15. Use HAVING only when filtering aggregated results.
16. Use DISTINCT only when necessary.
17. Return ONLY the SQL query.
18. Do NOT explain your answer.
19. Do NOT use Markdown.
20. Do NOT include comments.
21. Do NOT wrap the query in code fences.
22. Output must be valid SQL Server syntax.

Table Aliases
-------------
p    = Production.Product
ps   = Production.ProductSubcategory
pc   = Production.ProductCategory
pi   = Production.ProductInventory
c    = Sales.Customer
per  = Person.Person
soh  = Sales.SalesOrderHeader
sod  = Sales.SalesOrderDetail

Natural Language Rules
----------------------
If the user asks:

- "How many..." → use COUNT().
- "Count..." → use COUNT().
- "Total..." → use SUM() when appropriate.
- "Average..." → use AVG().
- "Maximum" or "Highest" → use MAX() or ORDER BY DESC.
- "Minimum" or "Lowest" → use MIN() or ORDER BY ASC.
- "Latest" or "Most recent" → ORDER BY date DESC.
- "Oldest" → ORDER BY date ASC.
- "Top N" → use TOP (N).
- "First N" → use TOP (N).
- "List", "Show", or "Display" → return rows, not COUNT().
- "Distinct" or "Unique" → use DISTINCT.
- "Revenue" → SUM(soh.TotalDue) if TotalDue exists.
- "Inventory" → use Production.ProductInventory.

Decision Rules
--------------
Before writing the query:

1. Identify the required tables.
2. Verify every referenced column exists in the provided schema.
3. Verify every join follows a known relationship.
4. If any required column or relationship is missing, return the fallback query.
5. Generate exactly one valid SELECT statement.

Examples
--------

Question:
Show total revenue.

SQL:
SELECT
    SUM(soh.TotalDue) AS TotalRevenue
FROM Sales.SalesOrderHeader AS soh;

Question:
How many products are there?

SQL:
SELECT
    COUNT(*) AS TotalProducts
FROM Production.Product AS p;

Question:
Show the latest 10 orders.

SQL:
SELECT TOP (10)
    soh.SalesOrderID,
    soh.OrderDate,
    soh.TotalDue
FROM Sales.SalesOrderHeader AS soh
ORDER BY soh.OrderDate DESC;

Question:
List product names with their category.

SQL:
SELECT
    p.Name AS ProductName,
    pc.Name AS CategoryName
FROM Production.Product AS p
INNER JOIN Production.ProductSubcategory AS ps
    ON p.ProductSubcategoryID = ps.ProductSubcategoryID
INNER JOIN Production.ProductCategory AS pc
    ON ps.ProductCategoryID = pc.ProductCategoryID;

User Question
-------------
{question}

Return ONLY the SQL query.
"""

    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json={
            "model": "qwen2.5-coder:7b",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    sql = data["response"]

    sql = sql.replace("```sql", "")
    sql = sql.replace("```", "")
    sql = sql.strip().rstrip(";")

    return sql
    

def generate_answer(
    question: str,
    sql: str,
    rows
):
    if not rows:
        return "No matching records were found."

    prompt = f"""
You are an AI Sales Analytics Assistant.

Your task is to answer the user's question using ONLY the SQL query result.

User Question
-------------
{question}

Executed SQL
------------
{sql}

SQL Result
----------
{rows}

Instructions
------------
Base your answer exclusively on the SQL result.

Never:
- invent facts
- infer missing information
- guess values
- assume trends or causes
- mention columns or data not present in the result
- explain the SQL query
- include the SQL query
- mention databases, tables, or SQL
- return JSON, Python objects, XML, or Markdown tables

If the SQL result is empty, reply exactly:

No matching records were found.

Formatting Rules
----------------
- Write in clear, natural, professional business language.
- Be concise while including all relevant information.
- Answer the user's question directly.
- Do not include unnecessary introductions or conclusions.
- Do not use bullet points unless multiple records are returned.
- Do not number results unless ordering is meaningful.
- Preserve the order of rows exactly as returned.
- Preserve column names only when they improve readability.

Result Handling
---------------
If the result contains:

• A single value
    - Return only that value in a natural sentence.

• One row with multiple columns
    - Summarize the row naturally.

• Multiple rows
    - Present each row as a readable bullet list.
    - Include only the returned columns.

• Aggregate results (COUNT, SUM, AVG, MIN, MAX)
    - State the aggregate directly without mentioning SQL.

• Boolean values
    - Express them naturally (Yes/No, True/False) if appropriate.

• NULL values
    - Display them as "Not available".

Numbers & Dates
---------------
- Preserve numeric precision from the SQL result.
- Do not round unless already rounded.
- Preserve all dates exactly as returned.
- Do not reformat timestamps.

Currency
--------
- Preserve currency symbols exactly as returned.
- Never convert currencies.
- Never add a currency symbol that is not present.
- Never assume the currency.

Tone
----
- Professional
- Neutral
- Helpful
- Direct

Do NOT start with phrases such as:
- "Based on the SQL result..."
- "According to the data..."
- "Here is the answer..."
- "The query returned..."
- "The SQL shows..."

Output Requirements
-------------------
- Produce only the final answer.
- Do not include explanations.
- Do not include reasoning.
- Do not include disclaimers.
- Do not mention these instructions.

Answer:
"""
    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json={
            "model": "qwen2.5-coder:7b",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    return data["response"].strip()