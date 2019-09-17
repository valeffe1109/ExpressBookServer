const express = require("express")
const fs = require("fs-extra")
const shortid = require("shortid")
const utils = require('./utils')

getReviews = async () => {
    return await getItems("reviews.json")
}

saveReviews = async (reviews) => {
    await saveItems("reviews.json", reviews)
}

const router = express.Router();

router.get("/", async (req, res) => {
    var reviews = await getReviews();

    console.log(req.query)
    for (let entry in req.query) {
        var queryValue = req.query[entry].toLowerCase ? req.query[entry].toLowerCase() : req.query[entry];
        reviews = reviews.filter(x => x[entry].toLowerCase ?
            x[entry].toLowerCase().indexOf(queryValue) >= 0 :
            x[entry] == queryValue)
        console.log(entry + " => " + queryValue + " array size: " + reviews.length)
    }

    res.send(reviews)
})

router.get("/:id", async (req, res) => {
    var reviews = await getReviews();
    res.send(reviews.find(x => x.ID == req.params.id))
})


router.post("/", async (req, res) => {
    var reviews = await getReviews();
    var newReview = req.body
    newReview.createdAt = new Date()
    newReview.updatedAt = newReview.createdAt
    newReview.ID = shortid.generate()
    reviews.push(newReview)
    await saveReviews(reviews)

    res.send(newReview)
})
router.put("/:id", async (req, res) => {
    var reviews = await getReviews();
    var review = reviews.find(x => x.ID == req.params.id)
    Object.assign(review, req.body)

    await saveReviews(reviews);
})

router.delete("/:id", async (req, res) => {
    var reviews = await getReviews();
    var reviewsWithoutSpecifiedID = reviews.filter(x => x.asin != req.params.id)
    await saveReviews(reviewsWithoutSpecifiedID);
})

module.exports = router