import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from "./serviceWorker";
import * as dataMgr from './dataMgr';
import 'bootstrap/dist/css/bootstrap.min.css';
class Test extends React.Component {
    render() {
        return (<button>aaaaa</button>)
    }
}

class Show extends React.Component {
    render() {
        return (
            <div className="container">
               {dataMgr.ShowInfo()}
            </div>
        );
    }
}

ReactDOM.render(<Show/>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
