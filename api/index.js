import 'babel-polyfill';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import socketIO from 'socket.io';
import cors from '@koa/cors';
import http from 'http';
import models from './models';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import messages from "./models/messages";

const app = new Koa(), router = new Router();

const server = http.createServer(app.callback()); // create a http server
const socket = socketIO(server);

// async function relay() {
//     return await timeout(5000);
// }


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

router.post('/:user/message', ctx => {
    ctx.body = models.Message.create({
        recipient: 50,//ctx.params.user,
        message: ctx.request.body.message
    }).then((message) => {
        ctx.body = message.dataValues;
    });
});

router.post('/users', async (ctx) => {

    /* hash the password using bcrypt and save user to DB */
    const addUserToDB = () => {
        return new Promise((resolve, reject) => {
            let token = "";
            bcrypt.hash(ctx.request.body.passwd, 10).then(function (hash) {
                models.User.create({
                    username: ctx.request.body.username,
                    password: hash
                }).then((newUser) => {
                    /* Create web token */
                    token = jwt.sign(
                        {userId: newUser.dataValues.id},
                        process.env.SECRET_KEY,
                        {expiresIn: "1 day"}
                    );

                    ctx.status = 200;
                    resolve(token);
                }).catch(models.Sequelize.Error, () =>{

                });
            });
        });
    };

    ctx.body = await addUserToDB(ctx);

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