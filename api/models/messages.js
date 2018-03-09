import models from "./index";

export default (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        recipient: DataTypes.INTEGER,
        message:DataTypes.STRING,
        sender: DataTypes.INTEGER
    });

    return Message;
};