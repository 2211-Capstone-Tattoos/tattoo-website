const { client } = require('./client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async ({
  email,
  username,
  password,
  fullname,
  profileImg,
  location,
  isArtist = false
}) => {
  try {

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { rows: [user] } = await client.query(`
     INSERT INTO users(email, username, password, fullname, profile_img, location, is_artist)
     VALUES ( $1, $2, $3, $4, $5, $6, $7)
     RETURNING *
    `, [email, username, hashedPassword, fullname, profileImg, location, isArtist])
    return user
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getUser({username, password}) { 
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
