import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme, TextField, Button} from "material-ui";
import '../assets/index.css';
import User  from './user';
import Chat  from './chats';
import ChatHeader from "./chatHeader";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import io from 'socket.io-client';
import {fetchMessages, fetchContacts, createMessage} from '../actions/';


const socketUrl = 'http://127.0.0.1:4000';
const theme = createMuiTheme();

class App extends Component {

    state = {
        contacts: {},
        messages: {},
        currentChat: ""
    };

    componentWillMount(){

        const {fetchMessages, fetchContacts} = this.props;

        fetchContacts();
        fetchMessages();

        // const socket = io(socketUrl);
        // socket.on('interval_received', (interval)=>{
        //     console.log("interval_received", interval);
        // });
        //
        // socket.emit('subscribeToTimer', 1000);

    }

    componentWillReceiveProps(nextProps) {

        /* Update the messages state */
        if( this.state.contacts !== nextProps.contacts)
            this.setState({
                contacts: nextProps.contacts,
                currentChat: Object.keys(nextProps.contacts)[0]
            });

        /* Update the messages state */
        if( this.state.messages !== nextProps.messages)
            this.setState({messages: nextProps.messages});

    }

    changeRecipient = (recipient, e)=>{
        this.setState({ currentChat: recipient });
    };

    render() {

        const {contacts, messages, currentChat} = this.state;
        const {changeRecipient} = this;

        return (
            <MuiThemeProvider theme={theme}>
                <div className="container" {...this.props}>
                    <div className="conversations">

                        {
                            contacts[currentChat] &&
                            <ChatHeader contact={contacts[currentChat]} />
                        }

                        {messages[currentChat] && messages[currentChat].map((message, index) =>(
                            <Chat key={index} message={message} ownMessage={index%2}/>
                            )
                        )}

                    </div>
                    <div className="message-input">
                        <TextField
                            id="multiline-flexible"
                            multiline
                            rowsMax="4"
                            fullWidth
                            placeholder="Message Username"
                            onChange={()=>{}}
                            margin="normal"
                        />
                    </div>
                    <div className="send-message">
                        <Button className="" variant="raised" color="primary">
                            Send
                        </Button>
                    </div>
                    <div className="chats-sidebar">
                        <ul>
                            {Object.keys(contacts).map((id) =>(
                                <User
                                    changeRecipient ={changeRecipient}
                                    key={id} id={id}
                                    contact={contacts[id]}
                                />
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        contacts: state.contacts,
        messages: state.messages
    }
};

const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({fetchMessages, fetchContacts, createMessage}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);