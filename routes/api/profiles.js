const express = require("express");
const router = express.Router();

// @route GET api/profils/test
// @desc Tests profiles route
// @access Public
router.get('/test', (req, res) => res.json({ message: 'Hello world!' }));

module.exports = router;