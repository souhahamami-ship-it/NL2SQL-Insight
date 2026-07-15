from sqlalchemy import text
from database import engine


def get_schema():

    schema_text = ""

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT
                    TABLE_NAME,
                    COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                ORDER BY
                    TABLE_NAME,
                    ORDINAL_POSITION
            """)
        )

        tables = {}

        for row in result:

            table = row.TABLE_NAME
            column = row.COLUMN_NAME

            if table not in tables:
                tables[table] = []

            tables[table].append(column)

    for table, columns in tables.items():

        schema_text += f"{table}(\n"

        for column in columns:
            schema_text += f"    {column},\n"

        schema_text += ")\n\n"
        schema_text += """
Relationships:

Employees.DepartmentId references Departments.Id
"""

    return schema_text