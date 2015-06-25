var mysql  = require('mysql'),
    pool   = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "todolist",
        connectionLimit: 10,
        supportBigNumbers: true
    });

exports.CheckUserExists = function (username, callback) {
    var query = "SELECT * FROM users u WHERE u.username = ?;";
    
    queryDatabase(query, [username], callback);
};

exports.GetLists = function (count, callback) {
    var query = "SELECT * FROM list where list.deleted_at = NULL ORDER BY list.created_at DESC LIMIT ?;",
        count = count || 10;

    queryDatabase(query, [count], callback);
};

exports.CreateNewList = function (topic, callback) {
    var query = "INSERT INTO list(`topic`, `created_at`) " +
                "VALUES (?, NOW());";

    queryDatabase(query, [topic], callback);
};

function queryDatabase(query, data, callback) {
    pool.getConnection(function (poolErr, connection) {
        if (poolErr) {
            console.log(poolErr);
            callback(poolErr);
            return;
        }

        connection.query(query, data, function (connErr, results) {
            connection.release();
            if (connErr) {
                console.log(connErr);
                callback(connErr);
                return;
            }

            callback(false, results);
        });
    });
};
