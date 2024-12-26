import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div>
      <Helmet>
        <title>Ödeme Yöntemi</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
        <h1>Ödeme Yöntemi</h1>
        <form onSubmit={submitHandler}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="radio"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="PayPal">PayPal</label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="radio"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="Stripe">Stripe</label>
          </div>
          <div>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Devam Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
