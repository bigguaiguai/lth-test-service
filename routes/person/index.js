
const router = require('koa-router')()

// 引入mongo模型
const Person = require('../../dbs/models/person')
const PersonDetail = require('../../dbs/models/person-detail')
// 引入公共方法
const { filterObjFalse } = require('../../config/constants')
// 设置接口前缀
router.prefix('/users')


router.post('/addPerson', async function (ctx) {
  // 创建实例
  const person = new Person({
    name: ctx.request.body.name,
    age: ctx.request.body.age,
    createTime: new Date().getTime(),
  })
  let code = 200 // 状态码
  let msg = '新增成功'
  let success = true;
  try {
    await person.save()
  } catch (e) {
    code = 400;
    success = false
    msg = '新增失败:' + e;;
  }
  ctx.body = {
    code,
    msg,
    success,
  }
})

router.post('/getPerson', async function (ctx) {
  let code = 200
  let msg = '查询成功'
  let success = true;

  const search = filterObjFalse(ctx.request.body.search)
  let result = []
  let results = [];
  try {
    //显示符合前端分页请求的列表查询
    const pageSize = Number(ctx.request.body.pageSize); // 限制多少条，用于一页展示多少条
    const pageNo = Number(ctx.request.body.pageNo);
    const skipNum = (pageNo - 1) * pageSize; // 跳过多少条，用于分页
    const createTime = search?.createTime; // 时间段的过滤条件
    if (createTime) {
      delete search.createTime;
      search.createTime = { $gte: createTime[0], $lte: createTime[1] } // 大于第一个时间，小于第二个时间
    }
    const sortObj = ctx.request.body.orderProp; // 根据哪个字段排序
    results = await Person.find(search).sort(sortObj) // 不分页的接口用于获取总数
    result = await Person.find(search).sort(sortObj).skip(skipNum).limit(pageSize)
  } catch (e) {
    code = 400;
    success = false;
    msg = '查询失败:' + e;
  }
  ctx.body = {
    code,
    msg,
    success,
    result,
    total: results.length,
  }
})

router.post('/updatePerson', async function (ctx) {
  // 找到符合条件的name,并修改其age
  // await Person.where({
  //   _id: ctx.request.body._id
  // }).update({
  //   name: ctx.request.body.name,
  //   age: ctx.request.body.age
  // })
  const person = Person.where({
    _id: ctx.request.body._id
  })
  let code = 200 // 状态码
  let msg = '修改成功'
  let success = true;
  try {
    await person.update({
      name: ctx.request.body.name,
      age: ctx.request.body.age,
    })
  } catch (e) {
    code = 400
    msg = '修改失败:' + e;
    success = false
  }
  ctx.body = {
    code, msg, success,
  }

})

router.post('/removePerson', async function (ctx) {
  let code = 200 // 状态码
  let msg = '删除成功'
  let success = true;
  const _id = ctx.request.body._id
  try {
    await Person.remove({ _id })
  } catch (err) {
    code = 400
    success = false
    msg = '删除失败:' + err;
  }
  ctx.body = {
    msg,
    code,
    success,
  }
})

router.post('/getPersonDetail', async function (ctx) {
  let code = 200
  let msg = '详细信息查询成功';
  let success = true;
  let result = {};
  const _id = ctx.request.body._id
  try {
    result = await Person.find({_id}).populate('detail')
    console.log(result,'res1')
  } catch (e) {
    console.log(e, 'eee')
  }
  ctx.body = {
    msg,
    code,
    success,
    result,
  }
})

module.exports = router
