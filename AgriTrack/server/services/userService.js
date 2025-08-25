const { randomUUID } = require('crypto');

const User = require('../models/User.js');
const { generatePasswordHash, validatePassword } = require('../utils/password.js');

class UserService {
  static async list() {
    try {
      return User.find();
    } catch (err) {
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id) {
    try {
      return User.findOne({ _id: id }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email) {
    try {
      return User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }

  static async update(id, data) {
    try {
      return User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
    } catch (err) {
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id) {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return (result.deletedCount === 1);
    } catch (err) {
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email, password) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      console.log('Attempting to authenticate user:', email);
      const user = await User.findOne({email}).exec();
      if (!user) {
        console.log('User not found:', email);
        return null;
      }

      console.log('User found, validating password for:', email);
      const passwordValid = await validatePassword(password, user.password);
      if (!passwordValid) {
        console.log('Password validation failed for:', email);
        return null;
      }

      console.log('Password validation successful for:', email);
      user.lastLoginAt = Date.now();
      const updatedUser = await user.save();
      return updatedUser;
    } catch (err) {
      console.error(`Database error while authenticating user ${email} with password: ${err}`);
      throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
    }
  }

  static async create({ email, password, firstName, lastName, farmName, farmLocation, farmSize, state }) {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');
    if (!firstName) throw new Error('First name is required');
    if (!lastName) throw new Error('Last name is required');
    if (!state) throw new Error('State is required');

    // Validate state
    const validStates = ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'];
    if (!validStates.includes(state)) {
      throw new Error('Invalid state. Must be one of the southwestern Nigerian states.');
    }

    console.log('Checking if user already exists:', email);
    const existingUser = await UserService.getByEmail(email);
    if (existingUser) {
      console.log('User already exists:', email);
      throw new Error('User with this email already exists');
    }

    console.log('Generating password hash for new user:', email);
    const hash = await generatePasswordHash(password);

    try {
      const user = new User({
        email,
        password: hash,
        firstName,
        lastName,
        farmName,
        farmLocation,
        farmSize,
        state,
      });

      console.log('Saving new user to database:', email);
      await user.save();
      console.log('User successfully created:', email);
      return user;
    } catch (err) {
      console.error(`Database error while creating new user: ${err}`);
      throw new Error(`Database error while creating new user: ${err}`);
    }
  }

  static async setPassword(user, password) {
    if (!password) throw new Error('Password is required');
    user.password = await generatePasswordHash(password); // eslint-disable-line

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new Error(`Database error while setting user password: ${err}`);
    }
  }
}

module.exports = UserService;