const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;
// const objectId = require('mongodb').ObjectID;   // we do not use yet?

const assert = require("assert");
// The assert module provides a way of testing expressions. If the expression evaluates to 0, or false, an assertion failure is being caused, and the program is terminated.

const url = "mongodb://localhost:27017";
const dbName = "testDatabase";

// GET for output id
router.get("/home/:id", (req, res) => {
  res.render('page', { output: req.params.id });
});

// GET for CRUD
router.get("/", (req, res) => {
  res.render("home", { title: "CRUD exercises: Create, Read, Update, Delete", myDemoArray: [1, 2, 3, "huhu"] });
});

// GET for GET DATA (output "Insert Data" form)
router.get('/get-data', function (req, res) {
  // array for input data
  const resultArray = [];
  // connect to database
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    const db = client.db(dbName); // database name (from mongoDB)
    const collection = db.collection('any');  // mongoDB username
    const info = collection.find(); // find all from user ('any')

    // loop through stuff from input
    info.forEach(function(doc) {
      // push stuff from collection into array
      resultArray.push(doc);
    }, function () {
      // render "home" with title and user input (array content)
      res.render('home', {
        title: "CRUD output", items: resultArray
      })
    })
  })
})


// POST for getting id from input
router.post("/home", (req, res) => {
  // console.log() // to debug
  // render user input from first form (with submit button)
  res.render('page', { output: req.body.id });
});

// POST for form input
router.post("/insert", function(req, res) {
  const item = {
    title: req.body.title,
    content: req.body.content, 
    author: req.body.author
  }

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
    assert.strictEqual(null, err);  // testing expression (why? which?) 

    const db = client.db(dbName);
    const collection = db.collection('any');
    collection.insertOne(item); // inserts item into the collection
  })

  // Redirect to trailing “/” when the pathname is a directory 
  res.redirect("/");
})

/////////////before the blue boxes//////////////////
// router.get("/", (req, res) => {
//   res.render("home", {title: "Express with Handlebars", myArray: [1,2,3]});
// });

// // GET
// // route for pages
// router.get('/page/:id', function(req, res) {
//   res.render('page', { output: req.params.id })
// })

// // POST -> home.hbs form
// router.post('/page/submit', function(req, res) {
//   console.log(req.body.id);
//   const id = req.body.id;
//   res.redirect('/page/' +id)
// })

// note: in HTML only (POST, GET) Methods allowed, but we can make (DELETE, PUT) method using fetch()

module.exports = router;