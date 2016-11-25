import _ from 'lodash';
import { AsyncRouter } from 'express-async-router';

export default (ctx) => {
  const api = AsyncRouter();

  api.get('/populate', ctx.resourses.User.filterUsers, (req, res) => {
    const users = _.cloneDeep(req.filterUsers);

    const userPopulate = _.map(users, (user) => {
      const pets = _.filter(ctx.db.pets, {'userId': user.id});
      return Object.assign(user, {pets});
    })

    return res.json(userPopulate);
  });
  api.use('/:key', ctx.resourses.User.getUser);
  api.use(ctx.resourses.User.error);
  api.get('/', ctx.resourses.User.filterUsers, (req, res) => {
    return res.json(req.filterUsers);
  });
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

  api.get('/:key/populate', (req, res) => {
    const user = _.cloneDeep(req.myuser);
    const pets = _.filter(ctx.db.pets, {'userId': user.id});

    return res.json(Object.assign(user, {pets}));
  });

  return api;
}
