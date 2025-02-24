import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/Home-page';
import AuthPage from './pages/AuthPage/AuthPage-page';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/auth" component={AuthPage} />
                {/* Add more routes as needed */}
            </Switch>
        </Router>
    );
};

export default App;
