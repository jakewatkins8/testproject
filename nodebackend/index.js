const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send({'response': 'here\'s a JSON response showing that a GET request to the \'/\' route was successfully received.'});
})

app.post('/addcontent', (req, res) => {
    res.send({'response': 'here\'s a JSON response showing that a POST request to the \'/addcontent\' route was received.'});
})

app.listen(PORT);

console.log('the express app is running successfully.');