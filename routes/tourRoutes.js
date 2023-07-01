const express = require("express");
const tourController = require('../controllers/tourController');

const router = express.Router();

// ----- param middleware -----
// if there's no id param (:id), then it won't run
router.param('id', tourController.checkID);

// Create a checkBody middleware --> in tourController.js
// Check if body contains the name and price property
// If not, send back 400 (bad request)
// Add it to the post handler stack


router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour); //run checkBody middleware first and if pass then run createTour middleware afterwards

    router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;