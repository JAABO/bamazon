DROP DATABASE IF EXISTS products_DB;
CREATE DATABASE products_DB;

USE products_DB;

CREATE TABLE products(
    item_id INTEGER(10) NOT NULL,
    product_name VARCHAR(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    price INT NOT NULL,
    stock_quantity INT,

    PRIMARY KEY(item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
    (10001, "drone", "Technology", 100, 750),
    (10002, "camera", "Technology", 150, 900),
    (10003, "laptop", "Technology", 200, 800),
    (10004, "TV", "Home-decor", 250, 100),
    (10005, "hat", "Clothes", 10, 1000),
    (10006, "t-shirt", "Clothes", 20, 1000),
    (10007, "towels", "Home-decor", 10, 100),
    (10008, "banana", "Grocery", 1, 300),
    (10009, "bread", "Grocery", 5, 400),
    (10010, "butter", "Grocery", 3, 200); 


