import { useEffect, useState } from "react";
import Note from "./Note.jsx";
import "./NoteContainer.css";

import { REACT_APP_PUBLIC_URL } from "./environment.js";


// use UUID for list item keys (note keys):
import { v4 as uuidV4 } from 'uuid';





const NoteContainer = (props) => {

    // const [messageOpacity, setMessageOpacity] = useState('0');
    // const [imageOpacity, setImageOpacity] = useState('1');

    const [messageStyle, setMessageStyle] = useState({
        opacity: '0'
    });

    const [imageStyle, setImageStyle] = useState({
        opacity: '0'
    });



useEffect(() => {

    console.log(`notes object as received by note container ${JSON.stringify(props.notes)}`);
    
    if (Object.keys(props.notes).length === 0) {
        setMessageStyle({
            opacity: '1'
        });
        setImageStyle({
            opacity: '1'
        });
    }
    else if (messageStyle.opacity !== '0') {
        setMessageStyle({
            opacity: '0'
        });
        setImageStyle({
            opacity: '0'
        });
    }
}, [props.notes]);



const handleEditNote = (event) => {
    console.log(`noteContainer level: note assoc. w/ ${event.noteId} has been selected for editing`);
    props.editNote(event);
};

const handleDeleteNote = (event) => {
    console.log(`noteContainer level: note assoc. w/ ${event.noteId} has been selected for deletion`);
    props.deleteNote(event);
};

const handleNoteInfo = (dbId) => {


    
    props.noteInfo(dbId);
};

const handleInfoOut = (dbId) => {

    props.noteInfoOut(dbId);
};

// const handleEditToolTip = displayed => {props.handleTipDisplay(displayed)};


return (
    
    <div className="noteContainer">
        {/* below statement is debug; I think the notes may be unmounting early? */}
        {/* {console.log(Object.keys(props.notes), Object.keys(props.notes).length)} */}
        {Object.keys(props.notes).length === 0 && (<>
            <div className="noneMessage" style={messageStyle}>
                <p>
                    No notes added yet. <br/>
                    Select "Add new note" above to start a new note.
                </p>

                <img className="notesImg" src={`${process.env.PUBLIC_URL}/assets/notes.png`} style={imageStyle} />
                
            </div>
        </>)}

        
        {
        props.notes.map((note, index) => {

        // drill down one array level into the note object:
        const noteData = note;
// TODO add ID here? or...?
          return (<Note content={noteData.content} dbId={noteData['_id']} key={uuidV4()} noteKey={noteData.noteKey}
          editNote={handleEditNote} deleteNote={handleDeleteNote} 
           noteInfo={handleNoteInfo} noteInfoOut={handleInfoOut} noteColor={noteData.noteColor}/>);
        })
        }
    </div>
);


};

export default NoteContainer;