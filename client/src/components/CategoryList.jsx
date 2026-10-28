import React from 'react';

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  const displayCategories = categories.filter((c) => c.id !== 'all');

  const handleCardClick = (catName) => {
    onSelectCategory(catName);
    const elem = document.getElementById('products-grid');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="categories" id="categories">
      <div className="section-heading">
        <span>EXPLORE</span>
        <h2>Shop By Category</h2>
        <p>Discover quality agricultural products directly from farmers.</p>
      </div>

      <div className="category-grid">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <div
              key={cat.id}
              className={`category-card ${isSelected ? 'selected-category' : ''}`}
              onClick={() => handleCardClick(cat.name)}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
