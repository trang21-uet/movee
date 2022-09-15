import React, { createRef, forwardRef, useState } from 'react';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const getMoviesEachScroll = () => {
  const { innerWidth } = window;
  switch (true) {
    case innerWidth <= 1024:
      return 2;
    case 1024 < innerWidth && innerWidth <= 1170:
      return 4;
    default:
      return 6;
  }
};

const MoviesList = ({ title, list }) => {
  const moviesEachScroll = getMoviesEachScroll();
  const [showing, setShowing] = useState({
    start: 0,
    end: moviesEachScroll - 1,
  });
  const listRef = createRef();
  const movieCount = list.length < 24 ? list.length : 24;

  const slideToNext = () => {
    if (showing.start < movieCount - moviesEachScroll) {
      listRef.current.scrollLeft += listRef.current.clientWidth;
      setShowing({
        start: showing.end + 1,
        end: showing.end + moviesEachScroll,
      });
    }
  };

  const slideToPrev = () => {
    if (showing.start > moviesEachScroll - 1) {
      listRef.current.scrollLeft -= listRef.current.clientWidth;
      setShowing({
        start: showing.start - moviesEachScroll,
        end: showing.start - 1,
      });
    }
  };

  return (
    <div className='movies-list-container'>
      <h1 className='list-title'>{title}</h1>
      {list && (
        <div className='list-row'>
          <button className='navigator' onClick={slideToPrev}>
            <AiOutlineLeft size={30} />
          </button>
          <ul className='movies-list' ref={listRef}>
            {list.slice(0, movieCount).map(movie => (
              <MovieThumbnail key={movie.id} {...movie} />
            ))}
          </ul>
          <button className='navigator' onClick={slideToNext}>
            <AiOutlineRight size={30} />
          </button>
        </div>
      )}
    </div>
  );
};

const MovieThumbnail = forwardRef(({ id, title, image }, ref) => {
  const navigate = useNavigate();
  return (
    <li
      ref={ref}
      className='movie-container'
      onClick={() => navigate(`/movie?id=${id}`)}
    >
      <img className='movie-poster' src={image} alt={title} />
      <div className='title-container'>
        <h3 className='movie-title'>{title}</h3>
      </div>
    </li>
  );
});

export default MoviesList;
