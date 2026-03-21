const Product = require('../models/Product');

describe('Product Model', () => {
  test('should create a valid product object', () => {
    const productData = {
      name: 'Test Product',
      description: 'A test product description',
      price: 99.99,
      category: 'Electronics',
      stock: 50,
      sku: 'TEST-001',
      status: 'Active',
      featured: true,
      imageUrl: 'https://example.com/image.jpg'
    };

    const product = new Product(productData);

    expect(product.name).toBe(productData.name);
    expect(product.description).toBe(productData.description);
    expect(product.price).toBe(productData.price);
    expect(product.category).toBe(productData.category);
    expect(product.stock).toBe(productData.stock);
    expect(product.sku).toBe(productData.sku);
    expect(product.status).toBe(productData.status);
    expect(product.featured).toBe(productData.featured);
    expect(product.imageUrl).toBe(productData.imageUrl);
  });

  test('should set default status to Active', () => {
    const productData = {
      name: 'Test Product',
      description: 'A test product description',
      price: 99.99,
      category: 'Electronics',
      stock: 50
    };

    const product = new Product(productData);

    expect(product.status).toBe('Active');
    expect(product.featured).toBe(false);
  });

  test('should validate required fields', () => {
    const product = new Product({});

    const validationError = product.validateSync();

    expect(validationError).toBeDefined();
    expect(validationError.errors.name).toBeDefined();
    expect(validationError.errors.description).toBeDefined();
    expect(validationError.errors.price).toBeDefined();
    expect(validationError.errors.category).toBeDefined();
    expect(validationError.errors.stock).toBeDefined();
  });
});
