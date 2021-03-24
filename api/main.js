import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bearerToken from 'express-bearer-token';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import i18nextBackend from 'i18next-fs-backend';
import http from 'http';
import https from 'https';
import socketio from 'socket.io';
import routes from './routes/index.js';
import models, { connect } from './models/index.js';
import websocket from './routes/websocket.js';
import { dirname } from './utils/nodeESM.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
let httpsServer;
const io = socketio();

io.attach(httpServer);

if (process.env.ENABLE_HTTPS && process.env.ENABLE_HTTPS.toLowerCase() === 'true') {
  const credentials = {
    key: fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8'),
    cert: fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8'),
    ca: fs.readFileSync(process.env.SSL_CA, 'utf8'),
  };

  httpsServer = https.createServer(credentials, app);

  io.attach(httpsServer);
}

websocket(io);

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(dirname(import.meta), 'locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(dirname(import.meta), 'locales/{{lng}}/{{ns}}.missing.json'),
    },
    detection: {
      order: ['header', 'querystring'],
      lookupHeader: 'lng',
      lookupQuerystring: 'lng',
    },
    fallbackLng: 'pt-BR',
    preload: ['pt-BR'],
    saveMissing: true,
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(bearerToken());
app.use(i18nextMiddleware.handle(i18next));
app.use((req, _, next) => {
  req.context = {
    models,
  };

  next();
});

if (process.env.ENABLE_HTTPS && process.env.ENABLE_HTTPS.toLowerCase() === 'true') {
  app.all('*', (req, res, next) => {
    if (req.secure) {
      return next();
    }

    res.redirect(`https://${req.hostname}${req.url}`);
  });
}
app.use('/api/authentication', routes.authentication);
app.use('/api/users', routes.users);
app.use('/api/leads', routes.leads);
app.use(express.static('public'));

connect().then(async () => {
  httpServer.listen(process.env.HTTP_PORT || 80, process.env.HOSTNAME || 'localhost', () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on ${process.env.HOSTNAME || 'localhost'}:${process.env.HTTP_PORT || 80}`);
  });

  if (process.env.ENABLE_HTTPS && process.env.ENABLE_HTTPS.toLowerCase() === 'true') {
    httpsServer.listen(process.env.HTTPS_PORT || 443, process.env.HOSTNAME || 'localhost', () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on ${process.env.HOSTNAME || 'localhost'}:${process.env.HTTPS_PORT || 443}`);
    });
  }
});
