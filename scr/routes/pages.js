var genreRouter = require ('./navigation/genre');
var artistRouter = require ('./navigation/artist');
var songRouter = require ('./navigation/song');
var siteRouter = require ('./navigation/sites');
var userRouter = require ('./navigation/user');

function pagesRouter(app) {
  
  // genre
  app.use("/genre", genreRouter);
  
  // artist
  app.use("/artist", artistRouter);

  // song
  app.use("/song", songRouter);

  // user
  app.use('/user', userRouter);
  
  // main page
  app.use("/", siteRouter);
  
  // theme switch
  app.post("/toggle-theme", function (req, res) {
    const currentTheme = req.cookies.theme === "dark" ? "light" : "dark";
    res.cookie("theme", currentTheme, { maxAge: 900000, httpOnly: true });
    res.send({ theme: currentTheme });
  });

}

module.exports = pagesRouter;
