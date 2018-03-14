import React, {Component} from 'react';
import {TextField, Button} from "material-ui";

class MessageInput extends Component {
    render() {

        const {currentChat, updateNewMessage, sendMessage} = this.props;

        return (
            <div>
                <div className="message-input">
                    <TextField
                        id="newMessage"
                        multiline
                        rowsMax="4"
                        fullWidth
                        placeholder={
                            currentChat ? "Message " + currentChat : ""
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
                        onClick={sendMessage}
                    >
                        Send
                    </Button>
                </div>
            </div>
        );
    }
}

export default MessageInput;