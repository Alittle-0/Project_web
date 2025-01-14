const Music = require("../Models/music");
const Song = require("../Models/song")

class SongController {
  // [GET] /song
  song(req, res, next) {
    Song.find({})
      .then((songs) => {
        res.render("pages/song", { title: "Song", songs });
      })
      .catch(next);
  }

  // [GET] /song/:title
  show(req, res, next) {
    Song.findOne({ title: req.params.title })
      .then((song) => {
        if (!song) {
          console.log('Song not found');
          return res.status(404).json({ message: 'Song not found' });
        }
        return Promise.all([
          Music.find({ song: song.song }), 
          Music.find({ genre: { $in: song.genre } }),
          ]).then(([songMusics, genreMusics]) => {
          return { song, songMusics, genreMusics };
          });
      })
      .then(({ song, songMusics, genreMusics }) => {
        res.render("results/songResult", {
          title: song.song,
          song,
          songMusics,
          genreMusics,
        });
      })
      .catch(next);
  }
}

module.exports = new SongController();
