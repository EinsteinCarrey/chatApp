import React, {Component} from 'react';
import {CardHeader, Avatar, IconButton} from "material-ui";
import '../assets/index.css';
import { withStyles } from 'material-ui/styles';


const styles = {
    avatar: {
        backgroundColor: '#fff'
    },
};

class User extends Component {
    render() {

        const {id, contact, changeRecipient} = this.props;

        const userName = contact[0],
            lastActive = contact[1];

        return (
            <div className="user-details"
                 onClick={(e) => changeRecipient(id, e)}
            >
                <CardHeader
                    avatar={
                        <Avatar aria-label={userName}>
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

export default withStyles(styles)(User);