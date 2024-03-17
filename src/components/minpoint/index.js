
const install = (app) => {
  console.log('======尝试注册FQ======')

  const context = require.context(
    '@/components/minpoint',
    true,
    /.vue$/
  )

  context.keys().forEach(item => {
    const model = context(item).default
    const lastSign = item.lastIndexOf('/')
    const lastPoint = item.lastIndexOf('.')
    const name = !model.name ? item.substring(lastSign + 1, lastPoint) : model.name
    console.log('注册全局组件：', name)
    app.component(name, model)
  })
}
export default {
  install
}
