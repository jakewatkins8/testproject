import { useEffect, useState } from "react";


import "./ProfileModal.css";

interface ProfileModal {
    currentUser: string;
}


const ProfileModal = (prop: { currentUser : string }) => {

    const users = [] as Array<String>;
    
    useEffect(() => getUserList(), []);


    // how to dismiss the modal? maybe just a close button for now.
    const handleClose = (event: Event) => {

    };

    // method to query MongoDB for all users, to render the list so it can be selected from
    const getUserList = () => {

// TODO -> change to actually query DB
// dummy data:
        const usersFromDb = [
            [{'username': 'user 1'}], 
            [{'username': 'user 2'}], 
            [{'username': 'user 3'}]
    ];

        users.concat(usersFromDb.map(row => row['username']));

        console.log('Users array, after DB request:', users);
    };


    // method to receive which user was selected:
    const handleLoadUserSelect = (event) => {};

    // method to request a given user's notes from MongoDB via the Express REST API
    const requestUserNotes = () => {};

    return (
        <div className="profileModal">
            <div className="modalClose">
                <span>✕</span>
            </div>
            <p>Select a user profile to load from the list below.</p>
            <ol>
                {users.map(userName => <li>
                                        <button onClick={handleLoadUserSelect}>
                                            {userName}
                                        </button>
                                    </li>)}
            </ol>
        </div>
        ); 
};

export default ProfileModal;