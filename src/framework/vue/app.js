import Vue from 'vue';
import './filter';
import './directive';
import './component';

const App = {};

App.data = () => {
  return window.__INITIAL_STATE__ || {};
};

App.init = options => {
  if (EASY_ENV_IS_NODE) {
    console.log('server render /n');
    return App.server(options);
  }
  console.log('client render /n');
  return App.client(options);
};


App.client = options => {
  Vue.prototype.$http = require('axios');
  if (options.store) {
    options.store.replaceState(Object.assign({}, App.data(), options.store.state));
  } else if (window.__INITIAL_STATE__) {
    options.data = Object.assign(window.__INITIAL_STATE__, options.data && options.data());
  }
  const app = new Vue(options);
  app.$mount('#app');
};

App.server = options => {
  if (options.store && options.router) {
    console.log('处理预取');
    return context => {
      options.router.push(context.state.url);
      const matchedComponents = options.router.getMatchedComponents();
      console.log(matchedComponents, options.router);
      if (!matchedComponents) {
        return Promise.reject({ code: '404' });
      }
      return Promise.all(
        matchedComponents.map(component => {
          console.log('遍历组件,当前：', component.name);
          if (component.preFetch) {
            console.log('存在服务端预取');
            return component.preFetch(options.store);
          }
          return null;
        })
      ).then(() => {
        context.state = Object.assign(options.store.state, context.state);
        return new Vue(options);
      }).catch((err) => {
        console.log(err);
      });
    };
  }
  console.log('没有预取');
  return context => {
    const VueApp = Vue.extend(options);
    const app = new VueApp({ data: context.state });
    return new Promise(resolve => {
      resolve(app);
    });
  };
};

App.use = component => {
  Vue.use(component);
};

App.component = (name, component) => {
  Vue.component(name, component);
};


export default App;
