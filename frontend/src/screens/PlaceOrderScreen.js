import Axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <Helmet>
        <title>Siparişi Önizle</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <h1 style={{ textAlign: 'center', margin: '1rem 0' }}>Siparişi Önizle</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
        {/* Sol Bölüm */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          {/* Gönderim Bilgileri */}
          <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', marginBottom: '1rem' }}>
            <h2>Gönderim</h2>
            <p>
              <strong>Ad Soyad:</strong> {cart.shippingAddress.fullName} <br />
              <strong>Adres:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
            <Link to="/shipping" style={{ color: '#007bff', textDecoration: 'none' }}>Düzenle</Link>
          </div>

          {/* Ödeme Bilgileri */}
          <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', marginBottom: '1rem' }}>
            <h2>Ödeme</h2>
            <p>
              <strong>Yöntem:</strong> {cart.paymentMethod}
            </p>
            <Link to="/payment" style={{ color: '#007bff', textDecoration: 'none' }}>Düzenle</Link>
          </div>

          {/* Ürünler */}
          <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem', marginBottom: '1rem' }}>
            <h2>Ürünler</h2>
            {cart.cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', marginRight: '1rem' }}
                />
                <div style={{ flex: '1' }}>
                  <Link to={`/product/${item.slug}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                    {item.name}
                  </Link>
                </div>
                <div style={{ width: '50px', textAlign: 'center' }}>x{item.quantity}</div>
                <div style={{ width: '70px', textAlign: 'right' }}>${item.price.toFixed(2)}</div>
              </div>
            ))}
            <Link to="/cart" style={{ color: '#007bff', textDecoration: 'none' }}>Düzenle</Link>
          </div>
        </div>

        {/* Sağ Bölüm - Sipariş Özeti */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '1rem' }}>
            <h2>Sipariş Özeti</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>Ürünler</div>
              <div>${cart.itemsPrice.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>Gönderim</div>
              <div>${cart.shippingPrice.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>Vergi</div>
              <div>${cart.taxPrice.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold' }}>
              <div>Sipariş Toplamı</div>
              <div>${cart.totalPrice.toFixed(2)}</div>
            </div>
            <button
              type="button"
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Siparişi Tamamla
            </button>
            {loading && <LoadingBox />}
          </div>
        </div>
      </div>
    </div>
  );
}
