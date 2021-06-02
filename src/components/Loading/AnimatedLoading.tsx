import React from 'react'
import './AnimatedLoading.scss'

const AnimatedLoading = () => {
  return (
    <div className="animated-loading-container">
      <div>Loading...</div>
      <div className="animated-loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    
  )
}

export default AnimatedLoading