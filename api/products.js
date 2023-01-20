const { getProducts } = require('../db/products');
const router = require('express').Router();


router.get("/", async (req, res, next) => {
    try {
        const allProducts = await getProducts();
        res.send(allProducts);
    } catch (error) {
        next(error);
    }
})

router.use("/*", (error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message
    })
})

module.exports = router;