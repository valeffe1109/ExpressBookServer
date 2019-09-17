const express = require('express')
const bodyParser = require('body-parser')
const bookRouter = require('./services/books')
const reviewsRouter = require('./services/reviews')
const cors = require ('cors')


const server = express();
server.set('port', process.env.PORT || 3450)

server.use(bodyParser.json())


server.use("/books",bookRouter)
server.use('/reviews',reviewsRouter)


server.listen(server.get('port'),() =>{

    console.log('SERVER IS RUNNING ON ' + server.get('port'))

})