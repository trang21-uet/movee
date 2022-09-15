import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_KEY, Loading } from '../../components';
// import json from './data';

export default function SearchResult() {
  const query = useLocation().search.split('=')[1];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchAll = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://imdb-api.com/en/API/SearchAll/${API_KEY}/${query}`
        );
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    searchAll();
  }, [query]);

  console.log(data);

  return loading ? (
    <Loading />
  ) : (
    <main id='search-result' className='container'>
      {data.results.length > 0 ? (
        <>
          <h1 className='title'>All search results for "{query}"</h1>
          <ResultsByType type='Title' data={data.results} />
          <ResultsByType type='Name' data={data.results} />
        </>
      ) : (
        <h1 className='pv text-center title'>No thing found!</h1>
      )}
    </main>
  );
}

const ResultsByType = ({ type, data }) => {
  const filtered = data.filter(element => element.resultType === type);
  return (
    <div className='result-section'>
      <h2 className='result-type'>{type + 's'}</h2>
      <ul className='results-by-type'>
        {filtered.map(element => (
          <Result key={element.id} {...element} />
        ))}
      </ul>
    </div>
  );
};

const Result = ({ id, title, description, image, resultType }) => {
  const navigate = useNavigate();

  const handleClick = () =>
    resultType === 'Title' ? navigate(`/movie?id=${id}`) : null;

  return (
    <li className='result-item mv' onClick={handleClick}>
      <img src={image} alt={title} />
      <p className='info-text'>{`${title} - ${description}`}</p>
    </li>
  );
};
