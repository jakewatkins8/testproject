import { useState } from "react";
import './App.css';
import SERVER_PATH from './environment';

import Note from "./Note.jsx";
import NoteContainer from "./NoteContainer.jsx";

// arrays of text that act as lists of notes:
import notelists from "./notelists.js";

// use UUID for list item keys (note keys):
import { v4 as uuidV4 } from 'uuid';



function App() {

  // currently hardcoded to use first list of object literals from the parent array of arrays of objects:
  const currentList = notelists[0];
  console.log(currentList);

  // trivial state object used to be updated with a response from the REST server:
  const [contents, setContents] = useState("");

  const [notes, setNotes] = useState(currentList.map(note => note.note));

  const loadUserProfile = (event) => {

    // suppress default page refresh behavior on Submit:
    event.preventDefault();

    console.log('the add content button was pressed.');
    fetch(SERVER_PATH + '/addcontent', {
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
      // for (let listNote of list) {
      //   console.log('listnote keys', Object.keys(listNote));
      //   console.log(`${listNote} from the list of objects ${list}`);
      //   console.log('list note Note Key:', listNote['noteKey']);
      //   console.log('note key for deletion: ', noteKeyForDeletion);
      //   if (listNote['noteObj']['noteKey'] === noteKeyForDeletion) {
      //     console.log(`found note w/ matching UUID at position ${list.indexOf(listNote)}. Deleting now.`)
      //     // list.splice(list.indexOf(listNote), 1);
      //     break;
      //   }

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


  return (
    <div className="App">
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
        </nav>
      </header>


      <NoteContainer editNote={noteEdit} deleteNote={noteDelete} notes={notes} />

    </div>
  );
}

export default App;
