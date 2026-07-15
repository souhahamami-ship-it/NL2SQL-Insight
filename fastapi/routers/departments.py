from fastapi import APIRouter
from sqlalchemy import text
from database import engine

router = APIRouter()


@router.get("/departments")
def get_departments():

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT *
                FROM Departments
            """)
        )

        departments = []

        for row in result:

            departments.append({
                "Id": row.Id,
                "Name": row.Name
            })

        return departments