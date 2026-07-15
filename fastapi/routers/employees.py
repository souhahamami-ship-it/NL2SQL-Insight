from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter()


@router.get("/employees")
def get_employees():

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT *
                FROM Employees
            """)
        )

        employees = []

        for row in result:

            employees.append({
                "Id": row.Id,
                "FirstName": row.FirstName,
                "LastName": row.LastName,
                "Salary": float(row.Salary),
                "DepartmentId": row.DepartmentId
            })

        return employees


@router.get("/employees/{employee_id}")
def get_employee(employee_id: int):

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT *
                FROM Employees
                WHERE Id = :id
            """),
            {"id": employee_id}
        )

        row = result.fetchone()

        if row is None:
            return {"error": "Employee not found"}

        return {
            "Id": row.Id,
            "FirstName": row.FirstName,
            "LastName": row.LastName,
            "Salary": float(row.Salary),
            "DepartmentId": row.DepartmentId
        }

@router.get("/employee-details")
def employee_details():

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT
                    e.Id,
                    e.FirstName,
                    e.LastName,
                    e.Salary,
                    d.Name AS Department
                FROM Employees e
                INNER JOIN Departments d
                    ON e.DepartmentId = d.Id
            """)
        )

        employees = []

        for row in result:

            employees.append({
                "Id": row.Id,
                "FirstName": row.FirstName,
                "LastName": row.LastName,
                "Salary": float(row.Salary),
                "Department": row.Department
            })

        return employees        