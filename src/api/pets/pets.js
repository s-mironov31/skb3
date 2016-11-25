import _ from 'lodash';
import { AsyncRouter } from 'express-async-router';

export default (ctx) => {
  const api = AsyncRouter();

  api.use('/:key', ctx.resourses.User.getPets);
  api.use(ctx.resourses.User.error);
  api.get('/', ctx.resourses.User.pets);
  api.get('/:key', (req, res) => {
    return res.json(req.mypets);
  });

  return api;
}
