const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require("assert");

const url = "mongodb://localhost:27017";
const dbName = "testDatabase";

router.get("/", (req, res) => {
  // res.render('page', { output: req.params.id });

  res.render("home", { title: "CRUD exercises: Create, Read, Update, Delete", myArray: [1, 2, 3, "huhu"] });
});

router.get('/get-data', function (req, res) {
  const resultArray = [];
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    const db = client.db(dbName);
    const collection = db.collection('users2');
    const info = collection.find();

    info.forEach(function (doc) {
      resultArray.push(doc);
    }, function () {
      res.render('home', {
        title: "CRUD exercises", items: resultArray
      })
    })
  })
})

router.post("/insert", function(req, res) {
  const item = {
    title: req.body.title,
    content: req.body.content, 
    author: req.body.author
  }

  MongoClient.connect(url, function(err, client) {
    assert.strictEqual(null, err);

    const db = client.db(dbName);
    const collection = db.collection('users2');
    collection.insertOne(item);
  })

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
router.post('/page/submit', function(req, res) {
  console.log(req.body.id);
  const id = req.body.id;
  res.redirect('/page/' +id)
})

// note: in HTML only (POST, GET) Methods allowed, but we can make (DELETE, PUT) method using fetch()

module.exports = router;