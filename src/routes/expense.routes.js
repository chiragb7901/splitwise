import expenseController from "../controllers/expense.controller";

const { Router } = require("express");

const expenseRoutes = Router();

expenseRoutes.get("/expense/:id", expenseController.getExpensesByUser);
expenseRoutes.post("/expense", expenseController.addExpense);
expenseRoutes.put("/expense/:id", expenseController.updateExpense);
expenseRoutes.delete("/expense/:id", expenseController.deleteExpense);

export { expenseRoutes };
