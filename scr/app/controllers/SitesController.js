const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../Models/user");
const Token = require("../Models/token");

class SitesController {
  // [GET] /
  home(req, res) {
    res.render("pages/main", { title: "main" });
  }

  // [GET] /login
  login(req, res) {
    res.render("pages/login", { title: "something" });
  }

  // [GET] /register
  register(req, res) {
    res.render("pages/register", { title: "something" });
  }

  //---------------------------------------------------------------------------//

  //store
  async userStore(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "Email has been used" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new user
      const newUser = new User({ ...req.body, password: hashed });
      await newUser.save();
      return res.status(200).send();
      
    } catch (error) {
      console.error("Error in userStore:", error);
      return res.status(500).json(error);
    }
  }

  //Generate Token
  //Access Token
  accessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  }

  //Refresh Token
  refreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
  }

  //LogIn
  userLogin = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(400).json({ message: "User not found!" });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(400).json({ message: "Wrong password!" });
      }

      if (user && validPassword) {
        const AccessToken = this.accessToken(user);
        const RefreshToken = this.refreshToken(user);

        // Save RT to MongoDB
        await Token.create({ userId: user._id, token: RefreshToken });

        res.cookie("refreshToken", RefreshToken, {
          httpOnly: true,
          secure: false, //true
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, AccessToken });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json(error);
    }
  };

  //[POST] Request refresh token
  requestRToken = async (req, res) => {
    try {
      //take RT from user
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json("You are not authenticated!");
      }

      // Verify the refresh token
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
        async (err, user) => {
          if (err) {
            console.error("Invalid refresh token:", err);
            return res.status(403).json("Refresh token is not valid!");
          }

          try {
            // Check MongoDB for stored refresh token
            const storeToken = await Token.findOne({
              userId: user.id,
              token: refreshToken,
            });
            if (!storeToken) {
              return res.status(403).json("Refresh token is not valid!");
            }

            // Generate a new access token
            const NewAccessToken = this.accessToken(user);
            const NewRefreshToken = this.refreshToken(user);

            // Delete the old refresh token from MongoDB
            await Token.deleteOne({ userId: user._id, token: refreshToken });
            // Save the new refresh token in MongoDB
            await Token.create({ userId: user._id, token: NewRefreshToken });

            res.cookie("refreshToken", NewRefreshToken, {
              httpOnly: true,
              secure: false, //true
              path: "/",
              sameSite: "strict",
            });
            return res.status(200).json({ accessToken: NewAccessToken });
          } catch (redisError) {
            console.error("Error interacting with Redis:", redisError);
            return res.status(500).json("Internal server error");
          }
        }
      );
    } catch (error) {}
  };
}

module.exports = new SitesController();
