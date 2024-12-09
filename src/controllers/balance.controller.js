import Balance from "../models/Balance";
import CURRENCIES from "../utils/currencyEnum";

const balanceController = {
  getBalance: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).send({ message: "User ID required" });

      const debitData = await Balance.findAll({ where: { senderId: id } });
      const creditData = await Balance.findAll({ where: { receiverId: id } });

      return res.status(200).send({
        data: {
          debitData: debitData,
          creditData: creditData,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getAllBalances: async (req, res, next) => {
    try {
      const balances = await Balance.findAll();

      return res.status(200).send({
        status: "success",
        data: balances,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default balanceController;
