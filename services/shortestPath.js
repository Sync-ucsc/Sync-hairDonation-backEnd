
const axios=require('axios');
const request = require('request');
const { compareSync } = require('bcryptjs');

// var dijkstra = {
//     single_source_shortest_paths: function (graph, s, d) {
//         // Predecessor map for each node that has been encountered.
//         // node ID => predecessor node ID
//         var predecessors = {};

//         // Costs of shortest paths from s to all nodes encountered.
//         // node ID => cost
//         var costs = {};
//         costs[s] = 0;

//         // Costs of shortest paths from s to all nodes encountered; differs from
//         // `costs` in that it provides easy access to the node that currently has
//         // the known shortest path from s.
//         // XXX: Do we actually need both `costs` and `open`?
//         var open = dijkstra.PriorityQueue.make();
//         open.push(s, 0);

//         var closest,
//             u, v,
//             cost_of_s_to_u,
//             adjacent_nodes,
//             cost_of_e,
//             cost_of_s_to_u_plus_cost_of_e,
//             cost_of_s_to_v,
//             first_visit;
//         while (!open.empty()) {
//             // In the nodes remaining in graph that have a known cost from s,
//             // find the node, u, that currently has the shortest path from s.
//             closest = open.pop();
//             u = closest.value;
//             cost_of_s_to_u = closest.cost;

//             // Get nodes adjacent to u...
//             adjacent_nodes = graph[u] || {};

//             // ...and explore the edges that connect u to those nodes, updating
//             // the cost of the shortest paths to any or all of those nodes as
//             // necessary. v is the node across the current edge from u.
//             for (v in adjacent_nodes) {
//                 if (adjacent_nodes.hasOwnProperty(v)) {
//                     // Get the cost of the edge running from u to v.
//                     cost_of_e = adjacent_nodes[v];

//                     // Cost of s to u plus the cost of u to v across e--this is *a*
//                     // cost from s to v that may or may not be less than the current
//                     // known cost to v.
//                     cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

//                     // If we haven't visited v yet OR if the current known cost from s to
//                     // v is greater than the new cost we just found (cost of s to u plus
//                     // cost of u to v across e), update v's cost in the cost list and
//                     // update v's predecessor in the predecessor list (it's now u).
//                     cost_of_s_to_v = costs[v];
//                     first_visit = (typeof costs[v] === 'undefined');
//                     if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
//                         costs[v] = cost_of_s_to_u_plus_cost_of_e;
//                         open.push(v, cost_of_s_to_u_plus_cost_of_e);
//                         predecessors[v] = u;
//                     }
//                 }
//             }
//         }

//         if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
//             var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
//             throw new Error(msg);
//         }

//         return predecessors;
//     },

//     extract_shortest_path_from_predecessor_list: function (predecessors, d) {
//         var nodes = [];
//         var u = d;
//         var predecessor;
//         while (u) {
//             nodes.push(u);
//             predecessor = predecessors[u];
//             u = predecessors[u];
//         }
//         nodes.reverse();
//         return nodes;
//     },

//     find_path: function (graph, s, d) {
//         var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
//         return dijkstra.extract_shortest_path_from_predecessor_list(
//             predecessors, d);
//     },

//     /**
//      * A very naive priority queue implementation.
//      */
//     PriorityQueue: {
//         make: function (opts) {
//             var T = dijkstra.PriorityQueue,
//                 t = {},
//                 key;
//             opts = opts || {};
//             for (key in T) {
//                 if (T.hasOwnProperty(key)) {
//                     t[key] = T[key];
//                 }
//             }
//             t.queue = [];
//             t.sorter = opts.sorter || T.default_sorter;
//             return t;
//         },

//         default_sorter: function (a, b) {
//             return a.cost - b.cost;
//         },

//         /**
//          * Add a new item to the queue and ensure the highest priority element
//          * is at the front of the queue.
//          */
//         push: function (value, cost) {
//             var item = {
//                 value: value,
//                 cost: cost
//             };
//             this.queue.push(item);
//             this.queue.sort(this.sorter);
//         },

//         /**
//          * Return the highest priority element in the queue.
//          */
//         pop: function () {
//             return this.queue.shift();
//         },

//         empty: function () {
//             return this.queue.length === 0;
//         }
//     }
// };


// // node.js module exports
// if (typeof module !== 'undefined') {
//     module.exports = dijkstra;
// }

// var find_path = dijkstra.find_path;


