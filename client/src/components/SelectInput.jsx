import React from 'react'
import styled from 'styled-components'
import {
  textColor,
  boldTextColor,
  quaternaryBgColor,
} from '../assets/js/variables'

const SelectInput = ({
  list,
  name,
  defaultValue,
  handleChoose,
  label,
  disabled,
  numberDropdown,
}) => {
  return (
    <Wrapper>
      <div>
        <h5 className="select-label">{label}</h5>
        <select
          disabled={disabled}
          name={name}
          defaultValue={defaultValue}
          onChange={handleChoose}
          className="select-input"
        >
          {!numberDropdown && <option value={''}>--</option>}
          {list?.map((item) => {
            return (
              <option
                className="select-item"
                key={item.id}
                name={item.name}
                value={item.id}
              >
                {item.name}
              </option>
            )
          })}
        </select>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .select-label {
    color: ${boldTextColor};
    font-size: 1rem;
  }

  .select-input {
    background-color: ${quaternaryBgColor};
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
`
export default SelectInput
