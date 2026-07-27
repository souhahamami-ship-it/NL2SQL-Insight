from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.employees import router as employee_router
from routers.departments import router as department_router

from services.ai_service import (
    generate_sql,
    generate_answer
)

from services.sql_service import (
    execute_sql
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
@app.get("/")
def home():
    return {
        "message": "FastAPI is running"
    }

from fastapi import HTTPException

@app.post("/chat")
def chat(request: ChatRequest):
    try:
        sql = generate_sql(request.question)
        
        if not sql.upper().startswith("SELECT"):
            raise HTTPException(status_code=400, detail="Only SELECT queries are allowed.")
        print("=" * 50)
        print("Generated SQL:")
        print(sql)
        print("=" * 50)
        rows = execute_sql(sql)

        answer = generate_answer(request.question, sql, rows)

        return {
            "generated_sql": sql,
            "answer": answer
        }

    except Exception  as e:
        print(e)
        raise

@app.get("/dashboard")
def dashboard():
    # Summary Cards
    total_customers = execute_sql("""
        SELECT COUNT(*) AS TotalCustomers
        FROM Sales.Customer
    """)

    total_products = execute_sql("""
        SELECT COUNT(*) AS TotalProducts
        FROM Production.Product
    """)

    total_orders = execute_sql("""
        SELECT COUNT(*) AS TotalOrders
        FROM Sales.SalesOrderHeader
    """)

    total_revenue = execute_sql("""
        SELECT SUM(TotalDue) AS TotalRevenue
        FROM Sales.SalesOrderHeader
    """)

    average_order = execute_sql("""
        SELECT AVG(TotalDue) AS AverageOrderValue
        FROM Sales.SalesOrderHeader
    """)

    # Revenue by Month
    revenue_by_month = execute_sql("""
        SELECT
            YEAR(OrderDate) AS Year,
            MONTH(OrderDate) AS Month,
            SUM(TotalDue) AS Revenue
        FROM Sales.SalesOrderHeader
        GROUP BY YEAR(OrderDate), MONTH(OrderDate)
        ORDER BY Year, Month
    """)

    # Orders by Month
    orders_by_month = execute_sql("""
        SELECT
            YEAR(OrderDate) AS Year,
            MONTH(OrderDate) AS Month,
            COUNT(*) AS Orders
        FROM Sales.SalesOrderHeader
        GROUP BY YEAR(OrderDate), MONTH(OrderDate)
        ORDER BY Year, Month
    """)

    # Top 10 Products by Revenue
    top_products = execute_sql("""
        SELECT TOP (10)
            p.Name,
            SUM(sod.LineTotal) AS Revenue
        FROM Sales.SalesOrderDetail AS sod
        INNER JOIN Production.Product AS p
            ON sod.ProductID = p.ProductID
        GROUP BY p.Name
        ORDER BY Revenue DESC
    """)

    # Product Categories
    categories = execute_sql("""
        SELECT
            pc.Name,
            COUNT(*) AS Products
        FROM Production.Product AS p
        INNER JOIN Production.ProductSubcategory AS ps
            ON p.ProductSubcategoryID = ps.ProductSubcategoryID
        INNER JOIN Production.ProductCategory AS pc
            ON ps.ProductCategoryID = pc.ProductCategoryID
        GROUP BY pc.Name
        ORDER BY Products DESC
    """)

    # Recent Orders
    recent_orders = execute_sql("""
        SELECT TOP (10)
            SalesOrderID,
            OrderDate,
            TotalDue
        FROM Sales.SalesOrderHeader
        ORDER BY OrderDate DESC
    """)

    return {
        "cards": {
            "customers": total_customers[0]["TotalCustomers"],
            "products": total_products[0]["TotalProducts"],
            "orders": total_orders[0]["TotalOrders"],
            "revenue": float(total_revenue[0]["TotalRevenue"] or 0),
            "averageOrderValue": float(average_order[0]["AverageOrderValue"] or 0)
        },
        "revenueByMonth": revenue_by_month,
        "ordersByMonth": orders_by_month,
        "topProducts": top_products,
        "categories": categories,
        "recentOrders": recent_orders
    }    

app.include_router(employee_router)
app.include_router(department_router)