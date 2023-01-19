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
  isArtist
}) => {
  try {
    const { rows: [user] } = await client.query(`
     INSERT INTO users(email, username, password, fullname, profile_img, location, is_artist)
     VALUES ( $1, $2, $3, $4, $5, $6, $7)
     RETURNING *
    `, [email, username, password, fullname, profileImg, location, isArtist])
    return user
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getUser() { }

async function getUserById() { }

async function getUserByUsername() { }

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
