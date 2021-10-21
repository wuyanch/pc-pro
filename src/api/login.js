import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  console.log(parameter)
  return axios({
    url: '/customer/common/login',
    method: 'POST',
    data: parameter
  })
}

