import React from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import { FaInstagram } from 'react-icons/fa'
import { FaFacebookF } from 'react-icons/fa'
import { FaPinterestP } from 'react-icons/fa'


const FooterFollowBtn = () => {
  return (
    <div className="d-inline-flex gap-2 p-2">
      <button
        type="button"
        className="btn btn-primary rounded-circle follow-btn"
      >
        <FaXTwitter />
      </button>
      <button
        type="button"
        className="btn btn-primary rounded-circle follow-btn"
      >
        <FaInstagram />
      </button>
      <button
        type="button"
        className="btn btn-primary rounded-circle follow-btn"
      >
        <FaFacebookF />
      </button>
      <button
        type="button"
        className="btn btn-primary rounded-circle follow-btn"
      >
        <FaPinterestP />
      </button>
    </div>
  )
}

export default FooterFollowBtn
