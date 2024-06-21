import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './Cart.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.get('/cart');
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axiosInstance.post('/cart/remove', { product_id: productId });
            setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
            toast.success('Producto eliminado del carrito correctamente');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Error al eliminar producto del carrito');
        }
    };

    const handlePayment = async () => {
        try {
            const response = await axiosInstance.post('/payment/create');
            const initPoint = response.data.init_point;
            if (initPoint) {
                window.location.href = initPoint;
            } else {
                console.error('No se encontró el punto de inicio en la respuesta');
                throw new Error('No se encontró el punto de inicio');
            }
        } catch (error) {
            console.error('Error al crear preferencia de pago:', error);
            console.error('Detalles del error:', error.response?.data);
            toast.error(error.response?.data?.error || 'Error al crear la preferencia de pago');
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0).toFixed(2);

    return (
        <div className="cart-container">
            <h1>Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.product.name}</td>
                                    <td>${item.product.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => removeFromCart(item.product_id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3">Total:</td>
                                <td>${totalPrice}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                    <button className="buy-button" onClick={handlePayment}>Buy Now</button>
                </div>
            )}
        </div>
    );
};

export default Cart;