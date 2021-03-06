import React, {Component} from 'react';
import '../assets/index.css';
import {Avatar, CardHeader} from "material-ui";
import { withStyles } from 'material-ui/styles';

const styles = {
    avatar: {
        width: 40,
        height: 40,
    },
    caredHeader: {
        color: "#fff"
    }
};

class ChatHeader extends Component {

    render() {

        const {contact, classes} = this.props;
        const userName = contact[0],
            lastActive = contact[1];

        return (
            <div className="conversations-header">
                <CardHeader
                    avatar={
                        <Avatar
                            className={classes.avatar}
                            aria-label={userName}>
                            {userName.substring(0,1).toUpperCase()}
                        </Avatar>
                    }
                    title={userName}
                    subheader={lastActive}
                />
            </div>
        );
    }
}

export default withStyles(styles)(ChatHeader);