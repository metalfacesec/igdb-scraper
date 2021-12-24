const mysql = require('mysql');
const Utils = require(`${__dirname}/Utils`);

class MySql {
    static getPlatformsInsertQuery(platforms) {
        let query = "INSERT IGNORE INTO platforms (id, name) VALUES ";
        platforms.forEach(platform => {
            query += `(${platform.id}, "${escape(platform.name)}"),`;
        });

        return Utils.removeLastCharacter(query);
    }

    static getGamesInsertQuery(games) {
        let query = "INSERT IGNORE INTO games (id, name, summary) VALUES ";
        games.forEach(game => {
            query += `(${game.id}, "${escape(game.name)}", "${typeof game.summary === 'string' ? escape(game.summary.replace('\n', ' ')) : ''}"),`;
        });

        return Utils.removeLastCharacter(query);
    }

    static getGamesPlatformsInsertQuery(games) {
        let query = "INSERT IGNORE INTO game_platforms (gameId, platformId) VALUES ";
        games.forEach(game => {
            if (!Array.isArray(game.platforms) || !game.platforms.length) {
                return;
            }
            game.platforms.forEach(platform => {
                query += `(${game.id}, ${platform}),`;
            });
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