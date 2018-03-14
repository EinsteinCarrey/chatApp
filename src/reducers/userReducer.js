import * as actionTypes from '../actions/actionTypes';
const initialState = localStorage.getItem('token');


export default function contactsReducer(state = initialState, action){

    switch (action.type) {
        case actionTypes.CREATE_USER_SUCCESS:
            return localStorage.getItem('token');
        case actionTypes.RE_AUTHENTICATE:
            return "";
        default:
            return state;
    }
}
