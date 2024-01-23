const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {

    // const products = await Product.find({}) gets all products - no filter.
    const search = 'a'

    const products = await Product.find({price : {$gt: 30}}).select('name price').sort('-price') // Chaning like yii2 query builder.

    res.status(200).json({products})
}

const getAllProducts = async (req, res) => {

    const {featured, company, name, sort, fields, numericFilters } = req.query

    // done for only using objects which we want to be filtered. rest will be ignored.
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true' ? true : false;
    }   

    if(company){
        queryObject.company = company;
    }

    if(name){
        queryObject.name = {$regex: name , $options : 'i'}; // Regex from Mongo Docs
    }

    if(numericFilters){
        const operatorMap = {
            '>' : '$gt',
            '>' : '$gte',
            '<' : '$lt',
            '<=' : '$lte',
            '=' : '$eq',
        }

        const regex = /\b(<|>|<=|>=|=)\b/g
        let filters = numericFilters.replace(regex, (match) => {
            `-${operatorMap[match]}-`
        })

        const options = ['price', 'rating']
        filters = filters.split(',').array.forEach(item => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        });

    }

    let result  =  Product.find(queryObject)

    if(sort){
        const sortList = sort.split(",").join(' ');
        result = result.sort(sortList)
    }else{
        result = result.sort('createdAt')
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)  
    }

    const page = Number(req,query.page) || 1;    
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result

    console.log(req.query);
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}