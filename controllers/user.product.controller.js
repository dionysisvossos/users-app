const User = require('../models/user.model');

exports.findAll = async (req, res) => {
    console.log('Find All products from collection users');
    try {
        const result = await User.find({},{username: 1, products: 1, _id: 0});
        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log('Problem in finding products from all users', err.message);
        res.status(400).json({ status: false, data: err.message });
    }
}

exports.findOne = async (req, res) => {
    console.log('Find products from specific user');
    const username = req.params.username;
    try {
        const result = await User.findOne({username: username}, {username: 1, products: 1, _id: 0});
        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log('Problem in finding user product', err.message);
        res.status(400).json({ status: false, data: err.message });
    }
}

exports.create = async (req, res) => {
    console.log('Insert product in collection users');
    const username = req.body.username;
    const products = req.body.products;

    try {
        const result = await User.updateOne(
            { username: username },
            { $push: { products: products } },
        );
        res.status(200).json({ status: true, data: result });
    }
    catch (err) {
        console.log('Problem in inserting product', err.message);
        res.status(400).json({ status: false, data: err.message });
    }
}

exports.update = async (req, res) => {

    const username = req.body.username;
    const productId = req.body.product._id;
    const product_quantity = req.body.product.quantity;

    console.log('Update product for usename', username);

    try {
        const result = await User.updateOne(
            { username: username, 'products._id': productId },
            { $set: { 'products.$.quantity': product_quantity}},
        );
        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log('Problem in updating product', err.message);
        res.status(400).json({ status: false, data: err.message });
    }
}

exports.delete = async (req, res) => {
    
    const username = req.params.username;
    const product_id = req.params.id;

    console.log('Delete product from user:', username);

    try {
        const result = await User.updateOne(
            { username: username },
            { $pull: { products: { _id: product_id } } },
        );
        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log('Problem in deleting product', err.message);
        res.status(400).json({ status: false, data: err.message });
    }
}

exports.stats1 = async (req, res) => {
    console.log('For each user return total amount and number of products');
    
    try {
        const result = await User.aggregate([
            { $unwind: '$products' },
            {
                $project: {
                _id: 1,
                username: 1,
                products: 1
                },
            },
            {
                $group: {
                    _id: {username: '$username', product: '$products.product'}, 
                    totalAmount: { $sum: { $multiply: ['$products.cost', '$products.quantity'] } 
                    },
                count: { $sum: 1 },
                }
            },
            {$sort: {'_id.username': 1, '_id.product': 1}},
        ]);
        res.status(200).json({ status: true, data: result });
    } catch (err) {
        console.log('Problem in getting stats', err.message);
        res.status(400).json({ status: false, data: err.message });
    }
}
