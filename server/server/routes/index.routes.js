import { Router } from "express";
import { PORT } from "../config.js";

const router = Router();

router.get("/", (req, res) => {  
  return res.json({
    msg: "Api proyecto 1 v0.1 funcionando en puerto: ", PORT,
  });
});

export default router;