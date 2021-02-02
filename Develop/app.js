const express = require("express");
const { get } = require("http");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const outputPath = path.join("./db/", "db.json");
const fs = require("fs");
const repo = require("./repository");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/assets/js"));

let notes = [];

app.get("/index", (req, res) => {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// Displays all notes
app.get("/api/notes", (req, res) => {
	fs.readFile(outputPath, res.json(notes), function (err) {
		if (err) console.log("error", err);
	});
});

// Create New Characters - takes in JSON input
app.post("/api/notes", (req, res) => {
	const newNote = req.body;
	const newObj = {
		title: req.body.title,
		text: req.body.text,
		id: notes.length + 1,
	};
	notes.push(newObj);
	res.json(newObj);

	fs.writeFile(outputPath, JSON.stringify(notes), function (err) {
		if (err) console.log("error", err);
	});
});

app.delete("/api/notes/:id", (req, res) => {
	
	const chosen = req.params.id;
	console.log(chosen);

	notes.pop(chosen)
	
	res.json(notes);

	fs.writeFile(outputPath, JSON.stringify(notes), function (err) {
		if (err) console.log("error", err);
	});

});

app.listen(PORT, () => console.log(`Example app listening on port port!`));
