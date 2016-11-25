import _ from 'lodash';

export default (ctx) => {
  const resourse = {};

  resourse.error = function (err, req, res, next) {
    return res.status(404).send(err.message);
  };

  resourse.users = function (req, res) {
    if(_.isEmpty(req.query)) return res.json(ctx.db.users);

    let typePets;
    const havePet = req.query["havePet"];
    if(havePet) {
      const reType = /(^[^\d\s]+$)?/i;
      typePets = havePet.match(reType)[1];
      if(!typePets)
        return res.status(404).send("Not Found");
    }

    if(!havePet)
      return res.json(ctx.db.users);

    const pets = _.filter(ctx.db.pets, (o) => {
      return (typePets != undefined ? (o.type == typePets) : true);
    });

    const usersId = _.map(pets, (o) => o.userId);

    const user = _.filter(ctx.db.users, (o) => {
      return _.some(usersId, (t) => {return t == o.id});
    });

    return res.json(user);

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

  resourse.pets = function (req, res) {
    if(_.isEmpty(req.query)) return res.json(ctx.db.pets);

    let typePets;
    const type = req.query.type;
    if(type) {
      const reType = /(^[^\d\s]+$)?/i;
      typePets = type.match(reType)[1];
      if(!typePets)
        return res.status(404).send("Not Found");
    }

    let ageGtPets;
    const age_gt = req.query["age_gt"];
    if(age_gt) {
      const reGt = /(^[\d]+$)?/i;
      ageGtPets = age_gt.match(reGt)[1];
      if(!ageGtPets)
        return res.status(404).send("Not Found");
    }

    let ageLtPets;
    const age_lt = req.query["age_lt"];
    if(age_lt) {
      const reLt = /(^[\d]+$)?/i;
      ageLtPets = age_lt.match(reLt)[1];
      if(!ageLtPets)
        return res.status(404).send("Not Found");
    }

    if(!type && !age_gt && !age_lt)
      return res.json(ctx.db.pets);

    const pets = _.filter(ctx.db.pets, (o) => {
      return (typePets != undefined ? (o.type == typePets) : true) &&
          (ageGtPets != undefined ? o.age>ageGtPets : true) &&
          (ageLtPets != undefined ? o.age<ageLtPets : true);
    });

    return res.json(pets);
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
