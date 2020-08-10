const Graph = require('node-dijkstra');
const axios=require('axios');
const request = require('request');
const { compareSync } = require('bcryptjs');


module.exports=class ShortestPath{

constructor() {}



    async calculateShortestPath(locations) {
// console.log(locations);

    const API_KEY = 'AIzaSyAkGlhRjMfmotb0UBMf8EAcmkTB6v3WEVM';
    const a = {
        "lat": 6.904784,
        "lng": 79.862619,
    }
    const b = {
        "lat": 6.89588,
        "lng": 79.856985,
    }

    let distances = [];

    locations.forEach(element1 => {
        let insideArr = []
        locations.forEach((element) => {
            const distance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${element1.lat},${element1.lng}&destinations=${element.lat}%2C${element.lng}&key=${API_KEY}`;
            axios.get(distance).then((data) => {
                insideArr.push({
                    "id": element.salonId,
                    "distance": data.data.rows[0].elements[0].distance.value
                });
                // console.log(data.data.rows[0].elements[0].distance);
                // console.log(insideArr);
                // console.log(distances);
            });
            // request(distance, {
            //     json: true
            // }, (err, res, body) => {
            //     if (err) {
            //         return console.log(err);
            //     }
            //     insideArr.push({
            //         "id": element.salonId,
            //         "distance": body.rows[0].elements[0].distance.value
            //     });
            //     console.log(body.rows[0].elements[0].distance.value);
            //     // console.log(distances);
                
            // });
        });
        // console.log('gg');
        distances.push({
            "id": element1.salonId,
            "in": insideArr
        });
        // console.log(insideArr);
        // console.log('g3');
        
    });
    
    
   


const route = new Graph();
// console.log(distances);
for (let index = 0; index < locations.length; index++) {
    let nodeMap = new Map()
    distances.forEach(element => {
        nodeMap[element.id] = element.distance
    });
    console.log(nodeMap);
    route.addNode(
        distances[index].id,nodeMap);
    
}


route.addNode('A', {B: 1});
route.addNode('B', {A: 1, C: 2, D: 4});
route.addNode('C', {B: 2, D: 1});
route.addNode('D', {C: 1, B: 4});

console.log(route.path('A', 'D')); // => [ 'A', 'B', 'C', 'D' ]

}



}


