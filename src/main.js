import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import CanvasViewer from "./components/CanvasViewer";
import Home from "./components/Home";
import TextLayer from "./components/TextLayer";

const routes = [
  { path: "/", component: Home },
  { path: "/canvas", component: CanvasViewer },
  { path: "/textlayer", component: TextLayer }
];

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
});

const app = createApp(App);

app.use(router);
app.mount("#app");
