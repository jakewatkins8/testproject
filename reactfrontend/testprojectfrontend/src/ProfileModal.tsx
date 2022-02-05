import { process_params } from "express/lib/router";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";


import "./ProfileModal.css";

interface ProfileModal {
    currentUser: string;
}


const ProfileModal = (prop: { currentUser : string, modalClosed: Function, selectedUser: Function }) => {

    const [users, setUsers] = useState([]);

    const [modalStyle, setModalStyle] = useState({});
    
    useEffect(() => getUserList(), []);


    // update style for animation (?)
    useEffect(() => {
        
        setModalStyle({
            transform: 'scale(1)',
            opacity: '1'
        });

    }, []);


    // how to dismiss the modal? maybe just a close button for now.
    const handleClose = (event: Event) => {

    };

    // method to query MongoDB for all users, to render the list so it can be selected from
    const getUserList = () => {

// TODO -> change to actually query DB
// dummy data:
        const usersFromDb = [
            [{'username': 'dog_walker'}], 
            [{'username': 'cat_sitter'}], 
            [{'username': 'software_engr'}]
    ];

        setUsers(() => usersFromDb.map(row => row[0]['username']));

        console.log('Users array, after DB request:', users);
    };

    // TODO TSX - type of event?
    // method to receive which user was selected:
    const handleLoadUserSelect = (event) => {

        prop.selectedUser(event.target.name);
    };

    // TODO TSX - type of event?
    const handleModalClose = (event) => {
        // TODO TSX - how to pass up either the event or the boolean value correctly?
        prop.modalClosed(event);
    };

    // method to request a given user's notes from MongoDB via the Express REST API
    const requestUserNotes = () => {};

    return (
        <div style={modalStyle} className="profileModal">
            <button onClick={handleModalClose} className="modalClose">
                <span>✕</span>
            </button>
            <p>Select a user profile to load from the list below.</p>
            <ol>
                {users.map(userName => <li key={uuidv4()}>
                                        <button name={userName} onClick={handleLoadUserSelect}>
                                            {userName}
                                        </button>
                                    </li>)}

            </ol>
        </div>
        ); 
};

export default ProfileModal;