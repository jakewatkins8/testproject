import "./Note.css";

const Note = (props) => {

    const noteEdit = (event) => {

        const {target, value} = event;

        console.log(target, value);

    };

    const noteDelete = (event) => {

        const {target, value} = event;

        console.log(target, value);


        // may not need value.

        // and pass these up to the parent component.

    };

    return (
    <div className="note">
        <div className="noteHotBar">
            <button onClick={noteEdit} className="edit">edit</button>
            <button onClick={noteDelete} className="delete">delete</button>
        </div>
        <p>{props.content}</p>
    </div>
    );

};


export default Note;