const express = require('express');

const router = express.Router();
const { updateSelf } = require('../controllers/employeController');

const { isEmployee } = require('../middlewares/authrization');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.use(isEmployee);

router.put('/update/:id', updateSelf);

module.exports = router;
