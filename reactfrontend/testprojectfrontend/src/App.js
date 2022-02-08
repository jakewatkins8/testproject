import { useEffect, useState } from "react";
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




function App() {



  // trivial state object that is used to test and confirm a state update when a response from the Express API server is received:
  const [contents, setContents] = useState("");




  const [info, setInfo] = useState("");



  // const [tipDisplayed, setTipDisplayed] = useState(false);

  // const handleEditToolTip = (displayed) => setTipDisplayed(displayed);


  const [profileModalActive, setProfileModalActive] = useState(false);



  // TODO: below, for now: maybe use State - BUT, to maintain auth context for anything else that is finer grain:
  // need to use a context/state mgmt solution like Redux or React Context API (useContext)
  // using State here because the implementation of a context solution is important, but not
  // the main point of this part of the project. 
  // The objectives are to practice writing TypeScript, and set up communication with a Mongo database.
  const [currentUserName, setCurrentUserName] = useState("dog_walker");

  const getCurrentUserName = () => currentUserName;

  // array to be used as a backing list for the "notes" state object, to help with keeping the
  // note list data the same as the note list rendered.
  // (currently hardcoded to load the first list of notes from notelists.js)
  // TODO make currentList stateful after setting up basic user accounts, or similar.
  
  // currently this is hard coded. TODO <----
  // let currentList = [];
  // console.log(currentList);

  // state object to hold the state of the note objects being rendered:
  const [notes, setNotes] = useState([]);



const [debugData, setDebugData] = useState("");



    

// TODO -> the special TypeScript types that behave like enums seem like a good use case for the Info state object's possible values.


  // useEffect(() => {

  //   if (tipDisplayed === true) {
  //   setInfo('Click/tap a note\'s text area to edit it.');
  //   } else {
  //     // does nothing now.
  //   }

  // }, [tipDisplayed]);



  // runs useEffect when current user name changes (and when component first loads?) to find the correct list for the user
  useEffect(() => {


    // calls the lookup method in noteslist.js to locate the current username's collection of notes: 
    let list = findListByUser(currentUserName);

    console.log(list);

    // having obtained the 2D array/object of "rows" of list objects for the current user,
    // sets state of the notes object as the 2D collection:
    setNotes(list);

  }, [currentUserName]);


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


  return (
    <div className="App">

      {profileModalActive && <ModalBackgroundDim onModalBgClicked={handleModalBgClick}/>}

      <div className="appWindow">
      <header className="App-header">

        <div className="titleNote">
          <div className="titleTop">
            <p>Notes</p>
          </div>
        </div>
        <nav className="navColumn">
          <div className="userInfo">
            <p>Current user profile: {currentUserName}</p>
          </div>
 
            <div className="hotBar"> 
              <button onClick={addNewNote}>New note</button>
              <button onClick={loadUserProfile} type="submit">
                  Load existing profile
              </button>

            </div>

          <div className="infoBar">
            {/* <span className="infoI" style={ {opacity: tipDisplayed ? '1' : '0'} }> */}
              {/* <span className="infoI_letter">i</span> */}
            {/* </span> */}
          {/* <span className="noteToolTip" style={ {opacity: tipDisplayed ? '1' : '0'} }> */}
          {info}
          {/* </span> */}
          </div>
        </nav>
        
        
      </header>

      {/* handleTipDisplay={handleEditToolTip}  */}
      <NoteContainer editNote={noteEdit} deleteNote={noteDelete} notes={notes}/>


      {profileModalActive && <ProfileModal modalClosed={handleModalClosed} selectedUser={handleSelectedUser} currentUser={currentUserName}/>}



      </div>

{/* DEBUG: */}
      {/* <p style={ {backgroundColor: 'maroon', color: 'white', fontSize: '10px'}}>DEBUG object data: <br/> {debugData}</p>
      
      <p style={ {backgroundColor: 'black', color: 'white' }}>DEBUG object data: <br/> {JSON.stringify(notes)}</p> */}
    
    </div>
  );
}

export default App;
