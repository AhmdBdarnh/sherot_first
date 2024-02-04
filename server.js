// server
const http = require('http');
const url = require('url');
const fs = require('fs');
const shelterModule = require('./shelter');
const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    if (req.method === 'GET' && parsedUrl.pathname === '/shelters') {       // GET method
        try {
            
            fs.readFile(dataPath, 'utf8', (err, data) => {
                    if (shelterModule.checkJsonFile() === 1){
                        const content = JSON.parse(data);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(content));
                    }
                    else {
                      console.error('the file is empty');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                       res.end('the file is empty');

                    }

            });
        } 
        catch (err) {
            console.error('Error parsing JSON:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server has an error in GET method');
        }
    } 
    else if (req.method === 'POST' && parsedUrl.pathname === '/shelters') {     //POST method
        let body = '';
        req.on('data', (data) => { 
            body += data;    
        });

        req.on('end', () => {
            try {
                shelterModule.checkJsonFile();  // if the file empty create []
                const newShelter = JSON.parse(body);
                const shelter = shelterModule.createShelter(newShelter);
                const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                existingData.push(shelter);

                fs.writeFileSync(dataPath, JSON.stringify(existingData), 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(shelter));
            } 
            catch (err) {
                console.error('Error processing POST request:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server has an error in POST method');
            }
        });
    } 
    else if (req.method === 'DELETE' && parsedUrl.pathname.padEnd("/shelters/")) {     //DELETE method
        try {
                const shelterId = parseInt(parsedUrl.pathname.split('/')[2]);

                let existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                const shelterIndex = existingData.findIndex(shelter => shelter.id === shelterId);

            if (shelterIndex == -1) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Shelter not exsist');
            } 
            else {
                 const deletedShelter = existingData.splice(shelterIndex, 1)[0];
                 fs.writeFileSync(dataPath, JSON.stringify(existingData), 'utf-8');
                 res.writeHead(200, { 'Content-Type': 'application/json' });
                 res.end(JSON.stringify(deletedShelter));
            }
        } 
        catch (err) {
            console.error('Error DELETE request:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server has an error in request in DELETE method');
        }
    } 
    else if (req.method === 'PUT' && parsedUrl.pathname.padEnd("/shelters/")) {     //PUT method
        let body = '';
        req.on('data', (data) => { 
            body += data;    
        });
        req.on('end', () => {

        try {
                const shelterId = parseInt(parsedUrl.pathname.split('/')[2]);
                let existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                const shelterIndex = existingData.findIndex(shelter => shelter.id === shelterId);
               if (shelterIndex == -1) {    // if the id dosnt exsist
                   res.writeHead(404, { 'Content-Type': 'text/plain' });
                   res.end('Shelter not exsist');
               } 
               else {
                    const updatedFields = JSON.parse(body);
                    existingData[shelterIndex] = {...existingData[shelterIndex],...updatedFields };
                    fs.writeFileSync(dataPath, JSON.stringify(existingData), 'utf-8');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(existingData[shelterIndex]));
               }
           } 
        catch (err) {
            console.error('Error PUT request:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server has an error in request in PUT method ');
        }
        });
    }
    else {
        console.log('request Not Found');
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('request Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});