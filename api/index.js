import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import socketIO from 'socket.io';

const app = new Koa(),
    router = new Router();

router.get('/', ctx => {
    ctx.body = "hello";
});

app
    .use(bodyParser())
    .use(router.allowedMethods())
    .use(router.routes());



const socket = socketIO.listen(app);
app.listen(4000);
