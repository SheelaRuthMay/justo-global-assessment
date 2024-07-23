const router = require("express").Router();
// const {validateToken} = '../middlewares/apiTokenValidation'
const login = require("../controllers/login.controller.js");
const dashboard = require("../controllers/dashboard.controller.js");


// router.post("/users/register", register.create);
router.post("/login", login.userLogin);
router.get("/insertOnce", login.insertOnce);
router.get("/getLink/:email", dashboard.getOneTimeLink);
router.get("/updateLinkTime/:token", dashboard.updateLinkTime);
router.get("/getTime", dashboard.tokenValidation);
router.get("/getAllUsers", dashboard.getAllUsers);
router.patch("/kickOut/:id", dashboard.kickOut);


module.exports = router;