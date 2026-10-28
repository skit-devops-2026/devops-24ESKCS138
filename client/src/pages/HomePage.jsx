import React, { useState, useMemo } from 'react';
import HeroSection from '../components/HeroSection';
import SearchFilter from '../components/SearchFilter';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import MarketPrices from '../components/MarketPrices';
import FarmerSection from '../components/FarmerSection';
import AboutSection from '../components/AboutSection';
import ProductModal from '../components/ProductModal';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockProducts';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeProduct, setActiveProduct] = useState(null);

  // Filter products by search text and selected category
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
    <main>
      <HeroSection />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
      />

      <CategoryList
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ProductList
        products={filteredProducts}
        onViewProduct={(product) => setActiveProduct(product)}
      />

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
