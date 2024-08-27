var pool = require('./dbConnection');
var md5 = require('md5');

async function getUser(user, password) {
    try {
        var query = 'select * from he_admin_users where username = ? and password = ? limit 1';
        var rows = await pool.query(query, [user, md5(password)]);
        return rows[0]
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getUser }