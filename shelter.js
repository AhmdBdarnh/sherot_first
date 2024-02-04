//shelter.js
dataPath = 'data.json';
const fs = require('fs');
let shelters = [];

function getShelter(){
    return shelters;
}
function createShelter(newShelter) {
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    const dataArray = JSON.parse(jsonData);
    const arrayLength = dataArray.length;
    const shelter = { id: arrayLength + 1, ...newShelter };
    shelters.push(shelter);
    return shelter;
}
function checkJsonFile() {
        const stats = fs.statSync(dataPath);
        if (stats.size === 0) {
            fs.writeFileSync(dataPath, JSON.stringify(shelters), 'utf-8');
            return 0;
        } 
        else {
            return 1;
        }
}
module.exports = {createShelter,getShelter,dataPath,checkJsonFile};
