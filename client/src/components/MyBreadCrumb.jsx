import React from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

const MyBreadCrumb = ({ breadcrumbItems }) => {
  return (
    <Breadcrumb id='breadcrumb'>
      {breadcrumbItems.map((breadcrumbItem) => {
        return (
          <Breadcrumb.Item
            key={breadcrumbItem.label}
            active={breadcrumbItem.active}
            href={breadcrumbItem.path}
          >
            {breadcrumbItem.label}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

export default MyBreadCrumb
