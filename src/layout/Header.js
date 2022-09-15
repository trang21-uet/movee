import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GoThreeBars, GoX } from 'react-icons/go';
import { API_KEY } from '../components';

function useClickOutside(ref, handler) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

const Header = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef();
  const hiddenMenuRef = useRef();
  useClickOutside(searchRef, () => setShowSearchResults(false));

  useEffect(() => {
    const controller = new AbortController();
    const search = async () => {
      const url = `https://imdb-api.com/en/API/Search/${API_KEY}/`;
      if (query) {
        try {
          const request = await fetch(url + query, {
            method: 'GET',
            signal: controller.signal,
          });
          const data = await request.json();
          setSearchResults(data.results);
        } catch (error) {
          console.info(error);
        }
      }
    };
    search();
  }, [query]);

  const handleSubmit = event => {
    event.preventDefault();
    setShowSearchResults(false);
    navigate(`/search?query=${query}`);
  };

  const toggleNav = () => hiddenMenuRef.current.classList.toggle('show');

  return (
    <header className='header'>
      <a href='/' className='navbar-brand'>
        Movee
      </a>
      <form className='search-box' onSubmit={handleSubmit}>
        <div className='search-area' ref={searchRef}>
          <input
            type='text'
            className='form-control'
            name='query'
            value={query}
            placeholder='Search'
            autoComplete='off'
            onChange={e => setQuery(e.currentTarget.value)}
            onFocus={() => setShowSearchResults(true)}
          />
          {query && showSearchResults && (
            <SearchResultsModal
              query={query}
              results={searchResults}
              setShow={setShowSearchResults}
            />
          )}
        </div>
      </form>
      <div className='navmenu'>
        <ul className='navbar-nav'>
          <li className='nav-item mh'>
            <NavLink to='/' className='nav-link'>
              Home
            </NavLink>
          </li>
          <li className='nav-item mh'>
            <NavLink to='/top?category=Top250Movies' className='nav-link'>
              Top
            </NavLink>
          </li>
          <li className='nav-item mh'>
            <NavLink to='/top?category=MostPopularMovies' className='nav-link'>
              Popular
            </NavLink>
          </li>
        </ul>
        <button className='menu-toggler hide' onClick={() => toggleNav()}>
          <GoThreeBars size={30} />
        </button>
        <div className='hide'>
          {toggleNav && (
            <div className='nav-container' ref={hiddenMenuRef}>
              <button className='menu-toggler'>
                <GoX size={30} onClick={() => toggleNav()} />
              </button>
              <ul className='navbar-nav'>
                <li className='nav-item mv'>
                  <NavLink onClick={toggleNav} to='/' className='nav-link'>
                    Home
                  </NavLink>
                </li>
                <li className='nav-item mv'>
                  <NavLink
                    onClick={toggleNav}
                    to='/top?category=Top250Movies'
                    className='nav-link'
                  >
                    Top 250 Movies
                  </NavLink>
                </li>
                <li className='nav-item mv'>
                  <NavLink
                    onClick={toggleNav}
                    to='/top?category=Top250TVs'
                    className='nav-link'
                  >
                    Top 250 TV Series
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const SearchResultsModal = ({ results, setShow }) => {
  const data = results.length < 5 ? results : results.slice(0, 5);

  return (
    <ul className='search-result'>
      {results.length === 0 ? (
        <p className='pv text-center'>No thing found!</p>
      ) : (
        data.map(result => (
          <SearchItem key={result.id} {...result} setShow={setShow} />
        ))
      )}
    </ul>
  );
};

const SearchItem = ({ id, description, image, title, setShow }) => {
  const navigate = useNavigate();
  return (
    <li
      className='search-item'
      onClick={() => {
        navigate(`movie?id=${id}`);
        setShow(false);
      }}
    >
      <img src={image} alt={title} />
      <div className='search-item-info mh'>
        <h3 className='title'>{title}</h3>
        <p className='description'>{description}</p>
      </div>
    </li>
  );
};

export default Header;
