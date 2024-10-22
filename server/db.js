const {Pool} = require('pg')
require('dotenv').config()

const pool  = new Pool({

    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DBPORT}/${process.env.DBNAME}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

module.exports = pool