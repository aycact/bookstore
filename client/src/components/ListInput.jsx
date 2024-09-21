import React from 'react'
import {
  textColor,
  boldTextColor,
  quaternaryBgColor,
} from '../assets/js/variables'
import styled from 'styled-components'

const ListInput = ({ label, list, name, handleChoose }) => {
  return (
    <Wrapper>
      <h5 className="list-label">{label}</h5>
      <div className="list-input d-flex flex-column">
        {list.map((item) => {
          return (
            <button
              name={name}
              key={item.id}
              className="list-input-item"
              onClick={handleChoose}
              value={item.id}
            >
              {item.name}
            </button>
          )
        })}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  margin-top: 1rem;
  .list-input {
    margin-bottom: 1rem;
  }
  .list-input .list-input-item {
    background-color: transparent;
    border-color: transparent;
    display: inline-block;
    width: fit-content;
    color: ${textColor};
    border-radius: 1rem;
  }
  .list-input-item.active {
    border-bottom: 1px solid ${textColor};
  }
  .list-input-item:hover {
    background-color: ${quaternaryBgColor};
  }
  .list-label {
    color: ${boldTextColor};
    font-weight: bold;
    text-transform: none;
  }
`

export default ListInput
