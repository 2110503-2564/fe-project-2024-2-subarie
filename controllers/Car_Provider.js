const Car_Provider = require('../models/car_provider');
const asyncHandler = require('express-async-handler');
const Car = require('../models/Car');

// @desc    Get all car providers
// @route   GET /api/providers
// @access  Public
const getCarProviders = asyncHandler(async (req, res) => {
    const providers = await Car_Provider.find();
    res.status(200).json({
        success: true,
        count: providers.length,
        data: providers
    });
});

// @desc    Get single car provider
// @route   GET /api/providers/:id
// @access  Public
const getCarProvider = asyncHandler(async (req, res) => {
    // Find the car provider
    const provider = await Car_Provider.findById(req.params.id);

    if (!provider) {
        return res.status(404).json({
            success: false,
            error: `Car provider not found with id of ${req.params.id}`
        });
    }

    // Find all cars associated with this provider
    const cars = await Car.find({ provider_id: req.params.id });

    res.status(200).json({
        success: true,
        data: {
            ...provider.toObject(),
            cars
        }
    });
});

// @desc    Create new car provider
// @route   POST /api/providers
// @access  Private
const createCarProvider = asyncHandler(async (req, res) => {
    const provider = await Car_Provider.create(req.body);
    
    res.status(201).json({
        success: true,
        data: provider
    });
});

// @desc    Update car provider
// @route   PUT /api/providers/:id
// @access  Private
const updateCarProvider = asyncHandler(async (req, res) => {
    let provider = await Car_Provider.findById(req.params.id);

    if (!provider) {
        return res.status(404).json({
            success: false,
            error: `Car provider not found with id of ${req.params.id}`
        });
    }

    provider = await Car_Provider.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: provider
    });
});

// @desc    Delete car provider
// @route   DELETE /api/providers/:id
// @access  Private
const deleteCarProvider = asyncHandler(async (req, res) => {
    const provider = await Car_Provider.findById(req.params.id);

    if (!provider) {
        return res.status(404).json({
            success: false,
            error: `Car provider not found with id of ${req.params.id}`
        });
    }

    await provider.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    getCarProviders,
    getCarProvider,
    createCarProvider,
    updateCarProvider,
    deleteCarProvider
};