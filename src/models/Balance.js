import { Model, Sequelize } from "sequelize";
import CURRENCIES from "../utils/currencyEnum";

class Balance extends Model {
  static init(sequelize) {
    super.init(
      {
        senderId: Sequelize.INTEGER,
        receiverId: Sequelize.INTEGER,
        amount: Sequelize.FLOAT,
        isSettled: Sequelize.BOOLEAN,
        currency: Sequelize.ENUM(...Object.values(CURRENCIES)),
        expenseId: Sequelize.INTEGER,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }
  
  static associate(models){
    this.belongsTo(models.User, { foreignKey: "senderId" });
    this.belongsTo(models.User, { foreignKey: "receiverId" });
    this.belongsTo(models.Expense, { foreignKey: "expenseId" });
  }
}

export default Balance;