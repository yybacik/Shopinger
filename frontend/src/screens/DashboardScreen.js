import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { FaUsers, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card bg="primary" text="white" className="h-100">
                <Card.Body className="d-flex align-items-center">
                  <FaUsers size={50} className="me-3" />
                  <div>
                    <Card.Title>
                      {summary.users && summary.users[0]
                        ? summary.users[0].numUsers
                        : 0}
                    </Card.Title>
                    <Card.Text>Users</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card bg="success" text="white" className="h-100">
                <Card.Body className="d-flex align-items-center">
                  <FaShoppingCart size={50} className="me-3" />
                  <div>
                    <Card.Title>
                      {summary.orders && summary.orders[0]
                        ? summary.orders[0].numOrders
                        : 0}
                    </Card.Title>
                    <Card.Text>Orders</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card bg="warning" text="white" className="h-100">
                <Card.Body className="d-flex align-items-center">
                  <FaDollarSign size={50} className="me-3" />
                  <div>
                    <Card.Title>
                      $
                      {summary.orders && summary.orders[0]
                        ? summary.orders[0].totalSales.toFixed(2)
                        : 0}
                    </Card.Title>
                    <Card.Text>Total Sales</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card className="mb-4">
                <Card.Header as="h5">Sales Overview</Card.Header>
                <Card.Body>
                  {summary.dailyOrders.length === 0 ? (
                    <MessageBox>No Sales Data Available</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Date', 'Sales'],
                        ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                      ]}
                      options={{
                        title: 'Daily Sales',
                        curveType: 'function',
                        legend: { position: 'bottom' },
                        colors: ['#4caf50'],
                      }}
                      // For tests
                      rootProps={{ 'data-testid': '1' }}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card className="mb-4">
                <Card.Header as="h5">Product Categories</Card.Header>
                <Card.Body>
                  {summary.productCategories.length === 0 ? (
                    <MessageBox>No Category Data Available</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="PieChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Category', 'Products'],
                        ...summary.productCategories.map((x) => [x._id, x.count]),
                      ]}
                      options={{
                        title: 'Product Categories',
                        pieHole: 0.4,
                        colors: ['#ff6384', '#36a2eb', '#ffce56', '#8e44ad', '#e67e22'],
                        legend: { position: 'right' },
                      }}
                      // For tests
                      rootProps={{ 'data-testid': '2' }}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
