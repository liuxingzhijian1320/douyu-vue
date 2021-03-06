import Vue from 'vue'
import Router from 'vue-router'
import setTitle from 'assets/scripts/settitle.js'; // 设置页面标题


const home = resolve =>
  import ('../views/home/home');

const classify = resolve =>
  import ('../views/classify/classify');

const user = resolve =>
  import ('../views/user/user');

const login = resolve =>
  import ('../views/login/login');

const detail = resolve =>
  import ('../views/detail/detail');


Vue.use(Router)

const router = new Router({

  mode: 'hash', // ['history', 'hash']
  linkActiveClass: 'active', // active class 名称
  scrollBehavior(to, from, savedPosition) { // 后退页面时, 保留滚动位置
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },

  routes: [
    {
      path: '/',
      component: home,
      name: 'home'
    },
    {
      path: '/classify',
      component: classify,
      meta: {
        title: '分类',
        login: true
      }
    },
    {
      path: '/user',
      component: user,
      meta: {
        title: '个人中心',
        login: true
      }
    },
    {
      path: '/login',
      component: login,
      meta: {
        title: '登陆',
        login: false
      }
    },
    {
      path: '/detail/:id',
      component: detail,
      meta: {
        title: '详情',
        login: false
      }
    },
    {
      path: "*",
      redirect: {
        name: 'home'
      }
    }
  ]
})


router.beforeEach((to, from, next) => {
  // console.info(22, window.location.href)
  //console.info(to,from,next)
  // 对路由变化作出响应...
  // console.log(router,to)
  // console.log(router,to.query, from)
  // console.log(to,$.param( to.query ),window.location.href)


  //全局拦截器的
  // console.info(to)
  // next()
  if (to.meta.login) {  // 判断该路由是否需要登录权限
    if (JSON.parse(localStorage.getItem('login_user_info_cookie')) &&
      JSON.parse(localStorage.getItem('login_user_info_cookie')).name
      && JSON.parse(localStorage.getItem('login_user_info_cookie')).phone) {
      next();
    }
    else {
      MessageBox.alert('未登录，请先登录').then(() => {
        next({
          path: '/login',
          redirect: to.fullPath
        })
      })
    }
  }
  else {
    next();
  }


  addHtmlBodyClass(from, to)

  // html加class ==>给每个组件添加一个className ，min-height：100vh；有些手机是不兼容
  //使用方法：html-路由的名称 组成的一个className：height:100%;width:100%; 全屏充满
  //这个className的查看方法 控制台 Element 即可
  function addHtmlBodyClass(from, to) {
    const fromName = from.name || '';
    const toName = to.name || '';
    if (fromName) {
      document.documentElement.classList.remove(`html-${fromName}`);
    }
    document.documentElement.classList.add(`html-${toName}`);
  }


  // next();
})


// 路由变化, 关闭弹窗
router.afterEach(function (to) {
  if (to.meta && to.meta.title) {
    //console.info(to.meta.title)
    setTitle(to.meta.title);
  }
  // store.commit('closeModal');
})


export default router;
