var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var animeRouter = require('./routes/anime');
var charactersRouter = require('./routes/characters');
var peopleRouter = require('./routes/people');
var ratingsRouter = require('./routes/ratings');
var favoritesRouter = require('./routes/favorites');
var profilesRouter = require('./routes/profiles');
var statsRouter = require('./routes/stats');
var recommendationsRouter = require('./routes/recommendations');

var app = express();

// Register Handlebars helpers
const { registerHelpers } = require('./helpers/handlebars-helpers');
registerHelpers();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Register Handlebars partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/anime', animeRouter);
app.use('/characters', charactersRouter);
app.use('/people', peopleRouter);
app.use('/ratings', ratingsRouter);
app.use('/favorites', favoritesRouter);
app.use('/profile', profilesRouter);
app.use('/stats', statsRouter);
app.use('/recommendations', recommendationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
