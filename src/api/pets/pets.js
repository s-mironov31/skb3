import _ from 'lodash';
import { AsyncRouter } from 'express-async-router';

export default (ctx) => {
  const api = AsyncRouter();

  api.get('/populate', ctx.resourses.User.filterPets, (req, res) => {
    const pets = _.cloneDeep(req.pets);
    const petsPopulate = _.map(pets, (pet) => {
      const user = _.find(ctx.db.users, {'id': pet.userId});
      return Object.assign(pet, {user});
    })

    return res.json(petsPopulate);
  });
  api.use('/:key', ctx.resourses.User.getPets);
  api.use(ctx.resourses.User.error);

  api.get('/', ctx.resourses.User.filterPets, (req, res) => {
    return res.json(req.pets);
  });
  api.get('/:key', (req, res) => {
    return res.json(req.mypets);
  });
  api.get('/:key/populate', (req, res) => {
    const pets = _.cloneDeep(req.mypets);
    const user = _.find(ctx.db.users, {'id': pets.userId});

    return res.json(Object.assign(pets, {user}));
  });

  return api;
}
