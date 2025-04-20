import React, { useState } from 'react';
import ModalMessage from './ModalMessage';  // Імпортуємо компонент для модального вікна

const RegisterForm = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // Для повідомлень
  const [isModalOpen, setIsModalOpen] = useState(false);  // Стан модального вікна

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        setMessage('Registration successful');
      } else {
        const result = await response.json();
        setMessage(result.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Error during registration: ' + error.message);
    } finally {
      setIsModalOpen(true);  // Відкриваємо модальне вікно після запиту
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Закриваємо модальне вікно
  };

  return (
    <>
      <form className="form" onSubmit={handleRegister}>
        <h2 className="form__title">Register</h2>
        <input
          type="email"
          className="form__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          className="form__input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className="form__input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="form__button">Register</button>
        <p onClick={toggleForm} className="form__toggle-link">
          Already have an account? Login here.
        </p>
      </form>

      {isModalOpen && <ModalMessage message={message} onClose={closeModal} />}
    </>
  );
};

export default RegisterForm;
