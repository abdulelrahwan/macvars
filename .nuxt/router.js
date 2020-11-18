import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _9f7c901e = () => interopDefault(import('..\\pages\\About.vue' /* webpackChunkName: "pages/About" */))
const _0168e6b3 = () => interopDefault(import('..\\pages\\Admin.vue' /* webpackChunkName: "pages/Admin" */))
const _6fd45a17 = () => interopDefault(import('..\\pages\\Brackets.vue' /* webpackChunkName: "pages/Brackets" */))
const _6d4258a4 = () => interopDefault(import('..\\pages\\forums\\index.vue' /* webpackChunkName: "pages/forums/index" */))
const _ccbd9466 = () => interopDefault(import('..\\pages\\Login.vue' /* webpackChunkName: "pages/Login" */))
const _504338eb = () => interopDefault(import('..\\pages\\matches\\index.vue' /* webpackChunkName: "pages/matches/index" */))
const _78bc00b3 = () => interopDefault(import('..\\pages\\Reset.vue' /* webpackChunkName: "pages/Reset" */))
const _32411e38 = () => interopDefault(import('..\\pages\\Signup.vue' /* webpackChunkName: "pages/Signup" */))
const _70842076 = () => interopDefault(import('..\\pages\\Verify.vue' /* webpackChunkName: "pages/Verify" */))
const _62bd069a = () => interopDefault(import('..\\pages\\forums\\create.vue' /* webpackChunkName: "pages/forums/create" */))
const _e3cb5c20 = () => interopDefault(import('..\\pages\\teams\\_id.vue' /* webpackChunkName: "pages/teams/_id" */))
const _0349c25a = () => interopDefault(import('..\\pages\\user\\_id.vue' /* webpackChunkName: "pages/user/_id" */))
const _8f96829a = () => interopDefault(import('..\\pages\\events\\_id\\bracket.vue' /* webpackChunkName: "pages/events/_id/bracket" */))
const _c7929556 = () => interopDefault(import('..\\pages\\events\\_id\\_slug.vue' /* webpackChunkName: "pages/events/_id/_slug" */))
const _651dcca4 = () => interopDefault(import('..\\pages\\forums\\_id\\_slug.vue' /* webpackChunkName: "pages/forums/_id/_slug" */))
const _fdb76472 = () => interopDefault(import('..\\pages\\matches\\_id\\_slug.vue' /* webpackChunkName: "pages/matches/_id/_slug" */))
const _9b20af74 = () => interopDefault(import('..\\pages\\players\\_id\\_slug.vue' /* webpackChunkName: "pages/players/_id/_slug" */))
const _588772d6 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/About",
    component: _9f7c901e,
    name: "About"
  }, {
    path: "/Admin",
    component: _0168e6b3,
    name: "Admin"
  }, {
    path: "/Brackets",
    component: _6fd45a17,
    name: "Brackets"
  }, {
    path: "/forums",
    component: _6d4258a4,
    name: "forums"
  }, {
    path: "/Login",
    component: _ccbd9466,
    name: "Login"
  }, {
    path: "/matches",
    component: _504338eb,
    name: "matches"
  }, {
    path: "/Reset",
    component: _78bc00b3,
    name: "Reset"
  }, {
    path: "/Signup",
    component: _32411e38,
    name: "Signup"
  }, {
    path: "/Verify",
    component: _70842076,
    name: "Verify"
  }, {
    path: "/forums/create",
    component: _62bd069a,
    name: "forums-create"
  }, {
    path: "/teams/:id?",
    component: _e3cb5c20,
    name: "teams-id"
  }, {
    path: "/user/:id?",
    component: _0349c25a,
    name: "user-id"
  }, {
    path: "/events/:id?/bracket",
    component: _8f96829a,
    name: "events-id-bracket"
  }, {
    path: "/events/:id?/:slug?",
    component: _c7929556,
    name: "events-id-slug"
  }, {
    path: "/forums/:id/:slug?",
    component: _651dcca4,
    name: "forums-id-slug"
  }, {
    path: "/matches/:id/:slug?",
    component: _fdb76472,
    name: "matches-id-slug"
  }, {
    path: "/players/:id?/:slug?",
    component: _9b20af74,
    name: "players-id-slug"
  }, {
    path: "/",
    component: _588772d6,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
