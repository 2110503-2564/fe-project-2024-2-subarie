const express = require('express');
const { 
    getCarProviders, 
    getCarProvider, 
    createCarProvider, 
    updateCarProvider, 
    deleteCarProvider 
} = require('../controllers/Car_Provider');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
router.use(protect);

router
    .route('/')
    .get(getCarProviders)
    .post(authorize('admin'),createCarProvider);

router
    .route('/:id')
    .get(getCarProvider)
    .put(authorize('admin'),updateCarProvider)
    .delete(authorize('admin'),deleteCarProvider);

module.exports = router;