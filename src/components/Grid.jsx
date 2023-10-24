import { useState } from "react";
import Node from "./Node"
import { dijkstra, getShortestPath } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
import Instructions from "./Instructions";

export const FIXED_ROWS = 20;
export const FIXED_COLS = 40;

const FIXED_START = {
  row: 9,
  col: 5
}

const FIXED_END = {
  row: 9,
  col: 30
}

function createNode(row, col) {
  return {
    row,
    col,
    isStart: row === FIXED_START.row && col === FIXED_START.col,
    isEnd: row === FIXED_END.row && col === FIXED_END.col,
    isWall: false,
    previousNode: null,
    weighted: false,
    visited: false,
    distance: Infinity
  }
}

function initialGrid () {
  const grid = [];
  for(let row = 0; row < FIXED_ROWS; ++row) {
    const currentRow = [];
    for(let col = 0; col < FIXED_COLS; ++col) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
}

function Grid() {
  const [clicked, setClicked] = useState(false);
  const [graph, setGraph] = useState(initialGrid());
  const [algorithm, setAlgorithm] = useState({
    name: "dijkstra"
  })
  const [clickDisable, setClickDisable] = useState(false);
  const [weightsEnable, setWeightsEnable] = useState(true);
  
  const handleMouseDown = (e, row, col) => {
    if(clickDisable) return;
    setClicked(!clicked);
    if(e.ctrlKey) {
      if(!weightsEnable) return;
      toggleWeight(row, col);
    } else {
      toggleWall(row, col);
    }
  }
  const handleMouseUp = () => {
    setClicked(!clicked);
  }
  const handleMouseEnter = (row, col) => {
    if(clickDisable) return;
    if(!clicked) return;
    toggleWall(row, col);
  }

  function toggleWall(row, col) {
    const newGraph = graph.slice();
    const nodeToToggle = newGraph[row][col];
    if(nodeToToggle.isStart || nodeToToggle.isEnd || nodeToToggle.weighted) return;
    const newNode = {
      ...nodeToToggle,
      isWall: !nodeToToggle.isWall
    }
    newGraph[row][col] = newNode;
    setGraph(newGraph);
  }

  function toggleWeight(row, col) {
    const newGraph = graph.slice();
    const nodeToToggle = newGraph[row][col];
    if(nodeToToggle.isStart || nodeToToggle.isEnd || nodeToToggle.isWall) return;
    const newNode = {
      ...nodeToToggle,
      weighted: !nodeToToggle.weighted,
    }
    newGraph[row][col] = newNode;
    setGraph(newGraph);
  }

  function handleVisualization(e) {
    e.preventDefault();
    setClickDisable(true);
    let visitedNodeInOrder;
    if(algorithm.name === 'dijkstra') {
      visitedNodeInOrder = dijkstra(graph, FIXED_START);
    } else if(algorithm.name === 'bfs') {
      visitedNodeInOrder = bfs(graph, FIXED_START);
    }
    if(visitedNodeInOrder.length > 0 && graph[FIXED_END.row][FIXED_END.col].visited) {
      const shortestPath = getShortestPath(graph, FIXED_START, FIXED_END);
      animateAlgorithm(visitedNodeInOrder, shortestPath);
    } else {
      animateAlgorithm(visitedNodeInOrder, []);
    }
  }

  function animateShortestPath(shortestPath) {
    for(let i = 0; i < shortestPath.length; ++i) {
      setTimeout(() => {
      const node = shortestPath[i];
      const nodeRow = node.row, nodeCol = node.col;
      const classlist = document.getElementById(`${nodeRow}-${nodeCol}`).classList
      classlist.replace('bg-blue-500', 'bg-yellow-400');
      classlist.replace('bg-weight-icon', 'bg-yellow-600');
      classlist.replace('bg-end-icon', 'bg-green-400');
      }, 50 * i);
    }
  }
  function animateAlgorithm(visitedNodes, shortestPath) {
    for(let i = 0; i <= visitedNodes.length; ++i) {
      if(i === visitedNodes.length) {
        setTimeout(() => {
          animateShortestPath(shortestPath)
        }, 10 * i);
        return;
      }
      setTimeout(() => {
      const node  = visitedNodes[i];
      const nodeRow = node.row, nodeCol = node.col;
      const classlist = document.getElementById(`${nodeRow}-${nodeCol}`).classList
      classlist.replace('bg-sky-50', 'bg-blue-500');
      }, 10 * i);
    }
  }

  function handleSelectChange (e) {
    setGraph(initialGrid());
    setAlgorithm((previousAlgorithm) => {
      if(e.target.value === 'bfs') {
        setWeightsEnable(false);
      } else {
        setWeightsEnable(true);
      }
      return {...previousAlgorithm, name: e.target.value}
    });
  }

  return (
    <div className="h-screen">
      <div>
        <div className="text-center p-2 bg-gray-900 text-white text-2xl font-mono font-black">PathFinding Visualizer</div>
      </div>
      <div className="outline outline-2">
        <Instructions />
      </div>
      <div className="mb-2">
        <form onSubmit={handleVisualization}>
          <div className="flex justify-evenly items-center">
              <div>
                <label
                htmlFor="id"
                className="mb-2 text-sm font-medium text-gray-900"
                >
                  Select an Algorithm
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm block w-full p-1"
                  onChange={handleSelectChange}
                  id="algorithm"
                >
                  <option value="dijkstra">Dijsktra</option>
                  <option value="bfs">Breadth-First-Search</option>
                </select>
              </div>
              <div className="self-end">
                <button
                  disabled={clickDisable}
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-sm text-sm px-5 py-2.5 mr-2 mb-2 disabled:opacity-75"
                >
                  Visualize
                </button>
              </div>
          </div>
        </form>
      </div>
      <div className="text-center mb-2">
        {graph.map((row, rid) => {
          return (
            <div key={rid} className="h-6">
              {row.map((node, nid) => {
                return (
                  <Node 
                    key={nid} 
                    node={node}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                  />
                )
              })
              }
            </div>
          )
        })
        }
      </div>
    </div>
  )
}
export default Grid