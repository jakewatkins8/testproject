import Note from "./Note.jsx";
import "./NoteContainer.css";

const NoteContainer = (props) => {

    // {props.noteList === [] && (<>
    //     <p>No notes added yet. <br/> Select "Add new note" above to start a new note.</p>
    //     </>)}
    //     {props.noteList !== [] && props.noteList.map((note, index) => {
    //         <Note key={index} content={props.noteList[index]}/>
    //     })}

return (
    <div className="noteContainer">

        {/* <Note/> <Note/> <Note/> <Note/> <Note/> */}
        
    </div>
);



};

export default NoteContainer;