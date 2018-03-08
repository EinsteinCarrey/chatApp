import * as actionTypes from '../actions/actionTypes';
const initialState = {};


export default function contactsReducer(state = initialState, action){

    switch (action.type) {
        case actionTypes.FETCH_CONTACTS_SUCCESS:
            return action.contacts;
        default:
            return state;
    }
}
