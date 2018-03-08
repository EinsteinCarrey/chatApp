import * as actionTypes from '../actions/actionTypes';
const initialState = {};


export default function messagesReducer(state = initialState, action){

    switch (action.type) {
        case actionTypes.FETCH_MESSAGES_SUCCESS:
            return action.messages;

        case actionTypes.CREATE_MESSAGE_SUCCESS:
            const recipient = action.message[0];

            // Clone current state
            let newState = Object.assign({}, state);
            let allMessages = state.recipient.slice(0);

            // Add new message to state
            allMessages.push(action.message);
            newState.recipient = allMessages;


            // Return updated state
            return newState;

        default:
            return state;
    }
}
