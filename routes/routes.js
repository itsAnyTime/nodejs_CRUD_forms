const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const objectId = require('mongodb').ObjectID;  
const assert = require("assert");

const url = "mongodb://localhost:27017";  
const dbName = "testDatabase";  

// router.get("/", (req, res) => {
//   res.render("home", {title: "CRUD exercises", myArray: [1,2,3, "huhu"]});
// });



/////////////before the blue boxes//////////////////
router.get("/", (req, res) => {
  res.render("home", {title: "Express with Handlebars", myArray: [1,2,3]});
});

// GET
// route for pages
router.get('/page/:id', function(req, res) {
  res.render('page', { output: req.params.id })
})

// POST -> home.hbs form
router.post('/page/submit', function(req, res) {
  console.log(req.body.id);
  const id = req.body.id;
  res.redirect('/page/' +id)
})

// note: in HTML only (POST, GET) Methods allowed, but we can make (DELETE, PUT) method using fetch()

module.exports = router;