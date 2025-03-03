var pool = require('./dbConnection');

async function postNewMatch(props, res) {
    try {
        var query = 'INSERT INTO he_matches (creator_id, match_title, match_type, match_size, schedule) VALUES (?, ?, ?, ?, ?)';
        var results = await pool.query(query, [props.creatorId, props.title, props.type, props.size, props.schedule]);
        res.status(201).json({ success: 'success', matchId: results.insertId });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { postNewMatch }