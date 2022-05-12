import React from 'react'

const ShowMore = ({ onClick }) => {
  return (
    <div className="w-full text-center border-b border-solid border-gray-400 leading-[0.1rem] mt-2 mb-4 cursor-pointer" onClick={onClick}>
        <span className="bg-white px-2">
          <small>Show More</small>
        </span>
    </div>
  )
}

export default ShowMore