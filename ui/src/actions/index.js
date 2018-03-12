import * as actionTypes from './actionTypes';
import fetchFromApi from "../apiHandler";
import toastr from 'toastr';

const displayErrorMessage = (err) =>{
    toastr.error(err);
    let output = null;
    String(err).includes("session has expired") ? output = {type: actionTypes.RE_AUTHENTICATE} :
        output = {type: actionTypes.DISPLAY_ERROR_MSG};
    return output;
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

export const createMessage = (message, recipientsID) =>{

    return function (dispatch) {

        /* display loader */
        dispatch({type: actionTypes.START_LOADER});

        fetchFromApi("post", `/${recipientsID}/message`, message).then((data) => {
            dispatch({
                type: actionTypes.CREATE_MESSAGE_SUCCESS,
                data: data
            });
        }).catch((err) => {
            dispatch(displayErrorMessage(err));
        });
    }

};

export const authenticateUser = (endpoint, userdata) =>{

    return function (dispatch) {

        /* display loader */
        dispatch({type: actionTypes.START_LOADER});

        fetchFromApi("post", endpoint, userdata).then((token) => {
            localStorage.setItem('token', token);
            dispatch({
                type: actionTypes.CREATE_USER_SUCCESS
            });
        }).catch((err) => {
            dispatch(displayErrorMessage(err));
        });
    }

};

export const addNewMessage = (message) =>{
    return function (dispatch) {
        dispatch({type: actionTypes.NEW_MESSAGE_NOTIFY, message});
    }
};

export const addNewContact = (newUser) =>{
    return function (dispatch) {
        dispatch({type: actionTypes.NEW_USER_NOTIFY, newUser});
    }
};