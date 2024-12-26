import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

function ConnectScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/contact', {
        name,
        email,
        message,
      });
      toast.success('Mesajınız başarıyla gönderildi!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>İletişim</h1>
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* İsim Alanı */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            İsim
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="İsminizi giriniz"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* E-posta Alanı */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            E-posta
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresinizi giriniz"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Mesaj Alanı */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Mesaj
          </label>
          <textarea
            id="message"
            rows="5"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı giriniz"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          ></textarea>
        </div>

        {/* Gönder Butonu */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Gönder
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConnectScreen;
