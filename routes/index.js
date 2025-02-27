import express from 'express';
import fs from 'fs';
var router = express.Router();

import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const data = fs.readFileSync(__dirname+"/../sample.json", { encoding: 'utf8', flag: 'r' });
const jsonData = JSON.parse(data);


/* GET home page. */
router.get('/getJSON', function(req, res, next) {
  let city = null;
  jsonData.forEach((cityJSON)=>{
    if(cityJSON.cityName.toLowerCase()===req.query.city.toLowerCase())
    {
      city = cityJSON;
    }
  });
  if(city)
  {
    res.json(city);
  }
  else {
    res.json({error: `No city ${req.query.city} found`});
  }
});

export default router;
