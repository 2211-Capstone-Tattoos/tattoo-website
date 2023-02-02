const { client } = require('./client');
const bcrypt = require('bcrypt');
const { createCart } = require('./cart');
const { getOrdersByUserId } = require('./orders');
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

async function getUserByEmail(email) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE email = $1;
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
    console.log(user)
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
    await client.query(`
    DELETE FROM orders
    WHERE "userId" = $1;
    `, [id]);

    await client.query(`
    UPDATE products
    set active = false
    WHERE "artistId" = $1;
    `, [id]);

    const { rows: [deletedUser] } = await client.query(`
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
    `, [id]);
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
