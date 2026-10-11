

CREATE TABLE Suppliers (
    SupplierID INT PRIMARY KEY AUTO_INCREMENT,
    SupplierName VARCHAR(100),
    ContactNumber VARCHAR(20)
);

CREATE TABLE Products (
     ProductID INT PRIMARY KEY AUTO_INCREMENT,
     ProductName VARCHAR(100),
     Price DECIMAL(10,2),
     StockQuantity INT,
     SupplierID INT,
     FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE Sales (
     SaleID INT PRIMARY KEY AUTO_INCREMENT,
     ProductID INT,
     QuantitySold INT,
     SaleDate DATE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);