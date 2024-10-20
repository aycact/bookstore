import React from 'react'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import { boldTextColor, quaternaryBgColorLight } from '../assets/js/variables'

const FormInput = ({
  required,
  label,
  name,
  type,
  defaultValue,
  value,
  placeholder,
  handleChange,
  size,
  disabled,
  isInvalid, // Thêm isInvalid để xử lý trạng thái lỗi
}) => {
  return (
    <Wrapper className="mb-2">
      <Form.Group>
        {label && <Form.Label htmlFor={label}>{label}</Form.Label>}
        <Form.Control
          type={type}
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          size={size}
          disabled={disabled}
          required={required}
          isInvalid={isInvalid} // Xử lý trạng thái lỗi
        />
        <Form.Control.Feedback type="invalid">
          {`Xin hãy điền ${label.toLowerCase()}`}
        </Form.Control.Feedback>
      </Form.Group>
    </Wrapper>
  )
}

export default FormInput

const Wrapper = styled.section`
  input {
    background-color: ${quaternaryBgColorLight};
    border: 1px solid #ccc;
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
`
