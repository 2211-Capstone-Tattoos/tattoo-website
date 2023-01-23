const { getProducts } = require('../db/products');
const router = require('express').Router();

// GET api/products
router.get("/", async (req, res, next) => {
    try {
        const allProducts = await getProducts();
        res.send(allProducts);
    } catch (error) {
        next(error);
    }
})

// GET api/products/:productId

// POST api/products
router.post('/', async (req, res, next) => {
	try {
			if (req.user.isArtist) {
				// try shorthand as used in patch
				const body = {
					title: req.body.title,
					description: req.body.description,
					price: req.body.price,
					img: req.body.img,
					artistId: req.user.id
				}

				const newProduct = await createProduct(body)
				console.log(newProduct)
				res.send(newProduct)
			} else {
				res.status(401)
				next({
					name: 'Unauthorized Error',
					message: 'You must be an authenticated artist to post a new product',
					error: 'Unauthorized Error'
				})
			}
	} catch (error) {
			next(error)
	}
})

// PATCH api/products/:productId
router.patch('/:productId', async (req, res, next) => {
	const productId = params.productId

	try {
		if (req.user.isArtist) {
			const product = await getProductById(productId)

			if (product.artistId === req.user.id) {
				const updatedProduct = await updateProduct({
					productId,
					req.body
				})
				res.send(updatedProduct)

			} else {
				next ({
					name: 'Unauthorized Error',
					message: 'You must own this product to edit it.',
					error: 'Unauthorized Error'
				})
			}
		} else {
			next ({
				name: 'Unauthorized Error',
				message: 'You must be an artist to edit products.',
				error: 'Unauthorized Error'
			})
		}
	} catch (error) {
		next(error)
	}
})

// DELETE api/products/:productId

//does our error handler catch this itself?
router.use("/*", (error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message
    })
})

module.exports = router;