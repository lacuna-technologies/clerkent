const AnimatedLoading = () => {
  return (
    <div className="inline-flex flex-row items-center">
      <div className="ml-[0.2rem]">Loading...</div>
      <div className="inline-block relative w-[80px] h-[10px] loading-container">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
    
  )
}

export default AnimatedLoading