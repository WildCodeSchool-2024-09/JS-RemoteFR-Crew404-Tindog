import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

/* ************************************************************************* */

import { hashPassword } from "./middlewares/argonMid";
// Define auth routes
import userActions from "./modules/user/userActions";

router.post("/register", userActions.register);
router.post("/login", userActions.login);

/* ************************************************************************* */
// A partir d'ici, les routes nécessitent un token JWT valide
import { jwtMid } from "./middlewares/jwtMid";
router.use(jwtMid);

/* ************************************************************************* */

export default router;
