import requests
from services.schema_service import get_schema

schema = get_schema()

def generate_sql(question: str):
    schema = get_schema()

    prompt = f"""
You are a SQL Server expert.

Database schema:

{schema}
Generate a valid SQL Server query.


Rules:

- Always return the columns needed to answer the question.
- When employees are requested, return:
    Id,
    FirstName,
    LastName,
    Salary,
    Department Name.
- Use explicit JOINs.
- Never use SELECT *.
- Return only the SQL query.



Do not explain.
Do not use markdown.
Do not add comments.

Question:
{question}
"""

    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json={
            "model": "llama3.2:3b",
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
    rows
):
    if not rows:
        return "No matching records were found."
    prompt = f"""
You are an HR assistant.

User question:
{question}

SQL result:
{rows}

ARules:


- Answer ONLY using the SQL result.
- Do not explain your reasoning.
- Do not describe what should be done.
- Do not make recommendations.
- Do not write code.
- Do not write SQL.
- Answer in natural language.
- If no records are found, say so.
- Do not return raw JSON.
- Do not return Python lists.
- Do not make assumptions.
- Be concise.
- Do not invent facts.
- If the result contains COUNT(...),
  describe it as a count.
- If the result contains SUM(...),
  describe it as a total.
- If the result contains AVG(...),
  describe it as an average.




Answer:
"""

    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json={
            "model": "llama3.2:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    data = response.json()

    return data["response"]