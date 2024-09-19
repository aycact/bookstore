import React from 'react'
import styled from 'styled-components'
import {
  textColor,
  boldTextColor,
  quaternaryBgColor,
} from '../assets/js/variables'

const SelectInput = ({list, name, defaultValue, handleChoose, label}) => {
  return (
    <Wrapper>
      <div>
        <h5 className="select-label">{label}</h5>
        <select
          name={name}
          defaultValue={defaultValue}
          onChange={handleChoose}
          className="select-input"
        >
          {!defaultValue && <option value={null}>--</option>} 
          {defaultValue && <option value=''>Tất cả</option>}
          {list.map((item) => {
            return (
              <option className="select-item" key={item.id} value={item.id}>
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
    font-weight: bold;
  }
  
  .select-input {
    background-color: ${quaternaryBgColor};
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
`
export default SelectInput
