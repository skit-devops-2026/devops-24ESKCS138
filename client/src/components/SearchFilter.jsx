import React from 'react';

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <div>
          <h2>Find Fresh Agricultural Products</h2>
          <p>Search for crops, vegetables, fruits, and grains directly from farmers.</p>
        </div>

        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <button type="submit">Search</button>
        </form>
      </div>
    </section>
  );
}
