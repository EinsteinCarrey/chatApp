import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import socketIO from 'socket.io';
import cors from '@koa/cors';
import http from 'http';
import models from './models';

const app = new Koa(),
    router = new Router();

const server = http.createServer(app.callback()); // create a http server

const socket = socketIO(server);

router.get('/', ctx => {
    ctx.body = "hello";
});

app
    .use(cors())
    .use(bodyParser())
    .use(router.allowedMethods())
    .use(router.routes());

socket.on('connection', (connectedSocket) =>{
    console.log("Connected id: ", connectedSocket.id)
});

models.sequelize.sync().then(() =>{
    server.listen(4000);
});