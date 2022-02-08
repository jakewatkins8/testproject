// import Mongoose ODM to communicate with Atlas MongoDB:
// import { Mongoose as mongoose } from 'mongoose';
const mongoose = require('mongoose');

import ENVIRON from "./environment.js";


// import { attrs_for_models } from './queryBuilderData.js';

// Data access object, to access MongoDB instance:
// DAO as a (constructor?) function?
const DataAccessObject = () => {

    // Object to hold refs to important properties of the database access object:
    const dataObj = {};

    // Object to hold refs to all created document models for use in CRUD operations:
    const models = {};


    // Notes:
    // 
    // callbacks in Mongoose follow the signature 'callback(error, result)', 
    // where result is the query's matching results
    // -
    // if no callback is specified, a Query obj is returned that can then be used later 
    // with the exec() method.
    // 
    
    return ({
        // from Mongoose docs: "for practical reasons, a connection equals a Db."


        connectToDb: async function() {

            // initialize database URI:
            dataObj.dbUri = `mongodb+srv://${ENVIRON.MONGO_USERNAME}:${ENVIRON.MONGO_PW}@cluster0.v4cer.mongodb.net/
            ${ENVIRON.MONGO_DB_NAME}?retryWrites=true&w=majority`;
        
            mongoose.connect(dataObj.dbUri, { 
                useNewUrlParser: true, 
                useUnifiedTopology: true });
        
            // obtain reference to db connection:
            dataObj.db = mongoose.connection;
        
            // binds any error events that occur from connecting to the db to the console:
            dataObj.db.on('error', console.error.bind(console, 'MongoDB connection error:'));

            // return the connection/Db object, if anything in the outer module wants to access it here:
            // but, there probably just won't be a need.
            return dataObj.db;

            // TODO investigate need or lack of need for async here.
        
        },

        getConnection: async function() {
            if (dataObj.db) {
                return dataObj.db;
            }
            else {
                console.log('no connection active. attempting connection.');
                try {
                    this.connectToDb().then(result => {
                        console.log(result);
                        if (dataObj.db) {
                            return dataObj.db;
                        }
                        else {
                            return {'errorMsg': 'Something went wrong while reconnecting to the server.'};
                        }
                        // test this: the above may not be necessary. any error in this inner scope may throw
                        //  to the catch block below.
                    });
                }
                catch (error) {
                    return {'errorMsg': 'Something went wrong while reconnecting to the server.'};
                }
            }
        },

        // TODO - input validation?
        // create initial Schemas and Models for User and Note documents:
        initializeDbStructure: async function() {
            let Schema = mongoose.Schema;

            let modelName;
            modelName = 'User';

            let UserModelSchema = new Schema({
                userName: String},
                {strictQuery: true});
            let UserModel = mongoose.model(modelName, UserModelSchema);

            models[modelName] = UserModel;

            // Note: the 'author' field in the Note schema below is being referenced and pulled from the User collection.
            // the object passed as the value for 'author' below places the reference to the User collection.
            // TODO make sure of this....^
            let NoteModelSchema = new Schema({
                author: { type: Schema.Types.ObjectId, ref: 'User' },
                content: String,
                dateCreated: Number,
                dateModified: Number 
            }, 
            {strictQuery: true});

            modelName = 'Note';

            let NoteModel = mongoose.model(modelName, NoteModelSchema);

            models[modelName] = NoteModel;


            console.log(models);


        },

        // method that adds an array of 1 or more User or Note documents to the DB.
        //  @param: (documents : User[] XOR Note[]) - an array of at least one Note or one User. 
        // The array must contain either only Note objects or only User objects.
        
        // TODO examine async plus .then() syntax, confirm it's all good
        addDocsOfModel: async function(modelName, docs) {
            if (docs.length < 1) {
                console.log('Must add at least one object to the database.');
            }

            console.log(modelName);

            // finds the model passed as a param by looking it up on the dataObj object,
            // and then inserts the documents if they are valid:
            const insert = models[modelName].insertMany(docs);

            console.log(insert.then(result => console.log('result of the previously pending insertMany operation:', result)));



        },

        buildFilter: function(modelName, conditions) {

            // receive as many objects as 'rows' are filled & received from the front end

            // up to 4

            // start with 1 condition:

            // consisting of an attribute, a value, and an operator.

            if (attrs_for_models[modelName] === undefined) {
                console.error('The model passed as a param is not recognized.');
                return;
            }

            const attrs = attrs_for_models[modelName];

            // given an input object of form

            // {attr: {$op: value}}

            // given a set of 4 conditions that can be received, map them all to a JS object and build a filter object out of the final result.
            return filterObj;
        },

        // TODO function stub - for read
        // This method will also be used in the update and delete methods below
        findDocsOfModel: async function(modelName, filterObj) {

            const findAttempt = await mongoose.findMany();
            
        },

        // overloaded 2nd version of method where the model obj is supplied, instead of the model name - this is to be used
        // in cases where the model obj has already been looked up in another data access method (read/find, update, delete)
        findDocsOfModel: async function(modelObj, filterObj) {

            const findAttempt = await mongoose.findMany();
            
        },

        // TODO function stub - for update (literally)
        updateDocsOfModel: async function(model, filterObj) {},

        // method to drop(delete) documents from a Collection, given the Collection's model type.
        // @param (model : modelName) -> a valid property key to the models object declared at the top of this module
        // @param (queryData: object) -> a JS object containing valid query conditions to 
        //      be applied in creating the query to filter and delete the desired documents.
        // @param (dropEntireCollection : boolean) -> (default value of false) If set to true, method will disregard queryData and 
        //      drop all of the documents for the supplied model(modelName).
        dropDocsOfModel: async function (model, queryData, dropEntireCollection=false) {
            if (!Object.keys(models).includes(model)) {
                console.log(`'${model}' is not a valid model name to drop documents for.`);
                return;
            }

            console.log(`attempting to drop all documents from the ${model} collection.`);

            // unpacking references for more clarity:
            const modelObj = models[model];

            // the filter for the dropEntireCollection op is:
                        /*     deleteMany(modelObj.where('doesNotExist').exists(false);    */
            // a silly logical paradox (at least semantically) that should always delete all documents,
            // as long as the documents do *NOT* have a 'doesNotExist' field.

            // TODO ^^^ is there a better way to select an entire collection?

            // initialize filterObj variable to hold conditions that will filter the query:
            let filterObj;

            let conditions; // conditions may not need to be separate from filterObj

            if (dropEntireCollection) {
                filterObj = modelObj.where('doesNotExist').exists(false);
            }
            else {
                // build query using Query object chaining syntax offered by Mongoose.

                // receive the filter conditions as a JSON from the front end:
                conditions = {'userName': 'jack'};
                // let conditions = {};

                // or something like this:
                filterObj = conditions;

                // and then, before executing:
                // sanitize the query filter object using Mongoose.prototype.sanitizeFilter(filterObj);
                // (to protect againt malicious syntax injection attacks (JSON/BSON injection...?))
                // ex. -> sanitizeFilter(filterObj);

                mongoose.sanitizeFilter(filterObj)
                // when compared with deleteMany(filter), the below may be redundant:
                // modelObj.find(filterObj);
                this.findDocsOfModel(modelObj, filterObj);
            }
 
            // TODO -> make sure that this is not always executing the query twice. ("Queries are not Promises" in Mongoose docs)
            // b/c it was either just nodemon refreshes executing it 'twice', or... there could be a problem.
            modelObj.deleteMany(filterObj).then(result => {

                // if the deleteMany operation succeeds, receives an object with a count of deleted records:
                console.log(`deleteMany Promise result: ${JSON.stringify(result)}`);
                console.log(`${result["deletedCount"]} documents deleted.`);

                // TODO - take and return the below on the front end in the appropriate workflow:
                return `${result["deletedCount"]} documents deleted.`;
                
                
                if (result.ok) {
                // log the successful result:
                console.log(`deletion op result: ${result}`);
                }
            }).catch(error => console.log('error, error:', error));



        }

    }); 

};



//     // method to init. mongo client:
//     const initMongoClient = function() {

//         client = new MongoClient(dbUri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
        
//     };

//     // method to (?) test the db connection?:
//     const testConnection = function() {

//         client.connect(error => {

//             // TODO -> handle this above error?
        
//             client.db('test').collection('devices');

//             console.log('successfully connected to db.')
        
//             // TODO perform whatever actions on the collection object here
        
//             client.close();
        
//         });

//     }

// };




export default DataAccessObject;

