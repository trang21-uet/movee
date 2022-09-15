import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BsPlay } from 'react-icons/bs';
import { API_KEY, MoviesList } from '../../components';
// import data from './data';

const getActorsEachRow = () => {
  const { innerWidth } = window;
  switch (true) {
    case innerWidth <= 1024:
      return 3;
    case 1024 < innerWidth && innerWidth <= 1170:
      return 4;
    default:
      return 6;
  }
};

export default function Movie() {
  const movieId = useLocation().search.split('=')[1];
  const [info, setInfo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const actorsEachRow = getActorsEachRow();
  const [show, setShow] = useState(false);
  const actorListRef = useRef();
  const showAllRef = useRef();

  useEffect(() => {
    const getMovieInfo = async () => {
      try {
        const request = await fetch(
          `https://imdb-api.com/en/API/Title/${API_KEY}/${movieId}/Poster,Images,Trailer`
        );
        const data = await request.json();
        if (data.errorMessage?.includes('Maximum usage'))
          alert('Cannot call API!');
        setInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMovieInfo();
  }, [movieId]);

  const handleClick = () => {
    actorListRef.current.style.maxHeight = show ? '2000px' : '0';
    showAllRef.current.innerText = show
      ? 'Show less actors'
      : 'Show all actors';
    setShow(!show);
  };

  return !info ? (
    <></>
  ) : (
    <main id='movie-screen' className='container'>
      <div className='row'>
        <div className='movie-info'>
          <img className='poster' src={info.image} alt={info.title} />
          <div className='text-info'>
            <h1 className='movie-title'>{info.title || 'Unknown'}</h1>
            <div className='other-info text-muted mv'>
              <span>{info.year || 'Unknown'}</span>
              <span>{info.contentRating || 'Unknown'}</span>
              <span>{info.runtimeStr || 'Unknown'}</span>
            </div>
            <p className='movie-plot mv'>{info.plot || 'Unknown'}</p>
            <div className='movie-crew'>
              <div className='row-info'>
                <span className='description'>Director</span>
                <span className='content text-muted'>
                  {info.directors || 'Unknown'}
                </span>
              </div>
              <div className='row-info'>
                <span className='description'>Main cast</span>
                <span className='content text-muted'>
                  {info.stars || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {info.trailer && (
          <div className='movie-videos'>
            {playing && (
              <div
                className='cover-container'
                onClick={() => setPlaying(false)}
              >
                <embed src={info.trailer.linkEmbed} type='video/webm' />
              </div>
            )}
            <h3 className='title'>Trailer</h3>
            <div className='movie-trailer' onClick={() => setPlaying(true)}>
              <img
                className='thumbnail'
                src={info.trailer.thumbnailUrl}
                alt={info.trailer.fullTitle}
              />
              <BsPlay className='play-btn' size={60} />
            </div>
          </div>
        )}
      </div>
      <ul className='actor-list-container'>
        {info.actorList.slice(0, actorsEachRow).map(element => (
          <ActorThumbnail key={element.id} {...element} />
        ))}
      </ul>
      <ul className='actor-list-container hide' ref={actorListRef}>
        {info.actorList.slice(actorsEachRow).map(element => (
          <ActorThumbnail key={element.id} {...element} />
        ))}
      </ul>
      <p
        className='show-all text-center'
        ref={showAllRef}
        onClick={handleClick}
      >
        Show all actors
      </p>

      <MoviesList title='Similars' list={info.similars} />
    </main>
  );
}

const ActorThumbnail = ({ name, asCharacter, image }) => {
  return (
    <li className='actor-container'>
      <img src={image} alt={name} className='actor-image' />

      <div className='actor-info'>
        <h3 className='actor-name'>{name}</h3>
        <h4 className='text-muted actor-character'>{asCharacter}</h4>
      </div>
    </li>
  );
};
