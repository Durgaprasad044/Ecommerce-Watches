'use strict';

const db = require('../../config/db');
const AppError = require('../../utils/AppError');

/**
 * Helper to build a date range filter.
 * @param {string} [start_date] - ISO date string
 * @param {string} [end_date] - ISO date string
 * @returns {{ start: Date, end: Date }}
 */
const parseDateRange = (start_date, end_date) => {
  const end = end_date ? new Date(end_date) : new Date();
  const start = start_date ? new Date(start_date) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
};

const getDashboardStats = async () => {
  const [ordersRes, usersRes, revenueRes] = await Promise.all([
    db.from('orders').select('id', { count: 'exact' }).neq('status', 'cancelled'),
    db.from('users').select('id', { count: 'exact' }).eq('is_deleted', false),
    db.from('orders').select('total_amount').eq('status', 'delivered'),
  ]);

  const totalOrders = ordersRes.count || 0;
  const totalUsers = usersRes.count || 0;
  const totalRevenue = (revenueRes.data || []).reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  return { totalOrders, totalUsers, totalRevenue: parseFloat(totalRevenue.toFixed(2)) };
};

const getSalesAnalytics = async ({ start_date, end_date, group_by = 'day' }) => {
  const { start, end } = parseDateRange(start_date, end_date);

  const { data, error } = await db
    .from('orders')
    .select('total_amount, created_at, status')
    .gte('created_at', start)
    .lte('created_at', end)
    .neq('status', 'cancelled');

  if (error) throw new AppError('Failed to fetch sales analytics.', 500, false);
  return { data, start, end };
};

const getTopProducts = async ({ limit = 10 }) => {
  const { data, error } = await db
    .from('order_items')
    .select('watch_id, quantity, unit_price, watches(id, name, brand, images)')
    .limit(1000);

  if (error) throw new AppError('Failed to fetch top products.', 500, false);

  // Aggregate by watch_id
  const aggregated = {};
  for (const item of data) {
    if (!aggregated[item.watch_id]) {
      aggregated[item.watch_id] = {
        watch: item.watches,
        units_sold: 0,
        revenue: 0,
      };
    }
    aggregated[item.watch_id].units_sold += item.quantity;
    aggregated[item.watch_id].revenue += item.unit_price * item.quantity;
  }

  const sorted = Object.values(aggregated)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);

  return sorted;
};

const getUserAnalytics = async ({ start_date, end_date }) => {
  const { start, end } = parseDateRange(start_date, end_date);

  const { data, error } = await db
    .from('users')
    .select('id, created_at')
    .gte('created_at', start)
    .lte('created_at', end)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw new AppError('Failed to fetch user analytics.', 500, false);
  return { data, start, end };
};

const getRevenueReport = async ({ start_date, end_date }) => {
  const { start, end } = parseDateRange(start_date, end_date);

  const { data, error } = await db
    .from('orders')
    .select('total_amount, discount, subtotal, status, created_at')
    .gte('created_at', start)
    .lte('created_at', end);

  if (error) throw new AppError('Failed to generate revenue report.', 500, false);

  const totalRevenue = data.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
  const totalDiscount = data.reduce((sum, o) => sum + parseFloat(o.discount || 0), 0);

  return { data, summary: { totalRevenue: parseFloat(totalRevenue.toFixed(2)), totalDiscount: parseFloat(totalDiscount.toFixed(2)) }, start, end };
};

module.exports = { getDashboardStats, getSalesAnalytics, getTopProducts, getUserAnalytics, getRevenueReport };
