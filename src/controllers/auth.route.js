const express = require('express');
const { users } = require('../models/db');
const router = express.Router();
const userRepository = require('../models/user-repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { firstName, password } = req.body;
    const user = users.find(u => u.firstName === firstName);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token });
    });
});

exports.initializeRoutes = () => router;