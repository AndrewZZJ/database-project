const PriorityQueue = require('./utils/dataStructure.js').PriorityQueue;
class Node{
    constructor(v, x, y, edges){
        this.v = v;
        this.x = x;
        this.y = y;
        this.edges = [];
    }
}
class Edge{
    constructor(id,start, end, length=0, difficulty = 0){
        this.id = id;
        this.start = start;
        this.end = end;
        this.difficulty = difficulty;
        this.length = length;
    }

}

function distance(node1, node2){
    return Math.sqrt((node1.x - node2.x)**2 + (node1.y - node2.y)**2);
}

function buildGraph(_nodes, _edges){
    // TODO: this function is not tested yet
    // The limitations of the edges will should be filtered out before calling this function.
    // ex: only edges that are part of the same mountain should be passed in
    let nodes = {}
    let edges = {}
    for (let [id, x, y] of _nodes){
        nodes[id] = new Node(id, x, y, []);
    }
    for(let [id, u,v, length, difficult] of _edges){        
        let edge = new Edge(id, u, v, length, difficult);
        nodes[u].edges.push(edge);
        edges[id] = edge;
    }
    return {'nodes':nodes, 'edges':edges};
}

function aStarSearch(map, startID, goalID, costFunction = (e=>e.length), heuristic = distance){
    /**
     * A* search algorithm
     * @param {{'nodes':Node[], 'edges':Edge[]}} map 
     * @param {string} startID 
     * @param {string} goalID 
     * @param {function} costFunction a function that takes an edge and returns the cost of traversing it
     * @param {function} heuristic a function that takes two nodes and returns the cost between them
     * @returns {int[]} The path from start to goal (ids of edges)
     */
    
    let node = map.nodes[startID];
    let goal = map.nodes[goalID];
    let gTable = {[startID]: 0}                  // The actual cost to reach the node
    let hTable = {[startID]:heuristic(node, goal)} // The heuristic cost to reach the goal
    let fTable = {[startID]:heuristic(node, goal)} // g(start,node)+h(node,goal)
    // let bestFrom = {startID:null}                // The best node to reach this node from
    let toVisit = new PriorityQueue(key = (x => fTable[x[0]]));
    toVisit.push([startID, []]);

    while(toVisit){
        let [nodeID, path] = toVisit.pop()
        let node = map.nodes[nodeID];
        if(nodeID == goalID){
            return path;
        }
        for(const edge of node.edges){
            const g = gTable[nodeID] + costFunction(edge);
            let vID = edge.end;
            if(!(vID in gTable) || g < gTable[vID]){
                gTable[vID] = g;
                hTable[vID] = heuristic(map.nodes[vID], goal);
                fTable[vID] = g + hTable[vID];
                if (!(vID in toVisit)){
                    toVisit.push([vID, path.concat(edge.id)]);
                }
            }
        }
    }
    return [];
}
module.exports = {Node, Edge, buildGraph, aStarSearch};