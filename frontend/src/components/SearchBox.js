import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/search/?query=${trimmedQuery}` : '/search');
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
            variant="primary"
            type="submit"
            id="button-search"
            className="rounded-pill"
            style={{ marginLeft: '-1px' }}
          >
            <FaSearch />
          </Button>
        </OverlayTrigger>
      </InputGroup>
    </Form>
  );
}
