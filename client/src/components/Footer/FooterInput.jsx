import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/Form';
import { BsArrowRightShort } from 'react-icons/bs'

const FooterInput = () => {
  return (
    <Form className='d-flex'>
      <Form.Control type="email" id="inputEmailFooter1" placeholder='Enter your email' className='mb-0' />
      <Button className='mb-0'>
        <BsArrowRightShort/>
      </Button>
    </Form>
  )
}

export default FooterInput
