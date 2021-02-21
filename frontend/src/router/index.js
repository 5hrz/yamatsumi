import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

import Login from '@/views/Login.vue';
import Logout from '@/views/Logout.vue';
import ExerciseList from '@/views/ExerciseList.vue';
import Exercise from '@/views/Exercise.vue';

Vue.use(VueRouter);

const appName = 'YAMATSUMI';
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: `Login - ${appName}`
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {
      title: `Logout - ${appName}`
    }
  },
  {
    path: '/exercise',
    name: 'ExerciseList',
    component: ExerciseList,
    meta: {
      title: appName,
      requiresAuth: true
    }
  },
  {
    path: '/exercise/:exerciseId',
    name: 'Exercise',
    component: Exercise,
    meta: {
      title: `Exercise - ${appName}`,
      requiresAuth: true
    }
  },
  {
    path: '*',
    redirect: '/exercise'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const userData = store.state.userData;
  if (userData.isEdit && !confirm('Are you sure you want to cancel editing Exercise?')) {
    next(false);
    return;
  }
  if (to.matched.some(record => !record.meta.requiresAuth) || ((to.matched.some(record => !record.meta.requiresSuperuser) || userData.isSuperuser) && userData.isAuthed)) {
    if ((to.name === 'Login' && userData.isAuthed)) {
      next({ name: 'ExerciseList' });
    } else {
      next();
    }
  } else if (userData.isAuthed) {
    next({ name: 'ExerciseList' });
  } else {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    });
  }
});

export default router;
