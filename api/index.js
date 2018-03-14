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
let connectedSockets = {};
const app = new Koa(), router = new Router();

const server = http.createServer(app.callback()); // create a http server
const socket = socketIO(server);

const getUserId = (token) =>{
    let output = null;
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            output = false;
            return;
        }
        // token is valid
        output = decoded.userId;
    });
    return output;
};

router.get('/', async ctx => {

    const fetchAllUserMessages = () => {
        return new Promise((resolve, reject) => {

            const token = ctx.request.headers['x-access-token'];
            const currentUserID = getUserId(token);
            if(currentUserID === false){
                ctx.status = 401;
                resolve({errMsg: "Authenticate token is invalid"});
                return;
            }

            models.Message.findAll({
                where: {
                    [models.Sequelize.Op.or]:[
                        {sender: currentUserID},
                        {recipient: currentUserID}
                    ]
                },
                order: [['createdAt', 'ASC']]
            }).then((messages) => {
                let output ={};
                messages.map((messageData) => {
                    const {message, recipient, sender, createdAt} = messageData.dataValues;

                    const fellowID = currentUserID === recipient? sender: recipient;

                    if(!output[fellowID])
                        output[fellowID] = [];

                    output[fellowID].push([message, createdAt, sender === currentUserID]);
                });

                ctx.status = 200;
                resolve(output);
            });

        });
    };

    ctx.body = await fetchAllUserMessages();

});

router.get('/contacts', async ctx => {

    const fetchAllUsers = () => {
        return new Promise((resolve, reject) => {

            const token = ctx.request.headers['x-access-token'];
            const currentUserID = getUserId(token);
            if(currentUserID === false) {
                ctx.status = 401;
                resolve({errMsg: "Authenticate token is invalid"});
                return;
            }

            models.User.findAll({
                attributes: ['id', 'username', 'createdAt'],
                where: {
                    id: {[models.Sequelize.Op.not]: currentUserID}
                }
            }).then((users) => {
                let output ={};
                users.map((user) =>{
                    const {id, username, createdAt} = user.dataValues;
                    output[id] = [username, createdAt];
                });

                ctx.status = 200;
                resolve(output);
            });

        });
    };

    ctx.body = await fetchAllUsers();

});

router.post('/:user/message', async ctx => {

    const token = ctx.request.headers['x-access-token'];

    const createNewMessage = () => {
        return new Promise((resolve, reject) => {

            const currentUserID = getUserId(token);
            if(currentUserID === false) {
                ctx.status = 401;
                resolve({errMsg: "Authenticate token is invalid"});
                return;
            }

            models.Message.create({
                sender: currentUserID,
                recipient: ctx.params.user,
                message: ctx.request.body.message
            }).then((message) => {

                // Send message to recipient via socket
                Object.keys(connectedSockets).map((sock_user)=>{
                    if(sock_user === ctx.params.user) {
                        connectedSockets[sock_user].emit('newMessage', message.dataValues);
                    }
                });

                ctx.status = 200;
                resolve(message.dataValues);
            });
        });
    };

    ctx.body = await createNewMessage()

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
                    const {id, username, createdAt} = newUser.dataValues;
                    /* Create web token */
                    token = jwt.sign(
                        {userId: id},
                        process.env.SECRET_KEY,
                        {expiresIn: "1 day"}
                    );

                    broadcastSockData('newUser', {
                        id,
                        username,
                        createdAt
                    });

                    ctx.status = 200;
                    resolve(token);
                }).catch(models.Sequelize.Error, () =>{
                    ctx.status = 409;
                    resolve({errMsg: "Username already in use"});
                });
            });
        });
    };

    ctx.body = await addUserToDB();

});

router.post('/users/authenticate', async (ctx) => {

    const findUSer = () => {
        return new Promise((resolve, reject) => {

            models.User.findOne({
                attributes: ['id', 'password'],
                where: { username: ctx.request.body.username }
            }).then((user) => {
                if(!user){
                    ctx.status = 401;
                    resolve({errMsg: "Incorrect username"});
                }
                bcrypt.compare(ctx.request.body.passwd, user.dataValues.password).then((err) =>{
                    if(!err){
                        ctx.status = 401;
                        resolve({errMsg: "Incorrect password"});
                        return;
                    }

                    const token = jwt.sign(
                        {userId: user.dataValues.id},
                        process.env.SECRET_KEY,
                        {expiresIn: "1 day"}
                    );
                    ctx.status = 200;
                    resolve(token);
                });
            });

        });
    };

    ctx.body = await findUSer();

});

app
    .use(cors()) // Allow Cross-Origin Resource Sharing
    .use(bodyParser()) // Allow post requests
    .use(router.allowedMethods())
    .use(router.routes());


socket.on('connection', (connectedSocket) =>{

    connectedSocket.on('register_user', (user)=>{
        connectedSockets[getUserId(user)] = connectedSocket
    });
    // console.log("Connected id: ", connectedSocket.id)
});

const broadcastSockData = (event, data) =>{
    Object.keys(connectedSockets).map((sock_user)=>{
        connectedSockets[sock_user].emit(event, data);
    });
};

// Create database tables
models.sequelize.sync().then(() =>{

    // Bind server to port 4000
    server.listen(4000);
});