import axios from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

declare global {
  interface Window {
    axios: typeof axios;
    route: typeof ziggyRoute;
  }
}

type AppGlobals = typeof globalThis & {
  axios: typeof axios;
  route: typeof ziggyRoute;
};

const appGlobal = globalThis as AppGlobals;

appGlobal.axios = axios;
appGlobal.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Make Ziggy route function available globally
appGlobal.route = ziggyRoute;
