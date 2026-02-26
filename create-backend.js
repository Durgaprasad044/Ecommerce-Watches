const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'watchvault-backend');

const dirs = [
  'src/config',
  'src/modules/auth',
  'src/modules/users',
  'src/modules/watches',
  'src/modules/orders',
  'src/modules/cart',
  'src/modules/wishlist',
  'src/modules/reviews',
  'src/modules/coupons',
  'src/modules/referrals',
  'src/modules/inventory',
  'src/modules/analytics',
  'src/modules/notifications',
  'src/middleware',
  'src/utils',
  'src/routes'
];

const files = [
  'src/config/env.js',
  'src/config/supabase.js',
  'src/config/db.js',
  'src/config/constants.js',
  
  'src/modules/auth/auth.controller.js',
  'src/modules/auth/auth.service.js',
  'src/modules/auth/auth.routes.js',
  'src/modules/auth/auth.validator.js',
  
  'src/modules/users/user.controller.js',
  'src/modules/users/user.service.js',
  'src/modules/users/user.routes.js',
  'src/modules/users/user.validator.js',
  
  'src/modules/watches/watch.controller.js',
  'src/modules/watches/watch.service.js',
  'src/modules/watches/watch.routes.js',
  'src/modules/watches/watch.validator.js',
  
  'src/modules/orders/order.controller.js',
  'src/modules/orders/order.service.js',
  'src/modules/orders/order.routes.js',
  'src/modules/orders/order.validator.js',
  
  'src/modules/cart/cart.controller.js',
  'src/modules/cart/cart.service.js',
  'src/modules/cart/cart.routes.js',
  
  'src/modules/wishlist/wishlist.controller.js',
  'src/modules/wishlist/wishlist.service.js',
  'src/modules/wishlist/wishlist.routes.js',
  
  'src/modules/reviews/review.controller.js',
  'src/modules/reviews/review.service.js',
  'src/modules/reviews/review.routes.js',
  'src/modules/reviews/review.validator.js',
  
  'src/modules/coupons/coupon.controller.js',
  'src/modules/coupons/coupon.service.js',
  'src/modules/coupons/coupon.routes.js',
  
  'src/modules/referrals/referral.controller.js',
  'src/modules/referrals/referral.service.js',
  'src/modules/referrals/referral.routes.js',
  
  'src/modules/inventory/inventory.controller.js',
  'src/modules/inventory/inventory.service.js',
  'src/modules/inventory/inventory.routes.js',
  
  'src/modules/analytics/analytics.controller.js',
  'src/modules/analytics/analytics.service.js',
  'src/modules/analytics/analytics.routes.js',
  
  'src/modules/notifications/notification.controller.js',
  'src/modules/notifications/notification.service.js',
  'src/modules/notifications/notification.routes.js',
  
  'src/middleware/auth.middleware.js',
  'src/middleware/role.middleware.js',
  'src/middleware/validate.middleware.js',
  'src/middleware/upload.middleware.js',
  'src/middleware/rateLimiter.middleware.js',
  'src/middleware/errorHandler.js',
  
  'src/utils/AppError.js',
  'src/utils/asyncHandler.js',
  'src/utils/response.js',
  'src/utils/logger.js',
  'src/utils/constants.js',
  
  'src/routes/index.js',
  'src/app.js',
  'src/server.js',
  
  '.env',
  '.env.example',
  '.gitignore',
  'package.json',
  'README.md'
];

dirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

files.forEach(file => {
  const fullPath = path.join(baseDir, file);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, '');
  }
});

console.log('Backend structure created successfully.');
