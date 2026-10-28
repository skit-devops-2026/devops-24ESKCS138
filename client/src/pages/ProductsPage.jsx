import React, { useState, useMemo } from 'react';
import SearchFilter from '../components/SearchFilter';
import ProductList from '../components/ProductList';
import ProductModal from '../components/ProductModal';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockProducts';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeProduct, setActiveProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'All Categories' ||
        prod.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
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

      <ProductList
        products={filteredProducts}
        onViewProduct={(product) => setActiveProduct(product)}
        title="All Available Products"
        subtitle={`Showing ${filteredProducts.length} fresh products direct from local farms.`}
      />

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
}
