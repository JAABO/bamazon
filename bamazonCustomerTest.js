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
connection.query("SELECT product_name, price FROM products", function (err, res) {
    if (err) throw err;

    var result = [];
    res.forEach(function (item) {
        result.push(`${item.product_name} | $${item.price}`)
    })

    connection.end();
    start(result);
});

//.connect() => start() => confirm()=> howMany() 


//NODE

var selected_item;
var selected_item_price;
var selected_quantity;


//this function populates the product info in list with price
var start = function (inventory) {
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
            selected_item_price = item_price;

            console.log("\nYou Chose " + item + ".\n");
            console.log("\nPrice: $" + item_price);
            confirm(item);
        });


}

var confirm = function () {
    inquirer.prompt({
        name: "confirm",
        type: "rawlist",
        message: "Are you sure?",
        choices: ["yes", "no"]
    }).then(function (confirmation) {
        if (confirmation.confirm === "yes") {//if yes prompt next function
            howMany();
        } else {
            console.log("\nYou said NO!\n");
            //here we grab only product name and price from the data products
            connection.query("SELECT product_name, price FROM products", function (err, res) {


                var result = [];
                res.forEach(function (item) {
                    result.push(`${item.product_name} | $${item.price}`)
                })


                start(result);

            });


        }
    })
};

//I need prompt function to ask how many to buy?
var howMany = function () {

    inquirer.prompt({
        name: "quantity",
        message: "How many would you like?"
    }).then(function (ans) {
        var quantity_selected = ans.quantity;//selected quantity to buy

        console.log("\nYou purchase was succesful!\n".yellow);

    });
};



// // instantiate 
// var prompt = function() {
//     inquirer.prompt({
//         name:"table_create",
//         message:"Want to create a table?",
//         choices: ["yes", "no"]
//     }).then (function(ans) {
//         if(ans.table_create === "yes"){
//                 create_table();
//             } else (console.log("NO"));
//         }); 
//     };

// var create_table = function(){
//     var table = new Table({
//         head: ['', 'TH 2 label']
//         , colWidths: [100, 200]
//     });

//     // table is an Array, so you can `push`, `unshift`, `splice` and friends 
//     table.push(
//         ['First value', 'Second value']
//         , ['First value', 'Second value'.blue]);

//     console.log(table.toString());
// };



// // function to handle posting new items up for auction
// function postAuction() {
//     // prompt for info about the item being put up for auction
//     inquirer
//         .prompt([
//             {
//                 name: "item",
//                 type: "input",
//                 message: "What is the item you would like to submit?"
//             },
//             {
//                 name: "category",
//                 type: "input",
//                 message: "What category would you like to place your auction in?"
//             },
//             {
//                 name: "startingBid",
//                 type: "input",
//                 message: "What would you like your starting bid to be?",
//                 validate: function (value) {
//                     if (isNaN(value) === false) {
//                         return true;
//                     }
//                     return false;
//                 }
//             }
//         ])
//         .then(function (answer) {
//             // when finished prompting, insert a new item into the db with that info
//             connection.query(
//                 "INSERT INTO auctions SET ?",
//                 {
//                     item_name: answer.item,
//                     category: answer.category,
//                     starting_bid: answer.startingBid,
//                     highest_bid: answer.startingBid
//                 },
//                 function (err) {
//                     if (err) throw err;
//                     console.log("Your auction was created successfully!");
//                     // re-prompt the user for if they want to bid or post
//                     start();
//                 }
//             );
//         });
// }

// function bidAuction() {
//     // query the database for all items being auctioned
//     connection.query("SELECT * FROM auctions", function (err, results) {
//         if (err) throw err;
//         // once you have the items, prompt the user for which they'd like to bid on
//         inquirer
//             .prompt([
//                 {
//                     name: "choice",
//                     type: "rawlist",
//                     choices: function () {
//                         var choiceArray = [];
//                         for (var i = 0; i < results.length; i++) {
//                             choiceArray.push(results[i].item_name);
//                         }
//                         return choiceArray;
//                     },
//                     message: "What auction would you like to place a bid in?"
//                 },
//                 {
//                     name: "bid",
//                     type: "input",
//                     message: "How much would you like to bid?"
//                 }
//             ])
//             .then(function (answer) {
//                 // get the information of the chosen item
//                 var chosenItem;
//                 for (var i = 0; i < results.length; i++) {
//                     if (results[i].item_name === answer.choice) {
//                         chosenItem = results[i];
//                     }
//                 }

//                 // determine if bid was high enough
//                 if (chosenItem.highest_bid < parseInt(answer.bid)) {
//                     // bid was high enough, so update db, let the user know, and start over
//                     connection.query(
//                         "UPDATE auctions SET ? WHERE ?",
//                         [
//                             {
//                                 highest_bid: answer.bid
//                             },
//                             {
//                                 id: chosenItem.id
//                             }
//                         ],
//                         function (error) {
//                             if (error) throw err;
//                             console.log("Bid placed successfully!");
//                             start();
//                         }
//                     );
//                 }
//                 else {
//                     // bid wasn't high enough, so apologize and start over
//                     console.log("Your bid was too low. Try again...");
//                     start();
//                 }
//             });
//     });
// }
