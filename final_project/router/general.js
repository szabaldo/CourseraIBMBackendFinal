const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let prom = new Promise((resolve, reject) => {
    resolve(res.status(200).json({books: JSON.stringify(books)}));
  })
  prom.then((successMessage) => {
    return successMessage;
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  isbn = req.params.isbn
  
  let prom = new Promise((resolve, reject) => {
    resolve(res.status(200).json({books: books[isbn]}))
  })
  prom.then((successMessage) => {
    return successMessage;
  })
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  author = req.params.author; 
  let ret_books = []
  let prom = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    for (let key in keys) {
      if (books[parseInt(key)+1]['author'] == author) {
        ret_books.push(books[parseInt(key)+1])
      }
    }
    resolve(res.status(200).json({books: ret_books}))
  })
  prom
    .then((successMessage) => {
      return successMessage;
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  title = req.params.title; 
  let ret_books = []
  let prom = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    for (let key in keys) {
      if (books[parseInt(key)+1]['title'] == title) {
        ret_books.push(books[parseInt(key)+1])
      }
    }
    resolve(res.status(200).json({books: ret_books}))
  })
  prom.then((successMessage) => {
    return successMessage;
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn
  return res.status(200).json({books: books[isbn]['reviews']});
});

module.exports.general = public_users;
