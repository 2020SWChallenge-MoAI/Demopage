var express = require("express");
var app = express();
var utils = require("./utils");

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));
app.use(express.json({
    limit: "50mb"
}));

app.use(express.static(__dirname + "/assets"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("ejs", require("ejs-locals"));

//routing
app.use("/api", require("./api"));
app.get("/keyword-ext", (req, res) => { res.render("keyword-ext", {nav_choice: 1}); })
app.get("/ner", (req, res) => { res.render("ner", {nav_choice: 2}); })
app.get("/qna-valid-chk", (req, res) => { res.render("qna-valid-chk", {nav_choice: 3}); });
app.get("/", (req, res) => { res.redirect("/keyword-ext") });

app.listen(9000, "0.0.0.0", () => {
    utils.log("", "Listening at http://0.0.0.0:9000");
})