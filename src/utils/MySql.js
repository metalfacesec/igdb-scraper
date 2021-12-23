const mysql = require('mysql');
const Utils = require(`${__dirname}/Utils`);

class MySql {
    static getPlatformsInsertQuery(platforms) {
        let query = "INSERT IGNORE INTO platforms (id, name) VALUES ";
        platforms.forEach(platform => {
            query += `(${platform.id}, "${platform.name}"),`;
        });

        return Utils.removeLastCharacter(query);
    }

    static runQuery(config, query) {
        return new Promise((resolve, reject) => {
            let con = mysql.createConnection({
                host: config['db_host'],
                user: config['db_username'],
                password: config['db_password'],
                database: 'igdb'
            });
            
            con.connect(function(err) {
                if (err) {
                    return reject(err);
                }
        
                con.query(query, function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    con.end();
                    resolve();
                });
            });
        });
    }
}

module.exports = MySql;