import { Model } from "sequelize";
import { ProjectAttributes } from "../Interfaces/ProjectInterface";

module.exports = (sequelize: any, DataTypes: any) => {
  class Project extends Model<ProjectAttributes> implements ProjectAttributes {
    id!: number;
    title!: string;
    status!: string;

    static associate(models: any) {
      Project.belongsToMany(models.User, {
        through: "ProjectAssignments",
      });
    }
  }
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
