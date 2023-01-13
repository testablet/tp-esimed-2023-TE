const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
  res.send(userRepository.getUsers());
});

router.get('/:firstName', (req, res) => {
  const foundUser = userRepository.getUserByFirstName(req.params.firstName);

  if (!foundUser) {
    throw new Error('User not found');
  }

  res.send(foundUser);
});

router.post('/', (req, res) => {
  const existingUser = userRepository.getUserByFirstName(req.body.firstName);
  body('firstName').isAlphanumeric(), 
  body('lastName').isAlphanumeric(), 
  body('password').isAlphanumeric().isLength({ min: 5 }), 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const existingUser = await userRepository.getUserByFirstName(req.body.firstName);
    if (existingUser) {
      throw new Error('Unable to create the user');
    }

    await userRepository.createUser(req.body);
    res.status(201).end();
  }
});

router.put('/:id', (req, res) => {
  userRepository.updateUser(req.params.id, req.body);
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  userRepository.deleteUser(req.params.id);
  res.status(204).end();
});

exports.initializeRoutes = () => router;