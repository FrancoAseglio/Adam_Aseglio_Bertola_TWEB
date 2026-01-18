const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const cors         = require('cors');

// Base router
const indexRouter              = require('./routes/index');

// API Routers
const animeApiRouter           = require('./routes/anime-api');
const favoritesApiRouter       = require('./routes/favorites-api');
const ratingsApiRouter         = require('./routes/ratings-api');
const statsApiRouter           = require('./routes/stats-api');
const profilesApiRouter        = require('./routes/profiles-api');
const charactersApiRouter      = require('./routes/characters-api');
const peopleApiRouter          = require('./routes/people-api');
const recommendationsApiRouter = require('./routes/recommendations-api');

const app = express();

// Swagger documentation
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Gateway API',
      version: '1.0.0',
      description: 'API Gateway for routing requests to MongoDB and Spring Boot backends',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Development server' }
    ],
  },
  apis: [path.join(__dirname, 'routes/*.js')],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger served on the main app
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs', (req, res) => res.redirect('/api-docs'));

// Middleware
app.use(logger('dev'));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Base route
app.use('/', indexRouter);

// API Routes
app.use('/api/characters',      charactersApiRouter);
app.use('/api/people',          peopleApiRouter);
app.use('/api/anime',           animeApiRouter);
app.use('/api/favorites',       favoritesApiRouter);
app.use('/api/ratings',         ratingsApiRouter);
app.use('/api/stats',           statsApiRouter);
app.use('/api/profiles',        profilesApiRouter);
app.use('/api/recommendations', recommendationsApiRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
