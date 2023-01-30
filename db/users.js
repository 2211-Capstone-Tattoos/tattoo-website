const { client } = require('./client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createCart } = require('./cart');
const saltRounds = 10;

const createUser = async (fields) => {
  const { password } = fields
  delete fields.id
  const keys = Object.keys(fields)
  const insertString = keys.map((key, index) => {
    if (key === 'profileImg') return 'profile_img'
    if (key === 'isArtist') return 'is_artist'
    return key
  }).join(', ')

  const setString = keys.map((key, index) => {
    return `$${index + 1}`
  }).join(', ')

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      fields.password = hashedPassword
    }
    const { rows: [user] } = await client.query(`
     INSERT INTO users(${insertString})
     VALUES (${setString})
     RETURNING *
    `, Object.values(fields))

    const cart = await createCart(user.id)
    return user
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getUser({ username, password }) {
  if (!username || !password) {
    return;
  }
  try {
    const user = await getUserByUsername(username);

    if (password === user.password) {
      delete user.password;
      return user
    }
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE id = ${userId};
    `);

    delete user.password;

    return user;
  } catch (error) {
    throw error
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE username = $1;
    `, [username]);

    return user;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
