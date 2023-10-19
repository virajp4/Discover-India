const Spot = require('../models/spot');
const Review = require('../models/reviews');

module.exports.createReview = async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/spots/${spot._id}`);
}

module.exports.deleteReview = async (req, res) => {
    await Spot.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/spots/${req.params.id}`);
}