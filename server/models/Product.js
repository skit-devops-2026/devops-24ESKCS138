import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product/crop name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Organic', 'Dairy'],
        message: '{VALUE} is not a valid category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Please specify price per unit'],
      min: [0, 'Price must be positive'],
    },
    unit: {
      type: String,
      required: [true, 'Please specify unit (e.g. kg, quintal, L)'],
      default: 'kg',
      enum: ['kg', 'quintal', 'ton', 'L', 'dozen', 'piece'],
    },
    stock: {
      type: Number,
      required: [true, 'Please specify available quantity/stock'],
      min: [0, 'Stock cannot be negative'],
      default: 10,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    icon: {
      type: String,
      default: '🌾',
    },
    farmer: {
      type: String,
      required: true,
      default: 'Verified Farmer',
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    location: {
      type: String,
      default: 'Local Mandi',
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON output for clean frontend consumption
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
  },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
