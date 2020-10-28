const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js') // 导入数据库登录信息
const jwt = require('jsonwebtoken')
// const md5 = require('js-md5');

const router1 = new Router()

//登录，根据用户名和密码查询用户信息接口
router1.post('/checkuser', async ctx => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `SELECT * FROM user where username = '${username}' and password= '${password}'`;
    const [rs] = await connection.query(sql);
    // 登录信息正确
    if (rs.length === 1) {
        let userToken = {
            username,
            id: rs[0].id,
        }
        let secret = 'niconiconi' // 指定密钥
        // 生成token
        let token = jwt.sign(userToken, secret, {
            expiresIn: '7d'
        })

        // token存入mysql
        const sql = `UPDATE user SET token = '${token}' WHERE id = '${rs[0].id}';`
        await connection.query(sql);
        // 连接结束
        connection.end(function(err){}) 

        ctx.body = {
            rs,
            token,
            code: 200
        }
    } else {
        ctx.body = {
            message: '登录失败',
            code: 400
        }
    }

});

// 自动登录所使用的接口
router1.post('/quickcheckuser', async ctx => {
    const token = ctx.request.body.token

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `SELECT * FROM user where token = '${token}'`;
    const [rs] = await connection.query(sql);
    if (rs.length === 1) {
        let userToken = {
            username:rs[0].username,
            id: rs[0].id,
        }
        let secret = 'niconiconi'
        // 生成新token
        let token = jwt.sign(userToken, secret, {
            expiresIn: '15d'
        })

        // token存入mysql
        const sql = `UPDATE user SET token = '${token}' WHERE id = '${rs[0].id}';`
        await connection.query(sql);
        // 连接结束
        connection.end(function(err){}) 

        ctx.body = {
            token,
            rs,
            message: '自动登录成功',
            code: 200
        }
    }else{
        ctx.body = {
            message: '自动登录失败',
            code: 400
        }
    }
});

module.exports = router1