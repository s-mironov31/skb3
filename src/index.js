import express from 'express';
import fetch from 'isomorphic-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import birdRouters from './birdRouters';

const app = express();
app.use(cors());


const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = {};
fetch(pcUrl)
  .then(async (res) => {
    pc = await res.json();
  })
  .catch(err => {
    console.log('Что-то пошло не так', err);
  });

app.get('/volumes', (req, res) => {
  let volumes = {};
  let volume = [];
  pc.hdd.forEach((hdd) => {
    if(!volume.some(item => {
      return item == hdd.volume;
    })) {
      volume.push(hdd.volume);
      volumes[hdd.volume] = 0;
    }

    volumes[hdd.volume] += hdd.size;
  })

  for (const volume in volumes){
    volumes[volume] += 'B';
  }

  return res.json(volumes);
});

app.get('/:key?/:keyValue?/:addValue?', (req, res) => {
  const params = req.params;
  let value = pc;

  try {
    for (const key in params){
      if(params[key] == undefined) break;

      if(typeof value == "object" && !Array.isArray(value)) {
        if(params[key] in value)
          value = value[params[key]];
        else
          throw(err);
      } else if(Array.isArray(value)) {
        if(+params[key] < value.length && +params[key] >= 0)
          value = value[+params[key]];
        else
          throw(err);
      } else {
        throw(err);
      }
    };
  } catch (err) {
    return res.status(404).send('Not Found');
  }

  return res.json(value);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000! ')
});
