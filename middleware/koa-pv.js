function pv (ctx) {
    // global.console.log('ctx 中间件中的ctx.state', ctx.state) // node中全局不能用window，需要用global来代替
}

module.exports = function () {
    return async function(ctx,next) {
        pv(ctx)
        await next() // 每个中间件都必须有这一句，用以执行下一个中间件
    }
}