// * Required npm pages and express modules.
const express = require("express");
const { get } = require("http");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const outputPath = path.join("./Develop/db/", "db.json");
const fs = require("fs");
const uniqid = require("uniqid");

// * Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/Develop/public"));
app.use(express.static(__dirname + "/Develop/public/assets/js"));

let notes = [];

// * Get method to get the index.html
app.get("/index", (req, res) => {
	res.sendFile(path.join(__dirname, "./Develop/./public/index.html"));
});

// * Get method to get the notes.html
app.get("/notes", (req, res) =>
	res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))
);

// * Get request. To see the db.json file.
app.get("/api/notes", (req, res) => {
	fs.readFile(outputPath, res.json(notes), function (err) {
		if (err) console.log("error", err);
	});
});

// * Post request. Creating a new id for each note and pushing it into the note array.
app.post("/api/notes", (req, res) => {
	const newNote = req.body;
	const newObj = {
		title: req.body.title,
		text: req.body.text,
		id: uniqid(),
	};
	notes.push(newObj);
	res.json(newObj);

	fs.writeFile(outputPath, JSON.stringify(notes), function (err) {
		if (err) console.log("error", err);
	});
});

// * Delete request.
app.delete("/api/notes/:id", (req, res) => {
	const deleteNote = req.params.id;
	for (let i = 0; i < notes.length; i++) {
		if (notes[i].id === deleteNote) {
			notes.splice(i, 1);
		}
	}
	res.json(notes);

	fs.writeFile(outputPath, JSON.stringify(notes), function (err, result) {
		if (err) console.log("error", err);
	});
});

app.listen(PORT, () => console.log(`Example app listening on port 3000!`));
