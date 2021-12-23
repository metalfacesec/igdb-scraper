const Igdb = require(`${__dirname}/utils/Igdb`);
const MySql = require(`${__dirname}/utils/MySql`);

const config = require(`${__dirname}/../config/config.json`);

async function scrapeData() {
    try {
        let igdb = new Igdb(config.client_id, config.client_secret);
        await igdb.getAccessToken();

        let platforms = await igdb.getPlatforms();
        MySql.runQuery(config, MySql.getPlatformsInsertQuery(platforms));
        console.log('Platform db updated');

        let games = await igdb.getGamesPage();
        await MySql.runQuery(config, MySql.getGamesInsertQuery(games));
        await MySql.runQuery(config, MySql.getGamesPlatformsInsertQuery(games));
        console.log('Games db page updated');
    } catch (error) {
        console.log(error);
    }
}

scrapeData();