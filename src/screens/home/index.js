import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_KEY, API_KEY_2, Loading, MoviesList } from '../../components';
// import items from './data';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVs, setPopularTVs] = useState([]);
  const [theater, setTheater] = useState([]);
  const [random, setRandom] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesRequest = await fetch(
          `https://imdb-api.com/en/API/MostPopularMovies/${API_KEY_2}`
        );
        const tvRequest = await fetch(
          `https://imdb-api.com/en/API/MostPopularTVs/${API_KEY_2}`
        );
        const theaterRequest = await fetch(
          `https://imdb-api.com/en/API/InTheaters/${API_KEY_2}`
        );
        const movies = await moviesRequest.json();
        const tvs = await tvRequest.json();
        const theater = await theaterRequest.json();

        setPopularMovies(movies.items);
        setPopularTVs(tvs.items);
        setTheater(theater.items);

        const all = [...movies.items, ...tvs.items, ...theater.items];
        setRandom(all[Math.floor(Math.random() * all.length)]);
        setLoading(false);
      } catch (error) {
        console.info(error);
      }
    };

    getMovies();
    // setRandom(items[Math.floor(Math.random() * items.length)]);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <main className='container'>
      {random && <Banner title={random} />}
      <MoviesList
        title='Popular Movies'
        // list={items}
        list={popularMovies}
      />
      <MoviesList
        title='Popular TV Series'
        // list={items}
        list={popularTVs}
      />
      <MoviesList
        title='Now In Theaters'
        // list={items}
        list={theater}
      />
    </main>
  );
};

const Banner = ({ title }) => {
  const [poster, setPoster] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPoster = async () => {
      try {
        const request = await fetch(
          `https://imdb-api.com/en/API/Posters/${API_KEY_2}/${title.id}`
        );
        const data = await request.json();
        // console.log(data);
        setPoster(data.items[0]);
      } catch (error) {
        console.log(error);
      }
    };

    getPoster();
  }, [title]);

  return (
    <div
      className='home-banner'
      onClick={() => navigate(`movie?id=${title.id}`)}
    >
      <img src={poster || title.image} alt={title.title} />
      <span className='banner-title'>{title.title}</span>
    </div>
  );
};

export default Home;
