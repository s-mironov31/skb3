import bunyan from 'bunyan';
import express from 'express';
import fetch from 'isomorphic-fetch';
import getApi from './api';
import getMiddlewares from './middlewares';
import getResourses from './resourses';

export default class App{
  constructor(params = {}) {
    Object.assign(this, params);
    if(!this.log) this.log = this.getLogger();
    this.init();
  }

  getLogger(params) {
    return bunyan.createLogger(Object.assign({
            name: 'app',
            src: __DEV__,
            level: 'trace'
        }, params));
  }

  getMiddlewares() {
    return getMiddlewares(this);
  }

  getResourses() {
    return getResourses(this);
  }

  async getDatabase() {
    const response = await fetch(this.config.db.url);
    const data = await response.json();
    return data;
  }

  init() {
    this.log.trace('App init');

    this.app = express();
    this.middlewares = this.getMiddlewares();
    this.log.trace('middlewares', Object.keys(this.middlewares));
    this.resourses = this.getResourses();
    this.log.trace('resourses', Object.keys(this.resourses));

    this.useMiddlewares();
    this.useRoutes();
  }

  useMiddlewares() {
    this.app.use(this.middlewares.reqParser);
  }

  useRoutes() {
    const api = getApi(this);
    this.app.use('/task3b', api);
  }

  async run() {
    this.log.trace('App run');
    try {
      this.db = await this.getDatabase();
    } catch (err) {
      this.log.fatal(err);
    }

    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        this.log.info(`App "${this.config.name}" running on port ${this.config.port}`);
        resolve(this);
      });
    });
  }
}

// app.get('/', async (req, res) => {
//   res.json(db);
// });
// app.get('/users', async (req, res) => {
//   res.json(db.users);
// });
// app.get('/pets', async (req, res) => {
//   res.json(db.pets);
// });
// app.get('/users/:id', async (req, res) => {
//   const params = req.params;
//   let userById;
//   db.users.forEach(user => {
//     if(user.id == params.id) {
//       userById = user;
//     }
//
//   });
//   res.json(userById);
// });
