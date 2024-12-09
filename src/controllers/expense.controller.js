import { where } from "sequelize";
import Balance from "../models/Balance";
import Expense from "../models/Expense";
import User from "../models/User";
import * as Yup from "yup";
import currencyConversion from "../utils/currencyConversion";

const expenseController = {
  addExpense: async (req, res, next) => {
    try {
      const expenseSchema = Yup.object().shape({
        name: Yup.string().required(),
        value: Yup.number().required(),
        currency: Yup.string().required(),
        userId: Yup.string().required(),
      });

      if (!req.body.members)
        return res.status(400).send({ message: "Members are required" });

      if (!expenseSchema.validate(req.body.expenseData))
        return res
          .status(400)
          .send({ message: "Required data for creating expense is missing" });

      req.body.expenseData.date = new Date();

      const newExpense = await Expense.create(req.body.expenseData);

      const members = req.body.members;
      const numberOfMembers = members.length + 1;
      const perHeadSplit = req.body.expenseData.value / numberOfMembers;

      for (let memberId of members) {
        const member = await User.findByPk(memberId);
        if (!member)
          return res
            .status(404)
            .send({ message: "Member not found", memberID: member });
      }

      for (let memberId of members) {
        const memberData = await User.findByPk(memberId);
        let convertedAmount = perHeadSplit;
        const toCurrency = memberData.dataValues.currency;
        const fromCurrency = req.body.expenseData.currency;

        if (fromCurrency != toCurrency) {
          convertedAmount = currencyConversion(
            fromCurrency,
            toCurrency,
            perHeadSplit
          );
        }

        const newBalance = {
          senderId: memberId,
          receiverId: Number(req.body.expenseData.userId),
          amount: convertedAmount,
          isSettled: false,
          currency: memberData.currency,
          expenseId: newExpense.id,
        };

        await Balance.create(newBalance);
      }

      return res
        .status(200)
        .send({ message: "Expense created successfully", data: newExpense });
    } catch (error) {
      next(error);
    }
  },
  getExpensesByUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).send({ message: "User ID required" });

      const expenseData = await Expense.findAll({ where: { userId: id } });

      return res.status(200).send({ data: expenseData });
    } catch (error) {
      next(error);
    }
  },
  updateExpense: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).send({ message: "Expense ID required" });

      const expenseData = await Expense.findByPk(id);
      if (!expenseData)
        return res
          .status(404)
          .send({ message: "No expense found for this ID" });

      if (req.body.name) {
        expenseData.name = req.body.name;
      }

      if (req.body.value) {
        const newValue = req.body.value;

        const members = await Balance.findAndCountAll({
          where: { expenseId: id },
        });

        const numberOfMembers = members.count + 1;
        const newPerHeadSplit = req.body.value / numberOfMembers;

        for (let member of members.rows) {
          member.dataValues.value = newPerHeadSplit;

          await Balance.update(
            { amount: newPerHeadSplit },
            { where: { id: member.dataValues.id } }
          );
        }

        expenseData.value = newValue;
      }

      await expenseData.save();

      return res
        .status(200)
        .send({ message: "Expense updated successfully", data: expenseData });
    } catch (error) {
      console.error("Error in updateExpense:", error);
      next(error);
    }
  },
  deleteExpense: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).send({ message: "Expense ID required" });

      await Balance.destroy({ where: { expenseId: id } });

      await Expense.destroy({ where: { id: id } });

      return res.status(200).send({ message: "Expense deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default expenseController;
