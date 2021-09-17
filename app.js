const Koa = require('koa')
const app = new Koa()

// 插件
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors') // 跨域
// jwt过程 用户登录时，服务端返回token；用户发需要登录操作的接口时，需要带上token进行验证，验证成功可以返回，过期或无效返回401。
const jwtKoa = require('koa-jwt') // jwt登录 （对是否为当前用户进行验证）

// 中间件
const pv = require('./middleware/koa-pv') // 自己写的中间件的例子

// 封装的方法和常量
const {verToken,SECRET} = require('./config/constants') //jwt密匙和封装的方法

// routes
const index = require('./routes/index')
const person = require('./routes/person/index')
const login = require('./routes/login/index')

// 连接数据库
const mongoose = require('mongoose') // mongoose 用于连接数据库
const dbConfig = require('./dbs/config') // MongoDB的配置的连接地址

// error handler
onerror(app)
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// 跨域
app.use(cors({
  origin: function(ctx) {
    return 'http://localhost:3001' // 本地前端项目地址
  }
}))

// 这一步是为了把解析出来的用户信息存入全局state中，这样在其他任一中间价都可以获取到state中的值
// app.use(async(ctx,next) => {
//   const token = ctx.headers.authorization;
//   if(token !== 'null' && token){
//     verToken(token).then(res => {
//       console.log(ctx.state,'1')
//       // console.log(ctx,'ctx1')
//       ctx.state = {
//         data: res
//       }
//       console.log(ctx.state,'2')
//       // console.log(ctx,'ctx2')
//     })

//   }
//   await next();
// })

// 401 登录超期报错返回
app.use(async(ctx,next) => {
  return next().catch(err => {
    if(err.status === 401){
      ctx.code = 401;
      ctx.body = {
        code: 401,
        success: false,
        msg: '登录过期，请重新登录'
      }
    }else{
      throw err;
    }
  })
})

// 对是否为当前用户进行验证
app.use(jwtKoa({
    secret: SECRET,
  }).unless({
    // 自定义哪些目录忽略JWT验证,此处为接口数组 '/login/login' '/login/register'
  path:['/login/login','/login/register' ]
}))

app.use(pv())
app.use(require('koa-static')(__dirname + '/public'))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(person.routes(), person.allowedMethods())
app.use(login.routes(), login.allowedMethods())

// 连接数据库的服务
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
},(res) => {
  console.log('连接上了')
},(err) => {
  console.log(err)
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
