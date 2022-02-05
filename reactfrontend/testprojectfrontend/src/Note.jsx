import { useEffect } from "react";
import { useState, useRef } from "react";

import "./Note.css";

const Note = (props) => {

    // const [isReadOnly, setIsReadOnly] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [isNew, setIsNew] = useState(props.userCreated);
    
    const [toolTipDisplayed, setToolTipDisplayed] = useState(false);

    const [moveMode, setMoveMode] = useState(false);

    // boolean flag state object to trigger a deleted animation:
    const [deletedAnim, setDeletedAnim] = useState(false);


    
    const activeTextArea = useRef();

    useEffect(() => {
        if (isNew) {
            // setIsReadOnly(false);
            setIsFocused(true);
        }
    }, []);


    const deleteNoteStyle = {
        opacity: 0,
        width: '0px',
        height: '0px',
        margin: '0',
        padding: '0'
    };



    const handleClick = (event) => {

        // if (!isFocused) {
        //     handleEditClick(event);
        // }

        handleEditClick(event);


        setToolTipDisplayed(false);
        handleHideTip(false);


    };

    const handleEditClick = (event) => {

        // attach noteId to the event:
        event = attachNoteUUID(event);

        console.log('edit handler at note level:', event.target, 'noteId for event', event.noteId);

        // and pass event up the component chain:
        props.editNote(event);


        activeTextArea.current.focus();

        setIsFocused(true);
        

    };

    const handleDeleteClick = (event) => {

        // attach noteId to the event:
        event = attachNoteUUID(event);

        console.log('delete handler at note level:', event.target, 'noteId for event', event.noteId);



        // trigger a CSS 'deleted' animation:
        setDeletedAnim(true);

        

        setTimeout(() => props.deleteNote(event), 400);


        // and pass event up the component chain:
        // props.deleteNote(event);

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

    const focusStyle = {
        backgroundColor: '#F8D862',
        // alignSelf: 'flex-end',
        top: '10px',
        borderRadius: '20px 20px 0 0',
        borderBottom: '2px dotted black'
        
    };



    return (
    <div style={deletedAnim ? deleteNoteStyle : {}} className="note">
        {!deletedAnim && 
            <div className="noteHotBar">
            <button onClick={handleInfoClick}>info</button>
            <button onClick={handleEditClick} className="edit" style={ isFocused ? focusStyle : {} }>edit</button>
            <button onClick={handleDeleteClick} className="delete">delete</button>
            </div>
        }
        <textarea onMouseEnter={handleShowTip} onMouseLeave={handleHideTip} onClick={handleClick} onTouchStart={handleEditClick} ref={activeTextArea} onBlur={handleBlur} defaultValue={props.content}
        placeholder={isNew ? "New note - start writing something..." : ""} 
        style={ { backgroundColor: isFocused && '#F8D862'} } />

    </div>
    );

};


export default Note;