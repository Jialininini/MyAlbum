//引入模块
var express = require("express");
var app = express();
var router = require("./controller/router.js")
//var router = require("controller");

app.listen(4000);
//设置视图模板引擎
app.set("view engine","ejs");
//设置根目录
app.use(express.static("./public"));
app.use(express.static("./uploads"));
//处理/请求
app.get("/",router.index);
app.get("/newDir",router.newDir);
app.get('/mkdir',router.mkdir);

app.get("/upload",router.upload);

app.post("/doUpload",router.doUpload);

//app.get("/del:dirName") ==> req.params.dirName;
//处理/del请求,删除文件夹
app.get("/del/:dirName",router.del);
//处理查看文件夹内容的请求(点击某个文件夹,显示文件夹的图片);因为文件夹名称不确定,故采用参数的方式
app.get("/:dirName",router.show);

//处理/:dirName请求,显示某文件夹的内容

