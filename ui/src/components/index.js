import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme, TextField, Button, Typography} from "material-ui";
import '../assets/index.css';
import User  from './user';
import Chat  from './chats';
import ChatHeader from "./chatHeader";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import io from 'socket.io-client';
import {fetchMessages, fetchContacts, createMessage, authenticateUser, addNewContact, addNewMessage} from '../actions/';
import AuthenticationModal from './authenticationModal';
import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.min.css';
import MessageInput from "./newMessageInput";


const socketUrl = 'http://127.0.0.1:4000';
const theme = createMuiTheme();
const socket = io(socketUrl);

class App extends Component {

    state = {
        contacts: {},
        messages: {},
        user: localStorage.getItem('token'),
        currentChat: "",
        newMessage: "",
        userData: {
            signupAction: "login",
            passwd: "",
            username: ""
        },
        showLoginModal: true
    };

    componentDidMount(){
        const {fetchmessages, fetchcontacts, addnewcontact, addnewmessage} = this.props;
        const {user} = this.state;
        if(user) {
            fetchcontacts();
            fetchmessages();
        }


        socket.on('connect', ()=>{

            // Register user for this socket
            socket.emit('register_user', user);

            // Receive new contacts created
            socket.on('newUser', (userdata)=>{
                addnewcontact(userdata);
            });

            // Receive new contacts created
            socket.on('newMessage', (messageData)=>{
                addnewmessage(messageData);
            });
        });


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

        /* Update the messages state */
        if( this.state.user !== nextProps.user) {
            this.setState({user: nextProps.user});

            // Register user for this socket
            socket.emit('register_user', nextProps.user);

            //  Get messages and contacts for this user
            const {fetchmessages, fetchcontacts} = this.props;
            fetchcontacts();
            fetchmessages();
        }

    }

    changeRecipient = (recipient, e)=>{
        this.setState({ currentChat: recipient });
    };

    updateNewMessage = (e) =>{
        this.setState({ newMessage: e.target.value });
    };

    authenticateUser = () =>{
        const {passwd, username, signupAction} = this.state.userData;
        const data = {
            passwd,
            username
        };
        let endPoint = "";
        signupAction === "login" ? endPoint = "/users/authenticate" : endPoint="/users";
        this.props.authenticateuser(endPoint, data);
    };

    hideAuthModal = ()=>{
        if(localStorage.getItem('token')) {
            this.setState({showLoginModal: false})
        }else{
            toastr.remove();
            toastr.error("Please login to continue");
        }
    };

    updateInputState = (source, e) => {
        let newDataState = this.state.userData;
        newDataState[source] = e.target.value;
        this.setState({userData: newDataState});
    };


    sendMessage = () =>{
        this.props.createmessage(
            { message: this.state.newMessage },
            this.state.currentChat
        );
    };

    render() {

        const {
            contacts,
            messages,
            currentChat,
            userData,
            user,
            showLoginModal
        } = this.state;

        const {
            changeRecipient,
            updateNewMessage,
            sendMessage,
            updateInputState,
            hideAuthModal,
            authenticateUser
        } = this;

        return (
            <MuiThemeProvider theme={theme}>
                {
                    !user &&
                        <AuthenticationModal
                            authenticateUser={authenticateUser}
                            hideAuthModal={hideAuthModal}
                            showLoginModal={showLoginModal}
                            userData={userData}
                            updateInputState={updateInputState}/>
                }
                {
                    user &&
                    <div className="container" {...this.props}>
                        <div className="conversations">

                            {
                                contacts[currentChat] &&
                                <ChatHeader contact={contacts[currentChat]}/>
                            }

                            {messages[currentChat] && messages[currentChat].map((message, index) => (
                                    <Chat key={index} message={message} ownMessage={index % 2}/>
                                )
                            )}

                        </div>

                        {
                            Object.keys(contacts).length > 0 ?
                                <MessageInput
                                    currentChat={contacts[currentChat][0]}
                                    updateNewMessage={updateNewMessage}
                                    sendMessage={sendMessage}
                                /> :

                                <Typography variant="headline" gutterBottom align="center">
                                    You don't have any contacts yet
                                </Typography>
                        }

                        <div className="chats-sidebar">
                            <Typography variant="headline" gutterBottom align="center">
                                Contacts
                            </Typography>
                            <ul>
                                {Object.keys(contacts).map((id) => (
                                    <User
                                        changeRecipient={changeRecipient}
                                        key={id} id={id}
                                        contact={contacts[id]}
                                    />
                                ))
                                }
                            </ul>
                        </div>
                    </div>
                }
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        contacts: state.contacts,
        messages: state.messages,
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
       addnewmessage: addNewMessage,
       addnewcontact: addNewContact,
       fetchmessages: fetchMessages,
       fetchcontacts: fetchContacts,
       createmessage: createMessage,
       authenticateuser: authenticateUser
   }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);