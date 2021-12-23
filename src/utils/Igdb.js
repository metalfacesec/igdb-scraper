const axios = require('axios');
const Utils = require(`${__dirname}/Utils`);

class Igdb {
    constructor(clientId, clientSecret) {
        this.accessToken = null;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    async getAccessToken() {
        let url = `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`;
    
        let response = await axios.post(url);
    
        if (typeof response.data !== 'object' || typeof response.data.access_token !== 'string' || !response.data.access_token.length) {
            throw 'Unable to fetch access token';
        }
    
        this.accessToken = response.data.access_token;
    }

    getAuthHeaders() {
        return{
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'text/plain'
        };
    }

    async getPlatforms() {
        let offset = 0;
        let allPlatforms = [];
        let url = 'https://api.igdb.com/v4/platforms';

        while (true) {
            let response = await axios.post(url, `fields *; limit 100; offset ${offset};`, { headers: this.getAuthHeaders() });
            if (!Array.isArray(response.data) || !response.data.length) {
                break;
            }

            allPlatforms = allPlatforms.concat(response.data);

            offset += 100;
            await Utils.sleep(500);
        }

        return allPlatforms;
    }

    async getGamesPage(offset=0) {
        let url = 'https://api.igdb.com/v4/games';

        let response = await axios.post(url, `fields *; limit 100; offset ${offset};`, { headers: this.getAuthHeaders() });
        if (!Array.isArray(response.data) || !response.data.length) {
            return false;
        }

        return response.data;
    }
}

module.exports = Igdb;