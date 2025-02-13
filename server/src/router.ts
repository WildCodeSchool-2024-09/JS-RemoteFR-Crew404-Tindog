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
router.get("/logout", userActions.logout);

/* ************************************************************************* */
// A partir d'ici, les routes nécessitent un token JWT valide
import { jwtMid } from "./middlewares/jwtMid";
router.use(jwtMid);
/* ************************************************************************* */

// Define user routes
router.get("/me", userActions.me);
router.put("/me", userActions.update);

// Define pets routes
import petActions from "./modules/pet/petActions";

router.get("/my-pets", petActions.getAllMyPets);
router.get("/pets", petActions.getAll);
router.get("/pets/:id", petActions.getOne);
router.post("/pets", petActions.create);
router.put("/pets/:id", petActions.update);
router.delete("/pets/:id", petActions.destroy);

// Define likes routes
import likeActions from "./modules/like/likeActions";

router.post("/likes", likeActions.addLike);

// Define match routes
import matchActions from "./modules/match/matchActions";

router.get("/matches", matchActions.getMatches);

// Export the router
export default router;
