import bunyan from 'bunyan';
import express from 'express';
import fetch from 'isomorphic-fetch';
import cors from 'cors';

global.__DEV__ = true;

const log = bunyan.createLogger(Object.assign({
        name: 'app',
        src: __DEV__,
        level: 'trace'
    }, {}));

const url = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

let db;

function getDatabase() {
  return new Promise( (resolv, reject) => {
    fetch(url)
        .then(async (res) => {
            if (res.status >= 400) {
                throw new Error("Bad response from server");
            }
            resolv(await res.json());
        })
        .catch(err => {
          reject(err);
      });
  });
}

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  res.json(db);
});
app.get('/users', async (req, res) => {
  res.json(db.users);
});
app.get('/pets', async (req, res) => {
  res.json(db.pets);
});
app.get('/users/:id', async (req, res) => {
  const params = req.params;
  let userById;
  db.users.forEach(user => {
    if(user.id == params.id) {
      userById = user;
    }

  });
  res.json(userById);
});

run();

async function run() {
  try {
    db = await getDatabase();
  } catch (err) {
    log.fatal(err);
  }

  app.listen(3000, function() {
    log.info(`App "My app" running the port 3000`);
  });
}
