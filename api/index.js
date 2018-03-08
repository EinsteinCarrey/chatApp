import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import socketIO from 'socket.io';
import cors from '@koa/cors';
import http from 'http';
import models from './models';

const app = new Koa(), router = new Router();

const server = http.createServer(app.callback()); // create a http server
const socket = socketIO(server);

router.get('/', ctx => {
    ctx.body = {
        shgvVG567HGYBHJ: [["messsage", "9:30 am", true], ["messsage2", "9:40 am"]],
        shgvVG56asdv7HGYBHJ: [["messsage4", "9:32 am"], ["messsage5", "9:44 am"], ["messsage10", "9:54 am", true]],
        shgvVG56asacsvdv7HGYBHJ: [
            ["messsage34", "9:12 am", true],
            ["VEry very long message", "9:35 am"],
            ["messsage sdcs csdcd csdc dcs ccs csdcs cds", "9:48 am"],
            ["sd sdc sdcs dcs cdavty ht gh jkytj thgvevfv sd vdfv", "9:59 am", true]
        ]
    };
});


router.get('/contacts', ctx => {
    ctx.body = {
        shgvVG567HGYBHJ: ["Number one", "9:50 am"],
        shgvVG56asdv7HGYBHJ: ["I am two", "9:53 am"],
        shgvVG56asacsvdv7HGYBHJ: ["Number three", "9:57 am"]
    };
});

app
    .use(cors()) // Allow Cross-Origin Resource Sharing
    .use(bodyParser()) // Allow post requests
    .use(router.allowedMethods())
    .use(router.routes());

socket.on('connection', (connectedSocket) =>{
    connectedSocket.on('subscribeToTimer', (interval)=>{
        console.log("subscribeToTimer ", interval);
        connectedSocket.emit('interval_received', interval)
    });
    console.log("Connected id: ", connectedSocket.id)
});

// Create database tables
models.sequelize.sync().then(() =>{

    // Bind server to port 4000
    server.listen(4000);
});