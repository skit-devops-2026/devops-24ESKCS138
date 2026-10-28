import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import SearchFilter from '../components/SearchFilter';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import MarketPrices from '../components/MarketPrices';
import FarmerSection from '../components/FarmerSection';
import AboutSection from '../components/AboutSection';
import ProductModal from '../components/ProductModal';
import { getProducts } from '../services/api';
import { CATEGORIES, MOCK_PRODUCTS } from '../data/mockProducts';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  // Fetch real products from Express/MongoDB API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getProducts(selectedCategory, searchTerm)
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Backend API unreachable, using local fallback fixtures:', err.message);
          // Graceful fallback so UI remains functional even if backend is paused
          const fallback = MOCK_PRODUCTS.filter((prod) => {
            const matchesSearch =
              searchTerm.trim() === '' ||
              prod.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat =
              selectedCategory === 'All Categories' ||
              prod.category.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCat;
          });
          setProducts(fallback);
          setError('Backend API offline — viewing local fallback data.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategory]);

  return (
    <main>
      <HeroSection />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
      />

      {error && (
        <div
          style={{
            margin: '10px 7%',
            padding: '10px 16px',
            borderRadius: '6px',
            background: '#fef3c7',
            color: '#92400e',
            fontSize: '13px',
          }}
        >
          ℹ️ {error}
        </div>
      )}

      <CategoryList
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--green)' }}>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>🌾 Loading fresh produce from Kisan Market API...</p>
        </div>
      ) : (
        <ProductList
          products={products}
          onViewProduct={(product) => setActiveProduct(product)}
        />
      )}

      <MarketPrices />

      <FarmerSection />

      <AboutSection />

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </main>
  );
}
