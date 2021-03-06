import 'dotenv/config';
import express from 'express'; 
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import ENVIRON from "./environment.js";

import DataAccessObject from "./dataAccessObject.js";
// import { Mongoose } from 'mongoose';

// was used to add all 'Note' docs to DB:
import { dbPopulationData } from './dbPopulationData.js';

// console.log('dbUri', DAO.dbUri);


//  DB init. & testing:

// create database access object
const Dao = DataAccessObject();
console.log('newly constructed Dao obj:', Dao);
Dao.connectToDb();

Dao.initializeDbStructure();

const populateInitialDbData = async () => {

    // if (await Dao.findDocsByModelName('Note', {}, true)) {
    //     console.log(`DB already has at least one ${modelName} document.`);
    //     return;
    // } else {
    //     // populate with initial dummy dataset:
    //     try {
    //         const addAll = await Dao.addDocsOfModelWithRefs('Note', 'User', 'userName', 'AuthorId', dbPopulationData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


};

// populateInitialDbData();

// adds initial User data to Db 
// TODO: work on this and set it to only add if 'User" collection does not exist or is empty:
// const addUsers = await Dao.addDocsOfModel('User', 
// [{userName: 'JMorrison', noteColor: '#FCFDAF'}, 
// {userName: 'NTesla', noteColor: '#b5ffbe'}, 
// {userName: 'BRattfink', noteColor: '#c2faff'}] 
// );

// iterates across data to add to db, and assigns _id fields from the database for the respective authors:
// signature structure: (modelName, refModelName, commonFieldName, refField, docs)
// const addAll = await Dao.addDocsOfModelWithRefs('Note', 'User', 'userName', 'AuthorId', dbPopulationData);
// const refFields = ['AuthorId', 'colorName'];

// Drop all Note & User docs:
// (passing a trivial empty filterObj param since it won't be used)
// Dao.dropDocsOfModel('Note', {}, true);
// Dao.dropDocsOfModel('User', {}, true);




// err on the two test queries below: """cannot use $and with text.""" Maybe you use $where or $regex.
// const findUsers = await Dao.findDocsByModelName('User', {userName: {$and: [{$neq: 'NTesla'}, {$neq: 'JMorrison'}]}});
// const findDocs = await Dao.findDocsByModelName('Note', {userName: {$and: [{$neq: 'BRattfink'}, {$neq: 'JMorrison'}]}});

// const findUsers = await Dao.findDocsByModelName('User', {userName: {$and: [{$neq: 'NTesla'}, {$neq: 'JMorrison'}]}});
// const findDocs = await Dao.findDocsByModelName('Note', {userName: {$and: [{$neq: 'BRattfink'}, {$neq: 'JMorrison'}]}});
 


// if (addAll !== undefined) {
//     // test finding a particular set of Documents:
//     const findUsers = await Dao.findDocsOfModel('User', {userName: {$or: [{$neq: 'NTesla'}, {$neq: 'JMorrison'}]}});
//     // passed

//     if (findUsers !== undefined) {
//         const findNotes = await Dao.findDocsOfModel('Note', {userName: {$or: [{$neq: 'BRattfink'}, {$neq: 'JMorrison'}]}});
//     }

// }




// Now, testing updating every note's contents to 'dziad ufolud' (all or many update functionality):
// Dao.updateDocsOfModel('Note', {_id: {$exists: true}}, {content: 'dziad ufolud'});


// Testing dropping specific note docs:
// Dao.dropDocsOfModel('Note', {userName: "JMorrison", content: "dziad ufolud"});



// Drop all Note docs:
// (passing a trivial filterObj since it won't be used)
// Dao.dropDocsOfModel('Note', {'a': 1}, true);


// obtain the port to run the Express server on:
const PORT = ENVIRON.PORT;






// create express app instance:
const app = express();


// use to allow cross-origin resource sharing during development:
if (process.env["NODE_ENV"] === "development") {
    console.log('enabling CORS during development, for server comms (localhost :3000 <-> :5000)');
    app.use(cors());
}
// TODO -> just make sure CORS is off in Production environment (it should be)






// use to parse body contents in JSON requests (this replaced 'bodyparser')
app.use(express.json());


// moved mock POST req response method to here, so that the static file serving routes don't 
// usurp the endpoint call and try to serve React page files.
// TODO -> should async be there below in the POST method?
app.post(`/query`, async (req, res) => {


    

    console.log(`Request body ${JSON.stringify(req.body)}`);
    // // parse query from req body and run it using mongoose
    // let queryData = req.json();
    // console.log('QUERY DATA:', queryData);
    // // let query = Dao.buildFilter(queryData);
    // // let results = Dao.findDocsOfModelObj('Note', query);

    // // res.send(JSON.stringify({'result': results}));

    const resData = await Dao.findDocsByModelName(req.body['modelName'], req.body['criteria']);
    
    let data = JSON.stringify(resData);
    console.log(`response data before sending to front end: ${data}`);

    // // TODO, for now, test sending all docs from a Collection:
    res.send(data);

    // Wow, my stars, it works.


});


// app.get('/users', async ((req) => {

//     // TODO - in production, I guess just disable CORs - so that requests from any other top level domain
//     // will be ignored.
//     if (req) {}

//     res.send(data);
// }));



// manually obtain a value for dirname to use in serving the static files, 
// as '__dirname' is not accessible in an ES module like this one.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use both static middleware functions to serve React files:
// note: order may matter here; i.e., having express.static("public") first 
// may cause the front end to render incorrectly, or just show a 500 error.
app.use(express.static(path.join(__dirname, "./reactfrontend/testprojectfrontend", "build")));
app.use(express.static("public"));




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
    let result = Dao.findDocsOfModelObj('Note', where({'author': 'JMorrison'})).toArray();

    res.send(JSON.stringify({'result': result}));
});




// 

app.listen(PORT);

console.log('the express app is running successfully.');



