import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Loading, MovieCard } from '../../components';
import { API_KEY } from '../../components';
// import topMovies from './data';

const categories = {
  'Top 250 Movies': '/top?category=Top250Movies',
  'Top 250 TV Series': '/top?category=Top250TVs',
  'Most Popular Movies': '/top?category=MostPopularMovies',
  'Most Popular TV Series': '/top?category=MostPopularTVs',
};

export default function Best() {
  const location = useLocation();
  const category = location.search.split('=')[1];
  const [topTitles, setTopTitles] = useState([]);
  const [showing, setShowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(50);

  useEffect(() => {
    const getTopTitles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://imdb-api.com/en/API/${category}${API_KEY}`
        );
        const topMovies = await response.json();
        setTopTitles(topMovies.items);
        setShowing(topMovies.items.slice(0, quantity));
        setLoading(false);
      } catch (error) {}
    };

    getTopTitles();
  }, [category, quantity]);

  useEffect(() => {
    setShowing(topTitles.slice(0, quantity));
  }, [topTitles, quantity]);

  const getTitle = () => {
    switch (category) {
      case 'Top250Movies':
        return 'Top Rated Movies';
      case 'Top250TVs':
        return 'Top Rated TV Series';
      case 'MostPopularMovies':
        return 'Most Popular Movies';
      case 'MostPopularTVs':
        return 'Most Popular TV Series';
      default:
        return 'Top Movies';
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className='container' id='best'>
      <main className='main'>
        <h1 className='title'>{getTitle()}</h1>
        <div className='list-label mv'>
          <span className='index'>Rank</span>
          <span className='movie-title'>Title</span>
          <span className='rating'>IMDB Rating</span>
        </div>
        <ul className='top-movies'>
          {showing.map(element => (
            <MovieCard key={element.id} {...element} />
          ))}
        </ul>
      </main>
      <aside className='filter'>
        <h1 className='title mv'>Filter</h1>
        <div className='quantity-options'>
          <span className='label'>Numbers of results:</span>
          <select
            name='quantity'
            id='movies-quantity'
            value={quantity}
            onChange={event => setQuantity(event.target.value)}
          >
            <option value={50} defaultChecked>
              50
            </option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
            <option value={250}>250</option>
          </select>
        </div>
        <ul className='categories-list'>
          <h1 className='title mv'>Other Categories</h1>
          {Object.keys(categories).map((key, index) => (
            <li key={index} className='category-item'>
              <NavLink
                to={categories[key]}
                className={() =>
                  'category ' +
                  (categories[key] === location.pathname + location.search
                    ? 'active'
                    : '')
                }
              >
                {key}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
