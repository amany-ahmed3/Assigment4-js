-- Q14: Create user and grant permissions

CREATE USER IF NOT EXISTS 'store_manager'@'localhost'
IDENTIFIED BY 'Store@12345';

GRANT SELECT, INSERT, UPDATE
      ON store_db.*
          TO 'store_manager'@'localhost';


-- Q15: Revoke UPDATE permission

REVOKE UPDATE
    ON store_db.*
    FROM 'store_manager'@'localhost';


-- Q16: Grant DELETE only on Sales table

GRANT DELETE
ON store_db.Sales
TO 'store_manager'@'localhost';