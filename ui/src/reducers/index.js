import {combineReducers} from 'redux';
import contacts from './contactsReducer';
import messages from './messagesReducer';

const combinedReducer = combineReducers({
    contacts,
    messages
});


export default combinedReducer;