// import 'dotenv/config

// TODO -> FIXME - dotenv does not work with the react app.

// an environment variable meant to serve as a dynamic path to the server, regardless of where it is hosted:
const REACT_APP_SERVER_PATH = process.env.REACT_APP_SERVER_PATH || 'http://localhost:5000';

console.log('REACT_APP_SERVER_PATH as determined from environment:', REACT_APP_SERVER_PATH);

const REACT_APP_PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:3000';

console.log('REACT_APP_PUBLIC_URL as determined from environment:', REACT_APP_PUBLIC_URL);

// In development, these should be different ports: ports 3000 and 5000. 
// In production, at least on the Heroku container: they should
// be the same, as they will both be the root address of the Heroku app: http://virtualtrivialstickynotes.herokuapp.com

export { REACT_APP_SERVER_PATH, REACT_APP_PUBLIC_URL };

