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


    let messageFadeTimer;
    let imageFadeTimer;

useEffect(() => {
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

// const handleEditToolTip = displayed => {props.handleTipDisplay(displayed)};


return (
    
    <div className="noteContainer">
        {/* below statement is debug; I think the notes may be unmounting early? */}
        {console.log(Object.keys(props.notes), Object.keys(props.notes).length)}
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

{/* let newRandKey = uuidV4();
key={newRandKey} noteKey={newRandKey}  */}
{/* testing using a random UUID here in the render: */}
{/* TODO -> does LOSING the old initial UUID cause any problems as long as React knows which is which? */}
{/* maybe not. maybe if it were an issue, you could also port over a different unique identifier from the DB. */}
{/* changing the tag from key={noteData.noteKey}, and noteKey={noteData.noteKey} to something else too */}
{/* handleToolTip={handleEditToolTip} */}

          return (<Note content={noteData.note} key={uuidV4()} noteKey={noteData.noteKey}
          editNote={handleEditNote} deleteNote={handleDeleteNote} 
           noteInfo={handleNoteInfo} />);
        })
        }

 
        
    </div>
);


};

export default NoteContainer;