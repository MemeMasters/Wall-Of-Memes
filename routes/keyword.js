'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Keyword = require('../models/KeywordModel.js')

const router = express.Router()


router.get('/:word', (req, res) => {
    let word = req.params.word
    Keyword.find({word: word})
    .lean()
    .then((wordList) => {
        res.send(wordList[0].votes)
    })
    .catch((err) => {
        res.status(500).send({
            err,
            givens: req.params
        })
    })
})

router.get('/top', (req, res) => {
	Keyword
		.find()
		.lean()
		.then((wordList) => {
			const topWords = wordList.reduce((accumulator, word) => {
				let wordSum = word.votes[word.votes.length-1].sum
				let topSum = accumulator.sum
				if (wordSum > topSum) {
					accumulator.words = [word]
					accumulator.sum = wordSum
				}
				if (wordSum === topSum) {
					accumulator.words.push(word)
				}
				return accumulator
			}, {
				sum: 0,
				words: []
			})
			res.send(topWords.words)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).send({
                err,
                givens: req.query
            })
		})
})

module.exports = router
