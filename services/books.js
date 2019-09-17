const express = require("express")
const fs = require("fs-extra")
const shortid = require("shortid")
const utils = require('./utils')

getBooks = async () => {
    return await getItems("books.json")
}

saveBooks = async (books) => {
    await saveItems("books.json", books)
}

const router = express.Router();

router.get("/", async (req, res) => {
    var books = await getBooks();

    console.log(req.query)
    for (let entry in req.query) {
        var queryValue = req.query[entry].toLowerCase ? req.query[entry].toLowerCase() : req.query[entry];
        books = books.filter(x => x[entry].toLowerCase ?
            x[entry].toLowerCase().indexOf(queryValue) >= 0 :
            x[entry] == queryValue)

        // if (req.query.toLowerCase)
        //     books = books.filter(x => x[entry].toLowerCase().indexOf(req.query[entry].toLowerCase()) >= 0);
        // else
        //     books = books.filter(x => x[entry] == req.query[entry]

        console.log(entry + " => " + queryValue + " array size: " + books.length)
    }

    res.send(books)
})

router.get("/:id", async (req, res) => {
    var books = await getBooks();
    res.send(books.find(x => x.asin == req.params.id))
})


router.get('/:id/reviews' , async (req,res)=>{
   
    var reviews = await getItems('reviews.json')
    res.send(reviews.filter(x=>x.asin == req.params.id ))

})


router.post("/", async (req, res) => {

    var books = await getBooks();
    var newBook = req.body
    newBook.asin = shortid.generate()
    books.push(newBook)
    await saveBooks(books)
    res.send(newBook)
})

router.put("/:id", async (req, res) => {
    var books = await getBooks();
    var book = books.find(x => x.asin == req.params.id)
    Object.assign(book, req.body)

    await saveBooks(books);
})

router.delete("/:id", async (req, res) => {
    var books = await getBooks();
    //[1 ,2 , 5, 7]
    //--------X
    //[1 ,2 , 7]
    var booksWithoutSpecifiedID = books.filter(x => x.asin != req.params.id)
    await saveBooks(booksWithoutSpecifiedID);
})

module.exports = router