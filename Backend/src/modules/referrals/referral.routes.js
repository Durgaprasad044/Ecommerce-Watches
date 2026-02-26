'use strict';

const { Router } = require('express');
const referralController = require('./referral.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const requireRole = require('../../middleware/role.middleware');
const { generalLimiter } = require('../../middleware/rateLimiter.middleware');
const { USER_ROLES } = require('../../utils/constants');

const router = Router();
router.use(generalLimiter);
router.use(authMiddleware);

router.get('/my-code', referralController.getMyReferralCode);
router.get('/stats', referralController.getReferralStats);
router.get('/', requireRole(USER_ROLES.ADMIN), referralController.getAllReferrals);

module.exports = router;
