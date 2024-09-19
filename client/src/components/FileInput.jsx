import React from 'react'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import { quaternaryBgColorLight, tertiaryBgColor } from '../assets/js/variables'

const FileInput = ({ label, value, name, handleChange }) => {
  return (
    <Wrapper>
      <Form.Group controlId="formFileSm" className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="file"
          size="sm"
          name={name}
          value={value}
          onChange={handleChange}
        />
      </Form.Group>
    </Wrapper>
  )
}

export default FileInput

const Wrapper = styled.div`
  input {
    max-width: 289px;
    background-color: ${quaternaryBgColorLight};
  }
  input[type='file']::file-selector-button {
    background-color: ${quaternaryBgColorLight};
  }
  input[type='file']::file-selector-button:hover {
    background-color: ${tertiaryBgColor};
  }
`
