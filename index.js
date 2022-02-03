const express = require('express');

const path = require('path');

const cors = require('cors');

const app = express();

// use to parse body contents in JSON requests:
app.use(express.json());


// to serve React files:
app.use(express.static(path.join(__dirname, "../reactfrontend/testprojectfrontend", "build")));
app.use(express.static("public"));

// use to allow cross-origin resource sharing during development:
app.use(cors());

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     // res.send({'response': 'here\'s a JSON response showing that a GET request to the \'/\' route was successfully received.'});

//     // res.sendFile(path.join(__dirname, "public", "index.html"));

// });

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "../reactfrontend/testprojectfrontend", "build", "index.html"));
});

app.post('/addcontent', (req, res) => {
    console.log('request body', req.body);
    res.send({'responsefromserver': req.body.greeting});
});

app.listen(PORT);

console.log('the express app is running successfully.');
