import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import './Cart.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [preferenceId, setPreferenceId] = useState(null);

    useEffect(() => {
        initMercadoPago(process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY);
        
        const fetchCartItems = async () => {
            try {
                const response = await axiosInstance.get('/cart');
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    const removeFromCart = async (itemId) => {
        try {
            await axiosInstance.post('/cart/remove', { itemId });
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            toast.success('Producto eliminado del carrito correctamente');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Error al eliminar producto del carrito');
        }
    };

    const handlePayment = async () => {
        try {
            const response = await axiosInstance.post('/payment/create');
            if (response.data.preference_id) {
                setPreferenceId(response.data.preference_id);
            } else {
                throw new Error('No se recibió el ID de preferencia');
            }
        } catch (error) {
            console.error('Error creating payment preference:', error.response?.data?.error || error.message);
            toast.error(error.response?.data?.error || 'Error al crear la preferencia de pago');
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>
                                        <button onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2">Total:</td>
                                <td>${totalPrice}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <button className="buy-button" onClick={handlePayment}>Buy Now</button>
                    {preferenceId && (
                        <Wallet
                            initialization={{ preferenceId }}
                            onSubmit={async (param) => console.log(param)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;