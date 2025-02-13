import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

/* ************************************************************************* */

// Define auth routes
import userActions from "./modules/user/userActions";

router.post("/register", userActions.register);
router.post("/login", userActions.login);

/* ************************************************************************* */
// A partir d'ici, les routes nécessitent un token JWT valide
import { jwtMid } from "./middlewares/jwtMid";
router.use(jwtMid);
/* ************************************************************************* */

// Define pets routes
import petActions from "./modules/pet/petActions";

router.get("/my-pets", petActions.getAllMyPets);
router.get("/pets", petActions.getAll);
router.get("/pets/:id", petActions.getOne);
router.post("/pets", petActions.create);
router.put("/pets/:id", petActions.update);
router.delete("/pets/:id", petActions.destroy);

// Export the router
export default router;
