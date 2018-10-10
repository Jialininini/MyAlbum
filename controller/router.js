//router路由,用于处理具体的业务逻辑,由app.js来调用
var file = require("../model/file.js");
var fs = require("fs");
var sd = require("silly-datetime");
var rimraf = require("rimraf");
//处理/请求
exports.index = function(req,res){
    //var dirs = file.getDirs();
    //console.log(dirs)
    //res.render("index",{dirs:dirs});
    file.getDirs(function(err,files){
        if(err){
            console.log(err);
            res.send("error")
        }else{
            res.render("index",{dirs:files});
        };
    });
}

exports.show = function(req,res) {
    var dirName = req.params.dirName;
    file.getPics(dirName,function(err,files){
        if(err){
            console.log("router:"+err);
            console.log("router:"+files);
            res.end("error");
        }else{
            //显示文件需要文件夹名称,一起传过去
            res.render("show",{pics:files,dirName:dirName});
        }
    })
}

exports.newDir = function(req,res){
    res.render("newdir");
}

//处理mkdir请求,创建文件夹
exports.mkdir = function(req,res){
    //如何获取数据req.query 拿到新建文件夹名字
    var dirName = req.query.dirName;
    //调用file对应的创建文件夹的方法
    file.mkdir(dirName,function(err){
        if (err){
            console.log(err);
            res.send("failed to create a new file, click here to <a href='/newDir'>go back</a>")
        }else{
            //创建成功,返回首页
            res.redirect("/");
        }
    })

}

//处理/upload请求,跳转到上传图片页面
exports.upload = function(req,res){
    //上传页面需要选择上传的文件夹,使用要获取所有文件夹的名称,传递给上传视图页面
    file.getDirs(function(err,files){
        if(err){
            console.log(err);
            res.send("Line busy, click <a href='/'>back</a>")
        }else{
            //跳转到upload视图,同时将files传递过去
            res.render("upload",{dirs:files})
        }
    })
}

//处理/doUpload请求,具体的上传图片的操作
        //分给file.js去做
exports.doUpload = function(req,res){
    //调用file的upload方法
   // console.log(req);//req中没有上传的图片和文件夹信息

    file.upload(req,function(err,fields,files){
        //console.log(fields);
        //console.log(files);
        //重命名
        var dirName = fields.dirName; //需要保存的文件夹名称
        //旧名称:path;name:拿后缀名
        var oldPath = files.pic.path;//获取旧路径
        var name = files.pic.name;//文件原名称,获取后缀名
        var arr = name.split(".");
        var ext = arr[arr.length-1];
        //设置新路径
        var newName = sd.format(new Date(),"YYYY-MM-DD HH-mm")+"."+ext;
        //console.log("newName:"+newName);
        // ./uploads/a/111.jpg结构的路径
        var newPath = "./uploads/"+dirName+"/"+newName;
        //console.log("newPath:"+newPath);
        //改名字
        fs.rename(oldPath,newPath,function(err){
            if(err){
                console.log(err);
                res.end("Network Error, please try again later. click <a href='/'>go back</a>")
            }else{
                res.redirect("/"+dirName);
            }
        })
    })
}

exports.del = function(req,res){
    var dirName = req.params.dirName;//获取参数将要被删除的文件夹的名称
    file.del(dirName,function(err){
        if(err){
            console.log(err);
            res.send("Line busy, click <a href='/'>back</a>")
        }else{
            res.redirect('/');
        }
    })
}