import { Router } from "express";
import { authToken } from "../controllers/auth.controller.js";
export const router = Router();
router.get('auth/token', authToken);
//# sourceMappingURL=auth.route.js.map