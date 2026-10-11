
app.get('/suppliers', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Suppliers');
    res.json(rows);
});

app.patch('/suppliers/:id', async (req, res) => {
    const { SupplierName, ContactNumber } = req.body;

    const [result] = await pool.query(
        UPDATE Suppliers
    SET SupplierName = COALESCE(?, SupplierName),
        ContactNumber = COALESCE(?, ContactNumber)
    WHERE SupplierID = ?,
        [SupplierName ?? null, ContactNumber ?? null, req.params.id]
);

    res.json({ message: 'Supplier updated', affectedRows: result.affectedRows });
});

app.delete('/suppliers/:id', async (req, res) => {
    const [result] = await pool.query(
        'DELETE FROM Suppliers WHERE SupplierID = ?',
        [req.params.id]
    );

    res.json({ message: 'Supplier deleted', affectedRows: result.affectedRows });
});

// Q4: Sales

app.post('/sales', async (req, res) => {
    const { ProductID, QuantitySold, SaleDate } = req.body;

    const [result] = await pool.query(
        INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
    VALUES (?, ?, ?),
        [ProductID, QuantitySold, SaleDate]
);

    res.json({ message: 'Sale recorded', id: result.insertId });
});

app.get('/sales', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Sales');
    res.json(rows);
});

app.get('/sales/product/:id', async (req, res) => {
    const [rows] = await pool.query(
        'SELECT * FROM Sales WHERE ProductID = ?',
        [req.params.id]
    );

    res.json(rows);
});

// Q5: Database modifications

app.post('/database/add-category', async (req, res) => {
    await pool.query(
        'ALTER TABLE Products ADD COLUMN Category VARCHAR(100)'
    );

    res.json({ message: 'Category column added' });
});

app.delete('/database/remove-category', async (req, res) => {
    await pool.query(
        'ALTER TABLE Products DROP COLUMN Category'
    );

    res.json({ message: 'Category column removed' });
});

app.patch('/database/contact-number', async (req, res) => {
    await pool.query(
        'ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)'
    );

    res.json({ message: 'ContactNumber changed to VARCHAR(15)' });
});

app.patch('/database/product-name-not-null', async (req, res) => {
    await pool.query(
        'ALTER TABLE Products MODIFY ProductName VARCHAR(100) NOT NULL'
    );

    res.json({ message: 'ProductName is NOT NULL' });
});

// Q6: Insert required sample data

app.post('/seed', async (req, res) => {
    const [existing] = await pool.query(
        'SELECT SupplierID FROM Suppliers WHERE SupplierName = ?',
        ['FreshFoods']
    );

    let supplierId;

    if (existing.length > 0) {
        supplierId = existing[0].SupplierID;
    } else {
        const [supplier] = await pool.query(
            INSERT INTO Suppliers (SupplierName, ContactNumber)
        VALUES (?, ?),
            ['FreshFoods', '01001234567']
    );

        supplierId = supplier.insertId;
    }

    const products = [
        ['Milk', 15.00, 50],
        ['Bread', 10.00, 30],
        ['Eggs', 20.00, 40]
    ];

    for (const product of products) {
        const [found] = await pool.query(
            'SELECT ProductID FROM Products WHERE ProductName = ?',
            [product[0]]
        );

        if (found.length === 0) {
            await pool.query(
                INSERT INTO Products
            (ProductName, Price, StockQuantity, SupplierID)
            VALUES (?, ?, ?, ?),
                [product[0], product[1], product[2], supplierId]
        );
        }
    }


const [milk] = await pool.query(
    'SELECT ProductID FROM Products WHERE ProductName = ?',
    ['Milk']
);

if (milk.length > 0) {
    const [sale] = await pool.query(
        SELECT SaleID FROM Sales
    WHERE ProductID = ? AND QuantitySold = 2 AND SaleDate = ?,
        [milk[0].ProductID, '2025-05-20']
);

    if (sale.length === 0) {
        await pool.query(
            INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
        VALUES (?, ?, ?),
            [milk[0].ProductID, 2, '2025-05-20']
    );
    }
}

res.json({ message: 'Sample data inserted' });
});

// Q7: Update Bread price

app.patch('/products/bread/price', async (req, res) => {
    const [result] = await pool.query(
        'UPDATE Products SET Price = 25.00 WHERE ProductName = ?',
        ['Bread']
    );

    res.json({ message: 'Bread price updated', affectedRows: result.affectedRows });
});

// Q8: Delete Eggs

app.delete('/products/eggs', async (req, res) => {
    const [result] = await pool.query(
        'DELETE FROM Products WHERE ProductName = ?',
        ['Eggs']
    );

    res.json({ message: 'Eggs deleted', affectedRows: result.affectedRows });
});

// Q9: Total quantity sold for each product

app.get('/reports/quantity-sold', async (req, res) => {
    const [rows] = await pool.query(
        SELECT p.ProductName,
        COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    GROUP BY p.ProductID, p.ProductName
);

    res.json(rows);
});

// Q10: Product with highest stock quantity

app.get('/reports/highest-stock', async (req, res) => {
    const [rows] = await pool.query(
        SELECT * FROM Products
    WHERE StockQuantity = (
        SELECT MAX(StockQuantity) FROM Products
)
);

    res.json(rows);
});

// Q11: Suppliers whose names start with F

app.get('/reports/suppliers-starting-f', async (req, res) => {
    const [rows] = await pool.query(
        "SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'"
    );

    res.json(rows);
});

// Q12: Products that have never been sold

app.get('/reports/never-sold', async (req, res) => {
    const [rows] = await pool.query(
        SELECT p.*
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    WHERE s.SaleID IS NULL
);

    res.json(rows);
});

// Q13: Sales report using JOIN

app.get('/reports/sales-details', async (req, res) => {
    const [rows] = await pool.query(
        SELECT p.ProductName, s.QuantitySold, s.SaleDate
    FROM Sales s
    JOIN Products p ON s.ProductID = p.ProductID
);

    res.json(rows);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
}

startServer().catch(console.error);

