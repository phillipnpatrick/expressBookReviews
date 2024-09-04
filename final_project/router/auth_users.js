const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        const message = new Object();
        message.message = "User (" + username + ") successfully logged in.";

        return res.status(200).json(JSON.stringify(message));

    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    
    if (username) {
        const isbn = req.params.isbn;
        const review = req.body.review;

        const newReview = new Object();
        newReview.username = username;
        newReview.review = review;

        if (books[isbn]["reviews"].length) {
            let userReviews = books[isbn]["reviews"].filter((review) => review.username !== username);

            if (books[isbn]["reviews"].length){
                books[isbn]["reviews"] = userReviews;
            } else {
                books[isbn]["reviews"] = [];                
            }        
        } else {
            books[isbn]["reviews"] = [];
        }
        books[isbn]["reviews"].push(newReview);  
        
        const message = new Object();
        message.message = "Review by " + username + " successfully updated.";

        return res.status(200).json(JSON.stringify(message));
    } else {
        return res.status(210).json({ message: "You must have a login to write a book review."});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    
    if (username) {
        const isbn = req.params.isbn;
        
        if (books[isbn]["reviews"].length) {
            books[isbn]["reviews"] = books[isbn]["reviews"].filter((review) => review.username !== username);
            
            const message = new Object();
            message.message = "Review by " + username + " successfully deleted.";

            return res.status(200).json(JSON.stringify(message));
        } else {
            return res.status(240).json({ message: "There are no reviews for this book."});    
        }
    } else {
        return res.status(210).json({ message: "You must have a login to write a book review."});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
