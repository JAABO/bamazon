//REQUIRE
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require('cli-table');


//CONNECTION

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "products_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    
    console.log("connected as id ".green + connection.threadId);
    console.log(`\n====================\n WELCOME to Bamazon\n==================== \n   Command store\n`.yellow)

    
}); 

//here we grab only product name and price from the data products


var pullInventory= function () {
    
    connection.query("SELECT product_name, price FROM products", function (err, res) {
        if (err) throw err;
        
        var result = [];
        res.forEach(function(item){
            result.push(`${item.product_name} | $${item.price}`)
        })


    start(result);
});
}

pullInventory();

//pullInventory() => start() => howMany() => updateInventory


//NODE

var selected_item;

//this function populates the product info in list with price
var start = function(inventory) {
    inquirer
        .prompt({
            name: "makeYourChoice",
            type: "rawlist",
            message: "What would you like to buy? Choose an index please.",
            choices: inventory,
            pageSize: 14
        })
        .then(function (answer) {
            // based on the answer,
            var item = answer.makeYourChoice.split("|")[0].trim();
            selected_item = item;

            var item_price = answer.makeYourChoice.split("$")[1].trim();

            console.log("\nYou chose " + item.blue + ".");
            console.log("\nPrice: $" + item_price + "\n");
            howMany(item);
        });
    }


//I need prompt function to ask how many to buy?
var howMany = function(makeYourChoice) {

    inquirer.prompt({
        name:"quantity",
        message:"How many would you like?"
    }).then (function(ans){
        var quantity_selected = ans.quantity;//selected quantity to buy

        updateInventory(makeYourChoice, quantity_selected);
    });
};

var updateInventory = function (makeYourChoice, quantity_selected) {

    var query = connection.query(
        "SELECT price, stock_quantity FROM products WHERE product_name= ? ",
        [makeYourChoice],
        function (err, res) {
                if (err) throw err;
                var stock = res[0].stock_quantity;
                console.log(stock);

                if (stock <= 0) {
                    console.log(`\nThis product is out of stock.\n`.red);

                pullInventory();
            }
                else if (stock >= quantity_selected) {

                    var new_stock = (stock - quantity_selected);
                    var total = (quantity_selected * res[0].price);

                connection.query( "UPDATE products SET ? WHERE ?",
                            [
                                {   stock_quantity: new_stock},

                                {   product_name: makeYourChoice}
                            ],

                    function (err, res) {
                        if (err) throw err;

                        console.log("\nYou purchase was succesful!".yellow);
                        console.log("===========================")
                        console.log(`\nYou have bought ${quantity_selected} ${selected_item} for $${total}`.yellow + "\n");
        
                        pullInventory();
                    })

                    } else { 

                        console.log(`\nStock is insufficient. Please try again.\n`.red);    
                        howMany(makeYourChoice);
                    connection.end();  
                    }

            });
        };


