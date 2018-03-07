import React, {Component} from 'react';
import {Typography} from "material-ui";
import '../assets/index.css';


class Message extends Component {
    render() {

        const {ownMessage, text} = this.props;

        return (
            <div className={["message",  ownMessage ? "own-message" : "received-message" ].join(" ")}>
                <Typography component="p">
                    <div>
                        {text}
                    </div>
                </Typography>
                <Typography variant="caption" gutterBottom align="right">
                    <div>
                        9:30 pm Yesterday
                    </div>
                </Typography>
            </div>
        );
    }
}

export default Message;