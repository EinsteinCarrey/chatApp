import {combineReducers} from 'redux';
import contacts from './contactsReducer';
import messages from './messagesReducer';
import user from './userReducer';

const combinedReducer = combineReducers({
    contacts,
    messages,
    user
});


export default combinedReducer;