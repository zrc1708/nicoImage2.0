const Router = require('koa-router')
const Mysql = require('mysql2/promise'); //引入mysql,mysql依赖
const mysql_nico = require('./mysql.js') // 导入数据库登录信息
const fs = require("fs");
const path = require('path');
const send = require('koa-send');
const mime = require('mime-types');

const tinify = require("tinify");
tinify.key = "HkkzR8kq2LdqpBJpwQkJ0SvXBPrynYHP";

const filerouters = new Router()

const baseurl = 'http://imgapi.jibei66.com'

// 文件上传接口
filerouters.post('/uploadimage', async (ctx, next) => {
    let file,fileNames
    // 获取保存文件用的文件名, 获取文件
    if(ctx.request.files.file.length){
        file = [...ctx.request.files.file]
    }else{
        file = [ctx.request.files.file]
    }
    fileNames = [...ctx.request.body.fileNames.split(',')]

    // 保存文件
    file.forEach((item,index)=>{
        // 创建可读流
        const reader = fs.createReadStream(item.path);
        let filePath = path.join(__dirname+'/images') + `/${fileNames[index]}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
    })

    var sourse = tinify.fromFile(path.join(__dirname+'/images')+`/${fileNames[0]}`);//输入文件
    // console.log(path.join(__dirname+'/images')+`/${fileNames[0]}`)
    // console.log(fileNames[0].split('.')[0]+'-tiny.'+fileNames[0].split('.')[1])
    await sourse.toFile(path.join(__dirname+'/images')+`/${fileNames[0].split('.')[0]+'-tiny.'+fileNames[0].split('.')[1]}`); //输出文件

    var imageUrl = []
    // 将文件信息写入数据库
    const connection = await Mysql.createConnection(mysql_nico)
    fileNames.forEach(async (item)=>{
        let filepath = path.join(__dirname+'/images')+ `/${item}`
        // 顺便生成图片文件的访问地址
        let url = baseurl+'/getimage/'+item
        imageUrl.push(url)
        const sql = `INSERT INTO image (filename, path,url) VALUES ( '${item}', '${filepath}','${url}');`
        const [rs] = await connection.query(sql);
    })
    connection.end(function(err){})

    return ctx.body = {
        message:"上传成功！",
        imageUrl,
        code:200,
    };
});

// 公开的文件上传接口
filerouters.post('/nicoimageapi/:userkey', async (ctx, next) => {
    const userkey = ctx.params.userkey.trim()
    if(userkey!=='zrc'){
        return ctx.body = {
            message:"用户密钥不正确",
            code:440,
        };
    }

    let file,fileNames
    // 获取保存文件用的文件名, 获取文件
    if(ctx.request.files.file.length){
        file = [...ctx.request.files.file]
    }else{
        file = [ctx.request.files.file]
    }
    fileNames = [...ctx.request.body.fileNames.split(',')]

    // 判断用户上传的文件名是否正确(附带后缀)
    let flag = false
    fileNames.forEach(item=>{
        if(item.indexOf('.')==-1){
            flag = true
        }
    })
    if(flag){
        return ctx.body = {
            message:"文件名不正确，请附带后缀",
            code:440,
        };
    }

    // 保存文件
    file.forEach((item,index)=>{
        // 创建可读流
        const reader = fs.createReadStream(item.path);
        let filePath = path.join(__dirname+'/images') + `/${fileNames[index]}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
    })

    var imageUrl = []
    // 将文件信息写入数据库
    const connection = await Mysql.createConnection(mysql_nico)
    fileNames.forEach(async (item)=>{
        let filepath = path.join(__dirname+'/images')+ `/${item}`
        // 顺便生成图片文件的访问地址
        let url = baseurl+'/getimage/'+item
        imageUrl.push(url)
        const sql = `INSERT INTO image (filename, path,url) VALUES ( '${item}', '${filepath}','${url}');`
        const [rs] = await connection.query(sql);
    })
    connection.end(function(err){})

    return ctx.body = {
        message:"上传成功！",
        imageUrl,
        code:200,
    };
});

// 获取图片接口
filerouters.get('/getimage/:imageName', async (ctx, next) => {
    const imageName = ctx.params.imageName.trim()
    // 设置文件路径
    let filePath = path.join(__dirname)+'/images/'+imageName
	try {
	    //读取文件
        file = fs.readFileSync(filePath)
	} catch (error) {
		//如果服务器不存在请求的图片，返回默认图片
	    filePath = path.join(__dirname, '/404/404.png')
	    file = fs.readFileSync(filePath)    
    }
    //读取图片文件类型
    let mimeType = mime.lookup(filePath)
    //设置返回类型
    ctx.set('content-type', mimeType)
    //返回图片
	ctx.body = file
});

// 获取所有图片
filerouters.get('/getallimages', async (ctx, next) => {
    const connection = await Mysql.createConnection(mysql_nico)
    const sql = "SELECT * FROM image";
    const [rs] = await connection.query(sql);
    connection.end(function(err){})
    ctx.body = {
        code:200,
        message:"获取所有图片成功！",
        rs
    }
});

// 删除文件接口
filerouters.post('/remove', async function (ctx) {
    const path = ctx.request.body.path

    const connection = await Mysql.createConnection(mysql_nico)
    const sql = `delete from image where path='${path}';`
    const [rs] = await connection.query(sql);

    connection.end(function(err){})

    await fs.unlink(path.trim(), (err) => {
        if (err) throw err;
    });
    
    return ctx.body = {
        message:"删除文件成功！",
        code:200,
    };
});

module.exports = filerouters