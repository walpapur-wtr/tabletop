
import React from 'react';

const RegistrationComponent = () => {
    return (
        <div>
            <h2>Register</h2>
            <form>
                <label>
                    Username:
                    <input type="text" name="username" />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <label>
                    Confirm Password:
                    <input type="password" name="confirmPassword" />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegistrationComponent;
