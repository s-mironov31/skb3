import _ from 'lodash';
import { AsyncRouter } from 'express-async-router';

export default (ctx) => {
  const api = AsyncRouter();

  api.use('/:key', ctx.resourses.User.getUser);
  api.use(ctx.resourses.User.error);
  api.get('/', ctx.resourses.User.users);
  api.get('/:key', (req, res) => {
    return res.json(req.myuser);
  });
  api.get('/:key/pets', (req, res) => {
    const user = req.myuser;

    const pets = _.filter(ctx.db.pets, (o) => {
      return o.userId == user.id;
    });
    return res.json(pets);
  });

  return api;
}