const dijkstra = function (graph, start) {

    //This contains the distances from the start node to all other nodes
    var distances = [];
    //Initializing with a distance of "Infinity"
    for (var i = 0; i < graph.length; i++) distances[i] = Number.MAX_VALUE;
    //The distance from the start node to itself is of course 0
    distances[start] = 0;

    //This contains whether a node was already visited
    var visited = [];

    //While there are nodes left to visit...
    while (true) {
        // ... find the node with the currently shortest distance from the start node...
        var shortestDistance = Number.MAX_VALUE;
        var shortestIndex = -1;
        for (var i = 0; i < graph.length; i++) {
            //... by going through all nodes that haven't been visited yet
            if (distances[i] < shortestDistance && !visited[i]) {
                shortestDistance = distances[i];
                shortestIndex = i;
            }
        }

        console.log("Visiting node " + shortestDistance + " with current distance " + shortestDistance);

        if (shortestIndex === -1) {
            // There was no node not yet visited --> We are done
            return distances;
        }

        //...then, for all neighboring nodes....
        for (var i = 0; i < graph[shortestIndex].length; i++) {
            //...if the path over this edge is shorter...
            if (graph[shortestIndex][i] !== 0 && distances[i] > distances[shortestIndex] + graph[shortestIndex][i]) {
                //...Save this path as new shortest path.
                distances[i] = distances[shortestIndex] + graph[shortestIndex][i];
                console.log("Updating distance of node " + i + " to " + distances[i]);
            }
        }
        // Lastly, note that we are finished with this node.
        visited[shortestIndex] = true;
        console.log("Visited nodes: " + visited);
        console.log("Currently lowest distances: " + distances);

    }
};

module.exports = {
    dijkstra
};

module.exports=class ShortestPath{

constructor() {}


    calculateShortestPath(locations) {

    const API_KEY = 'AIzaSyAkGlhRjMfmotb0UBMf8EAcmkTB6v3WEVM';

    let distances = [];

    var bar = new Promise((resolve, reject) => {
        let i = 0;
        locations.forEach((element1, index, array) => {
            let insideArr = []
            var bar1 = new Promise((resolve, reject) => {
                let i1 = 0;
                locations.forEach((element, index1, array1) => {
                    const distance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${element1.lat},${element1.lng}&destinations=${element.lat}%2C${element.lng}&key=${API_KEY}`;
                    // axios.get(distance).then((data) => {
                    //     insideArr.push({
                    //         "id": element.salonId,
                    //         "distance": data.data.rows[0].elements[0].distance.value
                    //     });
                    //     // console.log(data.data.rows[0].elements[0].distance);
                    //     // console.log(insideArr);
                    //     console.log(distances);
                    // });
                    request(distance, {
                        json: true
                    }, (err, res, body) => {
                        
                        if (err) {
                            return console.log(err);
                        }
                        insideArr.push({
                            "id": element.salonId,
                            "distance": body.rows[0].elements[0].distance.value
                        });
                        i1++;
                        // console.log(body.rows[0].elements[0].distance.value);
                        if (i1 === array1.length) {
                            i++;
                            resolve();
                        }

                    });
                });
            });

            bar1.then(() => {
                console.log('gg');
                distances.push({
                    "id": element1.salonId,
                    "in": insideArr
                });
                
                if (i === array.length) resolve();
                // console.log('1 All done!');
            });
            
            
            
            // console.log(insideArr);
            // console.log('g3');

        });
    });

    bar.then(() => {
        let graph = {};
        // console.log(distances);
        for (let index = 0; index < locations.length; index++) {
            let nodeMap = {};
            console.log(index)
            distances[index].in.forEach(element => {
                if (element.id !== distances[index].id)
                {
                    nodeMap[element.id] = element.distance
                    }
                // console.log(element);
            });
            // console.log(nodeMap);
            // console.log(distances[index].id)
            // route.addNode(distances[index].id, nodeMap);
            graph[distances[index].id] = nodeMap
            
            nodeMap = {};
        
        }
        var path = dijkstra(graph, distances[0].id);
        console.log(path)
        //  console.log(route.path(distances[0].id, distances[distances.length - 1].id,{cost:true})); // => [ 'A', 'B', 'C', 'D' ]
    });

    
    
    
   


// const route = new Graph();
// // console.log(distances);
// for (let index = 0; index < locations.length; index++) {
//     // let nodeMap = new Map()
//     // distances.forEach(element => {
//     //     nodeMap[element.id] = element.distance
//     // });
//     // console.log(nodeMap);
//     // route.addNode(
//     //     distances[index].id,nodeMap);
    
// }
// let s =  {B: 1}
// let f = {}
// f["A"] = 1;
// f["C"] = 2;
// f["D"] = 4;
// console.log(f)

// route.addNode('A', s);
// route.addNode('B', f);
// route.addNode('C', {B: 2, D: 1});
// route.addNode('D', {C: 1, B: 4});

// console.log(route.path('A', 'D')); // => [ 'A', 'B', 'C', 'D' ]

}



}


