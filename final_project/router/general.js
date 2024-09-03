const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send JSON response with formatted books data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL
    const isbn = req.params.isbn;

    // send the corresponding book's details
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve the author parameter from the request URL
    const author = req.params.author;
    let results = [];

    Object.entries(books).forEach(([key, value]) => {        
        let bAuthor = value["author"];
        if (bAuthor.toLowerCase().indexOf(author.toLowerCase()) !== -1) {
            results.push(value);            
        }
    });

    // send the corresponding book's details
    res.send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title parameter from the request URL
    const title = req.params.title;
    let results = [];

    Object.entries(books).forEach(([key, value]) => {        
        let bTitle = value["title"];
        if (bTitle.toLowerCase().indexOf(title.toLowerCase()) !== -1) {
            results.push(value);            
        }
    });

    // send the corresponding book's details
    res.send(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL
    const isbn = req.params.isbn;

    // send the corresponding book's reviews
    res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
