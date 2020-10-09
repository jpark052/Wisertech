// var cmd = require('node-cmd');

// cmd.get(
//     'arp -na | grep -i b8:27:eb',
//     function (err, data, stderr) {
//         console.log('1', data)
//     }
// );

const express = require('express')
const app = express()
const path = require('path');

app.get('/', (req, res) => {
    res.send('Users Page')
  })

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'settings.html'))
})

app.get('/sensors', (req, res) => {
    res.sendFile(path.join(__dirname, 'sensors.html'))
})

app.listen(3000, () => console.log('Server Started'))