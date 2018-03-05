import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {MuiThemeProvider, createMuiTheme} from "material-ui";
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import User  from './user';


const theme = createMuiTheme();

const users = ['', '', ''];



class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="container" {...this.props}>
                    <div className="chats-sidebar">
                        <ul>
                            {users.map(() =>(
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


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
