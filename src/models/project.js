"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  project.init(
    {
      title: DataTypes.STRING,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      duration: DataTypes.STRING,
      description: DataTypes.TEXT,
      tech: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};
