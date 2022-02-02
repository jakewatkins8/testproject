const express = require('express');

const cors = require('cors');

const app = express();

// use to parse body contents in JSON requests:
app.use(express.json());

// use to allow cross-origin resource sharing during development:
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send({'response': 'here\'s a JSON response showing that a GET request to the \'/\' route was successfully received.'});
});

app.post('/addcontent', (req, res) => {
    console.log('request body', req.body);
    res.send({'responsefromserver': req.body.greeting});
});

app.listen(PORT);

console.log('the express app is running successfully.');
