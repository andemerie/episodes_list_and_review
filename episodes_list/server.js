const express = require('express');
const fs = require('fs');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 5000;

const filterEpisodes = (query, episodes) => {
  const season = +query.season;
  if (!season) {
    return episodes;
  }
  return episodes.filter(episode => episode.season === season);
};

app.get('/api/episodes', (request, response) => {
  fs.readFile('episodes.json', 'utf-8', (error, jsonData) => {
    if (error) {
      throw error;
    }

    const path = '_embedded.episodes';
    const data = JSON.parse(jsonData);
    let episodes = _.get(data, path);

    const seasonsSet = new Set();
    episodes.forEach(({ season }) => {
      seasonsSet.add(season);
    });

    const seasons = [...seasonsSet];
    seasons.sort();

    const filteredEpisodes = filterEpisodes(request.query, episodes);

    response.send({ episodes: filteredEpisodes, seasons });
  });
});

app.listen(port, () => console.log(`episodes-list app listening on port ${port}`));

module.exports = { filterEpisodes };
