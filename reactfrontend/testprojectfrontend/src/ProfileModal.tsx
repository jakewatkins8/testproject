import { process_params } from "express/lib/router";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";


import "./ProfileModal.css";

interface ProfileModal {
    currentUser: string;
}


const ProfileModal = (prop: { users: Object[], currentUser : string, modalClosed: Function, selectedUser: Function }) => {



    useEffect(() => {

    }, []);


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

    const currentUserNameStyle = {
        backgroundColor: '#bbfff0',
        // color: 'white'
    }


    return (
        <div className="profileModal">
            <button onClick={handleModalClose} className="modalClose">
                <span>✕</span>
            </button>
            <p>Select a user profile to load from the list below.</p>
            <ol>
                {prop.users.map(user => {
                    let isCurrentUser = user['userName'] === prop.currentUser;        
                return (<li key={uuidv4()}>
                        <button name={user['userName']} style={isCurrentUser ? currentUserNameStyle : null} disabled={isCurrentUser ? true : false} onClick={handleLoadUserSelect}>
                            {user['userName']}{isCurrentUser && (' (Current)')}
                        </button>
                        </li>);
                                    })}

            </ol>
        </div>
        ); 
};

export default ProfileModal;