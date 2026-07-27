/*
=========================================================
AdventureWorks2022 - AI Sales Chatbot Reference
=========================================================

Database: AdventureWorks2022

Only these tables are used by the chatbot.

=========================================================
1. Products
=========================================================
*/

-- Production.Product
-- Primary Key: ProductID

SELECT
    ProductID,
    Name,
    ProductNumber,
    Color,
    StandardCost,
    ListPrice,
    ProductSubcategoryID
FROM Production.Product;


/*
=========================================================
2. Product Categories
=========================================================
*/

-- Production.ProductCategory
-- Primary Key: ProductCategoryID

SELECT
    ProductCategoryID,
    Name
FROM Production.ProductCategory;


/*
=========================================================
3. Product Subcategories
=========================================================
*/

-- Production.ProductSubcategory
-- Primary Key: ProductSubcategoryID

SELECT
    ProductSubcategoryID,
    ProductCategoryID,
    Name
FROM Production.ProductSubcategory;


/*
=========================================================
4. Inventory
=========================================================
*/

-- Production.ProductInventory

SELECT
    ProductID,
    LocationID,
    Shelf,
    Quantity
FROM Production.ProductInventory;


/*
=========================================================
5. Customers
=========================================================
*/

-- Sales.Customer

SELECT
    CustomerID,
    PersonID,
    StoreID,
    TerritoryID
FROM Sales.Customer;


/*
=========================================================
6. Customer Names
=========================================================
*/

-- Person.Person

SELECT
    BusinessEntityID,
    FirstName,
    LastName
FROM Person.Person;


/*
=========================================================
7. Sales Orders
=========================================================
*/

-- Sales.SalesOrderHeader

SELECT
    SalesOrderID,
    CustomerID,
    OrderDate,
    Status,
    TotalDue
FROM Sales.SalesOrderHeader;


/*
=========================================================
8. Sales Order Details
=========================================================
*/

-- Sales.SalesOrderDetail

SELECT
    SalesOrderID,
    ProductID,
    OrderQty,
    UnitPrice,
    LineTotal
FROM Sales.SalesOrderDetail;


/*
=========================================================
Relationships
=========================================================

Product.ProductSubcategoryID
    -> ProductSubcategory.ProductSubcategoryID

ProductSubcategory.ProductCategoryID
    -> ProductCategory.ProductCategoryID

ProductInventory.ProductID
    -> Product.ProductID

SalesOrderHeader.CustomerID
    -> Customer.CustomerID

Customer.PersonID
    -> Person.BusinessEntityID

SalesOrderDetail.SalesOrderID
    -> SalesOrderHeader.SalesOrderID

SalesOrderDetail.ProductID
    -> Product.ProductID

=========================================================
Common Joins
=========================================================

Products + Category

Product
JOIN ProductSubcategory
    ON Product.ProductSubcategoryID = ProductSubcategory.ProductSubcategoryID
JOIN ProductCategory
    ON ProductSubcategory.ProductCategoryID = ProductCategory.ProductCategoryID

---------------------------------------------------------

Orders + Customer

SalesOrderHeader
JOIN Customer
    ON SalesOrderHeader.CustomerID = Customer.CustomerID

---------------------------------------------------------

Customer + Person

Customer
JOIN Person
    ON Customer.PersonID = Person.BusinessEntityID

---------------------------------------------------------

Order + Product

SalesOrderDetail
JOIN Product
    ON SalesOrderDetail.ProductID = Product.ProductID

---------------------------------------------------------

Header + Details

SalesOrderHeader
JOIN SalesOrderDetail
    ON SalesOrderHeader.SalesOrderID = SalesOrderDetail.SalesOrderID

=========================================================