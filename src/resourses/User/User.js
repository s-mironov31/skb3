import _ from 'lodash';

export default (ctx) => {
  const resourse = {};

  resourse.error = function (err, req, res, next) {
    return res.status(404).send(err.message);
  };

  resourse.filterUsers = function (req, res, next) {
    // if(_.isEmpty(req.query)) return res.json(ctx.db.users);

    // let typePets;
    const havePet = req.query["havePet"];
    // if(havePet) {
    //   const reType = /(^[^\d\s]+$)?/i;
    //   typePets = havePet.match(reType)[1];
    //   if(!typePets)
    //     return res.status(404).send("Not Found");
    // }
    //
    // if(!havePet)
    //   return res.json(ctx.db.users);

    const pets = _.filter(ctx.db.pets, (o) => {
      return (havePet != undefined ? (o.type == havePet) : true);
    });

    const usersId = _.map(pets, (o) => o.userId);

    const user = _.filter(ctx.db.users, (o) => {
      return _.some(usersId, (t) => {return t == o.id});
    });

    req.filterUsers = user;
    next();
    // return res.json(user);

    // GET /users?havePet=cat	Пользователи у которых есть коты
  };

  resourse.getUser = function (req, res, next) {
    const params = req.params;

    const re = /(^\d+$)|(^[^\d\s]+$)/i;
    const key = params.key.match(re);
    if(key == null)
      return next(new Error("Not Found"));

    const id = key[1];
    const username = key[2];

    if(id) {
        const userById = _.find(ctx.db.users, {'id': +id});
        if(!userById) next(new Error("Not Found"));
        req.myuser = userById;
    } else if(username) {
        const userByUsername = _.find(ctx.db.users, ['username', username]);
        if(!userByUsername) next(new Error("Not Found"));
        req.myuser = userByUsername;
    }

    next();
  };

  resourse.filterPets = function (req, res, next) {
    // if(_.isEmpty(req.query)) return res.json(ctx.db.pets);

    const type = req.query.type;
    const age_gt = req.query["age_gt"];
    const age_lt = req.query["age_lt"];

    // if(!type && !age_gt && !age_lt)
    //   return res.json(ctx.db.pets);

    const pets = _.filter(ctx.db.pets, (o) => {
      return (type != undefined ? (o.type == type) : true) &&
          (age_gt != undefined ? o.age>age_gt : true) &&
          (age_lt != undefined ? o.age<age_lt : true);
    });

    req.pets = pets;
    next();
    // return res.json(pets);
  };

  resourse.getPets = function(req, res, next) {
    const params = req.params;

    const re = /(^\d+$)/i;
    const key = params.key.match(re);
    if(key == null)
      return next(new Error("Not Found"));

    const id = key[1];

    const petsById = _.find(ctx.db.pets, {'id': +id});
    if(!petsById) next(new Error("Not Found"));
    req.mypets = petsById;

    next();
  };

  return resourse;
}
