import { useEffect, useState } from "react";
import Note from "./Note.jsx";
import "./NoteContainer.css";

import { PUBLIC_URL } from "./environment.js";





const NoteContainer = (props) => {

    const [messageOpacity, setMessageOpacity] = useState('0');
    const [imageOpacity, setImageOpacity] = useState('1');


    let messageFadeTimer;
    let imageFadeTimer;

useEffect(() => {
    if (Object.keys(props.notes).length === 0) {
        messageFadeTimer = setTimeout(function() {
            setMessageOpacity('1');
            imageFadeTimer = setTimeout(function(){ setImageOpacity('1') }, 500);
        }, 300);
    }
    else if (messageOpacity !== '0') {
        setMessageOpacity('0');
        clearTimeout(messageFadeTimer)
        clearTimeout(imageFadeTimer);
        setImageOpacity('0');
    }
}, [props.notes]);

// useEffect(() => {
//     if (messageOpacity === '1') {
//         setImageOpacity('1');
//     }
//     else if (imageOpacity !== '0') {
//         setImageOpacity('0');
//     }
// }, [messageOpacity]);

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
        {/* below statement is debug; I think the notes may be unmounting early? */}
        {console.log(Object.keys(props.notes), Object.keys(props.notes).length)}
        {Object.keys(props.notes).length === 0 && (<>
            <div className="noneMessage" style={ {opacity: messageOpacity} }>
                <p>
                    No notes added yet. <br/>
                    Select "Add new note" above to start a new note.
                </p>

                <img className="notesImg" src={`${process.env.PUBLIC_URL}/assets/notes.png`} style={ { opacity: imageOpacity } } />
                
            </div>
        </>)}

        
        {
        props.notes.map((note, index) => {

        // drill down one array level into the note object:
        const noteData = note;

          return (<Note content={noteData.note} key={noteData.noteKey} noteKey={noteData.noteKey}
          editNote={handleEditNote} deleteNote={handleDeleteNote} 
          handleToolTip={handleEditToolTip} noteInfo={handleNoteInfo} />);
        })
        }

 
        
    </div>
);


};

export default NoteContainer;