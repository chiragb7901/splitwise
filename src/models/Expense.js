import { Model, Sequelize } from "sequelize";
import CURRENCIES from "../utils/currencyEnum";

class Expense extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        value: Sequelize.FLOAT,
        currency: Sequelize.ENUM(...Object.values(CURRENCIES)),
        date: Sequelize.DATE,
        userId: Sequelize.INTEGER,
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    this.addHook("beforeSave", async (expense) => {
      if (!expense.date) {
        expense.date = new Date();
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId" });
  }
}

export default Expense;
