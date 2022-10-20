import { request } from 'umi';

const prefix = REACT_APP_ENV === 'dev' ? '/api' : API_PREFIX

export default (path, opt) => {
  const { headers: h, ...rest } = opt
  const headers = {
    ...h,
    // 'x-csrf-token': Cookies.get('csrfToken') || '',
  }
  return request(`${prefix}${path}`, { headers, ...rest })
}

export const api = path => `${prefix}${path}`
