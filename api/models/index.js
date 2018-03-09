import Sequelize from 'sequelize';

const sequelize = new Sequelize('chat_app', 'postgres', '', {
    operatorsAliases: Sequelize.Op,
    host: 'localhost',
    dialect: 'postgres'
});


const User = sequelize.import('./users'),
    Message = sequelize.import('./messages');

const models = {
    User,
    Message
};


User.hasMany(Message, {foreignKey: 'sender', sourceKey: 'id'});
User.hasMany(Message, {foreignKey: 'recipient', sourceKey: 'id'});

Message.belongsTo(User, {foreignKey: 'sender', targetKey: 'id'});
Message.belongsTo(User, {foreignKey: 'recipient', targetKey: 'id'});


Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;