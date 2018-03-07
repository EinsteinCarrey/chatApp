export default (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        recipient: DataTypes.INTEGER,
        message:DataTypes.STRING
    });

    Message.associate = function (models) {
        Message.belongsTo(models.User, {
            foreignKey: "recipient"
        });
    };

    return Message;
};