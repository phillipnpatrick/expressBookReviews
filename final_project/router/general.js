const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});

            const message = new Object();
            message.message = "User (" + username + ") successfully registered. Now you can login.";

            return res.status(200).json(JSON.stringify(message));
        } else {
            const message = new Object();
            message.message = "User (" + username + ") already exists!";

            return res.status(404).json(message);
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

function takeTimeout(lengthOfTimeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Other things to do before completion of the promise
        console.log("Timed out for " + lengthOfTimeout);

        // The fulfillment value of the promise
        resolve("Promised timeout resolved");
      }, lengthOfTimeout);
    });
  }
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    takeTimeout(6000).then((successMessage) => {
        // Send JSON response with formatted books data
        res.send(JSON.stringify(books,null,4));
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL
    const isbn = req.params.isbn;

    takeTimeout(7000).then((successMessage) => {
        // send the corresponding book's details
        res.send(books[isbn]);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve the author parameter from the request URL
    const author = req.params.author;
    let results = [];

    takeTimeout(5000).then((successMessage) => {
        console.log("Returning books by author: " + author);

        Object.entries(books).forEach(([key, value]) => {        
            let bAuthor = value["author"];
            if (bAuthor.toLowerCase().indexOf(author.toLowerCase()) !== -1) {
                results.push(value);            
            }
        });

        // send the corresponding book's details
        res.send(results);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title parameter from the request URL
    const title = req.params.title;
    let results = [];

    console.log("Please wait will loading books with '" + title + "' in the title.");

    takeTimeout(5000).then((successMessage) => {
        Object.entries(books).forEach(([key, value]) => {        
            let bTitle = value["title"];
            if (bTitle.toLowerCase().indexOf(title.toLowerCase()) !== -1) {
                results.push(value);            
            }
        });

        // send the corresponding book's details
        res.send(results);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL
    const isbn = req.params.isbn;

    // send the corresponding book's reviews
    res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
