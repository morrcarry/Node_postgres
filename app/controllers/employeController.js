/* eslint-disable no-undef */
const { Op } = require('sequelize');
const { User } = require('../../models');
const { HttpException } = require('../error/HttpException');
const { validateUser } = require('../validators/user.validator');
const passKey = require('../utils/passKey');

const addEmployee = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      // return res.status(400).json({ error: error.details[0].message });
      throw new HttpException(400, error.details[0].message);
    }
    const data = req.body;
    const { name, email, phone } = data;
    const adminId = req.user.id; // Assuming you have a user object in your request representing the logged-in admin
    const companyId = req.user.company_id; // Assuming companyId is passed in the URL or request body

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      throw new HttpException(400, 'Email is already registered');
    }

    const { privateKey, pubKey } = passKey();

    const newEmployee = await User.create({
      name,
      email,
      phone,
      public_key: pubKey,
      role: 'employee',
      created_by: adminId,
      company_id: companyId,
    });

    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee, privateKey });
  } catch (error) {
    // Add an HTTP exception here to handle the error
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error('Error adding employee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const getAllEmployees = async (req, res) => {
  try {
    // Assuming you have the adminId of the logged-in admin
    const adminId = req.user.id;
    const companyId = req.user.company_id;
    const employees = await User.findAll({
      where: {
        created_by: adminId,
        company_id: companyId,
      },
    });

    res.status(201).json(employees);
  } catch (error) {
    // Add an HTTP exception here to handle the error
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      // return res.status(400).json({ error: error.details[0].message });
      throw new HttpException(400, error.details[0].message);
    }
    const { name, email, phone } = req.body;
    const employeeId = req.params.id;
    const adminId = req.user.id; // Assuming you have a user object representing the logged-in admin
    const companyId = req.user.company_id; // Assuming you have a companyId associated with the logged-in user

    const existingEmployee = await User.findOne({
      where: {
        email,
        id: {
          [Op.not]: employeeId, // Exclude the current employee being updated
        },
      },
    });

    if (existingEmployee) {
      // Email already exists, return a 409 Conflict HTTP exception
      throw new HttpException(400, 'Email already exists');
    }
    const employee = await User.findOne({
      where: {
        id: employeeId,
        created_by: adminId,
        company_id: companyId,
      },
    });

    if (!employee) {
      // Employee not found, throw a 404 Not Found HTTP exception
      throw new HttpException(404, 'Employee not found');
    }

    await User.update(
      {
        name,
        email,
        phone,
      },
      {
        where: { id: employeeId },
      },
    );

    res.status(201).json({ message: 'Employee updated successfully' });
  } catch (error) {
    // Handle HTTP exceptions
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      // Handle other internal server errors
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const updateSelf = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      // return res.status(400).json({ error: error.details[0].message });
      throw new HttpException(400, error.details[0].message);
    }
    const { name, email, phone } = req.body;
    const employeeId = Number(req.params.id);
    const loggedEmployeeId = req.user.id;

    if (employeeId !== loggedEmployeeId) {
      throw new HttpException(403, 'Permission denied. You can only update your own information');
    }

    await User.update(
      {
        name,
        email,
        phone,
      },
      {
        where: { id: employeeId },
      },
    );

    res.status(201).json({ message: 'Employee information updated successfully' });
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error('Error updating employee information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const adminId = req.user.id; // Assuming you have a user object representing the logged-in admin
    const companyId = req.user.company_id; // Assuming you have a companyId associated with the logged-in user

    const employee = await User.findOne({
      where: {
        id: employeeId,
        created_by: adminId,
        company_id: companyId,
      },
    });

    if (!employee) {
      throw new HttpException(404, 'Employee not found'); // Throw an HttpException with a 404 status code
    }

    await User.destroy({
      where: { id: employeeId },
    });

    res.status(201).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error('Error deleting employee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const adminId = req.user.id; // Assuming you have a user object representing the logged-in admin
    const companyId = req.user.company_id; // Assuming you have a companyId associated with the logged-in user

    const userDetail = await User.findOne({
      where: {
        id: employeeId,
        created_by: adminId,
        company_id: companyId,
      },
    });

    if (!userDetail) {
      throw new HttpException(404, 'User not found'); // Throw an HttpException with a 404 status code
    }

    res.status(201).json(userDetail);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = {
  updateEmployee, getAllEmployees, addEmployee, deleteEmployee, getEmployeeById, updateSelf,
};
