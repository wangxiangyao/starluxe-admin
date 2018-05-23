import Vue from 'vue';

import Layout from 'component/layout/app';
import mask from 'component/mask/mask.vue';
import navigation from 'component/navigation/navigation.vue';
import topBar from 'component/topBar/topBar.vue';

Vue.component(Layout.name, Layout);
Vue.component(mask.name, mask);
Vue.component(navigation.name, navigation);
Vue.component(topBar.name, topBar);
