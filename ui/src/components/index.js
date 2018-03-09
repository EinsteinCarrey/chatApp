import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme, TextField, Button} from "material-ui";
import '../assets/index.css';
import User  from './user';
import Chat  from './chats';
import ChatHeader from "./chatHeader";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import io from 'socket.io-client';
import {fetchMessages, fetchContacts, createMessage, authenticateUser} from '../actions/';
import AuthenticationModal from './authenticationModal';
import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.min.css';


const socketUrl = 'http://127.0.0.1:4000';
const theme = createMuiTheme();

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
        if(this.state.user) {
            const {fetchMessages, fetchContacts} = this.props;
            fetchContacts();
            fetchMessages();
        }
    }

    componentWillMount(){


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

        /* Update the messages state */
        if( this.state.user !== nextProps.user) {
            this.setState({user: nextProps.user});

            const {fetchMessages, fetchContacts} = this.props;
            fetchContacts();
            fetchMessages();
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
        this.props.authenticateUser(endPoint, data);
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
        this.props.createMessage(
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
                        <div className="message-input">
                            <TextField
                                id="newMessage"
                                multiline
                                rowsMax="4"
                                fullWidth
                                placeholder={
                                    contacts[currentChat] ? "Message " + contacts[currentChat][0] : ""
                                }
                                onChange={(e) => {
                                    updateNewMessage(e)
                                }}
                                margin="normal"
                            />
                        </div>
                        <div className="send-message">
                            <Button
                                variant="raised"
                                color="primary"
                                onClick={sendMessage}>
                                Send
                            </Button>
                        </div>
                        <div className="chats-sidebar">
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
       fetchMessages,
       fetchContacts,
       createMessage,
       authenticateUser
   }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);