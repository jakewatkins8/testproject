import { useState } from "react";
import './App.css';
import SERVER_PATH from './environment';

import Note from "./Note.jsx";
import NoteContainer from "./NoteContainer.jsx";

// arrays of text that act as lists of notes:
import notelists from "./notelists.js";



function App() {

  // currently hardcoded to use first list of notes from the parent list of lists:
  const currentList = notelists[0];


  const [contents, setContents] = useState("");

  const [notes, setNotes] = useState(currentList);

  const addContentButton = (event) => {

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

    currentList.push("<new note>");

    setNotes((oldVal) => [...notes, currentList[currentList.length]])

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

        <div className="hotBar"> 
          <button onClick={addNewNote}>Add New</button>
          <button onClick={addContentButton} type="submit">
              Load Existing Profile
          </button>
        </div>


      </header>

{/* noteList={currentList} */}

      <NoteContainer>
        {notes.map((note, index) => {
          <Note content={note} key={index} />
        })}
      </NoteContainer>

    </div>
  );
}

export default App;
