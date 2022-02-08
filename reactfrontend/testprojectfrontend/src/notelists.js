// dummy uuid:
import { v4 as uuidV4 } from 'uuid';

// An array of object/array hybrids used to describe each user's collection of notes.
// This is what Tesla meant when he said "You may live to see man-made horrors beyond your comprehension."
// You are living it.

const dummyDataCreateDate = new Date();

// looks up and returns a reference to a user's note list.
/* @param userName: the user's username as a string. */
const findListByUser = (userName) => {

    for (let noteList of noteLists) {

        // drills down one more level:
        noteList = noteList[0];

        console.log(noteList);

        if (noteList.hasOwnProperty(userName)) {
            console.log(`list located: ${JSON.stringify(noteList).substring(0, 70).concat('...')}`);

            // drills down in object to obtain the 2d array of "rows" of note objects:
            noteList = noteList[userName];

            console.log('note objects within the list: \n', JSON.stringify(noteList).substring(0, 70).concat('...'));

            return noteList;
        }
    }

};

const noteLists = [
    [
        {
            'dog': 
            [
                {note: 'Dog treats', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'Dog shampoo', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'Dog food', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'Dog leash', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)}
            ]
        }
    ],
    [
        {
            'cat_sitter': 
            [
                {note: 'Cat shampoo', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'Cat treats', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'human first aid kit', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'spray bottle', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)}
            ]
        }
    ],
    [
        {
            'software_engr': 
            [
                {note: 'open issue', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'open issue caused by working on issue', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'delete feature and close issues', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)},
                {note: 'mothball app', noteKey: uuidV4(), dateCreated: Date(dummyDataCreateDate), dateModified: Date(dummyDataCreateDate)}
            ]
        }
    ]
];


export { findListByUser };
export default noteLists;

