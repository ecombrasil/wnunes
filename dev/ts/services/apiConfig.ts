import { Cookies } from 'easy-coding';
import HttpConfig from 'http-service-ts/lib/http.config';

const apiConfig: HttpConfig = {
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken')
  }),
  appendSlash: true
}

export default apiConfig;
