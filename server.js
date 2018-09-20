// require('dotenv').config();
let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let mongoose = require("mongoose");

let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");

// ============================================
let path = require("path");
let PORT = process.env.PORT || 3000;
let db = require("./models");
let app = express();
// ============================================
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
// ============================================
// connect to the Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/News";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true 
})
.then(connection => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log(err.message);
});

// ============================================
// ============================================
// Use express.static to serve the public folder as a static directory
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
// ============================================
// Use express.static to serve the public folder as a static directory
// Handlerbars  
let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
// ============================================
app.get("/", function (req, res) {
  res.render("index");
});

// ============================================
app.get("/", function (req, res) {
  db.Article.find({})
    .then(function (articles) {
      res.render("index", {
        articles: articles
      });
    })
    .catch(function (err) {
      res.json(err);
    })
})
// ============================================


// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/section/food").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    let $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      let result = {};
    
      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this)
        .find("h2.headline").text();
      result.link = $(this)
        .find("a").attr("href");
      result.summary = $(this)
        .find("p.summary").text();
      result.author = $(this)
        .find("p.byline").text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Start the server
app.listen(PORT, function() {
    console.log(`App running on port ${PORT} !`);
  });