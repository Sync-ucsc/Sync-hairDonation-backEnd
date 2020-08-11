const Graph = require('node-dijkstra');
const axios=require('axios');
const { compareSync } = require('bcryptjs');


module.exports=class ShortestPath{

constructor() {}



calculateShortestPath(locations){
console.log(locations);

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

    for (let index = 0; index < locations.length; index++) {
        let insideArr = []
         locations.forEach((element) => {
           const distance = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${locations[index].lat},${locations[index].lng}&destinations=${element.lat}%2C${element.lng}&key=${API_KEY}`;
           axios.get(distance).then((data) => {
                insideArr.push({
                    "id": element.salonId,
                    "distance":data.data.rows[0].elements[0].distance
                });
             console.log(data.data.rows[0].elements[0].distance);
           });
         });
        distances.push({"in":insideArr});
        console.log(insideArr);
    }
    console.log(distances)

   


const route = new Graph();

for (let index = 0; index < locations.length; index++) {
    const element = array[index];
    
}


route.addNode('A', {B: 1});
route.addNode('B', {A: 1, C: 2, D: 4});
route.addNode('C', {B: 2, D: 1});
route.addNode('D', {C: 1, B: 4});

console.log(route.path('A', 'D')); // => [ 'A', 'B', 'C', 'D' ]

}



}


