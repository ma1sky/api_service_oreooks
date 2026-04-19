import { Router } from "express";
import { authToken } from "../controllers/auth.controller.js";
const router = Router();
router.get('auth/token', authToken);
export default router;
//# sourceMappingURL=routes.js.map