import { REACT_APP_SERVER_PATH } from "./environment.js";



const makeRequest = async (modelName, queryName, controller) => {

    // look up the appropriate query criteria object to send from this file:
    const query = criteria[queryName]




  



    // then run the query on the Node server:
    return fetch(`${REACT_APP_SERVER_PATH}/query`, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {'Content-Type': 'application/json'},
        signal: controller.signal
      }).then((res) => {
  
        console.log(res);
        
        if (res.ok) {
          return res.json();
        }
    }).then(data => {
        console.log(`User data received from API: ${JSON.stringify(data)}`);

        return data;
        
    }).catch(error => {
        if (error.name === 'AbortError') {
            console.log(`an AbortError was thrown: ${error}`);
        }
        else {
            console.log(error);
        }
    });

};



// dictionary object of common query criteria to be used for fetch calls:
const criteria = {
    'all': {_id: {$exists: true}},
    'userNotes': (userName) => `{${userName}: {$eq: ${userName}}`
};

// method to obtain array of all User document(objects) from DB:
const fetchAllUsers = async (controller) => {



    // send the below object in the body to set up the mongoose query:
    let queryData = {
        'modelName': 'User',
        'criteria': {_id: {$exists: true}}
      };
  



    // then run the query on the Node server:
    return fetch(`${REACT_APP_SERVER_PATH}/query`, {
        method: 'POST',
        body: JSON.stringify(queryData),
        headers: {'Content-Type': 'application/json'},
        signal: controller.signal
      }).then((res) => {
  
        console.log(res);
        
        if (res.ok) {
          return res.json();
        }
    }).then(data => {
        console.log(`User data received from API: ${JSON.stringify(data)}`);

        return data;
        
    }).catch(error => {
        if (error.name === 'AbortError') {
            console.log(`an AbortError was thrown: ${error}`);
        }
        else {
            console.log(error);
        }
    });

};


const getUserNotes = async (userName, controller) => {

    let queryData = {
        'modelName': 'Note',
        'criteria': {userName: {$eq: userName}}
    };

    // run the query on the server:
    return fetch(`${REACT_APP_SERVER_PATH}/query`, {
        method: 'POST',
        body: JSON.stringify(queryData),
        headers: {'Content-Type': 'application/json'},
        signal: controller.signal
        }).then((res) => {
    
        console.log(res);
        
        if (res.ok) {
            return res.json();
        }
    }).then(data => {
        console.log(`User data received from API: ${JSON.stringify(data)}`);

        return data;
        
    }).catch(error => {
        if (error.name === 'AbortError') {
            console.log(`an AbortError was thrown: ${error}`);
        }
        else {
            console.log(error);
        }
    });

}

export { fetchAllUsers, getUserNotes };