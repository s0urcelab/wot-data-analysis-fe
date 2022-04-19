import { request } from 'umi';
import Cookies from 'js-cookie'

export default (path, opt) => {
  const prefix = REACT_APP_ENV === 'dev' ? '/api' : API_PREFIX
  const { headers: h, ...rest } = opt
  const headers = {
    ...h,
    // 'x-csrf-token': Cookies.get('csrfToken') || '',
  }
  return request(`${prefix}${path}`, { headers, ...rest })
}
