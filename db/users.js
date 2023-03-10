const { client } = require('./client');
const bcrypt = require('bcrypt');
const { createCart } = require('./cart');
const { getOrdersByUserId } = require('./orders');
const saltRounds = 10;

const createUser = async (fields) => {
  debugger
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

    if (!fields) {
      const { rows: [user] } = await client.query(`
     INSERT INTO users DEFAULT VALUES
     RETURNING *
     `)
      const cart = await createCart(user.id)
      return user
    } else {
      const { rows: [user] } = await client.query(`
     INSERT INTO users(${insertString})
     VALUES (${setString})
     ON CONFLICT DO NOTHING
     RETURNING *
    `, Object.values(fields))
      if (!user && fields.email) {
        const { rows: [user] } = await client.query(`
      SELECT * FROM users
      WHERE email = $1
      `, [fields.email])
        return user
      } else {
        const cart = await createCart(user.id)
        return user
      }
    }
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
    if (user) {
      delete user.password;
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE LOWER(username) = $1;
    `, [username.toLowerCase()]);

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByEmail(email) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE LOWER(email) = $1;
    `, [email]);

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function updateUser(userId, fields) {
  const keys = Object.keys(fields)
  const { password } = fields
  if (password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    fields.password = hashedPassword
  }
  const setString = keys.map((key, index) => {
    return `"${key}" = $${index + 1}`
  }).join(', ')


  try {
    const { rows: [user] } = await client.query(`
    UPDATE users
    SET ${setString}
    WHERE id = ${userId}
    RETURNING *
    `, Object.values(fields))
    delete user.password
    return user
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsers() {
  try {
    const { rows: userIds } = await client.query(`
    SELECT id FROM users
    `)

    const users = await Promise.all(userIds.map(
      user => getUserById(user.id)
    ))

    return users
  } catch (error) {
    throw error
  }
}

// this doesn't work still
async function deleteUser(id) {
  try {
    const deletedUser = await client.query(`
    UPDATE users
    SET deleted = true,
        username = null,
        password = null,
        fullname = null,
        profile_img = null,
        location = null,
        is_artist = false
    WHERE id = ${id}
    RETURNING *
    `)
    const userProducts = await client.query(`
    UPDATE products
    SET is_active = false,
    "artistId" = 1
    WHERE "artistId" = ${id}
    `)
    return deletedUser
  } catch (error) {
    console.error("error deleting user", error)
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  updateUser,
  getUserByEmail,
  getAllUsers,
  deleteUser
};
