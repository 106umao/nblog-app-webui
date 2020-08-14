import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import NoteList from '../components/public/NoteList.vue'
import Login from '../components/public/Login.vue'
import Register from '../components/public/Register.vue'
import NoteDetail from '../components/public/NoteDetail.vue'
import SeeNote from '../components/public/SeeNote.vue'
import PersonalCenter from '../components/private/PersonalCenter.vue'
import PersonalNoteDetial from '../components/private/PersonalNoteDetial.vue'
import PersonalNote from '../components/private/PersonalNote.vue'
import EditNote from '../components/private/EditNote.vue'
import MyFavorite from '../components/private/MyFavorite.vue'
import Archived from '../components/Archived.vue'
import EditArticle from '../components/EditArticle.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/archived', component: Archived },
  { path: '/editArticle', component: EditArticle },
  {
    path: '/home',
    component: Home,
    redirect: '/public/noteList',
    children: [
      {
        path: '/note',
        component: SeeNote,
        children: [
          { path: '/public/noteList', component: NoteList },
          {
            path: '/public/noteDetail/:noteId',
            component: NoteDetail,
            props: true
          }
        ]
      },
      {
        path: '/personalCenter',
        component: PersonalCenter,
        children: [
          { path: '/personalNoteDetail/:noteId', props: true, component: PersonalNoteDetial },
          { path: '/personalNoteList', component: PersonalNote },
          { path: '/edit/note/:contentType', props: true, component: EditNote },
          { path: '/myfavorite', component: MyFavorite }
        ]
      }

    ]
  },
  {
    path: '/',
    redirect: '/home'
  },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

const router = new VueRouter({
  routes
})
// eslint-disable-next-line no-use-before-define
router.beforeEach((to, from, next) => {
  return next()
  // console.log(to)
  // to = to.path
  // if (to.indexOf('/public') !== -1 || to === '/' || to === '/login' || to === '/logout' || to === '/register') {
  //   return next()
  // }
  // if (window.localStorage.getItem('token') != null) {
  //   console.log(to.indexOf('/admin'))
  //   if (to.indexOf('/admin') !== -1) {
  //     if (JSON.parse(window.localStorage.getItem('loginUser')).role !== 0) {
  //       return next()
  //     }
  //     return next('/')
  //   } else { return next() }
  // }
  // return next('/')
})

export default router
