import { useEffect } from "react";
import { useState, useRef } from "react";

import "./Note.css";

const Note = (props) => {

    // const [isReadOnly, setIsReadOnly] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isNew, setIsNew] = useState(props.userCreated);
    
    const [toolTipDisplayed, setToolTipDisplayed] = useState(false);

    const activeTextArea = useRef();

    useEffect(() => {
        if (isNew) {
            // setIsReadOnly(false);
            setIsFocused(true);
        }
    }, []);


    // useEffect(() => handleDisplayTip(), [isFocused, isReadOnly]);

    const handleClick = (event) => {

        if (!isFocused) {
            handleEditClick(event);
        }

        setToolTipDisplayed(false);
        handleHideTip(false);


    };

    const handleEditClick = (event) => {

        // attach noteId to the event:
        event = attachNoteUUID(event);

        console.log('edit handler at note level:', event.target, 'noteId for event', event.noteId);

        // and pass event up the component chain:
        props.editNote(event);

        // setIsReadOnly(false);

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
        // if (!isReadOnly) {
        //     setIsReadOnly(true);
        // }
        if (isNew) {
            setIsNew(false);
        }

        setIsFocused(false);
    };

    let toolTipAppearTimer;

    const handleShowTip = (event) => {

        toolTipAppearTimer = setTimeout(() => {
            props.handleToolTip(true);
            setToolTipDisplayed(true);    
        }, 500);

    };

    
    const handleHideTip = (event) => {

        clearTimeout(toolTipAppearTimer);
        
        props.handleToolTip(false);
        setToolTipDisplayed(false);

    };

    return (
    <div className="note">
        <div className="infoButton">
            <button onClick={handleInfoClick}>i</button>
        </div>
        <div className="noteHotBar">
            <button onClick={handleEditClick} className="edit" style={ {backgroundColor: isFocused ? '#75ecbb' : '' }}>edit</button>
            <button onClick={handleDeleteClick} className="delete">delete</button>
        </div>
        <textarea onMouseEnter={handleShowTip} onMouseLeave={handleHideTip} onClick={handleClick} onTouchStart={handleEditClick} ref={activeTextArea} onBlur={handleBlur} defaultValue={props.content}
        placeholder={isNew ? "New note - start writing something..." : ""}
        style={ { backgroundColor: isFocused && '#F8D862'} } />
        {/* {(isReadOnly && isFocused) && (<>
        <button className="noteToolTipClose"><span>✕</span></button>
        <p className="noteToolTip">(double click/double tap the text area to edit)</p>
        </> 
        )} */}
        {/* tags removed from textarea - changing the edit workflow: */}
        {/* readOnly={isReadOnly}  */}
    </div>
    );

};


export default Note;