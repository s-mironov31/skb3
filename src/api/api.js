import { AsyncRouter } from 'express-async-router';
import getUser from './user';
import getPets from './pets';

export default (ctx) => {
  const api = AsyncRouter();

  api.get('/', () => (ctx.db));
  api.use('/users', getUser(ctx));
  api.use('/pets', getPets(ctx));

  return api;
};
