import React, {Component} from 'react';
import {CardHeader, Avatar, IconButton} from "material-ui";
import './index.css';
import { withStyles } from 'material-ui/styles';


const styles = {
    avatar: {
        backgroundColor: '#fff'
    },
};

class User extends Component {
    render() {

        const {userName, lastActive} = this.props;

        return (
            <CardHeader
                avatar={
                    <Avatar aria-label="Recipe">
                        {userName.substring(0,1).toUpperCase()}
                    </Avatar>
                }
                title={userName}
                subheader={lastActive}
            />
        );
    }
}

export default withStyles(styles)(User);