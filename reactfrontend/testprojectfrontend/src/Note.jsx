import { useEffect } from "react";
import { useState, useRef } from "react";

import "./Note.css";

const Note = (props) => {

    const [isReadOnly, setIsReadOnly] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isNew, setIsNew] = useState(props.userCreated);
    
    const [toolTipDisplayed, setToolTipDisplayed] = useState(false);

    const activeTextArea = useRef();

    useEffect(() => {
        if (isNew) {
            setIsReadOnly(false);
            setIsFocused(true);
        }
    }, []);


    useEffect(() => handleDisplayTip(), [isFocused, isReadOnly]);

    const handleSingleClick = (event) => {

        setIsFocused(true);


    };

    const handleEditClick = (event) => {

        // attach noteId to the event:
        event = attachNoteUUID(event);

        console.log('edit handler at note level:', event.target, 'noteId for event', event.noteId);

        // and pass event up the component chain:
        props.editNote(event);

        setIsReadOnly(false);

        activeTextArea.current.focus();

        setIsFocused(true);
        

    };

    const handleDeleteClick = (event) => {

        // attach noteId to the event:
        event = attachNoteUUID(event);

        console.log('delete handler at note level:', event.target, 'noteId for event', event.noteId);

        // and pass event up the component chain:
        props.deleteNote(event);

    };

    const handleInfoClick = (event) => {

        event = attachNoteUUID(event);

        console.log('info handler at note level running');

        props.noteInfo(event);
    };

    // helper function to attach note UUID for any of the click handlers above.
    const attachNoteUUID = (event) => {

        // obtain reference to note's UUID
        let noteId = props.noteKey;

        // attach it as a custom property on the triggered event:
        event.noteId = noteId;


        // return the event to the calling click handler, now that the note UUID is added:
        return event;
    };

    // reset the textarea to read only (and the normal color) if it was being edited:
    const handleBlur = (event) => {
        console.log('handle blur(handling focus leaving the textarea) running');
        if (!isReadOnly) {
            setIsReadOnly(true);
        }
        if (isNew) {
            setIsNew(false);
        }

        setIsFocused(false);
    };

    const handleDisplayTip = () => {

        // use to pass state change before the state loop completes:
        let displayed;

        if (isFocused && isReadOnly) {
            displayed = true;
            setToolTipDisplayed(true);
        }
        else {
            displayed = false;
            setToolTipDisplayed(false);
        }

        // TODO - this param may get handed up BEFORE the state loop completes, and could then be wrong/behind.
        // may have to use a backing state variable here to send instead, one that will
        // update immediately.
        // props.handleToolTip(toolTipDisplayed);

        // trying w/ a separate pre-state update variable now:
        props.handleToolTip(displayed);

        // TODO - so, that does work.
        // But it is proper practice in React?

    };

    return (
    <div className="note">
        <div className="infoButton">
            <button onClick={handleInfoClick}>i</button>
        </div>
        <div className="noteHotBar">
            <button onClick={handleEditClick} className="edit">edit</button>
            <button onClick={handleDeleteClick} className="delete">delete</button>
        </div>
        <textarea onClick={handleSingleClick} onDoubleClick={handleEditClick} autoFocus ref={activeTextArea} onBlur={handleBlur} readOnly={isReadOnly} defaultValue={props.content}
        placeholder={isNew ? "New note - start writing something..." : ""}
        style={ { backgroundColor: isReadOnly ? 'initial' : '#F8D862'} }/>
        {/* {(isReadOnly && isFocused) && (<>
        <button className="noteToolTipClose"><span>✕</span></button>
        <p className="noteToolTip">(double click/double tap the text area to edit)</p>
        </> 
        )} */}
    </div>
    );

};


export default Note;