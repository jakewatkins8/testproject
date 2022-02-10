import { REACT_APP_SERVER_PATH } from "./environment.js";

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


const getUserNotes = (userName) => {

    let queryData = {
        'modelName': 'Note',
        'criteria': {userName: {$eq: userName}}
    };
}

export { fetchAllUsers, getUserNotes };