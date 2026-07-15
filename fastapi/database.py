from sqlalchemy import create_engine

DATABASE_URL = (
    "mssql+pyodbc://sa:YourStrong%40Pass123"
    "@sqlserver/HRDemo"
    "?driver=ODBC+Driver+18+for+SQL+Server"
    "&TrustServerCertificate=yes"
)

engine = create_engine(DATABASE_URL)