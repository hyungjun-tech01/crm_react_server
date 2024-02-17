const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    host: process.env.MYHOST,
    user: process.env.MYUSERNAME,
    port: process.env.MYDBPORT,
    password: process.env.MYPASSWORD,
    database: process.env.MYDATABASE
})
module.exports = pool;