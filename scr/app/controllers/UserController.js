const Artist = require("../Models/artist");
const Genre = require("../Models/genre");
const Song = require("../Models/song");
const Music = require("../Models/music");
const User = require("../Models/user");
const Token = require("../Models/token");
const mongoose = require("mongoose");
const { format } = require("morgan");
const ObjectId = mongoose.Types.ObjectId;



class UserController {
  //------------------------------JUST ADMIN------------------------------//

  // [POST] /store artist
  storeArtist(req, res, next) {
    const formatTitle = (title) => {
      return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_');
    };
    if (!req.body.title) {
      req.body.title = formatTitle(req.body.artist);
    }
    if (typeof req.body.genre === 'string') {
      req.body.genre = req.body.genre.split(',').map(genre => genre.trim());
    }
    Artist.create(req.body)
      .then(() => res.redirect("/user/create"))
      .catch(next);
  }

  // [GET] /create artist
  createArtist(req, res) {
    res.render("pages/create", { title: "create" });
  }


  // [POST] /store genre
  storeGenre(req, res, next) {
    const formatTitle = (title) => {
      return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_');
    };
    const formatDesc = (desc) => {
      if (!desc || typeof desc !== 'string') {
          return ''; 
      }
      return desc
          .trim() 
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase());
  };
    if (!req.body.title) {
      req.body.title = formatTitle(req.body.genre);
    }
    if (typeof req.body.genre === 'string') {
      req.body.genre = req.body.genre.split(',').map(genre => genre.trim());
    }
    if (!req.body.desc) {
      req.body.desc = `The genre ${req.body.genre} is popular and well-known.`; 
  } else {
      req.body.desc = formatDesc(req.body.desc); 
  }
    Genre.create(req.body)
      .then(() => res.redirect("/user/create2"))
      .catch(next);
    if (req.body.desc) {
      req.body.desc = formatDesc(req.body.desc);
    }
  }

  
  // [GET] /create genre
  createGenre(req, res) {
    res.render("pages/create2", { title: "create" });
  }
  //----------------------------------------------------------------------//

  // [GET] All users
  user = async (req, res, next) => {
    try {
      res.status(200).json("success");
    } catch (error) {
      console.error(error);
      return res.status(400).json(error);
    }
  };



    // [POST] /store genre

    async store(req, res, next) {
      try{
        const formatTitle = (title) => {
          return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_');
        };
        if (!req.body.title) {
          req.body.title = formatTitle(req.body.song);
        }
      if (typeof req.body.genre === "string") {
        req.body.genre = req.body.genre.split(",").map((genre) => genre.trim());
      }
      const { genre, song } = req.body;
      //If no data
      if (!genre || !song) {
        throw new Error("Genre and song fields are required");
      }
      await Music.create(req.body);
      await Song.create({ genre, song, title: req.body.title });
      res.redirect("/user/createSong");
      } catch(error){
        next(error);
      }
    }
      
    // [GET] /create song

    create(req, res, next) {
      Artist.find({})
      .then((artists) => {res.render("pages/createSong", { title: "create", artists })})
      .catch(next);
    }



  // [GET] user
  userActive = async (req, res, next) => {
    try {
      const user = await User.findOne({ title: req.params.title });
      return res.render("user/user", {
        title: user.title,
        admin: user.admin,
        email: user.email,
        username: user.username,
        password: user.password,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("sever error");
    }
  };

  // [DELETE] User by ID
  async deleteUser(req, res, next) {
    try {
      // Find the user by ID
      const user = await User.findById({_id: new ObjectId(req.params.id||req.body.id)});

      if (user) {
        // Delete the user
        await User.findByIdAndDelete({_id: new ObjectId(req.params.id)});
        res.status(200).json("User deleted successfully");
      } else {
        res.status(404).json("User not found");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json("Error deleting user");
    }
  }

  // [GET] User favorites
  async favorite(req, res, next) {
    try {
      const musics = await Music.find({});
      res.status(200).json({ title: "Favorites", musics });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json("Error fetching favorites");
    }
  }

  //[POST] Log out
  userLogout = async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      await Token.deleteOne(req.headers.userId);
      return res.status(200).json("Logged out successfully");
    } catch (error) {
      console.log("Error during load: ", error);
      return res.status(400).json(error);
    }
  };
}

module.exports = new UserController();
