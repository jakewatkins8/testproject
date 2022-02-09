// import Mongoose ODM to communicate with Atlas MongoDB:
import mongoose from 'mongoose';

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
        
            // TODO -> test
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
                AuthorId: { type: Schema.Types.ObjectId, ref: 'User' },
                userName: String,
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

        // 1st overloaded default version of method that adds an array of 1 or more User or Note documents to the DB.
        // @param: TODO (docs : User[] XOR Note[]) - an array of at least one Note or one User. 
        // The array must contain either only Note objects or only User objects.
        // @param modelName: model of docs to be added 
        // TODO examine async plus .then() syntax, confirm it's accurate
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

        // 2nd overloaded version of method that also accepts a second model parameter.
        // the 2nd model parameter is to create manual references in the Db between the
        // documents being added, and their 'parent' documents. The _id of the 'parent' docs
        // will be added to the new docs in a reference field.
        // @param modelName: model of docs to be added
        // @param refModelName: model of docs that will be bound to new docs using a manual _id reference
        // @param commonField: a field that the two documents share - this field is compared for equality,
        //      so that the right id will be assigned
        // @param refField: field on the new docs that will bind the new and existing docs together. (This field should be the refModel's _id.)
        addDocsOfModel: async function(modelName, refModelName, commonFieldName, refField, docData) {
            if (docData.length < 1) {
                console.log('Must add at least one object to the database.');
            }

            console.log(modelName);

            const model = models[modelName];

            const refModel = models[refModelName];

            // iterate across the new item data and add a manual id reference on each:
            for (let singleDocDatapoint of docData) {

                console.log(JSON.stringify(singleDocDatapoint));
                // let refDoc = await this.findDocsOfModel(refModel, refModel.find().exists('_id', true).and());


                console.log(JSON.stringify(refModel));


                // find the 'parent'/related document that is related by the common field between the two docs:
                let refDoc = await this.findDocsOfModelObj(refModel, refModel.find().and([{_id: {$exists: true}}, {userName: { $eq: singleDocDatapoint[commonFieldName]}}]));
                // query.and[{_id: {$exists: true}}, {userName: { $eq: doc[commonFieldName]}}];
                
                console.log(`result of refDoc after await op: ${JSON.stringify(refDoc)}`);
                
                // have to add [0] due to the result from findDocsOfModel being a one-element array with
                // the object inside:
                let refValue = refDoc[0]['_id'];
            
                singleDocDatapoint[refField] = refValue;

                console.log(` single doc datapoint after field addition: ${JSON.stringify(singleDocDatapoint)}`);
            }

            console.log(`After field updates: ${JSON.stringify(docData)}`);

            // Now that the doc. data has been manually updated to include the parent doc's id,
            // the document data will be inserted into the DB:

            // inserts the documents if they are valid:
            const insert = await model.insertMany(docData);

            console.log('insert op completion results', insert);


        },

        // function stub to construct a query criteria object, given user field input.
        // -> TODO - escape the text input fields? Maybe the final sanitizeFilter() call is enough?
        // I think that maybe the way to write this is somewhat recursive, given the way that the mongoDB/mongoose queries
        // end up structured (BSON/JSON like {color: {$neq: blue}})
        // So, maybe a pointer can drill down to the lowest level of the object and build out the query on the way up....?
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


        // method to find all docs for a given model obj that meet the filter criteria; (Note: the modelObj param must 
        //          be a *ref to the object* and not just its name.)
        findDocsOfModelObj: async function(modelObj, filterObj) {

            try {

                const findAttempt = await modelObj.find(filterObj);

                console.log(`result of find attempt: ${findAttempt}`);

                return findAttempt;

            } catch (error) {

                console.log(`An error occurred while attempting to find documents: ${error}`);
            }

            // findAttempt.then(result => {
            //     console.log('result of find query:', result);
            //     return result;
            // }).catch(error => console.log('something went wrong finding the documents for the given model:', error));
            
        },

                // very similar method to find all docs for a given model obj that meet the filter criteria; 

        findDocsByModelName: async function(modelObjName, filterObj, returnAllOfModel=false) {

            try {

                const modelObj = models[modelObjName];

                if (returnAllOfModel) {
                    const findAttempt = await modelObj.find();
                }
                else {
                    const findAttempt = await modelObj.find(filterObj);
                }
                // something about the async control flow may be making findAttempt basically empty at this point:
                console.log(`result of find attempt: ${findAttempt}`);

                return findAttempt;

            } catch (error) {

                console.log(`An error occurred while attempting to find documents: ${error}`);
            }

            // findAttempt.then(result => {
            //     console.log('result of find query:', result);
            //     return result;
            // }).catch(error => console.log('something went wrong finding the documents for the given model:', error));
            
        },


        // method to update one or many docs for a given model, Query filter, and update Criteria object:
        updateDocsOfModel: async function(modelName, filterObj, updateCriteria) {

            const modelObj = models[modelName];

            try {
            const updateOp = await modelObj.updateMany(filterObj, updateCriteria);
            
            const resultStr = {'message': `${updateOp.matchedCount} records matched; ${updateOp.modifiedCount} records successfully updated`};

            return resultStr;        
            } catch (error) {

                console.log(`An error occurred while attempting to update documents: ${error}`);
            }
        
        },

        // method to drop(delete) documents from a Collection, given the Collection's model type.
        // @param (model : modelName) -> a valid property key to the models object declared at the top of this module
        // @param (filterObj: object) -> a JS object containing valid query conditions to 
        //      be applied in creating the query to filter and delete the desired documents.
        // @param (dropEntireCollection : boolean) -> (default value of false) If set to true, method will disregard queryData and 
        //      drop all of the documents for the supplied model(modelName).
        dropDocsOfModel: async function (modelName, filterObj, dropEntireCollection=false) {
            if (!Object.keys(models).includes(modelName)) {
                console.log(`'${modelName}' is not a valid model name to drop documents for.`);
                return;
            }

            console.log(`attempting to drop documents from the ${modelName} collection.`);

            // unpacking references for more clarity:
            const modelObj = models[modelName];

            // the filter for the dropEntireCollection op is:
                        /*     deleteMany(modelObj.where('doesNotExist').exists(false);    */
            // a silly logical paradox (at least semantically) that should always delete all documents,
            // as long as the documents do *NOT* have a 'doesNotExist' field.
            // TODO ^^^ is there a better way to select an entire collection?

            if (dropEntireCollection) {
                // filterObj = modelObj.where('doesNotExist').exists(false);
                // or, maybe more simply:
                filterObj = modelObj.find();
                // an empty arg for find() selects every instance of the Model from the Collection
            }
            else {
                // build query using Query object chaining syntax offered by Mongoose.
                // TODO
                // and then, before executing:
                // sanitize the query filter object using Mongoose.prototype.sanitizeFilter(filterObj);
                // (to protect againt malicious syntax injection attacks (JSON/BSON injection...?))
                // ex. -> sanitizeFilter(filterObj);

                mongoose.sanitizeFilter(filterObj);
                
                // when compared with deleteMany(filter), the below may be redundant:
                // modelObj.find(filterObj);
                // this.findDocsOfModel(modelObj, filterObj);
            }
 
            // TODO -> make sure that this is not always executing the query twice. ("Queries are not Promises" in Mongoose docs)
            // b/c it was either just nodemon refreshes executing it 'twice', or... there could be a problem.
            modelObj.deleteMany(filterObj).then(result => {

                // if the deleteMany operation succeeds, receives an object with a count of deleted records:
                console.log(`deleteMany Promise result: ${JSON.stringify(result)}`);
                console.log(`${result["deletedCount"]} documents deleted.`);

                // TODO - take and return the below on the front end in the appropriate workflow:
                return `${result["deletedCount"]} documents deleted.`;
                
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

