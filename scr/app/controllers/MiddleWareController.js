const jwt = require("jsonwebtoken");
const User = require("../Models/user");

class MiddleWareController {
  //verify token (op: just admin)
  verifyToken = async (req, res, next) => {
    try {
      const token = req.headers.token;
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          console.error("Error during login:", err);
          return res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } catch (error) {
      console.log("Authentication error: Token not provided");
      return res.status(401).json("You are not authenticated");
    }
  };

  //verify token and admin auth
  verifyAuth = (req, res, next) => {
    this.verifyToken(req, res, async () => {
      try {
        if (req.headers.admin) {
          const userDeleted = await User.findOne({ email: req.body.email });
          req.body.id = userDeleted.id;
          return next();
        } else if (req.body.id === req.params.id) {
          return next();
        } else {
          console.error("Authorization error: User not allowed");
          return res.status(403).json("You are not allowed");
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json("Internal server error");
      }
    });
  };
}

module.exports = new MiddleWareController();
