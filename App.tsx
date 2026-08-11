import React, { Suspense, lazy } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { UIModeProvider } from './context/UIModeContext';

const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Submit = lazy(() => import('./pages/Submit'));

const App: React.FC = () => {
  return (
    <Router>
      <UIModeProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/submit" element={<Submit />} />
            </Routes>
          </Suspense>
        </Layout>
      </UIModeProvider>
    </Router>
  );
};

export default App;
