const { client } = require("./client")
const { getProductsByUser } = require("./products")
const { getUserById } = require("./users")

async function getAllArtists () {
  try {
    const { rows: artists } = await client.query(`
      SELECT * FROM users
      WHERE users.is_artist = true;
    `)

    return artists
  } catch (error) {
    throw error
  }
}

async function getArtistById (artistId) {
  try {
    const artist = await getUserById(artistId)
    if (artist.is_artist) {
      delete artist.password
      artist.products = await getProductsByUser(artist.username)
      console.log(artist)
      res.send(artist)
    } else {
      throw new Error(`User: ${artist.username} is not an artist`)
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllArtists,
  getArtistById
}