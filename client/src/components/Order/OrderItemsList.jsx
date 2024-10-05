import styled from "styled-components"

const OrderItemsList = ({ itemList }) => {
  return (
  <Wrapper>
    <div className="container">
   {itemList.map(item => {
    return (
      <div className="row">
        <div className="col">
          <img src={''} alt={123} className="" />
        </div>
        <div className="col">
          <h3>title</h3>
          <h4>author name</h4>
        </div>
        <div className="col">
          Select input
          {/* <SelectInput
            name={'Amount'}
            defaultValue={amount}
            list={list}
            handleChoose={handleAmount}
          />
          <a className="remove-btn" onClick={removeItemFromTheCart}>
            Xóa
          </a> */}
        </div>
        <div className="col">

        </div>
      </div>
    )
  })}
  </div>

  </Wrapper>
  )
}
export default OrderItemsList

const Wrapper = styled.section`
  
`