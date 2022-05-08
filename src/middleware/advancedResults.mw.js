const advancedResults = (model, populate) => async (req, res, next) => {

    let query;

    // copy request query
    const reqQuery = { ...req.query };

    // fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']; // fields to exclude before being saved to DB

    // loop over removeFields and delete them from request query
    removeFields.forEach((a) => delete reqQuery[a]);

    // create query string
    let queryStr = JSON.stringify(reqQuery);

    // create operators
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    // find the resource
    query = model.find(JSON.parse(queryStr));

     // select fields
     if (req.query.select) {
        const fields = req.query.select.split(',').join(' '); // .split always return an array while .join will return it to a string
        query = query.select(fields);
    }

    // sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else {
        query = query.sort('-createdAt');
    }

    // pagination
    const page = parseInt(req.query.ppage, 10) || 1; // parseInt changes anything to number, base 10
    const limit = parseInt(req.query.limit, 10) || 50; // if the limit is not passed to 10, set to 50 by default.
    const startIndex = (page - 1) * limit; //
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // populate
    if(populate) {
        query = query.populate(populate);
    }

    // execute query
    const results = await query;

    // pagination result
    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit,
        };
    }

    res.advancedResults = {
        error: false,
        errors: [],
        status: 200,
        message: 'Fetched resource successfully',
        count: results.length,
        data: results,
        pagination: pagination,
        status: 200
    }

    next();
    
}

module.exports = advancedResults;