import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "../node_modules/react-router-dom";
import './index.css';
import GroupGuru from './GroupGuru';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <Router>
        <GroupGuru />
    </Router>
    , document.getElementById('root'));

serviceWorker.register();

