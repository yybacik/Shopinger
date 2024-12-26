import React, { useContext, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Badge from 'react-bootstrap/Badge';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Üzgünüz. Ürün stokta yok');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const handleLike = () => {
    setLiked(true);
    if (disliked) setDisliked(false);
    // Beğenme ile ilgili diğer işlemler
  };

  const handleDislike = () => {
    setDisliked(true);
    if (liked) setLiked(false);
    // Beğenmeme ile ilgili diğer işlemler
  };

  const cancelLike = () => {
    setLiked(false);
    // Beğenmeyi iptal etme ile ilgili diğer işlemler
  };

  const cancelDislike = () => {
    setDisliked(false);
    // Beğenmeyi iptal etme ile ilgili diğer işlemler
  };

  return (
    <Card className="h-100 shadow-sm">
      <Link to={`/product/${product.slug}`}>
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          style={{ objectFit: 'cover', height: '200px' }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product.slug}`} className="text-decoration-none text-dark">
          <Card.Title as="div" className="mb-2">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text as="h5" className="mt-auto">
          ${product.price.toFixed(2)}
          {product.countInStock > 0 ? (
            <Badge bg="success" className="ms-2">
              In Stock
            </Badge>
          ) : (
            <Badge bg="danger" className="ms-2">
              Out of Stock
            </Badge>
          )}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => addToCartHandler(product)}
            disabled={product.countInStock === 0}
          >
            <i className="fas fa-cart-plus me-2"></i>Sepete Ekle
          </Button>
          <div>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{liked ? 'Unlike' : 'Like'}</Tooltip>}
            >
              <Button
                variant={liked ? 'success' : 'outline-success'}
                size="sm"
                className="me-2"
                onClick={liked ? cancelLike : handleLike}
                disabled={!liked && disliked}
              >
                <FaThumbsUp />
                <span className="ms-1">{liked ? 'Liked' : 'Like'}</span>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{disliked ? 'Undislike' : 'Dislike'}</Tooltip>}
            >
              <Button
                variant={disliked ? 'danger' : 'outline-danger'}
                size="sm"
                onClick={disliked ? cancelDislike : handleDislike}
                disabled={!disliked && liked}
              >
                <FaThumbsDown />
                <span className="ms-1">{disliked ? 'Disliked' : 'Dislike'}</span>
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;
