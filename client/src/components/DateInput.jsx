import { DatePicker } from '@mui/x-date-pickers'
import styled from 'styled-components'
const DateInput = ({ label, name, value, handleChange }) => {
  return (
    <Wrapper>
      <DatePicker
        className="date-picker"
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
        format="YYYY-MM-DD"
      />
    </Wrapper>
  )
}
export default DateInput

const Wrapper = styled.section`
  margin-top: 1rem;
  input {
    padding: 0.75rem 0;
    padding-left: 0.5rem;
  }
`
