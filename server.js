var express = require('express')
var app = express()
var path = require('path')

app.get('/_monitor/ping', function (req, res) {
    res.status(200).end('ok')
})

app.use(express.static(path.resolve(__dirname, 'build')))

app.listen(process.env.PORT || 8888)
