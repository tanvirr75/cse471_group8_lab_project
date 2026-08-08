const express = require("express");
const router = express.Router();
const devAuth = require("../middlewares/devAuth");
const {
  applyToJob,
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.use(devAuth);

router.post("/", applyToJob);
router.get("/", getMyApplications);
router.patch("/:id", updateApplicationStatus);

module.exports = router;
