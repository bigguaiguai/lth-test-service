const router = require('koa-router')()

// 引入mongo模型
const Users = require('../../dbs/models/users')
// 自定义方法
const {setToken,filterObjFalse} = require('../../config/constants')
// 设置接口的默认前缀
router.prefix('/login')

router.post('/login', async function (ctx) {
    let code = 200;
    let msg = '登录成功';
    let success = true;
    let token = null;
    // 参数过滤 去除null
    const search = filterObjFalse(ctx.request.body);
    try {
        // 根据 用户名和密码 在数据库查找是否存在
        const results = await Users.find(search)
        if (results.length > 0) {
            // 如果存在更新登录时间
            await results[0].update({
                loginTime: new Date().getTime(),
            });
            // 根据jsonwebtoken对返回信息进行加密，获取token 
            token = setToken(results[0].userName,results[0]._id)
        } else {
            success = false;
            msg = '登录失败：该用户不存在';
        }
    } catch (e) {
        code = 400;
        success = false;
        msg = '登录失败:' + e;
    }
    ctx.body = {
        code,
        msg,
        success,
        token,
    }
})

router.post('/register', async function (ctx) {
    let code = 200;
    let msg = '注册成功';
    let success = true;
    const search = filterObjFalse({
        userName: ctx.request.body.userName
    })
    try {
        const results = await Users.find(search)
        // 如果查得到 说明用户名已存在
        if (results.length > 0) {
            msg = '该账号已注册';
            success = false;
        } else {
            // 如果查不到 就创建一个新的
            const users = new Users({
                userName: ctx.request.body.userName,
                password: ctx.request.body.password,
                createTime: new Date().getTime(),
            })
            await users.save()
        }
    } catch (e) {
        code = 400
        msg = '新增失败:' + e;
        success = false;
    }
    ctx.body = {
        code,
        msg,
        success,
    }
})

module.exports = router