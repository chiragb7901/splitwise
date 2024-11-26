import User from "../models/User";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import CURRENCIES from "../utils/currencyEnum";

let userController = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  add: async (req, res, next) => {
    try {
      const UserSchema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required().min(8),
        currency: Yup.string(),
      });

      if (!Object.values(CURRENCIES).includes(req.body.currency)) {
        return res.status(400).send({ message: "Invalid currency" });
      }

      if (!(await UserSchema.validate(req.body))) throw new ValidationError();

      const { email } = req.body;

      const userExist = await User.findOne({
        where: { email },
      });

      if (userExist) {
        res.status(400).send("Email is already registered");
      }

      const user = await User.create(req.body);

      res.status(201).send({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  findUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).send({
          status: "failed",
          message: "User not found",
        });
      }

      return res.status(200).send({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.body;

      const user = await User.findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (req.body.name) {
        user.dataValues.name = req.body.name;
      }
      if (req.body.email) {
        user.dataValues.email = req.body.email;
      }
      if (req.body.currency) {
        if (!Object.values(CURRENCIES).includes(currency)) {
          return res.status(400).send({ message: "Invalid currency" });
        }
        user.dataValues.currency = req.body.currency;
      }

      const newUser = await User.update(user.dataValues, {
        where: {
          id: userId,
        },
      });

      return res.status(200).send({
        status: "success",
        message: "User updated successully",
      });
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const userId = req.body.userId;
      if (!userId)
        return res.status(400).send({ message: "UserID is required" });

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).send({ message: "User not found" });

      if (!req.body.oldPassword)
        return res.status(400).send({ message: "Old password is required" });
      if (!req.body.newPassword)
        return res.status(400).send({ message: "New password is required" });
      if (req.body.newPassword.length < 8)
        return res
          .status(400)
          .send({ message: "Password must be at least 8 characters long" });
      if (req.body.oldPassword === req.body.newPassword)
        return res
          .status(400)
          .send({
            message: "New password cannot be the same as the old password",
          });

      const isPasswordValid = await user.checkPassword(req.body.oldPassword);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Incorrect old password" });
      }

      const encryptedPassword = await bcrypt.hash(req.body.newPassword, 8);

      const [updatedRows] = await User.update(
        { password_hash: encryptedPassword },
        { where: { id: userId } }
      );

      if (updatedRows === 0) {
        return res.status(500).send({ message: "Failed to update password" });
      }

      return res.status(200).send({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.body;

      const user = await User.findOne(id);
      if (!user) {
        return res.status(404).send({
          status: "failed",
          message: "UserId is invalid",
        });
      }

      user.destroy();

      return res.status(202).send({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
