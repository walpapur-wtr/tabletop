import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateCharacter-styles.css';

const CreateCharacter = () => {
    const [characterData, setCharacterData] = useState({
        name: '',
        class: '',
        level: 1,
        race: '',
        // Add other character fields as needed
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ characterData })
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to create character');
            }

            // Redirect to character sheet or grid after successful creation
            navigate('/characters');
        } catch (error) {
            console.error('Error creating character:', error);
            // Handle error (show message to user)
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCharacterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="create-character-container">
            <h2>Create New Character</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Character Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={characterData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="class">Class</label>
                    <input
                        type="text"
                        id="class"
                        name="class"
                        value={characterData.class}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="level">Level</label>
                    <input
                        type="number"
                        id="level"
                        name="level"
                        value={characterData.level}
                        onChange={handleInputChange}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="race">Race</label>
                    <input
                        type="text"
                        id="race"
                        name="race"
                        value={characterData.race}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="create-button">Create Character</button>
            </form>
        </div>
    );
};

export default CreateCharacter;