const Igdb = require(`${__dirname}/utils/Igdb`);
const MySql = require(`${__dirname}/utils/MySql`);
const Utils = require(`${__dirname}/utils/Utils`);

const config = require(`${__dirname}/../config/config.json`);

async function scrapeData() {
    try {
        let igdb = new Igdb(config.client_id, config.client_secret);
        await igdb.getAccessToken();

        let platforms = await igdb.getPlatforms();
        await MySql.runQuery(config, MySql.getPlatformsInsertQuery(platforms));
        console.log('Platform db updated');

        let offset = 0;
        while (true) {
            let games = await igdb.getGamesPage(offset);

            if (!Array.isArray(games) || !games.length) {
                break;
            }

            await MySql.runQuery(config, MySql.getGamesInsertQuery(games));
            await MySql.runQuery(config, MySql.getGamesPlatformsInsertQuery(games));
            console.log('Games db page updated');

            offset += 100;
            Utils.sleep(500);
        }

        console.log('All games updated');
    } catch (error) {
        console.log(error);
    }
}

scrapeData();