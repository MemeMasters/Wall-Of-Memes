import dispatcher from '../dispatcher'
import ActionTypes from '../constants/ActionTypes'

export default class ArticleActions {

  static fetchArticles(sort, lastArticle) {
    return new Promise((resolve, reject) => {
      let fetchURL = 'articles'
      const lastDate = (lastArticle) ? lastArticle.publishedAt : null
      const lastVote = (lastArticle) ? lastArticle.votes : null

      switch (sort) {
        case 'NEW': {
          fetchURL += '/new'
          if (lastDate) {
            fetchURL += `?lastDate=${lastDate}`
          }
          break
        }
        case 'TOP': {
          fetchURL += '/top'
          if (lastDate && lastVote) {
            fetchURL += `?lastVote=${lastVote}&lastDate=${lastDate}`
          }
          break
        }
      }

      fetch(fetchURL)
        .then(res => res.json())
        .then((articles) => {
          dispatcher.dispatch({
            articles,
            type: ActionTypes.UPDATE_ARTICLES,
          })
          resolve()
        })
        .catch(err => reject(err))
    })
  }

  static changeSort(sort) {
    dispatcher.dispatch({
      sort,
      type: ActionTypes.UPDATE_SORT,
    })
  }

  static postVote(vote, id) {
    return new Promise((resolve, reject) => {
      // TODO: Could add a dispatch here if need post vote info
      fetch('articles/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote, id }),
      })
        .then(res => resolve(res.json()))
        .catch(err => reject(err))
    })
  }
}
