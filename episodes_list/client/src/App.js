import React, { Component } from 'react';

import * as api from './api';
import 'bulma/css/bulma.css';
import './App.css'

class App extends Component {
  state = {
    episodes: [],
    seasons: [],
    seasonFilter: '',
    titleFilter: '',
    error: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async (season) => {
    const url = `/api/episodes${season ? `?season=${season}` : ''}`;
    api.get(url)
      .then(({ episodes, seasons }) => this.setState({ episodes, seasons, error: false }))
      .catch(error => {
        this.setState({ error: error.message })
      });
  };

  onFilterSeason = ({ target }) => {
    const { value } = target;
    this.setState({ seasonFilter: value }, () => {
      this.fetchData(value);
    });
  };

  onFilterTitle = ({ target }) => {
    this.setState({ titleFilter: target.value });
  };

  render() {
    const { episodes, seasons, seasonFilter, titleFilter, error } = this.state;

    const selectOptions = [
      { value: '', label: 'All seasons'},
      ...seasons.map(value => ({ value, label: `${value} season`}))
    ];

    const filteredEpisodes = episodes.filter(({ name }) => name.toLowerCase().includes(titleFilter.toLowerCase()));

    return (
      <div>
        <section className="hero is-light">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Silicon Valley Episodes List App
              </h1>
            </div>
          </div>
        </section>

        {!error && (
          <div className="container workarea">
            <div className="filters">
              <div className="select">
                <select className="season-select" value={seasonFilter} onChange={this.onFilterSeason}>
                  {selectOptions.map(({ value, label }) => <option value={value} key={label}>{label}</option>)}
                </select>
              </div>

              <div className="field title-filter">
                <div className="control">
                  <input
                    className="input title-input"
                    type="text"
                    placeholder="Filter by Title"
                    value={titleFilter}
                    onChange={this.onFilterTitle}
                  />
                </div>
              </div>
            </div>

            <div className="container">
              {!filteredEpisodes.length && (
                <h5 className="title is-5 no-episodes">No episodes found</h5>
              )}
              {!!filteredEpisodes.length && (
                <table className="table episodes-table">
                  <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                  </tr>
                  </thead>
                  <tbody>
                    {
                      filteredEpisodes
                        .map(({ id, image, name }) => (
                          <tr key={id}>
                            <td>
                              <figure className="image">
                                <img src={image.medium} alt={name} />
                              </figure>
                            </td>
                            <td>{name}</td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {error && (
          <div className="container workarea">
            <h5 className="title is-5 some-error">{error}</h5>
          </div>
        )}
      </div>
    );
  }
}

export default App;
