const Music = require("../Models/music");
const Genre = require("../Models/genre");

class GenreController {
  // [GET] /genre
  genre(req, res, next) {
    Genre.find({})
      .then((genres) => {
        res.render("pages/genre", { title: "Genre", genres });
      })
      .catch(next);
  }

  // [GET] /genre/:title
  show(req, res, next) {
    Genre.findOne({ title: req.params.title })
      .then((genre) => {
        if (!genre) {
          console.log("Genre not found");
          return res.status(404).json({ message: "Genre not found" });
        }
        return Promise.all([
          Music.find({ genre: { $in: genre.genre } }), 
        ]).then(([genreMusics]) => {
          const artistNames = [...new Set(genreMusics.map((music) => music.artist))];

          return { genre, genreMusics, artistNames };
        });
      })
      .then(({ genre, genreMusics, artistNames }) => {
        console.log(genre)
        res.render("results/genreResult", {
          title: genre.genre,
          genre,
          genreMusics,
          artistNames,
        });
      })
      .catch(next);
  }
}

module.exports = new GenreController();
