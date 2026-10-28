// Initial product controller (Milestone 2 baseline, to be connected to MongoDB in M3/M4)

const initialProducts = [
  {
    id: '1',
    name: 'Organic Wheat',
    category: 'Grains',
    price: 45,
    unit: 'kg',
    stock: 500,
    farmer: 'Ramesh Patel',
    description: 'Freshly harvested, unpolished premium organic wheat direct from farm.',
  },
  {
    id: '2',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 35,
    unit: 'kg',
    stock: 120,
    farmer: 'Suresh Kumar',
    description: 'Naturally ripened, juicy farm-grown red tomatoes.',
  },
  {
    id: '3',
    name: 'Fresh Potatoes',
    category: 'Vegetables',
    price: 30,
    unit: 'kg',
    stock: 300,
    farmer: 'Harish Verma',
    description: 'High-quality soil-grown potatoes, ideal for everyday cooking.',
  },
  {
    id: '4',
    name: 'Premium Rice',
    category: 'Grains',
    price: 60,
    unit: 'kg',
    stock: 450,
    farmer: 'Gurpreet Singh',
    description: 'Aromatic long-grain premium basmati rice directly from farmers.',
  },
];

// GET /api/products
export const getAllProducts = (req, res) => {
  const { category, search } = req.query;
  let results = [...initialProducts];

  if (category && category.toLowerCase() !== 'all categories') {
    results = results.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
};

// GET /api/products/:id
export const getProductById = (req, res) => {
  const product = initialProducts.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${req.params.id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};
