import React, { Suspense, lazy } from 'react';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthProvider } from './context/AuthContext';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Submit = lazy(() => import('./pages/Submit'));
const Auth = lazy(() => import('./pages/Auth'));

const DesignSystem = lazy(() => import('./pages/DesignSystem'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/auth" element={<Auth />} />
              {import.meta.env.DEV && (
                <Route path="/dev/design-system" element={<DesignSystem />} />
              )}
            </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
