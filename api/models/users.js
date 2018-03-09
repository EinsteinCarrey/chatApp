import models from "./index";

export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },username: {
            type: DataTypes.STRING,
            unique: true
        },
        password:DataTypes.STRING
    });

    return User;
};