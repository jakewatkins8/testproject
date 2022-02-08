// TODO -> this file is written in CommonJS, so that the index.js will allow it to be read 
// (I think that you can't 'import' before the Express app instance is up?)

// module to store Express server environment variables in:

// local boolean flag for logging a console message in development
let development = (process.env['NODE_ENV'] === 'development' ? true : false); 

console.log(development);

// dictionary object of environment properties being actively set.
// for each property, this object uses the below fallback values by default if no different value is 
// detected in the environment.
// TODO - Note - these fallback values have to be non-sensitive data, as they can be viewed; they are not within a .env file.
const ENVIRON = {
    'NODE_ENV': 'development',
    'PORT': '5000', 
    'MONGO_USERNAME': 'user',
    'MONGO_PW': 'user',
    'MONGO_DB_NAME': 'Cluster0'
};

// review and update the properties' environment values using a loop:
for (let property in ENVIRON) {
    if (process.env.property !== undefined) {
        ENVIRON.property = process.env.property;
    }
}

// TODO -> test and see if the NODE_ENV value is somehow automatically set to production in the deployed version...?
if (development) {
    console.log(`***Note: The express server\'s NODE_ENV value is currently === development. A built version of the app should have a NODE_ENV value
    === production. `);
}

export default ENVIRON;