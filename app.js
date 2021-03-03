const express = require("express");
const path = require("path");

// const MongoClient = require("mongodb").MongoClient; -> move to routes.js
// const assert = require("assert");  -> move to routes.js

const hbs = require("express-handlebars");
const router = require("./routes/routes");

const app = express();
const port = 3000;

// Set Handlebars
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: true }));

app.use("/", router);



// const url = "mongodb://localhost:27017";  -> move to routes.js
// const dbName = "testDatabase";  -> move to routes.js

// const client = new MongoClient(url);  // seems we dont need

app.use(express.static(__dirname + "/public/stylesheets/"));


// following line needs to come before app.use router, to get the POST form working
// app.use(express.urlencoded({ extended: true }));


//GET
app.get("/get", function (req, res) {
  const resultArray = [];
  MongoClient.connect(url, (err, client) => {
    const db = client.db(dbName);
    const collection = db.collection("users");
    const info = collection.find();

    info.forEach(
      function (doc) {
        resultArray.push(doc);
      },
      function () {
        res.send(JSON.stringify(resultArray));
      }
    );
  });
});

//POST
app.post("/", (req, res) => {
  const name = {
    fname: req.body.fname,
    lname: req.body.lname,
  };
  MongoClient.connect(url, (err, client) => {
    assert.strictEqual(null, err);

    const db = client.db(dbName);
    const collection = db.collection("users");

    collection.insertOne(name);
  });

  res.redirect("/get");
});

app.listen(port, () => console.log(`Listening on port:${port}`));
