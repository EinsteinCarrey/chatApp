import * as actionTypes from './actionTypes';
import fetchFromApi from "../apiHandler";

const displayErrorMessage = (err) =>{
    console.log(err);
    return {type: actionTypes.DISPLAY_ERROR_MSG}
};

export const fetchMessages = () =>{

    return function (dispatch) {

        /* display loader */
        dispatch({type: actionTypes.START_LOADER});

        fetchFromApi("get").then((messages) => {
            dispatch({
                type: actionTypes.FETCH_MESSAGES_SUCCESS,
                messages: messages
            });
        }).catch((err) => {
            dispatch(displayErrorMessage(err));
        });
    }

};

export const fetchContacts = () =>{

    return function (dispatch) {

        /* display loader */
        dispatch({type: actionTypes.START_LOADER});

        fetchFromApi("get","/contacts").then((contacts) => {
            dispatch({
                type: actionTypes.FETCH_CONTACTS_SUCCESS,
                contacts: contacts
            });
        }).catch((err) => {
            dispatch(displayErrorMessage(err));
        });
    }

};

export const createMessage = (recipientsID, message) =>{

    return function (dispatch) {

        /* display loader */
        dispatch({type: actionTypes.START_LOADER});

        fetchFromApi("post", recipientsID+"/message", message).then(() => {
            dispatch({
                type: actionTypes.CREATE_MESSAGE_SUCCESS,
                message: message
            });
        }).catch((err) => {
            dispatch(displayErrorMessage(err));
        });
    }

};
//
// export const createContact = (endpoint, userData) =>{
//     return function (dispatch) {
//
//         /* display loader */
//         dispatch({type: actionTypes.START_LOADER});
//
//         fetchFromApi("post", endpoint, userData).then((outPut) => {
//             /* Set token in localStorage */
//             localStorage.setItem("token", outPut.token);
//             localStorage.setItem("displayName", outPut.displayName);
//
//             dispatch({
//                 type: actionTypes.AUTHENTICATE_USER_SUCCESS,
//                 displayName: outPut.displayName
//             });
//         }).catch((err) => {
//             dispatch(displayErrorMessage(err));
//         });
//     }
// };