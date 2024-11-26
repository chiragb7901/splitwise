import balanceController from "../controllers/balance.controller";

const { Router } = require("express");

const balanceRoutes = Router();

balanceRoutes.get("/balance/:id",balanceController.getBalance);

export { balanceRoutes };