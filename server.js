// require('dotenv').config();
let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
let mongoose = require("mongoose");
// let exphbs = require("express-handlebars");
let axios = require("axios");
let request = require("request");
let cheerio = require("cheerio");
// ============================================
let PORT = 3000;
let db = require("./models");
let app = express();
// ============================================
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
// connect to the Mongo DB
mongoose.connect("mongodb://localhost/News", { useNewUrlParser: true });

// ============================================
// app.use(express.static("public"));
// app.engine("handlebars", exphbs({
//     defaultLayout: "main"
// }));
// app.set("view engine", "handlebars");
// ============================================
let url = "https://www.nytimes.com/section/food";
// Making a request for `nhl.com`'s homepage
request(url, function(error, response, html) {
  // Load the body of the HTML into cheerio
  let $ = cheerio.load(html);

  $("article.story").each(function(i, element) {
    let results = {};
      
    let headline = $(element).find("h2.headline").text();
    let link = $(element).find("a").attr("href");
    let summary = $(element).find("p.summary").text();
    let author = $(element).find("p.byline").text();
    
    // Make an object with data we scraped from the N.Y. Times
    results.push({
      headline: headline,
      link: link,
      summary: summary,
      author: author
    
    });
  });

  // After looping through each article.story log the results
  // console.log(results);
});

app.get("/", function(req, res) {
	Article.find({}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
		}
		else{
			res.render("index", {articles: data});
		}
	});
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });