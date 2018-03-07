import {combineReducers} from 'redux';
import user from './usersReducer';
import messages from './messagesReducer';

const combinedReducer = combineReducers({
    user,
    messages
});


export default combinedReducer;