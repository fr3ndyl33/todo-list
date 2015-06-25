var mysql  = require('mysql'),
    pool   = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "todolist",
        connectionLimit: 10,
        supportBigNumbers: true
    });

exports.GetLists = function (count, callback) {
    var query = "SELECT * FROM list where list.deleted_at IS NULL ORDER BY list.created_at ASC LIMIT ?;",
        count = count || 10;

    queryDatabase(query, [count], callback);
};

exports.GetLatestLists = function (count, callback) {
    var query = "SELECT * FROM list where list.deleted_at IS NULL AND list.done_at IS NULL ORDER BY list.created_at DESC LIMIT 1;";        
    count = count || 1;

    queryDatabase(query, [count], callback);
};

exports.CreateNewList = function (topic, callback) {
    var query = "INSERT INTO list(`topic`, `created_at`) " +
                "VALUES (?, NOW());";

    queryDatabase(query, [topic], callback);
};

exports.DoneList = function (id, callback) {
    var query = "UPDATE list SET `done_at` = NOW() WHERE `id` = ? ;";

    queryDatabase(query, [id], callback);
};

exports.DeleteList = function (id, callback) {
    var query = "UPDATE list SET `deleted_at` = NOW() WHERE `id` = ? ;";

    queryDatabase(query, [id], callback);
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
