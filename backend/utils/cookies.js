const asyncWrapper = require('../middleware/async.wrapper');
const cookies = require('cookie-parser');

const cookieAdd = async (res , name , value , options = {}) => {
        res.cookie(name , value , {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000,
            ...options
        })
    };


module.exports = cookieAdd;