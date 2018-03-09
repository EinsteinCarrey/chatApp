import * as actionTypes from '../actions/actionTypes';
const initialState = {};


export default function messagesReducer(state = initialState, action){

    switch (action.type) {
        case actionTypes.FETCH_MESSAGES_SUCCESS:
            return action.messages;

        case actionTypes.CREATE_MESSAGE_SUCCESS:

            const {recipient, message, createdAt} = action.data;

            // Clone current state
            let newState = Object.assign({}, state);
            let allMessages = state[recipient].length > 0 ? state[recipient].slice(0):
                [];

            // Add new message to state
            allMessages.push([message, createdAt, true]);
            newState[recipient] = allMessages;

            // Return updated state
            return newState;

        default:
            return state;
    }
}
