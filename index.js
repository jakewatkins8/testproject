import 'dotenv/config';
import express from 'express'; 
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import ENVIRON from "./environment.js";

import DataAccessObject from "./dataAccessObject.js";
// import { Mongoose } from 'mongoose';


import { dbPopulationData } from './dbPopulationData.js';



// console.log('dbUri', DAO.dbUri);

const Dao = DataAccessObject();
console.log('newly constructed Dao obj:', Dao);
Dao.connectToDb();

Dao.initializeDbStructure();
Dao.addDocsOfModel('User', 
[{userName: 'JMorrison'}, 
{userName: 'NTesla'}, 
{userName: 'BRattfink'}] 
);

Dao.addDocsOfModel('Note', dbPopulationData);

// Dao.dropDocsOfModel('UUUUser');

// Dao.dropDocsOfModel('User');

// obtain the port to run the Express server on:
const PORT = ENVIRON.PORT;






// create express app instance:
const app = express();






// use to parse body contents in JSON requests (this replaced 'bodyparser')
app.use(express.json());



// manually obtain a value for dirname to use in serving the static files, 
// as '__dirname' is not accessible in an ES module like this one.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use both static middleware functions to serve React files:
// note: order may matter here; i.e., having express.static("public") first 
// may cause the front end to render incorrectly, or just show a 500 error.
app.use(express.static(path.join(__dirname, "./reactfrontend/testprojectfrontend", "build")));
app.use(express.static("public"));

// use to allow cross-origin resource sharing during development:
app.use(cors());



// a route for a GET request to the root address of the server.
// disabled, as the express.static file functions are now serving all of the get requests made
// (currently, the only GET request is the one to the root address to load the app.)
// app.get('/', (req, res) => {

//     // test JSON object to be used to confirm that the API/backend is reached by the GET request successfully:
//     // res.send({'response': 'here\'s a JSON response showing that a GET request to the \'/\' route was successfully received.'});

//     // statement to try and send the static React files in response to the root address GET request.
//     // this may not work with React, for some reason.
//     // TODO -> figure out why, and confirm that express.static() middleware is best practice here. 
//     // res.sendFile(path.join(__dirname, "public", "index.html"));

// });

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "./reactfrontend/testprojectfrontend", "build", "index.html"));
});

app.post('/retrievenotes', (req, res) => {
    console.log('request body', req.body);
    res.send({'responsefromserver': req.body.greeting});
});

// 

app.get('/usersnotes', (req, res) => {
    let result = Dao.findDocsOfModel('Note', where({'author': 'JMorrison'})).toArray();

    res.send(JSON.stringify({'result': result}));
});

app.post('/query', (req, res) => {
    // unpack query and run it using mongoose
    let queryData = req.json();
    console.log(queryData);
    let query = Dao.buildFilter(queryData);
    let results = Dao.findDocsOfModel('Note', query);
    res.send(JSON.stringify({'result': results}));
});

// 

app.listen(PORT);

console.log('the express app is running successfully.');



