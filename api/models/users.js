export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password:DataTypes.STRING
    });

    User.associate = function (models) {
        User.belongsToMany(models.Message, {
            through: 'chats',
            foreignKey: 'senderID'
        });
    };

    return User;
};