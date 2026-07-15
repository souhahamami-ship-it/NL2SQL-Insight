from sqlalchemy import text
from database import engine


def execute_sql(sql: str):

    with engine.connect() as conn:

        result = conn.execute(
            text(sql)
        )

        rows = []

        for row in result:
            rows.append(
                dict(row._mapping)
            )

        return rows