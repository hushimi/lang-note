import axios from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

declare global {
  interface Window {
    axios: typeof axios;
    route: typeof ziggyRoute;
  }
}

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Make Ziggy route function available globally
window.route = ziggyRoute;
