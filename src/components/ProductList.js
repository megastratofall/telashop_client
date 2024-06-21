import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './ProductList.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await axiosInstance.post('/cart/add', { product_id: productId, quantity: 1 });
      toast.success('Producto agregado al carrito correctamente');
      setCartCount(cartCount + 1); 
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar producto al carrito');
    }
  }; 

  return (
    <div className="product-list">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={`http://localhost:8000/storage/${product.image}`} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="product-footer">
              <button onClick={() => addToCart(product.id)}>Add to cart</button>
              <span>${product.price}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
