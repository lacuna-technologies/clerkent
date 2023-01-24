const ShowNewResultsButton = ({ onClick }) => {
  return (
    <button
      className="py-1 px-2 border border-solid border-gray-400 rounded hover:bg-gray-200 my-0 mx-auto select-none"
      onClick={onClick}>
      Show additional results
    </button>
  )
}

export default ShowNewResultsButton