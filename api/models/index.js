import Sequelize from 'sequelize';

const sequelize = new Sequelize('chat_app', 'postgres', '', {
    operatorsAliases: Sequelize.Op,
    host: 'localhost',
    dialect: 'postgres'
});

const models = {
    User: sequelize.import('./users'),
    Message: sequelize.import('./messages')
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;