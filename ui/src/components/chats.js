import React, {Component} from 'react';
import {Typography} from "material-ui";
import '../assets/index.css';


class Message extends Component {
    render() {

        const {message} = this.props;

        return (
            <div className="message-div">
                <div className={["message",  message[2] ? "own-message" : "received-message" ].join(" ")}>
                    <Typography component="p">
                        <div>
                            {message[0]}
                        </div>
                    </Typography>
                    <Typography variant="caption" gutterBottom align="right">
                        <div>
                            {message[1]}
                        </div>
                    </Typography>
                </div>
            </div>
        );
    }
}

export default Message;