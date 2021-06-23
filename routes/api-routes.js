const fs = require("fs");
const util = require("util");
const uuidv1 = require("uuid/v1");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class store {
  read() {
    return readFileAsync("../db/db.json", "utf8");
  }
  write(note) {
    return writeFileAsync("../db/db.json", JSON.stringify(note));
  }

  getNotes() {
    return this.read().then((notes) => {
      let parsedNotes;
      try {
        parsedNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        parsedNotes = [];
      } return parsedNotes;
    });
  }

  addNote(note) {
    const {title, text} = note;
    const newNote = { title, text, id: uuidv1() };
    return this.getNotes()
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  removeNote(id) {
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = (app) => {
    app.get("/notes", (req, res) => {
    store.getNotes().then((notes) => {
        return res.json(notes);
      })
      .catch((err) => res.status(500).json(err));
  });
  
    app.post("/notes", (req, res) => {
    store.addNote(req.body).then((note) => res.json(note))
      .catch((err) => res.status(500).json(err));
  });
  
    app.delete("/notes/:id", (req, res) => {
    store.removeNote(req.params.id).then(() => res.json({ ok: true }))
      .catch((err) => res.status(500).json(err));
  });
};