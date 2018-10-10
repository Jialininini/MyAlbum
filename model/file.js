//model层,专门用于数据的相关操作
var fs = require("fs");
var fd = require("formidable");
var sd = require("silly-datetime");
var rimraf = require("rimraf");
//获取文件夹
exports.getDirs = function(callback){
    //return ["a","b","c"];
    //读取uploads中的内容,并返回给调用者
    //该方法是异步的,在读取完毕之前,调用者router已经结束程序了
    /*fs.readdir("./uploads",function(err,files){//是app.js找uploads文件夹
        if(err){
            console.log(err);
            return "failed to read file";
        }else{
            console.log(files)
            return files;
        }
    });*/
    //办法:使用回调函数
    fs.readdir("./uploads",function(err,files){
        if(err){
            callback(err,null)
        }else{ //无错误,返回数据
            callback(null,files)
        }
    })

};//谁调用这个方法,就export给谁

//获取某个文件夹的内容
//dirName:读取的文件夹的名称
exports.getPics = function(dirName,callback){
    fs.readdir("./uploads/"+dirName,function(err,files){
        // console.log("files:"+files);
        callback(err,files);
    })
}

//创建文件夹
exports.mkdir = function(dirName,callback){ //需要回调:成功不成功都要
    fs.mkdir("./uploads/"+dirName,function (err){
        callback(err);
    })
}

//上传图片
//参数: dirName 文件保存的路径;req:将要解析的请求
exports.upload = function(req,callback){
    //获取form表单对象 IncomingForm
    var form = new fd.IncomingForm();
    //设置文件保存的路径 form.upload='路径'
    form.uploadDir = "./uploads/";
    //解析请求数据
    form.parse(req,function(err,fields,files){
        //无论解析的结果如何,全部返回给调用者
        callback(err,fields,files);
    })
}


//删除指定文件夹  dirName:将要被删除的文件夹名称
exports.del = function(dirName,callback){
    rimraf("./uploads/"+dirName,function(err){
        callback(err);
    })
}
