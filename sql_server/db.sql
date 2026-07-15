CREATE TABLE Employees (
    Id INT PRIMARY KEY,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Salary DECIMAL(10,2),
    DepartmentId INT,

    FOREIGN KEY (DepartmentId)
    REFERENCES Departments(Id)
);

CREATE TABLE Departments (
    Id INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

INSERT INTO Departments VALUES
(1,'IT'),
(2,'HR'),
(3,'Finance');

INSERT INTO Employees VALUES
(1,'Ahmed','Ben Ali',3500,1),
(2,'Sonia','Trabelsi',4200,1),
(3,'Mohamed','Jaziri',3000,2),
(4,'Leila','Ayadi',5000,3);