import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';

export default function MovieCard({
  id,
  rank,
  image,
  fullTitle,
  crew,
  imDbRating,
  index,
}) {
  const navigate = useNavigate();
  return (
    <li className='movie-card pv' onClick={() => navigate(`/movie?id=${id}`)}>
      <h1 className='index'>{rank || index}</h1>
      <div className='movie-title'>
        <img className='poster' src={image} alt={fullTitle} />
        <div className='mh'>
          <h2 className='full-title'>{fullTitle}</h2>
          <p className='text-muted crew'>{crew}</p>
          {imDbRating && (
            <span className='rating'>
              {imDbRating} <AiFillStar className='star' />
            </span>
          )}
        </div>
      </div>
      {imDbRating && (
        <span className='rating xl'>
          {imDbRating} <AiFillStar className='star' />
        </span>
      )}
    </li>
  );
}
