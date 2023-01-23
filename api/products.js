const {
	getProducts,
	updateProduct,
	getProductById,
	createProduct,
	removeProduct
} = require('../db/products');
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
router.get('/:productId', async (req, res, next) => {
	try {
		const product = await getProductById(req.params.productId)

		if (product) {
			res.send(product)
		} else {
			res.status(404)
			next({
				name: 'ProductNotFoundError',
				message: `Product: ${req.params.productId} does not exist`,
				error: 'ProductNotFoundError'
			})
		}
	} catch (error) {
		next(error)
	}
})

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
				name: 'UnauthorizedError',
				message: 'You must be an authenticated artist to post a new product',
				error: 'UnauthorizedError'
			})
		}
	} catch (error) {
		next(error)
	}
})

// PATCH api/products/:productId
router.patch('/:productId', async (req, res, next) => {
	const productId = req.params.productId

	try {
		if (req.user.isArtist) {
			const product = await getProductById(productId)
			if (!product) {
				res.status(404)
				next({
					name: 'ProductNotFoundError',
					message: `Product: ${req.params.productId} does not exist`,
					error: 'ProductNotFoundError'
				})
			}

			if (product.artistId === req.user.id) {
				const updatedProduct = await updateProduct({
					productId,
					...req.body
				})
				res.send(updatedProduct)

			} else {
				next({
					name: 'UnauthorizedError',
					message: 'You must own this product to edit it.',
					error: 'UnauthorizedError'
				})
			}
		} else {
			next({
				name: 'UnauthorizedError',
				message: 'You must be an artist to edit products.',
				error: 'UnauthorizedError'
			})
		}
	} catch (error) {
		next(error)
	}
})

// DELETE api/products/:productId
router.delete('/:productId', async (req, res, next) => {
	const productId = req.params.productId

	try {
		if (req.user.isArtist) {
			const product = await getProductById(productId)
			if (!product) {
				res.status(404)
				next({
					name: 'ProductNotFoundError',
					message: `Product: ${req.params.productId} does not exist`,
					error: 'ProductNotFoundError'
				})
			}

			if (product.artistId === req.user.id) {
				const deletedProduct = await removeProduct(productId)
				res.send(deletedProduct)

			} else {
				next({
					name: 'UnauthorizedError',
					message: 'You must own this product to delete it.',
					error: 'UnauthorizedError'
				})
			}
		} else {
			next({
				name: 'UnauthorizedError',
				message: 'You must be an artist to delete products.',
				error: 'UnauthorizedError'
			})
		}
	} catch (error) {
		next(error)
	}
})

//does our error handler catch this itself?
router.use("/*", (error, req, res, next) => {
	res.send({
		name: error.name,
		message: error.message
	})
})

module.exports = router;