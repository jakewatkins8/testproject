const express = require('express');

const path = require('path');

// to use cross-origin resource sharing between localhost:5000 and :3000 during development:
const cors = require('cors');

// create express app instance:
const app = express();

// use to parse body contents in JSON requests (this replaced 'bodyparser')
app.use(express.json());


// use both static middleware functions to serve React files:
// note: order may matter here; i.e., having express.static("public") first 
// may cause the front end to render incorrectly, or just show a 500 error.
app.use(express.static(path.join(__dirname, "./reactfrontend/testprojectfrontend", "build")));
app.use(express.static("public"));

// use to allow cross-origin resource sharing during development:
app.use(cors());

// use environment variable for the port that Node/express will use to run on, 
// and use port 5000 if still in development:
const PORT = process.env.PORT || 5000;

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

app.listen(PORT);

console.log('the express app is running successfully.');
