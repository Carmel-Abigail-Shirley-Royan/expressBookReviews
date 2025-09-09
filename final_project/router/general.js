const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "username or password not found" });

  }
  if (!isValid(username)) {
    return res.status(400).json({ success: false, message: "username already registered" });
  }
  users.push({ username, password });
  return res.json({ success: true, message: "user registered successfully" });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const list = Object.keys(books).map(b => ({ b, title: books[b].title, author: books[b].author }));
  res.json({ success: true, books: list });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const bkn = req.params.isbn;
  const book = books[bkn];
  if (!book) return res.status(400).json({ success: false, message: "Book not found" });
  res.json({ success: true, book });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const matches = Object.keys(books).filter(id => books[id].author.toLowerCase() === author).map(id => ({ id, ...books[id] }));
  if (matches.length === 0) {
    return res.status(404).json({ success: false, message: "No books found for this author" });
  }
  res.json({ success: true, matches });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.author.toLowerCase();
  const matches = Object.keys(books).filter(id => books[id].author.toLowerCase() === title).map(id => ({ id, ...books[id] }));
  if (matches.length === 0) {
    return res.status(404).json({ success: false, message: "No books found for this title" });
  }
  res.json({ success: true, matches });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const id = req.params.isbn;
  const book = books[id];
  if (!book) return res.status(400).json({ success: false, message: "Bokk not found" });
  res.json({ success: true, reviews: book.reviews });
});

module.exports.general = public_users;
