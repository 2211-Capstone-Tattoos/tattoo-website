const { client } = require("./client")
const { getProductsByUser } = require("./products")
const { getUserById } = require("./users")

//Add getAllArtists without products?

async function getAllArtists() {
  try {
    const { rows: artistIds } = await client.query(`
      SELECT id FROM users
      WHERE users.is_artist = true;
    `)

    const artists = await Promise.all(artistIds.map(
      artist => getArtistById(artist.id)
    ))
    return artists
  } catch (error) {
    throw error
  }
}

async function getArtistById(artistId) {
  try {
    const artist = await getUserById(artistId)
    if (artist.is_artist) {
      delete artist.password
      artist.products = await getProductsByUser(artist.id)
      return artist
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