const express = require('express');

const router = express.Router();
const {
  updateEmployee, getAllEmployees, addEmployee, deleteEmployee, getEmployeeById,
} = require('../controllers/employeController');

const { isAdmin } = require('../middlewares/authrization');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.use(isAdmin);

router.get('/employe', getAllEmployees);
router.get('/employe/:id', getEmployeeById);
router.post('/employe/add', addEmployee);
router.put('/employe/:id', updateEmployee);
router.delete('/employe/:id', deleteEmployee);

module.exports = router;
