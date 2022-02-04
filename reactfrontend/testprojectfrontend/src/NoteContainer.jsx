import { useState } from "react";
import Note from "./Note.jsx";
import "./NoteContainer.css";

import { PUBLIC_URL } from "./environment.js";





const NoteContainer = (props) => {



const handleEditNote = (event) => {
    console.log(`noteContainer level: note assoc. w/ ${event.noteId} has been selected for editing`);
    props.editNote(event);
};

const handleDeleteNote = (event) => {
    console.log(`noteContainer level: note assoc. w/ ${event.noteId} has been selected for deletion`);
    props.deleteNote(event);
};

const handleNoteInfo = (event) => {

    props.noteInfo(event);
};

const handleEditToolTip = displayed => {props.handleTipDisplay(displayed)};


return (
    <div className="noteContainer">
        {props.notes.length === 0 && (<>
            <div className="noneMessage">
                <p>
                    No notes added yet. <br/>
                    Select "Add new note" above to start a new note.
                </p>

                <img class="notesImg" src={`${process.env.PUBLIC_URL}/assets/notes.png`} />
                
            </div>
        </>)}

        
        {
        props.notes.map((note, index) => {
            console.log(`note at index ${index}: key - ${note.noteKey}`);

          return (<Note content={note.note} key={note.noteKey} noteKey={note.noteKey}
          editNote={handleEditNote} deleteNote={handleDeleteNote} 
          handleToolTip={handleEditToolTip} userCreated={note.userCreated} noteInfo={handleNoteInfo} />);
        })
        }

{/* dummy data for mockup */}
    {/* <Note content="Exercise" /> <Note content="Game Friday, 7:00 PM "/> <Note content="Update notes app" /> 
    <Note content="Finish notes app" /> <Note content="Learn from the project" /> */}
        
    </div>
);


};

export default NoteContainer;