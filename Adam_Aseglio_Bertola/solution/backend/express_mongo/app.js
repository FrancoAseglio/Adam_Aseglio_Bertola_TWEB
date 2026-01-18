const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const cors         = require('cors');

// Base router
const indexRouter           = require('./routes/index');

// API Routers
const favoritesRouter       = require('./routes/favorites');
const ratingsRouter         = require('./routes/ratings');
const statsRouter           = require('./routes/stats');
const profilesRouter        = require('./routes/profiles');
const recommendationsRouter = require('./routes/recommendations');

const app = express();

// Swagger documentation
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Anime Data System API',
      version: '1.0.0',
      description: 'MongoDB backend API for anime data, favorites, ratings, and user profiles',
    },
    servers: [
      { url: 'http://localhost:3002', description: 'MongoDB backend server' }
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
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Base route
app.use('/', indexRouter);

// API Routes
app.use('/api/favorites',       favoritesRouter);
app.use('/api/ratings',         ratingsRouter);
app.use('/api/stats',           statsRouter);
app.use('/api/profiles',        profilesRouter);
app.use('/api/recommendations', recommendationsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Return JSON error response
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
