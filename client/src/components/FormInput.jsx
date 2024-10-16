import React from 'react'
import Form from 'react-bootstrap/Form'
import styled from 'styled-components'
import { boldTextColor, quaternaryBgColorLight } from '../assets/js/variables'

const FormInput = ({
  label,
  name,
  type,
  defaultValue,
  value,
  placeholder,
  handleChange,
  size,
  disabled
}) => {
  return (
    <Wrapper className="mb-2">
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
      />
    </Wrapper>
  )
}

export default FormInput

const Wrapper = styled.section`
  input {
    background-color: ${quaternaryBgColorLight};
  }
`
