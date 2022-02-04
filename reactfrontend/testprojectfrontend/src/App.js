import { useEffect, useState } from "react";
import './App.css';
import { SERVER_PATH } from './environment';

import Note from "./Note.jsx";
import NoteContainer from "./NoteContainer.jsx";

// arrays of text that act as lists of notes:
import notelists from "./notelists.js";

// use UUID for list item keys (note keys):
import { v4 as uuidV4 } from 'uuid';


// not currently using any routing:
// import { HashRouter, NavLink, Route, Routes } from "react-router-dom";


import ProfileModal from "./ProfileModal.tsx";
import ModalBackgroundDim from "./ModalBackgroundDim.jsx";




function App(props) {

  // array to be used as a backing list for the "notes" state object, to help with keeping the
  // note list data the same as the note list rendered.
  // (currently hardcoded to load the first list of notes from notelists.js)
  // TODO make currentList stateful after setting up basic user accounts, or similar.
  const currentList = notelists[0];
  console.log(currentList);

  // trivial state object that is used to test and confirm a state update when a response from the Express API server is received:
  const [contents, setContents] = useState("");

  // state object to hold the state of the note objects being rendered:
  const [notes, setNotes] = useState(currentList.map(note => note.note));


  const [info, setInfo] = useState("");



  const [tipDisplayed, setTipDisplayed] = useState(false);

  const handleEditToolTip = (displayed) => setTipDisplayed(displayed);


  const [profileModalActive, setProfileModalActive] = useState(false);



  useEffect(() => {

    if (tipDisplayed === true) {
    setInfo('Double click/double tap a note\'s text area to edit it.');
    } else {
      setInfo('');
    }

  }, [tipDisplayed]);


  // function stub to be used to query the backend and retrieve all of a given user profile's notes:
  // TODO finish this functionality using a MongoDB instance (likely also using the Mongoose ORM)
  const loadUserProfile = (event) => {

    // suppress default page refresh behavior on Submit:
    event.preventDefault();


    // activate the profile select modal:
    setProfileModalActive(true);


    fetch(SERVER_PATH + '/retrievenotes', {
      method: "POST",
      body: JSON.stringify({greeting: "hello"}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log('response received.');
      console.log(res);
      if (res.ok) {
        return res.json();
      }
      else {
        setContents('Something went wrong with receiving content from the server.');
      }
    }).then(data => {
      console.log('the res from the backend was ok.');
      let dataStr = data['responsefromserver'];
      console.log(dataStr);
      setContents(dataStr);
    }).catch(error => {
      console.log('caught the following error:', error);
    });
  };  

  const addNewNote = () => {

    if (notes.length === 10) {
      // max reached.
      return;
    }

    let noteObj = {
        note: ``, 
        noteKey: uuidV4(), 
        dateCreated: Date.now(),
        dateModified: Date.now(),
        userCreated: true
    };
    
    currentList.push(noteObj);

    console.log('curList', currentList);
    console.log('notes:', notes);

    setNotes(oldValue => {
      return ([...oldValue, noteObj]);
    });

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


      // TODO - determine if I even actually need to use and keep this backing list to manage state of the notes list.
      // update the backing array (currentList) to not include the deleted note:
      // clear the list:
      currentList.length = 0;
      currentList.concat(updatedList); 

      // return a NEW array with the deleted value filtered out:
      return updatedList; 
    });

  };


  return (
    <div className="App">

            
      {profileModalActive && <ModalBackgroundDim/>}

      <div className="appWindow">
      <header className="App-header">

        <div className="titleNote">
          <div className="titleTop">
            <p>Notes</p>
          </div>
          <div className="titleBottom">

          </div>
        </div>
        <nav className="navColumn">
          <div className="userInfo">
            <p>Current user profile: User1</p>
          </div>
 
            <div className="hotBar"> 
              <button onClick={addNewNote}>New note</button>
              <button onClick={loadUserProfile} type="submit">
                  Load existing profile
              </button>

            </div>

          <div className="infoBar">
            <span className="infoI" style={ {opacity: tipDisplayed ? "1" : "0"} }></span>
          <span className="noteToolTip">
          {/* 
          /* the X button to close the tool tip is mothballed below.
          Likely need to get rid of it altogether. */}
          {/* <button className="noteToolTipClose"><span>✕</span></button> */}
          {info}
          </span>
          </div>
        </nav>
        
      </header>


      <NoteContainer handleTipDisplay={handleEditToolTip} editNote={noteEdit} deleteNote={noteDelete} notes={notes} />


      {profileModalActive && <ProfileModal/>}



      </div>

    </div>
  );
}

export default App;
