import React, { useState, useEffect } from 'react';
import SearchFilter from '../components/SearchFilter';
import ProductList from '../components/ProductList';
import ProductModal from '../components/ProductModal';
import { getProducts } from '../services/api';
import { CATEGORIES, MOCK_PRODUCTS } from '../data/mockProducts';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getProducts(selectedCategory, searchTerm)
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Backend API unreachable, using local fallback:', err.message);
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
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedCategory]);

  return (
    <div style={{ padding: '30px 0' }}>
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--green)' }}>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>🌾 Loading products catalog...</p>
        </div>
      ) : (
        <ProductList
          products={products}
          onViewProduct={(product) => setActiveProduct(product)}
          title="All Available Products"
          subtitle={`Showing ${products.length} fresh products direct from local farms.`}
        />
      )}

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
}
