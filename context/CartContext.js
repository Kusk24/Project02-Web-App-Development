'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Helper function to normalize size value (undefined/null -> null)
const normalizeSize = (size) => (size === undefined || size === null ? null : size);
// Helper function to check if size should be considered in matching
const shouldCheckSize = (payload) => normalizeSize(payload.size) !== null;

// Helper function to check if two items match by id and size
const itemsMatch = (item1, item2, checkSize = true) => {
  const idsMatch = item1.id === item2.id;
  if (!checkSize) return idsMatch;
  
  // Normalize size values for comparison
  const size1 = normalizeSize(item1.size);
  const size2 = normalizeSize(item2.size);
  
  return idsMatch && size1 === size2;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Compare by id and size (size can be undefined for items without size variants)
      const existingItem = state.items.find(item => 
        itemsMatch(item, action.payload)
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            itemsMatch(item, action.payload)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_FROM_CART':
      // Remove by id and optionally by size if provided
      return {
        ...state,
        items: state.items.filter(item => 
          !itemsMatch(item, action.payload, shouldCheckSize(action.payload))
        )
      };

    case 'UPDATE_QUANTITY':
      // Update by id and optionally by size if provided
      return {
        ...state,
        items: state.items.map(item =>
          itemsMatch(item, action.payload, shouldCheckSize(action.payload))
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartData });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && state.items.length >= 0) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
        // Dispatch event for header updates
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items]);

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id, size = undefined) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } });
  };

  const updateQuantity = (id, quantity, size = undefined) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity, size } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // Return a fallback instead of throwing error
    console.warn('useCart must be used within a CartProvider');
    return {
      items: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getTotalPrice: () => 0,
      getTotalItems: () => 0
    };
  }
  return context;
};
