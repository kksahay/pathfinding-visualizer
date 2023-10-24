function Node(props) {
  const { row, col, isStart, isEnd, isWall, weighted } = props.node;

  
  return (
    <div 
      className={`bg-cover w-6 h-6 outline outline-1 inline-block
      ${isStart ? 
        "bg-start-icon" : isEnd ?
        "bg-end-icon" : isWall ?
        "bg-sky-950" : weighted ?
        "bg-weight-icon" : "bg-sky-50"}
      `} 
      id={`${row}-${col}`}
      onMouseDown={(e) => props.onMouseDown(e, row, col)}
      onMouseEnter={() => props.onMouseEnter(row, col)}
      onMouseUp={() => props.onMouseUp()}
    >
    </div>
  )
}
export default Node