import styled from 'styled-components'
import { Form } from 'react-bootstrap'

const RadiosInput = ({
  name,
  value,
  handleCheck,
  label,
  checked,
}) => {
  return (
    <Wrapper>
      <Form.Group>
        <Form.Check
          type="radio"
          name={name}
          value={value}
          id={`radio-${value}`}
          label={label}
          onChange={handleCheck}
          checked={checked}
          feedback="Vui lòng chọn một trong các lựa chọn"
          feedbackType="invalid"
        />
      </Form.Group>
    </Wrapper>
  )
}
export default RadiosInput

const Wrapper = styled.section`
  .form-check-input {
    margin-right: 10px;
  }
`
