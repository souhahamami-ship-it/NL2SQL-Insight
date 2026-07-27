from sqlalchemy import text
from database import engine


def execute_sql(sql: str):
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql))

            return [dict(row._mapping) for row in result]

    except Exception as e:
        print("\nSQL EXECUTION ERROR")
        print(sql)
        print(e)
        raise