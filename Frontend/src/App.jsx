import axiosInstance from './api/axiosInstance.js';
import authService from './api/authService.js';
import watchService from './api/watchService.js';
import orderService from './api/orderService.js';
import cartService from './api/cartService.js';
import wishlistService from './api/wishlistService.js';
import reviewService from './api/reviewService.js';
import couponService from './api/couponService.js';
import referralService from './api/referralService.js';
import vendorService from './api/vendorService.js';
import Button from './components/common/Button.jsx';
import Input from './components/common/Input.jsx';
import Badge from './components/common/Badge.jsx';
import Modal from './components/common/Modal.jsx';
import Spinner from './components/common/Spinner.jsx';
import Pagination from './components/common/Pagination.jsx';
import EmptyState from './components/common/EmptyState.jsx';
import ErrorMessage from './components/common/ErrorMessage.jsx';
import ConfirmDialog from './components/common/ConfirmDialog.jsx';
import WatchCard from './components/watch/WatchCard.jsx';
import WatchGrid from './components/watch/WatchGrid.jsx';
import WatchFilters from './components/watch/WatchFilters.jsx';
import WatchImages from './components/watch/WatchImages.jsx';
import WatchAttributes from './components/watch/WatchAttributes.jsx';
import StockBadge from './components/watch/StockBadge.jsx';
import PriceTag from './components/watch/PriceTag.jsx';
import RatingStars from './components/watch/RatingStars.jsx';
import OrderSummary from './components/order/OrderSummary.jsx';
import OrderTimeline from './components/order/OrderTimeline.jsx';
import OrderStatus from './components/order/OrderStatus.jsx';
import OrderCard from './components/order/OrderCard.jsx';
import CartItem from './components/cart/CartItem.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import CartSummary from './components/cart/CartSummary.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import PageWrapper from './components/layout/PageWrapper.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import VendorStats from './components/vendor/VendorStats.jsx';
import RevenueChart from './components/vendor/RevenueChart.jsx';
import InventoryTable from './components/vendor/InventoryTable.jsx';
import LowStockAlert from './components/vendor/LowStockAlert.jsx';
import TopWatches from './components/vendor/TopWatches.jsx';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import CartContext from './context/CartContext.jsx';
//import WishlistContext from './context/WishlistContext.jsx';
import useAuth from './hooks/useAuth.js';
import { CartProvider } from "./context/CartContext.jsx";
//import useWishlist from './hooks/useWishlist.js';
import useFilters from './hooks/useFilters.js';
import usePagination from './hooks/usePagination.js';
import useDebounce from './hooks/useDebounce.js';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Catalog from './pages/customer/Catalog.jsx';
import WatchDetail from './pages/customer/WatchDetail.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import OrderList from './pages/customer/OrderList.jsx';
import OrderDetail from './pages/customer/OrderDetail.jsx';
import Wishlist from './pages/customer/Wishlist.jsx';
import Profile from './pages/customer/Profile.jsx';
import Dashboard from './pages/vendor/Dashboard.jsx';
import ManageWatches from './pages/vendor/ManageWatches.jsx';
import AddWatch from './pages/vendor/AddWatch.jsx';
import EditWatch from './pages/vendor/EditWatch.jsx';
import VendorOrders from './pages/vendor/VendorOrders.jsx';
import Inventory from './pages/vendor/Inventory.jsx';
import Analytics from './pages/vendor/Analytics.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Users from './pages/admin/Users.jsx';
import Reviews from './pages/admin/Reviews.jsx';
import AppRouter from './routes/AppRouter.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import formatCurrency from './utils/formatCurrency.js';
import formatDate from './utils/formatDate.js';
import validateSchema from './utils/validateSchema.js';
import * as constants from './utils/constants.js';
import './styles/globals.css';
import { WishlistProvider } from "./context/WishlistContext";
function App() {
  return(
    <AuthProvider>
     <CartProvider> 
    <WishlistProvider>
    <AppRouter />
    </WishlistProvider>
    </CartProvider>
    </AuthProvider>
    );
}

export default App;
