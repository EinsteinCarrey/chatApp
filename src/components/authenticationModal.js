import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

function getModalStyle() {
    return {
        top: `30%`,
        left: `40%`,
        transform: `translate(-30%, -40%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400,
    },
});

class AuthenticationModal extends React.Component {

    state = {
        action: "login",
        userData: this.props.userData
    };

    toggleSignupFields = ()=>{
        let action;
        this.state.action === "signup" ? action = "login" : action = "signup";
        this.setState({action: action});

        /* Toggle actions between signup and login */
        const e = {
            target:{
                value: action
            }
        };
        this.props.updateInputState("signupAction", e)
    };

    render() {
        const { classes, hideAuthModal, showLoginModal, updateInputState, authenticateUser} = this.props;
        const { passwd, username } = this.state.userData;

        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={showLoginModal}
                    onClose={hideAuthModal}
                >
                    <div style={getModalStyle()} className={classes.paper}>

                        <Typography
                            align="left"
                            color="primary"
                            variant="headline"
                        >
                            {
                                this.state.action === "signup" ? <div>Create An Account</div> :
                                    <div>Log In</div>
                            }
                        </Typography>

                        <form>

                            <TextField
                                required
                                id="Username"
                                label="Username"
                                value={username}
                                className={classes.textField}
                                margin="normal"
                                onChange={(e) => updateInputState("username", e)}
                            />

                            <br/>

                            <TextField
                                required
                                type="password"
                                id="password"
                                label="Password"
                                value={passwd}
                                className={classes.textField}
                                variant="password"
                                margin="normal"
                                onChange={(e) => updateInputState("passwd", e)}
                            />

                            <Button size="small" variant="raised" color="primary" onClick={authenticateUser}>
                                { this.state.action === "signup" ? <div>Sign Up</div>:
                                    <div>Log In</div> }
                            </Button>

                            <Typography align={"right"} color="primary" variant="caption">
                                { this.state.action === "signup" ? <div>Already have an account?</div>:
                                    <div>Don't have an account yet?</div> }

                                <Button size="small" color="primary" onClick={this.toggleSignupFields}>
                                    { this.state.action === "signup" ? <div>Log In</div>:
                                        <div>Create one</div> }
                                </Button>
                            </Typography>

                        </form>
                    </div>
                </Modal>
            </div>
        );
    }
}

AuthenticationModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AuthenticationModal);