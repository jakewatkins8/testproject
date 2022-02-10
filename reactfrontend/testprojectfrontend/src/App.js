import { useEffect, useState, useCallback } from "react";
import './App.css';
import { REACT_APP_SERVER_PATH } from './environment';

import Note from "./Note.jsx";
import NoteContainer from "./NoteContainer.jsx";

// arrays of text that act as lists of notes:
import noteLists from "./notelists.js";
import { findListByUser } from "./notelists.js";

// use UUID for list item keys (note keys):
import { v4 as uuidV4 } from 'uuid';


// not currently using any routing:
// import { HashRouter, NavLink, Route, Routes } from "react-router-dom";


import ProfileModal from "./ProfileModal.tsx";
import ModalBackgroundDim from "./ModalBackgroundDim.jsx";
import { Query } from "mongoose";
import QueryStatement from "./QueryStatement.jsx";

import { fetchAllUsers, getUserNotes } from "./APIrequests.js";





function App() {


  const [users, setUsers] = useState([]);


  const [usersLoaded, setUsersLoaded] = useState(false);

  const [currentUserName, setCurrentUserName] = useState('');

  // Fetch and load list of users from database
  useEffect(() => {

    // use AbortController and pass its signal property to the fetch request method,
    // as it will be used as an option for the fetch request:
    const abortController = new AbortController();


    try {
      // declare inner function to use async:
        const getUsers = async () => {
          const userData = await fetchAllUsers(abortController);

          setUsers(userData);
          setCurrentUserName(userData[0]['userName']);

      }

      getUsers();
    }
    catch (error) {
      console.log(`an error occured while trying to fetch the list of users from the DB: ${error}`)
    }

    // useEffect cleanup hook to abort the fetch if the component is unmounted:
    return () => {
      console.log('the component is unmounted. aborting POST request.')
      abortController.abort();
    }

    // TODO I think I am supposed to add a cancel/cleanup function within the return value of useEffect here,
    // I think you are supposed to do that anytime you call an asynchronous function inside of
    // useEffect.
    // if not done, you may have old async requests returning "late" on the UI and causing problems.
    // reference article on this topic: https://academind.com/tutorials/useeffect-abort-http-requests 
}, []);

// load notes for selected user:
useEffect(() => {


  const abortController = new AbortController();


  try {
    const loadUserNotes = async () => {
      const userNotes = await getUserNotes(currentUserName, abortController);
      setNotes(userNotes);
    };

    loadUserNotes();
  }
  catch (error) {
    console.log(`an error occured while trying to fetch the list of notes for the current user: ${error}`)
  }


}, [currentUserName]);
// ^^^ the above is a problem probably bc it's not mounted when first called.
// how to only call AFTER it's ready?


      // TODO come back and understand what is wrong here:
    // appears to be likely use and/or placement of async / await

    // const result = async () => {
    //   try { 
    //     const data = await fetch(`${REACT_APP_SERVER_PATH}/query`, {
    //       "method": "POST",
    //       "body": JSON.stringify(queryData),
    //       "Headers": { "Content-Type": "application/json" }
    //     });

    //     console.log(data);

    //     return data;
    //   }
    //   catch (error) {
    //     console.log(`Something went wrong retrieving the list of users from the database: ${error}`);
    //   }
    // };





  const [queryExpanded, setQueryExpanded] = useState(false);


  // TODO no 2nd condition just yet:
  // / 1: {}
  const [query, setQuery] = useState({
    '0': {
      'User': {
        'userName': {
          '$eq': 'JMorrison'}}}
  });



  const [info, setInfo] = useState("");
  // This is test info for the info bar.



  const [profileModalActive, setProfileModalActive] = useState(false);


  // state object to hold the state of the note objects being rendered:
const [notes, setNotes] = useState([]);


const [queryResults, setQueryResults] = useState({});




const [debugData, setDebugData] = useState("");


useEffect(() => {

  if (queryResults === null || queryResults === undefined || Object.keys(queryResults).length === 0) {
    // do not attempt to map out the query results, as there are none yet.
    return;
  }

  const noteList = [];

  queryResults.map((dataRow) => {

    let noteRowObj = {
      note: dataRow['content'], 
      noteKey: uuidV4(), 
      dateCreated: new Date(dataRow['dateCreated'] * 1000),
      dateModified: new Date(dataRow['dateModified'] * 1000),
      userCreated: false
  };

  noteList.push(noteRowObj);

  });

  setNotes(noteList);

}, [queryResults])


//  TODO turned off until updates further along:
  // runs useEffect when current user name changes (and when component first loads?) to find the correct list for the user
  // useEffect(() => {


  //   // // calls the lookup method in noteslist.js to locate the current username's collection of notes: 
  //   // let list = findListByUser(currentUserName);

  //   // console.log(list);

  //   let list = fetch(`${REACT_APP_SERVER_PATH}/`)

  //   // having obtained the 2D array/object of "rows" of list objects for the current user,
  //   // sets state of the notes object as the 2D collection:
  //   setNotes(list);

  // }, [currentUserName]);


  // function stub to be used to query the backend and retrieve all of a given user profile's notes:
  // TODO finish this functionality using a MongoDB instance (likely also using the Mongoose ORM)
  const loadUserProfile = (event) => {

    // suppress default page refresh behavior on Submit:
    event.preventDefault();


    // activate the profile select modal:
    setProfileModalActive(true);

// TODO -> finish the REST version reaching into Mongo

    // fetch(SERVER_PATH + '/retrievenotes', {
    //   method: "POST",
    //   body: JSON.stringify({greeting: "hello"}),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(res => {
    //   console.log('response received.');
    //   console.log(res);
    //   if (res.ok) {
    //     return res.json();
    //   }
    //   else {
    //     setContents('Something went wrong with receiving content from the server.');
    //   }
    // }).then(data => {
    //   console.log('the res from the backend was ok.');
    //   let dataStr = data['responsefromserver'];
    //   console.log(dataStr);
    //   setContents(dataStr);
    // }).catch(error => {
    //   console.log('caught the following error:', error);
    // });

   
  };  

  const showNoteInfo = (dbId) => {
    console.log(dbId);

    let noteObj = notes.find(note => note['_id'] === dbId);

    let dateCreated = new Date(noteObj.dateCreated);
    let dateModified = new Date(noteObj.dateModified);

    let infoStr = `Created on ${dateCreated.getMonth()+1}-${dateCreated.getDate()}-${dateCreated.getFullYear()}
    at ${dateCreated.toLocaleTimeString()};
    Last modified on ${dateModified.getMonth()+1}-${dateModified.getDate()}-${dateModified.getFullYear()}
    at ${dateModified.toLocaleTimeString()}`;
    setInfo(infoStr);
  };


  const hideNoteInfo = () => {

    setInfo('');
  };

  const addNewNote = () => {



    // if (Object.keys(notes).length === 10) {
    //   // max reached.
    //   return;
    // }

    const createDate = new Date(); 

    let noteRowObj = {
        note: ``, 
        noteKey: uuidV4(), 
        dateCreated: Date(createDate),
        dateModified: Date(createDate),
        userCreated: true
    };

    console.log('new note data:');
    console.log(Object.entries(noteRowObj));
    
    // currentList.push(noteObj);

    // console.log('curList', currentList);
    console.log('notes:', notes);

    setNotes(oldValue => [...oldValue, noteRowObj]);
  };

  const noteEdit = (event) => {

    console.log(`At app (top) level: Note with UUID ${event.noteId} has been selected for editing.`);
  };

  const noteDelete = (event) => {

    const noteKeyForDeletion = event.noteId;

    console.log(`At app (top) level: Note with UUID ${noteKeyForDeletion} has been selected for deletion.`);


    

    console.log(notes);

    // locate the note with the correct UUID, and remove it from the list:
    setNotes(oldValue => {
      const list = [...oldValue];

      console.log(Object.keys(list));

      const updatedList = list.filter((listItem, index) => {
        console.log(listItem['noteKey']);
        console.log(noteKeyForDeletion);
        return listItem['noteKey'] !== noteKeyForDeletion;
      });
      

      console.log(updatedList);

      // return a NEW array with the deleted value filtered out:
      return updatedList; 
    });

  };

  const handleModalBgClick = () => {

    console.log('closing modal due to bg being clicked');
    setProfileModalActive(false);
  };



  const handleModalClosed = (event) => {

    console.log(`received from the modal close button: ${event.target}`);
    setProfileModalActive(false);
  }


  const handleSelectedUser = (userName) => {
    // close modal:
    setProfileModalActive(false);

    console.log(`${userName} has been selected.`);

    setCurrentUserName(userName);
    
  };

  // toggle query builder open/closed:
  const handleQueryOpen = (event) => {
    setQueryExpanded(oldVal => !oldVal);
  };

  const validateAndRunQuery = (event) => {

    // suppress default page refresh behavior on Submit:
    event.preventDefault();


    // validate input data here on the front end\


    // then run the query on the Node server:
    fetch(`${REACT_APP_SERVER_PATH}/query`, {
      'method': 'POST',
      'body': JSON.stringify(query),
      'Headers': {'Content-Type': 'application/json'}
    }).then((res) => {

      console.log(res);
      
      if (res.ok) {
        return res.json();
      }
    }).then(data => {
      console.log(data);
      setQueryResults(data);
      
    }).catch((error) => console.log(error));
  };

  return (
    <div className="App">

      {profileModalActive && <ModalBackgroundDim onModalBgClicked={handleModalBgClick}/>}

      <div className="appWindow">
        {/* debug: */}
        {JSON.stringify(users)}
      <header className="App-header">

        <div className="titleNote">
          <div className="titleTop">
            <p>Notes</p>
          </div>
        </div>
        <nav className="navColumn">
          <div className="userInfo">{currentUserName === '' ? <p>Loading user profile...</p> : 
                      <><p>Current user profile:&nbsp;</p><p>{currentUserName}</p></>
          }

          </div>
          {/* the regular header when query builder is not open: */}
            {!queryExpanded && (<>
              <div className="hotBar"> 
   
              <div className="buttonWrapper">
              {/* <div className="expandPlusSignBar">
                <div className="expandPlusSignBar child"></div>
              </div> */}
                  <button className="queryOpen" onClick={handleQueryOpen}>Open query builder</button>
              </div>
              <div className="rightColumnButtons">
                <button onClick={addNewNote}>New note</button>
                <button onClick={loadUserProfile} type="submit">
                    Load user profile
                </button>
              </div>
              
              </div>

                          <div className="infoBar">
                          <p>{info}</p>
                        </div></>)}

          {/* the header when query builder is open: */}
            {queryExpanded && (
            <form onSubmit={validateAndRunQuery}>
            <div className="queryBox">
              <div className="topRow">
                <button className="queryOpen" onClick={handleQueryOpen}>Close query builder</button>
                <p>Query Conditions: {Object.keys(query).length} of 2</p>
              </div>
              <div className="middleRow">
                <QueryStatement />
              </div>
              <div className="bottomRow">
                <QueryStatement isChainedStatement /> 

              </div>
              <button type='submit'>Run query</button>
            </div>
            </form>)
            }



        </nav>
        
        
      </header>

      {/* handleTipDisplay={handleEditToolTip}  */}
      <NoteContainer noteInfo={showNoteInfo} noteInfoOut={hideNoteInfo} editNote={noteEdit} deleteNote={noteDelete} notes={notes}/>


      {profileModalActive && <ProfileModal users={users} modalClosed={handleModalClosed} selectedUser={handleSelectedUser} currentUser={currentUserName}/>}



      </div>

{/* DEBUG: */}
      {/* <p style={ {backgroundColor: 'maroon', color: 'white', fontSize: '10px'}}>DEBUG object data: <br/> {debugData}</p>
      
      <p style={ {backgroundColor: 'black', color: 'white' }}>DEBUG object data: <br/> {JSON.stringify(notes)}</p> */}
    
    </div>
  );
}

export default App;
