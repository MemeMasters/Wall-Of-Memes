const express = require('express')
const Keyword = require('../models/KeywordModel')

const router = express.Router()

router.get('/top', (req, res) => {
  Keyword
    .find()
    .lean()
    .then((wordList) => {
      const topWords = wordList.reduce((accumulator, word) => {
        const wordSum = word.votes[word.votes.length - 1].sum
        const topSum = accumulator.sum
        if (wordSum > topSum) {
          return {
            words: [word],
            sum: wordSum,
          }
        }
        if (wordSum === topSum) {
          accumulator.words.push(word)
        }
        return accumulator
      }, {
        sum: 0,
        words: [],
      })
      res.send(topWords.words)
    })
    .catch((err) => {
      res.status(500).send({
        err,
        givens: req.query,
      })
    })
})

router.get('/:word', (req, res) => {
  const word = req.params.word
  Keyword.find({ word })
    .lean()
    .then((wordList) => {
      if (wordList.length === 0) {
        res.status(500).send({
          err: 'word not found',
          givens: req.params,
        })
      } else res.send(wordList)
    })
    .catch((err) => {
      res.status(500).send({
        err,
        givens: req.params,
      })
    })
})

module.exports = router
