const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const filesToCreate = {
  // === UTILS ===
  'utils/constants.js': `export const ROLES = { VENDOR: 'vendor', CUSTOMER: 'customer', ADMIN: 'admin' };
export const ORDER_STATUS = { PENDING: 'pending', PROCESSING: 'processing', SHIPPED: 'shipped', DELIVERED: 'delivered', CANCELLED: 'cancelled' };
export const CURRENCY = 'USD';`,
  'utils/formatCurrency.js': `export default function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}`,
  'utils/formatDate.js': `export default function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}`,

  // === COMMON COMPONENTS ===
  'components/common/Button.jsx': `import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', loading = false, disabled = false, ...props }) {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={twMerge(clsx(baseStyle, variants[variant], sizes[size], className))} {...props}>
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}`,
  'components/common/Badge.jsx': `import React from 'react';
export default function Badge({ children, variant = 'gray', className = '' }) {
  const variants = {
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800"
  };
  return (
    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold \${variants[variant]} \${className}\`}>
      {children}
    </span>
  );
}`,
  'components/common/Input.jsx': `import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Input({ label, type = 'text', id, className = '', error, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        id={id}
        className={twMerge(\`px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-sm \${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}\`, className)}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}`,
  'components/common/EmptyState.jsx': `import React from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from './Button';

export default function EmptyState({ title = 'No items found', description = 'There are no items to display right now.', icon = <FiInbox className="w-12 h-12 text-gray-400" />, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-gray-300 bg-gray-50 min-h-[300px]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
}`,

  // === WATCH COMPONENTS ===
  'components/watch/PriceTag.jsx': `import React from 'react';
import formatCurrency from '../../utils/formatCurrency';
export default function PriceTag({ price, discountPrice, className = '' }) {
  return (
    <div className={\`flex items-baseline gap-2 \${className}\`}>
      <span className="text-lg font-bold text-gray-900">{formatCurrency(discountPrice || price)}</span>
      {discountPrice && <span className="text-sm line-through text-gray-500">{formatCurrency(price)}</span>}
    </div>
  );
}`,
  'components/watch/WatchCard.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import PriceTag from './PriceTag';
import { FiHeart, FiStar } from 'react-icons/fi';

export default function WatchCard({ watch }) {
  return (
    <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 transition-colors z-10">
        <FiHeart />
      </button>
      <Link to={\`/watch/\${watch.id}\`} className="relative block h-64 bg-gray-50 overflow-hidden flex-shrink-0">
        <img src={watch.image || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80'} alt={watch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{watch.brand}</div>
        <Link to={\`/watch/\${watch.id}\`} className="text-base flex-grow font-bold text-gray-900 leading-snug hover:underline line-clamp-2 mb-2">
          {watch.name}
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{watch.rating || '4.5'}</span>
          <span className="text-xs text-gray-400">({watch.reviews || 12})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <PriceTag price={watch.price} discountPrice={watch.discountPrice} />
        </div>
      </div>
    </div>
  );
}`,
  'components/watch/WatchGrid.jsx': `import React from 'react';
import WatchCard from './WatchCard';

export default function WatchGrid({ watches = [] }) {
  if (!watches.length) return <div className="py-12 text-center text-gray-500">No watches found.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {watches.map(w => <WatchCard key={w.id} watch={w} />)}
    </div>
  );
}`,
  
  // === LAYOUT COMPONENTS ===
  'components/layout/Navbar.jsx': `import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiHeart } from 'react-icons/fi';

export default function Navbar() {
  const linkClass = ({ isActive }) => \`text-sm font-medium transition-colors hover:text-gray-900 \${isActive ? 'text-gray-900' : 'text-gray-500'}\`;
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900 uppercase">
              Watch<span className="text-gray-400">Vault</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/catalog" className={linkClass}>Catalog</NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 transition-colors">
              <FiHeart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors relative">
              <FiShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">2</span>
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition-colors pl-2 border-l border-gray-200">
              <FiUser className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}`,
  'components/layout/Footer.jsx': `import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-tighter text-gray-900 mb-4">WatchVault</h3>
          <p className="text-sm text-gray-500 pr-4">Premium destination for luxury and everyday timepieces. Timeless elegance matters.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/catalog" className="hover:text-gray-900 transition-colors">All Watches</Link></li>
            <li><Link to="/catalog" className="hover:text-gray-900 transition-colors">Luxury Brands</Link></li>
            <li><Link to="/catalog" className="hover:text-gray-900 transition-colors">Smart Watches</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="#" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-gray-900 transition-colors">Shipping & Returns</Link></li>
            <li><Link to="#" className="hover:text-gray-900 transition-colors">Warranty</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Newsletter</h4>
          <p className="text-sm text-gray-500 mb-2">Subscribe for updates on new arrivals.</p>
          <div className="flex">
            <input type="email" placeholder="Your email" className="px-3 py-2 text-sm border border-gray-300 rounded-l-md w-full focus:outline-none focus:border-gray-900" />
            <button className="bg-gray-900 text-white px-4 py-2 text-sm rounded-r-md font-medium hover:bg-gray-800 transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} WatchVault. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-gray-700">Privacy Policy</Link>
          <Link to="#" className="hover:text-gray-700">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}`,
  'components/layout/PageWrapper.jsx': `import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageWrapper({ children, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={\`flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full \${className}\`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}`,
  'components/layout/Sidebar.jsx': `import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiList, FiBarChart2, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/vendor', icon: <FiHome /> },
    { name: 'Products', path: '/vendor/products', icon: <FiBox /> },
    { name: 'Orders', path: '/vendor/orders', icon: <FiList /> },
    { name: 'Analytics', path: '/vendor/analytics', icon: <FiBarChart2 /> },
    { name: 'Settings', path: '/vendor/settings', icon: <FiSettings /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex-shrink-0 min-h-screen p-4 flex flex-col hidden lg:flex">
      <div className="text-2xl font-bold tracking-tighter text-white uppercase mb-8 ml-2 mt-2">
        Watch<span className="text-gray-500">Vendor</span>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(link => (
          <NavLink 
            key={link.path} 
            to={link.path}
            end
            className={({isActive}) => \`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors \${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}\`}
          >
            {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}`,
  'components/layout/DashboardLayout.jsx': `import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-800">Vendor Portal</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}`,

  // === CUSTOMER PAGES ===
  'pages/customer/Home.jsx': `import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Link } from 'react-router-dom';
import WatchGrid from '../../components/watch/WatchGrid';
import { FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const featured = [
    { id: '1', name: 'Oyster Perpetual', brand: 'Rolex', price: 6100, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80' },
    { id: '2', name: 'Speedmaster Pro', brand: 'Omega', price: 5300, image: 'https://images.unsplash.com/photo-1623998021450-85c29c644e0d?auto=format&fit=crop&q=80' },
    { id: '3', name: 'Carrera Calibre', brand: 'TAG Heuer', price: 4200, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80' },
    { id: '4', name: 'Royal Oak', brand: 'Audemars Piguet', price: 21000, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80' },
  ];

  return (
    <PageWrapper className="py-0 px-0 max-w-none">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548169874-53ce86f44e22?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="relative z-10 text-center max-w-3xl px-4 py-32">
          <span className="block text-sm tracking-[0.2em] uppercase text-gray-300 mb-4">The ultimate collection</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">Invest in Time.</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 mx-auto max-w-2xl font-light">
            Discover our curated selection of premium timepieces from the world's most renowned watchmakers.
          </p>
          <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all hover:gap-3">
            Shop Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Watches</h2>
            <p className="text-gray-500 mt-2">Hand-picked selections for you.</p>
          </div>
          <Link to="/catalog" className="hidden sm:flex text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors items-center gap-1">
            View All <FiArrowRight className="w-4 h-4"/>
          </Link>
        </div>
        <WatchGrid watches={featured} />
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/catalog?category=luxury" className="group relative h-80 rounded-2xl overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1614164185128-e4b10b0e5155?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Luxury" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Luxury</div>
            </Link>
            <Link to="/catalog?category=sports" className="group relative h-80 rounded-2xl overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Sports" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Sports & Activity</div>
            </Link>
            <Link to="/catalog?category=vintage" className="group relative h-80 rounded-2xl overflow-hidden block">
              <img src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Vintage" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white text-2xl font-bold tracking-tight">Vintage</div>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}`,
  'pages/customer/Catalog.jsx': `import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import WatchGrid from '../../components/watch/WatchGrid';
import { FiFilter } from 'react-icons/fi';

export default function Catalog() {
  const dummyWatches = Array.from({length: 12}).map((_, i) => ({
    id: String(i + 1),
    name: ['Chronograph Pro', 'Diver Blue', 'Gold Standard', 'Minimalist Black'][i % 4] + \` \${i}\`,
    brand: ['Rolex', 'Omega', 'Seiko', 'Tissot'][i % 4],
    price: 1000 + (i * 500),
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80'
  }));

  return (
    <PageWrapper>
      <div className="mb-8 border-b border-gray-200 pb-5 pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">All Watches</h1>
        <p className="mt-2 text-gray-500 text-lg">Browse our complete collection of fine timepieces.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky top-24">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
              <FiFilter /> <span>Filters</span>
            </div>
            {/* Filter segments */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Brands</h3>
                <div className="space-y-2">
                  {['Rolex', 'Omega', 'Seiko', 'Tissot'].map(b => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                      <span className="text-sm text-gray-600">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold mb-3">Price Range</h3>
                <input type="range" className="w-full" min="0" max="50000" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$0</span><span>$50k+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500 font-medium">{dummyWatches.length} Results</span>
            <select className="border-gray-300 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
          <WatchGrid watches={dummyWatches} />
          
          <div className="mt-12 flex justify-center">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition">
              Load More
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}`,
  'pages/customer/WatchDetail.jsx': `import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import PriceTag from '../../components/watch/PriceTag';
import Badge from '../../components/common/Badge';
import { FiCheck, FiTruck, FiShield, FiHeart } from 'react-icons/fi';

export default function WatchDetail() {
  const { id } = useParams();
  
  // Dummy
  const watch = {
    id, name: 'Chronograph Masterpiece', brand: 'Swiss luxury', price: 4200, status: 'In Stock',
    description: 'An exquisitely crafted timepiece featuring an automatic movement, scratch-resistant sapphire crystal, and specialized water resistance up to 300 meters.',
    features: ['Automatic movement', '42mm case size', 'Sapphire crystal', 'Water resistant to 300m', 'Stainless steel strap']
  };

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 text-gray-500 flex gap-2">
        <Link to="/" className="hover:text-gray-900">Home</Link> <span>/</span>
        <Link to="/catalog" className="hover:text-gray-900">Watches</Link> <span>/</span>
        <span className="text-gray-900 font-medium">{watch.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100 mb-16">
        {/* Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=80" alt={watch.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-gray-50 rounded-lg cursor-pointer border hover:border-gray-900 transition-colors">
                <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80" alt="thumb" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{watch.brand}</p>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">{watch.name}</h1>
          <div className="mb-6"><PriceTag price={watch.price} className="text-3xl" /></div>
          
          <Badge variant="green" className="w-fit mb-6 px-3 py-1 text-sm"><FiCheck className="mr-1"/> {watch.status}</Badge>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">{watch.description}</p>

          <div className="space-y-4 mb-8 text-sm font-medium text-gray-700">
            <div className="flex items-center gap-3"><FiTruck className="w-5 h-5 text-gray-400" /> Free overnight shipping</div>
            <div className="flex items-center gap-3"><FiShield className="w-5 h-5 text-gray-400" /> 5-Year international warranty</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-gray-100">
            <Button size="lg" className="flex-1 py-4 text-lg">Add to Cart</Button>
            <Button size="lg" variant="outline" className="px-6 border-2"><FiHeart className="w-6 h-6" /></Button>
          </div>
        </div>
      </div>

      {/* Tabs / Specifications */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8 text-lg font-medium">
          <button className="text-gray-900 border-b-2 border-gray-900 pb-4">Specifications</button>
          <button className="text-gray-500 hover:text-gray-900 pb-4">Reviews (12)</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-3xl">
        {watch.features.map((f, i) => (
          <div key={i} className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">Feature {i+1}</span>
            <span className="font-medium text-gray-900 text-right">{f}</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}`,
  'pages/customer/Cart.jsx': `import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import PriceTag from '../../components/watch/PriceTag';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  // Dummy
  const items = [
    { id: '1', name: 'Oyster Perpetual', brand: 'Rolex', price: 6100, qty: 1, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80' }
  ];

  if (!items.length) {
    return (
      <PageWrapper>
        <EmptyState title="Your cart is empty" description="Looks like you haven't added any watches yet." actionText="Shop Now" onAction={() => navigate('/catalog')} />
      </PageWrapper>
    );
  }

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <PageWrapper>
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Bag</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Items */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-sm md:text-base">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 hidden sm:grid">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center">
                <div className="col-span-1 border-b pb-4 sm:border-0 sm:pb-0 sm:col-span-6 flex gap-4 items-center">
                  <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{item.name}</p>
                    <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                    <button className="text-red-500 text-sm flex items-center gap-1 hover:underline"><FiTrash2 /> Remove</button>
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-3 flex justify-center items-center gap-3">
                  <button className="p-1 border rounded-md hover:bg-gray-50"><FiMinus /></button>
                  <span className="font-medium text-lg w-6 text-center">{item.qty}</span>
                  <button className="p-1 border rounded-md hover:bg-gray-50"><FiPlus /></button>
                </div>
                <div className="col-span-1 sm:col-span-3 text-right font-bold text-lg">
                  $<PriceTag price={item.price * item.qty} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">$\{(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="font-extrabold text-2xl text-gray-900">$\{(subtotal).toLocaleString()}</span>
            </div>
            <Button size="lg" className="w-full mb-4">Proceed to Checkout</Button>
            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <FiShield /> Secure SSL checkout
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}`,
  'pages/customer/Profile.jsx': `import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { FiUser, FiPackage, FiSettings, FiLogOut } from 'react-icons/fi';
import Button from '../../components/common/Button';

export default function Profile() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64">
            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium"><FiUser /> Profile Details</button>
              <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"><FiPackage /> Orders</button>
              <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"><FiSettings /> Settings</button>
              <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium mt-auto"><FiLogOut /> Logout</button>
            </nav>
          </aside>
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">First Name</label>
                <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Last Name</label>
                <input type="text" defaultValue="Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                <input type="email" defaultValue="john.doe@example.com" disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 cursor-not-allowed" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}`,

  // === VENDOR PAGES ===
  'pages/vendor/Dashboard.jsx': `import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiTrendingUp, FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';

export default function Dashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', icon: <FiDollarSign />, trend: '+20.1%' },
    { label: 'Orders', value: '156', icon: <FiPackage />, trend: '+12.5%' },
    { label: 'Conversion Rate', value: '3.2%', icon: <FiTrendingUp />, trend: '-1.1%' },
    { label: 'Total Views', value: '4,231', icon: <FiUsers />, trend: '+5.4%' }
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              <p className={\`text-xs mt-2 font-medium \${s.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}\`}>
                {s.trend} from last month
              </p>
            </div>
            <div className="p-3 bg-gray-50 text-gray-700 rounded-lg">{React.cloneElement(s.icon, {className: 'w-6 h-6'})}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
          <div className="flex items-center justify-center h-full text-gray-400">[Chart Component Placeholder]</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0 border-gray-100">
                <span className="font-medium text-gray-800">#ORD-00{i}</span>
                <span className="text-gray-500">$1,200</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}`,
  'pages/vendor/ManageWatches.jsx': `import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function ManageWatches() {
  const dummyProducts = [
    { id: '1', name: 'Chronograph PRO', price: 1200, stock: 45, status: 'Active' },
    { id: '2', name: 'Diver Black', price: 900, stock: 2, status: 'Low Stock' }
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <Button>Add New Watch</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Product Name</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dummyProducts.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">$\{p.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={p.stock > 10 ? 'green' : 'yellow'}>{p.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                  <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}`,

  // === ROUTES ===
  'routes/AppRouter.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/customer/Home';
import Catalog from '../pages/customer/Catalog';
import WatchDetail from '../pages/customer/WatchDetail';
import Cart from '../pages/customer/Cart';
import Profile from '../pages/customer/Profile';

import Dashboard from '../pages/vendor/Dashboard';
import ManageWatches from '../pages/vendor/ManageWatches';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/watch/:id" element={<WatchDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/vendor" element={<Dashboard />} />
        <Route path="/vendor/products" element={<ManageWatches />} />
      </Routes>
    </BrowserRouter>
  );
}`
};

for (const [relativePath, content] of Object.entries(filesToCreate)) {
  const absolutePath = path.join(srcDir, relativePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absolutePath, content, 'utf8');
}
console.log('Successfully generated complete frontend pages!');
