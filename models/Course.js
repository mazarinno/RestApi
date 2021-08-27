'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {};
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
    models.Course.belongsTo(models.User, {
      foreignKey:{
          fieldName: "userId"
      }
    });
  }

  return Course;
};