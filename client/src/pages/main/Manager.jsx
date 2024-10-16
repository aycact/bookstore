import React from 'react'
import styled from 'styled-components'
import { AddAttribute, AddBook, ManageSidebar } from '../../components'
import { useState } from 'react'
import { ImMenu } from 'react-icons/im'
import { Outlet } from 'react-router-dom'

import {
  primaryBgColor,
  quaternaryBgColor,
  quaternaryBgColorLight,
  shadow1,
} from '../../assets/js/variables'
import CreationPage from './Manage/CreationPage'

const Manager = () => {
  const toggleSidebar = () => {
    var sidebar = document.getElementById('mySidebar')
    var overlay = document.getElementById('myOverlay')
    sidebar.classList.toggle('active')
    overlay.classList.toggle('active')
  }
  return (
    <Wrapper>
      <div className="overlay" id="myOverlay" onClick={toggleSidebar}></div>
      <button type="button" className="sidebar-button" onClick={toggleSidebar}>
        <ImMenu />
      </button>
      <ManageSidebar />
      <Outlet />
    </Wrapper>
  )
}

export default Manager

const Wrapper = styled.section`
  .sidebar-button {
    float: right;
    background-color: ${quaternaryBgColorLight};
    margin-top: -2rem;
    padding: 0.75rem;
    border-radius: 50%;
    font-size: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 5rem;
    right: 1rem;
    color: ${primaryBgColor};
    border-color: transparent;
    box-shadow: ${shadow1};
    font-weight: bold;
    transition: all 0.3s linear;
  }

  .sidebar-button:hover {
    transform: rotate(90deg);
  }

  .overlay {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Màu đen với độ trong suốt 50% */
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0.3s ease; /* Làm mượt hiệu ứng */
  }
  .overlay.active {
    visibility: visible;
    opacity: 1;
  }
`
