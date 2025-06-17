import React, { useState } from 'react';
import './UserProfile-styles.css';

const EditProfile = ({ onClose, onSave, currentUsername, currentEmail }) => {
    const [username, setUsername] = useState(currentUsername || '');
    const [email, setEmail] = useState(currentEmail || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, email })
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update local storage
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
            
            // Update parent component
            onSave({
                username: data.username,
                email: data.email
            });
            
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="edit-profile-modal">
            <div className="edit-profile-content">
                <h2>Редагувати профіль</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Ім'я користувача:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="save-button">Зберегти</button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Скасувати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
