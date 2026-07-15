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

@app.get("/")
def home():
    return {
        "message": "FastAPI is running"
    }

@app.get("/chat")
def chat(question: str):

    sql = generate_sql(question)

    sql = sql.strip().rstrip(";")

    if not sql.upper().startswith("SELECT"):
        return {
            "error": "Only SELECT queries are allowed",
            "generated_sql": sql
        }

    rows = execute_sql(sql)

    answer = generate_answer(
        question,
        rows
    )

    return {
        "generated_sql": sql,
        "answer": answer
    }

app.include_router(employee_router)
app.include_router(department_router)