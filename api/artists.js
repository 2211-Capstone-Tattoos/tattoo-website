const { getAllArtists, getArtistById } = require('../db/artists')

const router = require('express').Router()

// GET /api/artists
router.get('/', async (req, res, next) => {
  try {
    res.send(await getAllArtists())
  } catch (error) {
    next(error)
  }
})

// GET /api/artists/:artistId
router.get('/:artistId', async (req, res, next) => {
  try {
    const artist = await getArtistById(req.params.artistId)
    if (artist) {
      if (artist.id === req.user?.id) {
        artist.isOwner = true
        res.send(artist)
      } else {
        res.send(artist)
      }
    } else {
      res.status(404)
      next({
        name: 'ArtistNotFoundError',
        message: `Unable to locate an artist with id: ${req.params.artistId}`,
        error: 'ArtistNotFoundError'
      })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router