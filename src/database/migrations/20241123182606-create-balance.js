"use strict";

const CURRENCIES = require('../../utils/currencyEnum');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable("Balances", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      senderId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      receiverId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      isSettled: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      currency: {
        allowNull: false,
        type: Sequelize.ENUM(...Object.values(CURRENCIES)),
        defaultValue : CURRENCIES.INR
      },
      expenseId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Expenses",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("Balances");
  },
};
