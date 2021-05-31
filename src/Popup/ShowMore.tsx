import React from 'react'
import './ShowMore.scss'

const ShowMore = ({ onClick }) => {
  return (
    <div id="show-more" onClick={onClick}>
        <span><small>Show More</small></span>
    </div>
  )
}

export default ShowMore