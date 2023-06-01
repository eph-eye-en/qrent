const dotenv = require("dotenv");
dotenv.config();
const { PORT=7073, REDIRECTS_FILE="./redirects.csv" } = process.env;

const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.static("./static"));
app.use(express.urlencoded({ extended: false }));

let redirects = new Map(
	fs.readFileSync(REDIRECTS_FILE).toString().split("\n")
	.filter(l => l.trim() != "")
	.map(l => l.split(/,(.*)/))
	.concat([["", "/"]])
);
console.log("Read redirects from " + REDIRECTS_FILE);

function doRedirect(req, res, code) {
	if(redirects.has(code))
		res.redirect(redirects.get(code));
	else
		res.status(404).end("Not found");
}

app.get("/:code", (req, res) => {
	console.log("GET\t/:code\t" + req.params.code);
	doRedirect(req, res, req.params.code);
})

app.post("/", (req, res) => {
	console.log("POST\t/\t" + req.body.code);
	doRedirect(req, res, req.body.code);
});

app.listen(PORT);
console.log("Listening on port " + PORT);
