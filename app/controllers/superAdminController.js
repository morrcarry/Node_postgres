const { User, Company } = require('../../models');
const { HttpException } = require('../error/HttpException');
const { validateCompany, validateAdmin } = require('../validators/user.validator');
const passKey = require('../utils/passKey');

const addCompany = async (req, res) => {
  try {
    const { error } = validateCompany(req.body);
    if (error) {
      throw new HttpException(400, error.details[0].message);
    }
    const data = req.body;
    const { name, address } = data;
    const logo = req.file ? req.file.filename : null; // Get the uploaded filename
    const { id } = req.user;

    const newCompany = await Company.create({
      name,
      address,
      logo,
      superAdminId: id,
    });

    res.status(201).json({ message: 'Company added successfully', company: newCompany });
  } catch (error) {
    console.error('Error adding company:', error);
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// eslint-disable-next-line consistent-return
const addAdmin = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error) {
      // return res.status(400).json({ error: error.details[0].message });
      throw new HttpException(400, error.details[0].message);
    }
    const data = req.body;
    const {
      name, email, phone, company_id,
    } = data;

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      throw new HttpException(400, 'Email is already registered');
    }

    const isCompany = await Company.findByPk(company_id);
    if (!isCompany) {
      return res.status(404).json({ message: 'Company does not exist' });
    }

    const superAdmin = isCompany.superAdminId;
    const loggedInAdminId = req.user.id; // Assuming this is the superAdminsId ID
    const { role } = req.user;

    if (role !== 'superadmin' || superAdmin !== loggedInAdminId) {
      throw new HttpException(403, 'Permission denied. You are not the superadmin of this company.');
    }
    const { privateKey, pubKey } = passKey();

    const newAdmin = await User.create({
      name,
      email,
      phone,
      public_key: pubKey,
      role: 'admin',
      created_by: loggedInAdminId,
      company_id,
    });

    res.status(201).json({ message: 'Admin added successfully', admin: newAdmin, privateKey });
  } catch (error) {
    console.error('Error adding admin:', error);
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = { addCompany, addAdmin };
