import enquireJs from 'enquire.js'

const enquireScreen = function (call) {
  // tablet
  // const handler = {
  //   match: function () {
  //     call && call(0)
  //   },
  //   unmatch: function () {
  //     call && call(-1)
  //   }
  // }
  // mobile
  const matchMobile = {
    match: () => {
      call && call(1)
    }
  }
  // matchLablet
  const matchLablet = {
    match: () => {
      call && call(2)
    }
  }
  // matchDesktop
  const matchDesktop = {
    match: () => {
      call && call(3)
    }
  }
  // enquireJs.register('screen and (max-width: 1087.99px)', handler)
  // enquireJs.register('screen and (max-width: 767.99px)', handler2)
  // 定义三种视口的宽度

enquireJs
  .register('screen and (max-width: 576px)', matchMobile)
  .register('screen and (min-width: 576px) and (max-width: 1199px)', matchLablet)
  .register('screen and (min-width: 1200px)', matchDesktop)

}

export default enquireScreen 