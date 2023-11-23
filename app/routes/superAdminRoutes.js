const express = require('express');

const router = express.Router();
const { upload } = require('../../server');
const { addCompany, addAdmin } = require('../controllers/superAdminController');
const { isSuperAdmin } = require('../middlewares/authrization');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.use(isSuperAdmin);

router.post('/adminadd', addAdmin);
router.post('/companyadd', upload.single('logo'), addCompany);

module.exports = router;
