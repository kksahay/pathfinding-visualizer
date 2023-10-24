import Node from "./Node"


function Instructions() {
  return (
    <div className="ml-5">
        <div className="font-bold">
            Instructions
        </div>
        <div className="flex flex-col">
            <div className="flex">
                <Node node={{isWall: true}}/>
                <span className="font-medium ml-2 w-24">Weight</span>
                <span>Click to add Wall</span>
            </div>
            <div className="flex">
                <Node node={{weighted: true}}/>
                <span className="font-medium ml-2 w-24">Weight</span>
                <span>Press Ctrl + Click to add Weight. Weights cannot be added for unweighted algorithm(BFS)</span>
            </div>
            <div className="flex">
                <Node node={{isStart: true}}/>
                <span className="font-medium ml-2 w-24">Start Node</span>
            </div>
            <div className="flex">
                <Node node={{isEnd: true}}/>
                <span className="font-medium ml-2 w-24">End Node</span>
            </div>
        </div>
    </div>
  )
}
export default Instructions