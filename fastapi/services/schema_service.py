from sqlalchemy import text
from database import engine


def get_schema():
    return """
Production.Product
(
    ProductID,
    Name,
    ProductNumber,
    Color,
    StandardCost,
    ListPrice,
    ProductSubcategoryID
)

Production.ProductCategory
(
    ProductCategoryID,
    Name
)

Production.ProductSubcategory
(
    ProductSubcategoryID,
    ProductCategoryID,
    Name
)

Production.ProductInventory
(
    ProductID,
    Quantity
)

Sales.Customer
(
    CustomerID,
    PersonID
)

Person.Person
(
    BusinessEntityID,
    FirstName,
    LastName
)

Sales.SalesOrderHeader
(
    SalesOrderID,
    CustomerID,
    OrderDate,
    Status,
    TotalDue
)

Sales.SalesOrderDetail
(
    SalesOrderID,
    ProductID,
    OrderQty,
    UnitPrice,
    LineTotal
)
"""
        

    