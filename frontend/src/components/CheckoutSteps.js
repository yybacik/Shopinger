import React from 'react';
import { Link } from 'react-router-dom';

export default function CheckoutSteps(props) {
  // Adımların sırasını ve isimlerini tanımlayın
  const steps = [
    { step: 1, name: 'Giriş Yap', link: '/signin' },
    { step: 2, name: 'Gönderim', link: '/shipping' },
    { step: 3, name: 'Ödeme', link: '/payment' },
    { step: 4, name: 'Sipariş Ver', link: '/placeorder' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', margin: '1rem 0' }}>
      {steps.map((item) => (
        <div
          key={item.step}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '0.5rem',
            borderBottom: props[`step${item.step}`] ? '2px solid red' : '2px solid #ccc',
            color: props[`step${item.step}`] ? 'red' : '#000',
          }}
        >
          {props[`step${item.step}`] ? (
            <Link to={item.link} style={{ textDecoration: 'none', color: 'red', fontWeight: 'bold' }}>
              {item.name}
            </Link>
          ) : (
            <span>{item.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}
