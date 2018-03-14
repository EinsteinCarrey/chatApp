import * as actionTypes from '../actions/actionTypes';
const initialState = [];


export default function contactsReducer(state = initialState, action){

    switch (action.type) {
        case actionTypes.FETCH_CONTACTS_SUCCESS:
            return action.contacts;
        case actionTypes.NEW_USER_NOTIFY:
            const {id, username, createdAt} = action.newUser;

            let newState = Object.assign({}, state);
            newState[id] = [username, createdAt];
            return newState;
        default:
            return state;
    }
}
