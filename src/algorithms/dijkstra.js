import { FIXED_COLS, FIXED_ROWS } from "../components/Grid";

let found = false;

class MinHeap {
    constructor() {
        this.arr = [];
    }

    insert(node) {
        this.arr.push(node);
        this.heapify();
    }

    extract() {
        const min = this.arr.shift();
        this.heapify();
        return min;
    }

    heapify() {
        let n = this.arr.length - 1;
        while (n > 0) {
            const currentNode = this.arr[n];
            const parentIndex = Math.floor(n / 2);
            const parentNode = this.arr[parentIndex];
            if (currentNode.distance < parentNode.distance) {
                this.arr[n] = parentNode;
                this.arr[parentIndex] = currentNode;
            }
            n = parentIndex;
        }
    }
}
const minHeap = new MinHeap();

function handleDown(graph, node, nodeRow, nodeCol) {
    const down = graph[nodeRow + 1][nodeCol];
    if (!isWalled(down) && !down.visited) {
        if (down.isEnd) {
            found = true;
        }
        graph[nodeRow + 1][nodeCol] = {
            ...down,
            visited: true,
            distance: Math.min(down.distance, down.weighted ? node.distance + 1000 : node.distance + 1),
            previousNode: node
        }
        if(!found) {
            minHeap.insert(graph[nodeRow + 1][nodeCol]);
        }
    }
}

function handleUp(graph, node, nodeRow, nodeCol) {
    const up = graph[nodeRow - 1][nodeCol];
    if (!isWalled(up) && !up.visited) {
        if (up.isEnd) {
            found = true;
        }
        graph[nodeRow - 1][nodeCol] = {
            ...up,
            visited: true,
            distance: Math.min(up.distance, up.weighted ? node.distance + 1000 : node.distance + 1),
            previousNode: node
        }
        if(!found) {
            minHeap.insert(graph[nodeRow - 1][nodeCol]);
        }
    }
}

function handleRight(graph, node, nodeRow, nodeCol) {
    const right = graph[nodeRow][nodeCol + 1]
    if (!isWalled(right) && !right.visited) {
        if (right.isEnd) {
            found = true;
        }
        graph[nodeRow][nodeCol + 1] = {
            ...right,
            visited: true,
            distance: Math.min(right.distance, right.weighted ? node.distance + 1000 : node.distance + 1),
            previousNode: node
        }
        if(!found) {
            minHeap.insert(graph[nodeRow][nodeCol + 1]);
        }
    }
}

function handleLeft(graph, node, nodeRow, nodeCol) {
    const left = graph[nodeRow][nodeCol - 1]
    if (!isWalled(left) && !left.visited) {
        if (left.isEnd) {
            found = true;
        }
        graph[nodeRow][nodeCol - 1] = {
            ...left,
            visited: true,
            distance: Math.min(left.distance, left.weighted ? node.distance + 1000 : node.distance + 1),
            previousNode: node
        }
        if(!found) {
            minHeap.insert(graph[nodeRow][nodeCol - 1]);
        }
    }
}

function isWalled(node) {
    return node.isWall;
}

function relaxNeighbours(graph, node) {
    const nodeRow = node.row, nodeCol = node.col;
    if (nodeRow > 0) {
        handleUp(graph, node, nodeRow, nodeCol);
    }
    if (nodeRow < FIXED_ROWS - 1) {
        handleDown(graph, node, nodeRow, nodeCol);
    }
    if (nodeCol > 0) {
        handleLeft(graph, node, nodeRow, nodeCol);
    }
    if (nodeCol < FIXED_COLS - 1) {
        handleRight(graph, node, nodeRow, nodeCol);
    }
}

export const dijkstra = (graph, start) => {
    graph[start.row][start.col] = { ...graph[start.row][start.col], visited: true, distance: 0 };
    minHeap.insert(graph[start.row][start.col]);
    
    const visitedNodeInOrder = [];
    while (minHeap.arr.length > 0) {
        const currentNode = minHeap.extract();
        
        visitedNodeInOrder.push(currentNode);
        relaxNeighbours(graph, currentNode);
        if (found) break;
    }
    return visitedNodeInOrder;
}

export const getShortestPath = (graph, start, end) => {
    const shortestPath = [];
    let currentNode = graph[end.row][end.col];
    while (currentNode !== graph[start.row][start.col]) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    shortestPath.unshift(graph[start.row][start.col]);
    return shortestPath;
}