const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const objectId = require('mongodb').ObjectID;   // for updating

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
  MongoClient.connect(url, { useUnifiedTopology: true }, { useNewUrlParser: true }, function (err, client) {
    const db = client.db(dbName); // database name (from mongoDB)
    const collection = db.collection('any');  // mongoDB username
    const info = collection.find(); // find all from user ('any')

    // loop through stuff from input
    info.forEach(function (doc) {
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
router.post("/insert", function (req, res) {
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  }

  MongoClient.connect(url, { useUnifiedTopology: true }, { useNewUrlParser: true }, function (err, client) {
    assert.strictEqual(null, err);  // testing expression (why? which?) 

    const db = client.db(dbName);
    const collection = db.collection('any');
    collection.insertOne(item); // inserts item into the collection

    // catch error
    if (!err)
      // Redirect to trailing “/” when the pathname is a directory
      res.redirect("/");
    else
      console.log("Error during insertion: " + err);
  })
})
//HINTS
// to read POST Data in Server side use (req.body)
// to read GET Data in Server side use (req.params)
// don't forget to put (name) property to each input inside the form

// const mongoose = require('mongoose');

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

// mongoose.connect(url, (err) => {
//   if (!err) {
//     console.log('Successfully Established Connection with MongoDB')
//   }
//   else {
//     console.log('Failed to Establish Connection with MongoDB with Error: ' + err)
//   }
// });


// UPDATE
// update data in MongoDB
router.post("/update", function (req, res, next) {
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;

  MongoClient.connect(url, { useUnifiedTopology: true }, { useNewUrlParser: true }, function (err, client) {
    assert.strictEqual(null, err);  // testing expression (why? which?) 

    const db = client.db(dbName);
    db.collection('any').updateOne({ "_id": objectId(id) }, { $set: item }, function (err, result) {
    });
    if (!err) {
      console.log("update success");
      res.redirect('/');
    } else
      console.log("Error during updating: " + err);
  })
})

// DELETE request
router.post('/delete', function (req, res, next) {
  var id = req.body.id;

  MongoClient.connect(url, { useUnifiedTopology: true }, { useNewUrlParser: true }, function (err, client) {
    assert.strictEqual(null, err);  // testing expression (why? which?) 

    const db = client.db(dbName);
    db.collection('any').deleteOne({ "_id": objectId(id) }, function (err, result) {
    });
    if (!err) {
      console.log("Deleted successfully");
      res.redirect('/');
    }
    else { console.log('Failed to Delete: ' + err); }
  });
});


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