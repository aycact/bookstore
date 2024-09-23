import React from 'react'
import Card from 'react-bootstrap/Card'

const FlipCard = ({IconComponent, title, description}) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <Card className="a-card">
            <div className="rounded-circle card-icon">
              <IconComponent />
            </div>
            <Card.Body className="a-card-body">
              <Card.Title>{title}</Card.Title>
            </Card.Body>
          </Card>
        </div>
        <div className="flip-card-back">
          <Card className="a-card">
            <Card.Body className="a-card-body">
              <Card.Title>{title}</Card.Title>
              <Card.Text className="text-justify">
                {description}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FlipCard
