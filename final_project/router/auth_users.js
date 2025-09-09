const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const found = users.find(u => u.username === username);
  return !found;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "mySecretKey", { expiresIn: "1h" });
    req.session.token = token;
    return res.json({ success: true, message: "login successfull", token });

  }
  else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const id = req.params.isbn;
  const book = books[id];
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
  try {
    const token = req.session.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, "mySecretKey");
    const username = decoded.username;
    const { review } = req.body;
    if (!review) {
      return res.status(400).json({ success: false, message: "Review text required" });

    }
    books.review[username] = review;
    return res.json({ success: true, message: "Review added/updated", reviews: book.reviews });

  }
  catch (error) {
    return res.status(401).json({ success: false, message: "invalid or expired token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
