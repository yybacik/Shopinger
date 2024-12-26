import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },
  {
    name: '3stars & up',
    rating: 3,
  },
  {
    name: '2stars & up',
    rating: 2,
  },
  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = Number(sp.get('page') || 1);

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (filter, skipPathname = false) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? '' : '/search?'
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3 className="mb-3">Filtreleme</h3>
          <Accordion defaultActiveKey="0">
            {/* Kategori Filtreleri */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>Kategori</Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      className={category === 'all' ? 'fw-bold' : ''}
                      to={getFilterUrl({ category: 'all' })}
                    >
                      Herhangi
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        className={c === category ? 'fw-bold' : ''}
                        to={getFilterUrl({ category: c })}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            {/* Fiyat Filtreleri */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Fiyat</Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      className={price === 'all' ? 'fw-bold' : ''}
                      to={getFilterUrl({ price: 'all' })}
                    >
                      Herhangi
                    </Link>
                  </li>
                  {prices.map((p) => (
                    <li key={p.value}>
                      <Link
                        to={getFilterUrl({ price: p.value })}
                        className={p.value === price ? 'fw-bold' : ''}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            {/* Değerlendirme Filtreleri */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Değerlendirme</Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled">
                  {ratings.map((r) => (
                    <li key={r.name}>
                      <Link
                        to={getFilterUrl({ rating: r.rating })}
                        className={`${r.rating}` === `${rating}` ? 'fw-bold' : ''}
                      >
                        <Rating caption=" ve üstü" rating={r.rating}></Rating>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to={getFilterUrl({ rating: 'all' })}
                      className={rating === 'all' ? 'fw-bold' : ''}
                    >
                      <Rating caption=" ve üstü" rating={0}></Rating>
                    </Link>
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              {/* Başlık ve Sıralama */}
              <Row className="align-items-center mb-4">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'Hiçbir' : countProducts} Sonuç
                    {query !== 'all' && ` : ${query}`}
                    {category !== 'all' && ` : ${category}`}
                    {price !== 'all' && ` : Fiyat ${price}`}
                    {rating !== 'all' && ` : Değerlendirme ${rating} ve üstü`}
                    {(query !== 'all' ||
                      category !== 'all' ||
                      rating !== 'all' ||
                      price !== 'all') && (
                      <Button
                        variant="light"
                        className="ms-2"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i> Temizle
                      </Button>
                    )}
                  </div>
                </Col>
                <Col md={6} className="text-md-end mt-3 mt-md-0">
                  <Form.Select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                    style={{ width: '200px', display: 'inline-block' }}
                  >
                    <option value="newest">En Yeni</option>
                    <option value="lowest">Fiyat: Düşükten Yükseğe</option>
                    <option value="highest">Fiyat: Yüksekten Düşüğe</option>
                    <option value="toprated">Müşteri Yorumları</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Ürünler */}
              {products.length === 0 && <MessageBox>Ürün Bulunamadı</MessageBox>}

              <Row>
                {products.map((product) => (
                  <Col sm={6} lg={4} className="mb-4" key={product._id}>
                    <Card className="h-100 shadow-sm">
                      <Link to={`/product/${product._id}`}>
                        <Card.Img
                          variant="top"
                          src={product.image}
                          alt={product.name}
                          style={{ objectFit: 'cover', height: '200px' }}
                        />
                      </Link>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title as="div">
                          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                            <strong>{product.name}</strong>
                          </Link>
                        </Card.Title>
                        <Card.Text as="div" className="mt-auto">
                          <div className="mb-2">
                            <Rating rating={product.rating} caption={`(${product.numReviews})`} />
                          </div>
                          <h5 className="text-primary">${product.price.toFixed(2)}</h5>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Sayfalama */}
              {pages > 1 && (
                <div className="d-flex justify-content-center my-4">
                  <Pagination>
                    {[...Array(pages).keys()].map((x) => (
                      <LinkContainer
                        key={x + 1}
                        to={{
                          pathname: '/search',
                          search: getFilterUrl({ page: x + 1 }, true),
                        }}
                      >
                        <Pagination.Item active={Number(page) === x + 1}>
                          {x + 1}
                        </Pagination.Item>
                      </LinkContainer>
                    ))}
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
