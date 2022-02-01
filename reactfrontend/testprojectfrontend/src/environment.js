
// an environment variable meant to serve as a dynamic path to the server, regardless of where it is hosted:
const SERVER_PATH = process.env.SERVER_PATH || 'http://localhost:5000';

console.log('SERVER_PATH as obtained by node runtime:', SERVER_PATH);

export default SERVER_PATH;