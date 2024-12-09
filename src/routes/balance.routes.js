import balanceController from "../controllers/balance.controller";

const { Router } = require("express");

const balanceRoutes = Router();

balanceRoutes.get("/balance/:id",balanceController.getBalance);
balanceRoutes.get("/balance",balanceController.getAllBalances);

export { balanceRoutes };