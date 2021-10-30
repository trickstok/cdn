import { Model, UUIDV4 } from "sequelize";
import bcrypt from "bcrypt";
import { throwError } from "../Helpers/utilities/error";
import { UserAttributes } from "../Interfaces/UserInterface";

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    id!: string;
    username!: string;
    email!: string;
    password!: string;

    static associate(models: any) {
      User.belongsToMany(models.Project, {
        through: "ProjectAssignments",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user, options) => {
    return bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => {
        throwError(err.message, err.status);
      });
  });

  return User;
};
