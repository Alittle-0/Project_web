const Music = require("../Models/music");
const Artist = require("../Models/artist");

class ArtistController {
  // [GET] /artist
  artist(req, res, next) {
    Artist.find({})
      .then((artists) => {
        res.render("pages/artist", { title: "Artist", artists });
      })
      .catch(next);
  }

  // [GET] /artist/:title
  show(req, res, next) {
    Artist.findOne({ title: req.params.title })
      .then((artist) => {

        if (!artist) {
          console.log("Artist not found");
          return res.status(404).json({ message: "Artist not found" });
        }
        return Promise.all([
          Music.find({ artist: artist.artist }), 
          Music.find({ genre: { $in: artist.genre } }), 
        ]).then(([artistMusics, genreMusics]) => {
          return { artist, artistMusics, genreMusics };
        });
      })
      .then(({ artist, artistMusics, genreMusics }) => {
        res.render("results/artistResult", {
          title: artist.artist,
          artist,
          artistMusics,
          genreMusics,
        });
      })
      .catch(next);
  }
}

module.exports = new ArtistController();
