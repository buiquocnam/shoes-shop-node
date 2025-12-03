import { Router } from "express";
import { login, register, logout } from "../controllers/authController";
import { validateLogin, validateRegister, validateLogout} from "../middlewares/validation";

const router = Router();

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);
router.post("/logout", logout);

export default router;
