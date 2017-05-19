let indexName
let indexComp

if (window.localStorage.fbToken) {
  indexName = 'home'
  indexComp = require('components/Home')
} else {
  indexName = 'login'
  indexComp = require('components/Login')
}

export default [
  {
    path: '/',
    name: indexName,
    component: indexComp
  },
  {
    path: '/landing',
    name: 'landing',
    component: require('components/Matches')
  },
  {
    path: '/swipe',
    name: 'swipe',
    component: require('components/Swipe')
  },
  {
    path: '/analyze',
    name: 'analyze',
    component: require('components/Analyze')
  },
  {
    path: '*',
    redirect: '/'
  }
]
