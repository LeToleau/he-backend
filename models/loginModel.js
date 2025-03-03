var pool = require('./dbConnection');
const bcrypt = require('bcryptjs');
var md5 = require('md5');

async function getPublicUser(email, password) {
    try {
        var query = 'SELECT email, password FROM he_public_users WHERE email = ? LIMIT 1';
        var rows = await pool.query(query, [email]);

        if (rows.length > 0) {
            try {
                const storedPassword = rows[0].password;
                const passwordMatch = await bcrypt.compareSync(password, storedPassword);
                if (passwordMatch) {
                    return rows[0];
                }
                
            } catch (error) {
                console.log(error)
            }
            
        }
        return null;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getPublicUser }