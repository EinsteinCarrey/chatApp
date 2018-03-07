import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme, TextField, Button} from "material-ui";
import '../assets/index.css';
import User  from './user';
import Message  from './chats';
import ChatHeader from "./chatHeader";
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';


const theme = createMuiTheme();

class App extends Component {

    state = {
        users: [],
        messages: []
    };

    componentDidMount(){

    }

    render() {

        const {users, messages} = this.state;

        return (
            <MuiThemeProvider theme={theme}>
                <div className="container" {...this.props}>
                    <div className="conversations">

                        <ChatHeader
                            userName="Shrimp and Chorizo Paella"
                            lastActive="September 14, 2016"
                        />

                        {messages.map((text, index) =>(
                            <Message text={text} ownMessage={index%2}/>
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
                            {users.map((user) =>(
                            <User
                                userName="Shrimp and Chorizo Paella"
                                lastActive="September 14, 2016"
                            />
                            ))}
                        </ul>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        users: state.users,
        messages: state.messages
    }
};

const mapDispatchToProps = () => {

};

export default connect(mapStateToProps, mapDispatchToProps)(App);