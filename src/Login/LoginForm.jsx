import React, { useState } from 'react';
import ModalMessage from './ModalMessage';  // Імпортуємо компонент для модального вікна

const LoginForm = ({ toggleForm, onLoginSuccess }) => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // Для повідомлень
  const [isModalOpen, setIsModalOpen] = useState(false);  // Стан модального вікна

  const handleLogin = async (e) => {
    e.preventDefault();

    // Перевірка, чи введене значення є email чи username
    const isEmail = loginInput.includes('@');
    const payload = isEmail
      ? { email: loginInput, password }  // Якщо email, передаємо email
      : { username: loginInput, password };  // Якщо username, передаємо username

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Login successful');
        localStorage.setItem("token", result.token); // Save token
        onLoginSuccess(result.username); // Pass the username to the parent component
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    } finally {
      setIsModalOpen(true); // Відкриваємо модальне вікно після запиту
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Закриваємо модальне вікно
  };

  return (
    <>
      <form className="form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email or Username"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p onClick={toggleForm} className="toggle-link">
          Don't have an account? Register here.
        </p>
      </form>

      {isModalOpen && <ModalMessage message={message} onClose={closeModal} />}
    </>
  );
};

export default LoginForm;
