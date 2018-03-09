import * as actionTypes from '../actions/actionTypes';
const initialState = "";


export default function contactsReducer(state = initialState, action){

    switch (action.type) {
        case actionTypes.CREATE_USER_SUCCESS:
            return action.token;
        default:
            return state;
    }
}
