import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({
  products,
  onViewProduct,
  title = 'Featured Products',
  subtitle = 'Popular products available from our farmers.',
}) {
  return (
    <section className="products-section" id="products-grid">
      <div className="section-heading">
        <span>FRESH FROM FARM</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onViewProduct}
            />
          ))
        ) : (
          <div className="no-products-msg">
            <p>No agricultural products found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
