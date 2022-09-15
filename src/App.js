import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Best, Home, Layout, Movie, SearchResult } from './screens';
import './sass/style.scss';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path='/movie' element={<Movie />} />
          <Route path='/search' element={<SearchResult />} />
          <Route path='/top' element={<Best />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
