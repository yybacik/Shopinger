import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';

// Import Star Rating Component (if not already available)
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REPLY_REQUEST':
      return { ...state, loadingCreateReply: true };
    case 'CREATE_REPLY_SUCCESS':
      return { ...state, loadingCreateReply: false };
    case 'CREATE_REPLY_FAIL':
      return { ...state, loadingCreateReply: false };
    // New cases for voting and rating
    case 'VOTE_REQUEST':
      return { ...state, loadingVote: true };
    case 'VOTE_SUCCESS':
      return { ...state, loadingVote: false };
    case 'VOTE_FAIL':
      return { ...state, loadingVote: false };
    case 'RATE_REVIEW_REQUEST':
      return { ...state, loadingRateReview: true };
    case 'RATE_REVIEW_SUCCESS':
      return { ...state, loadingRateReview: false };
    case 'RATE_REVIEW_FAIL':
      return { ...state, loadingRateReview: false };
    default:
      return state;
  }
};

function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  // State for replies
  const [replyComments, setReplyComments] = useState({});
  const [replyTexts, setReplyTexts] = useState({});

  // State for rating individual reviews
  const [reviewRatings, setReviewRatings] = useState({});

  // State for voting on reviews
  const [reviewVotes, setReviewVotes] = useState({});

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview, loadingCreateReply, loadingVote, loadingRateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  // Handler for submitting a reply
  const submitReplyHandler = async (e, reviewId) => {
    e.preventDefault();
    const replyComment = replyComments[reviewId];
    if (!replyComment) {
      toast.error('Please enter a reply');
      return;
    }
    try {
      dispatch({ type: 'CREATE_REPLY_REQUEST' });
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews/${reviewId}/replies`,
        { comment: replyComment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_REPLY_SUCCESS' });
      toast.success('Reply submitted successfully');

      // Find the review and append the reply
      const updatedProduct = { ...product };
      const reviewIndex = updatedProduct.reviews.findIndex(r => r._id === reviewId);
      if (reviewIndex !== -1) {
        if (!updatedProduct.reviews[reviewIndex].replies) {
          updatedProduct.reviews[reviewIndex].replies = [];
        }
        updatedProduct.reviews[reviewIndex].replies.push(data.reply);
        dispatch({ type: 'REFRESH_PRODUCT', payload: updatedProduct });
      }

      // Clear the reply input
      setReplyComments(prev => ({ ...prev, [reviewId]: '' }));
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_REPLY_FAIL' });
    }
  };

  // Toggle reply form visibility
  const toggleReplyForm = (reviewId) => {
    setReplyTexts(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Handler for voting on a review
  const voteHandler = async (reviewId, type) => {
    if (!userInfo) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      dispatch({ type: 'VOTE_REQUEST' });

      // Make API call to vote
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews/${reviewId}/vote`,
        { type }, // type can be 'upvote' or 'downvote'
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'VOTE_SUCCESS' });
      toast.success('Vote recorded successfully');

      // Update the vote count in the product state
      const updatedProduct = { ...product };
      const reviewIndex = updatedProduct.reviews.findIndex(r => r._id === reviewId);
      if (reviewIndex !== -1) {
        updatedProduct.reviews[reviewIndex].votes = data.votes;
        dispatch({ type: 'REFRESH_PRODUCT', payload: updatedProduct });
      }
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'VOTE_FAIL' });
    }
  };

  // Handler for rating a review
  const rateReviewHandler = async (e, reviewId) => {
    e.preventDefault();
    const reviewRating = reviewRatings[reviewId];
    if (!reviewRating) {
      toast.error('Please select a rating');
      return;
    }
    try {
      dispatch({ type: 'RATE_REVIEW_REQUEST' });

      // Make API call to rate the review
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews/${reviewId}/rate`,
        { rating: reviewRating },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: 'RATE_REVIEW_SUCCESS' });
      toast.success('Review rated successfully');

      // Update the rating in the product state
      const updatedProduct = { ...product };
      const reviewIndex = updatedProduct.reviews.findIndex(r => r._id === reviewId);
      if (reviewIndex !== -1) {
        updatedProduct.reviews[reviewIndex].ratingOnReview = data.rating;
        dispatch({ type: 'REFRESH_PRODUCT', payload: updatedProduct });
      }

      // Clear the rating input
      setReviewRatings(prev => ({ ...prev, [reviewId]: 0 }));
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'RATE_REVIEW_FAIL' });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Sepete Ekle
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef}>Reviews</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>There is no review</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{new Date(review.createdAt).toLocaleDateString()}</p>
              <p>{review.comment}</p>

              {/* Display Replies */}
              {review.replies && review.replies.length > 0 && (
                <ListGroup variant="flush" className="ms-4">
                  {review.replies.map((reply) => (
                    <ListGroup.Item key={reply._id}>
                      <strong>{reply.name} (Reply):</strong>
                      <p>{reply.comment}</p>
                      <p><small>{new Date(reply.createdAt).toLocaleDateString()}</small></p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {/* Voting Section */}
              <div className="mt-2 d-flex align-items-center">
                <FaThumbsUp
                  style={{ cursor: 'pointer', marginRight: '8px' }}
                  onClick={() => voteHandler(review._id, 'upvote')}
                />
                <span>{review.votes ? review.votes.up : 0}</span>
                <FaThumbsDown
                  style={{ cursor: 'pointer', marginLeft: '16px', marginRight: '8px' }}
                  onClick={() => voteHandler(review._id, 'downvote')}
                />
                <span>{review.votes ? review.votes.down : 0}</span>
              </div>

              {/* Rating the Review */}
              {userInfo && (
                <form onSubmit={(e) => rateReviewHandler(e, review._id)} className="mt-2">
                  <Form.Group className="mb-3" controlId={`rate-review-${review._id}`}>
                    <Form.Label>Rate this review:</Form.Label>
                    <Form.Select
                      aria-label="Rate Review"
                      value={reviewRatings[review._id] || ''}
                      onChange={(e) =>
                        setReviewRatings(prev => ({
                          ...prev,
                          [review._id]: Number(e.target.value),
                        }))
                      }
                      required
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Select>
                  </Form.Group>
                  <div className="mb-3">
                    <Button disabled={loadingRateReview} type="submit" variant="secondary" size="sm">
                      Submit Rating
                    </Button>
                    {loadingRateReview && <LoadingBox />}
                  </div>
                </form>
              )}

              {/* Reply Button */}
              {userInfo && (
                <div className="mt-2">
                  <Button
                    variant="link"
                    onClick={() => toggleReplyForm(review._id)}
                  >
                    {replyTexts[review._id] ? 'Cancel' : 'Reply'}
                  </Button>
                </div>
              )}

              {/* Reply Form */}
              {replyTexts[review._id] && (
                <form onSubmit={(e) => submitReplyHandler(e, review._id)} className="mt-2">
                  <Form.Group className="mb-3" controlId={`reply-${review._id}`}>
                    <FloatingLabel
                      controlId={`floatingTextarea-${review._id}`}
                      label="Reply"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a reply here"
                        value={replyComments[review._id] || ''}
                        onChange={(e) =>
                          setReplyComments(prev => ({
                            ...prev,
                            [review._id]: e.target.value,
                          }))
                        }
                        required
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <div className="mb-3">
                    <Button disabled={loadingCreateReply} type="submit" variant="primary" size="sm">
                      Submit
                    </Button>
                    {loadingCreateReply && <LoadingBox />}
                  </div>
                </form>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Write a customer review</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excellent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Submit
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
