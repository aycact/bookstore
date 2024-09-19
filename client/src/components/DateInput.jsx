import { DatePicker } from "@mui/x-date-pickers"
import styled from "styled-components"
const DateInput = ({label, name, value, handleChange}) => {
  return (
    <Wrapper>
      <DatePicker
        label={label}
        name={name}
        value={value}
        onChange={handleChange}
      />
    </Wrapper>
  )
}
export default DateInput

const Wrapper = styled.section`
margin-top: 1.5rem;
    input {
        height: 0.5rem;
    }
`