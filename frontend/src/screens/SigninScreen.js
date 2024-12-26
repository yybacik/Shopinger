import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
      <Helmet>
        <title>Giriş Yap</title>
      </Helmet>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Giriş Yap</h1>
      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* E-posta Alanı */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            E-posta
          </label>
          <input
            type="email"
            id="email"
            required
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

        {/* Şifre Alanı */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Şifre
          </label>
          <input
            type="password"
            id="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifrenizi giriniz"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Giriş Butonu */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
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
            Giriş Yap
          </button>
        </div>

        {/* Kayıt Ol ve Şifremi Unuttum Linkleri */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            Yeni misiniz?{' '}
            <Link to={`/signup?redirect=${redirect}`} style={{ color: '#007bff', textDecoration: 'none' }}>
              Hesap Oluşturun
            </Link>
          </p>
          <p>
            Şifrenizi mi unuttunuz?{' '}
            <Link to="/forget-password" style={{ color: '#007bff', textDecoration: 'none' }}>
              Şifre Sıfırla
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
