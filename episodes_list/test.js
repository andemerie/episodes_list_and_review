const expect = require('chai').expect;
const { filterEpisodes } = require('./server');

const episodes = [
  { id: 1, season: 1 },
  { id: 2, season: 1 },
  { id: 3, season: 2 },
  { id: 4, season: 3 },
  { id: 5, season: 4 },
];

describe("filterEpisodes", function() {
  it("should return 2 episodes from 1st season, when query is { season: 1 }", function() {
    const filteredEpisodes = filterEpisodes({ season: '1' }, episodes);
    expect(filteredEpisodes).to.have.lengthOf(2);

    const episodeIds = filteredEpisodes.map(({ id }) => id);
    expect(episodeIds).to.eql([1, 2]);
  });

  it("should return all episodes, when season query is not a number string", function() {
    expect(filterEpisodes({ season: 'some string' }, episodes)).to.eql(episodes);
  });

  it("should return all episodes, when there is no season query", function() {
    expect(filterEpisodes({ meow: 'meow' }, episodes)).to.have.lengthOf(episodes.length);
  });

  it("should return empty episodes when there is no episodes to filter", function() {
    expect(filterEpisodes({ season: 2 }, [])).to.eql([]);
  });
});
