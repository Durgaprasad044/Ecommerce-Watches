'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');

const getOrCreateCart = async (userId) => {
  let { data: cart, error } = await db
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw new AppError('Failed to fetch cart.', 500, false);

  if (!cart) {
    const { data: newCart, error: createError } = await db
      .from('carts')
      .insert({ user_id: userId })
      .select()
      .single();
    if (createError) throw new AppError('Failed to create cart.', 500, false);
    cart = newCart;
  }

  return cart;
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const { data: items, error } = await db
    .from('cart_items')
    .select('*, watches(id, name, brand, price, images, inventory(quantity, reserved_quantity))')
    .eq('cart_id', cart.id);

  if (error) throw new AppError('Failed to fetch cart items.', 500, false);

  const total = items.reduce((sum, item) => sum + item.watches.price * item.quantity, 0);
  return { cart_id: cart.id, items, total };
};

const addItem = async (userId, { watch_id, quantity }) => {
  const cart = await getOrCreateCart(userId);

  // Validate stock
  const { data: inventory } = await db
    .from('inventory')
    .select('quantity, reserved_quantity')
    .eq('watch_id', watch_id)
    .single();

  if (!inventory) throw new AppError('Watch not found.', 404);
  const available = inventory.quantity - inventory.reserved_quantity;
  if (available < quantity) {
    throw new AppError(`Only ${available} unit(s) available in stock.`, 400);
  }

  // Upsert cart item
  const { data: existing } = await db
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('watch_id', watch_id)
    .single();

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > available) throw new AppError(`Cannot add this quantity. Only ${available} unit(s) available.`, 400);

    const { data, error } = await db
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw new AppError('Failed to update cart item.', 500, false);
    return data;
  }

  const { data, error } = await db
    .from('cart_items')
    .insert({ cart_id: cart.id, watch_id, quantity })
    .select()
    .single();
  if (error) throw new AppError('Failed to add item to cart.', 500, false);
  return data;
};

const updateItem = async (userId, itemId, { quantity }) => {
  const cart = await getOrCreateCart(userId);

  const { data: item } = await db
    .from('cart_items')
    .select('id, watch_id')
    .eq('id', itemId)
    .eq('cart_id', cart.id)
    .single();

  if (!item) throw new AppError('Cart item not found.', 404);

  // Validate stock again
  const { data: inventory } = await db
    .from('inventory')
    .select('quantity, reserved_quantity')
    .eq('watch_id', item.watch_id)
    .single();

  const available = (inventory?.quantity || 0) - (inventory?.reserved_quantity || 0);
  if (quantity > available) throw new AppError(`Only ${available} unit(s) available.`, 400);

  const { data, error } = await db
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();
  if (error) throw new AppError('Failed to update cart item.', 500, false);
  return data;
};

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const { error } = await db
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('cart_id', cart.id);
  if (error) throw new AppError('Failed to remove item.', 500, false);
  return true;
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const { error } = await db.from('cart_items').delete().eq('cart_id', cart.id);
  if (error) throw new AppError('Failed to clear cart.', 500, false);
  return true;
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
