import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false); // Hover durumu için state

  const submitHandler = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/search/?query=${trimmedQuery}` : '/search');
  };

  // Buton için dinamik stil
  const buttonStyle = {
    backgroundColor: isHovered ? '#f8f9fa' : '#343a40', // Light veya Dark arka plan
    borderColor: isHovered ? '#f8f9fa' : '#343a40', // Sınır rengi
    color: isHovered ? '#343a40' : '#fff', // İkon rengi
    transition: 'background-color 0.3s, border-color 0.3s, color 0.3s', // Geçiş efekti
  };

  return (
    <Form className="d-flex justify-content-center" onSubmit={submitHandler}>
      <InputGroup style={{ minWidth: '500px' }}> {/* Genişliği artırdık */}
        <FormControl
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for product..."
          aria-label="Search for product"
          aria-describedby="button-search"
          className="border-end-0 rounded-pill"
        />
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-search">Ara</Tooltip>}
        >
          <Button
            type="submit"
            id="button-search"
            className="rounded-pill"
            style={{ 
              ...buttonStyle, 
              marginLeft: '-1px', 
              border: '1px solid', // Border özelliğini inline stile ekleyin
            }}
            onMouseEnter={() => setIsHovered(true)} // Hover başladığında
            onMouseLeave={() => setIsHovered(false)} // Hover bittiğinde
          >
            <FaSearch />
          </Button>
        </OverlayTrigger>
      </InputGroup>
    </Form>
  );
}
