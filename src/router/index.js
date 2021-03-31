import Vue from 'vue'
import VueRouter from 'vue-router'
import MainMenu from '../views/MainMenu.vue'
import Game from '../views/Game.vue'
import LevelSelect from '../views/LevelSelect.vue'
import LevelEdit from '../views/LevelEdit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MainMenu',
    component: MainMenu
  },
  {
    path: '/game/:levelId',
    name: 'Game',
    component: Game
  },
  {
    path: '/levelselect',
    name: 'LevelSelect',
    component: LevelSelect
  },
  {
    path: '/leveledit',
    name: 'LevelEdit',
    component: LevelEdit
  }
]

const router = new VueRouter({
  routes
})

export default router
