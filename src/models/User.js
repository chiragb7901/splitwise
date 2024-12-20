import { Model, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import CURRENCIES from "../utils/currencyEnum";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        currency: Sequelize.ENUM(...Object.values(CURRENCIES)),
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
