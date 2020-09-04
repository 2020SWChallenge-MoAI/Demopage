var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/assets"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("ejs", require("ejs-locals"));

//routing
app.use("/api", require("./api"));
app.get("/keyword-ext", (req, res) => { res.render("keyword-ext", {nav_choice: 2}); })
app.get("/qna-valid-chk", (req, res) => { res.render("qna-valid-chk", {nav_choice: 3}); });
app.get("/", (req, res) => { res.render("home", {nav_choice: 1}); });

app.listen(8888, "172.26.0.1", () => {
  console.log("Example app listening at http://172.26.0.1:8888");
})