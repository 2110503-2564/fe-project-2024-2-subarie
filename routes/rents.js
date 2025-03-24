const express = require('express');
const { 
    getRents, 
    getRent, 
    addRent,
    updateRent, 
    deleteRent, 
    completeRent,
    confirmRent
} = require('../controllers/rents');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

router
    .route('/')
    .get(getRents)
    .post(addRent);

router
    .route('/:id')
    .get(getRent)
    .put(updateRent)
    .delete(deleteRent);

router
    .route('/:id/complete')
    .put(completeRent);

router
    .route('/:id/confirm')
    .put(authorize('admin'), confirmRent);

module.exports = router;