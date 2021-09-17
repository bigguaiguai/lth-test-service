const jwt = require('jsonwebtoken') // jwt登录（对返回信息进行加密）

const SECRET = 'lthloginjwttest'

// 设置token
const setToken = (userName, _id) => {
    const token = jwt.sign(
        {
            userName: userName,
            _id: _id,
        },
        SECRET,
        {
            expiresIn: '1h'
        }
    );
    return token;
}

// 解析token
const verToken = (token) => {
    return new Promise((resolve) => {
        var userInfo = jwt.verify(token.split(' ')[1], SECRET);
        resolve(userInfo);
    })
}

// 对obj中过滤去除没有正常数值的，避免传参传入null报错
const filterObjFalse = (obj) => {
    Object.getOwnPropertyNames(obj).forEach(key => {
        if (obj[key]) {
        } else {
            delete obj[key]
        }
    })
    return obj
}



exports.SECRET = SECRET
exports.setToken = setToken
exports.verToken = verToken
exports.filterObjFalse = filterObjFalse