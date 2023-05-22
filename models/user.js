'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsToMany(models.jobs,{through:"user_jobs"});
      users.belongsTo(models.roles,{foreignKey:"roleId"});
      users.hasMany(models.jobs,{foreignKey:"recruiterId"});
    }
  }
  users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    // isActive: {type:DataTypes.BOOLEAN,defaultValue:true},
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};