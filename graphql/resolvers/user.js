const User = require('../../Models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const { UserInputError } = require('apollo-server');

module.exports = {
  Mutation: {
    async register(parent, { registerInput: { username, password, confirmPassword, email } }) {
      try {
        if (!username || !email) {
          return new UserInputError('Fields cant be empty', {
            errors: {
              username: 'Fields cant be empty',
              email: 'Fields cant be empty',
            },
          });
        }

        if (password !== confirmPassword) {
          return new UserInputError('Password Dont match', {
            errors: {
              password: 'Password Dont match ',
              confirmPassword: 'Password Dont match ',
            },
          });
        }

        let user = await User.findOne({ username });

        if (user) {
          return new UserInputError('User Already Exists', {
            errors: {
              username: 'User Already Registered',
            },
          });
        }

        password = await bcryptjs.hash(password, 12);

        let newUser = new User({
          username,
          email,
          password,
        });

        const res = await newUser.save();

        const token = await jwt.sign(
          {
            id: res.id,
            username: res.username,
            email: res.email,
          },
          '23123dc',
          { expiresIn: '1h' },
        );

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      } catch (error) {
        return new UserInputError('Error while Registering', {
          errors: {
            error: 'Error while Registering',
          },
        });
      }
    },
    async login(parent, { username, password }) {
      try {
        if (!username || !password) {
          return new UserInputError('Fields cant be empty', {
            errors: {
              username: 'Fields cant be empty',
              password: 'Fields cant be empty',
            },
          });
        }

        const user = await User.findOne({ username });

        if (!user) {
          return new UserInputError('Wrong Credentials', {
            errors: {
              general: 'Wrong Credentials',
            },
          });
        }

        const match = await bcryptjs.compare(password, user.password);

        if (!match) {
          return new UserInputError('Wrong Credentials', {
            errors: {
              general: 'Wrong Credentials',
            },
          });
        }

        const token = await jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          '23123dc',
          { expiresIn: '1h' },
        );

        return {
          ...user._doc,
          id: user._id,
          token,
        };
      } catch (error) {
        return new UserInputError('Error while Login', {
          errors: {
            error: 'Error while Login',
          },
        });
      }
    },
  },
};
