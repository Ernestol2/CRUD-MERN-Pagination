const router = require('express').Router()
const { faker } = require('@faker-js/faker')
const Product = require('../models/product')
 
router.get('/', (req, res) => {
    res.render('index')
})

router.get('/add-product', (req, res) => {
    res.render('main/add-product')
})

router.get('/all-products', async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message })
    }
})

router.post('/add-product', (req, res) => {
    
     try {
        const product = new Product({
            category: req.body.category, 
            name: req.body.name,
            price: req.body.price,
            cover: faker.image.urlPicsumPhotos()
        })
    
        product.save()
        res.status(201).json(product)
    } catch (error) {
        console.log(error);
    } 
})

router.get('/generate-fake-data', (req, res, next) => {
    try {
        for (var i = 0; i < 90; i++) {
            const product = new Product()
    
            product.category = faker.commerce.department()
            product.name = faker.commerce.productName()
            product.price = faker.commerce.price()
            product.cover = faker.image.urlPicsumPhotos()
    
            product.save()
        }
        res.redirect('/add-product')
    } catch (error) {
        console.log(error);
    }
})

router.get('/products/:page', async (req, res, next) => {
    const perPage = 8;
    const page = req.params.page || 1;

    try {
        const products = await Product.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();

        const count = await Product.countDocuments().exec();

        res.status(200).json({
            products: products,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/product/:id', async (req, res, next) => {
    let id = req.params.id
    try {
        const product = await Product.findById(id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json("No product found.")  
    }
} )

router.delete('/products/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndRemove(productId)
        if(!deletedProduct) {
            return res.status(404).json({message: 'product not found'})
        }
        res.status(200).json(deletedProduct)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'error on server'})
    }
})

router.put('/update/product/:id', async (req, res, next) => {
    const productId = req.params.id;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Validate the updated fields against the schema
        });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
});


module.exports = router