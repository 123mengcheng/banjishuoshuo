var db = require("../models/db.js");
var md5 = require("../models/md5.js");
var session = require("express-session");
var sd = require("silly-datetime");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
exports.showIndex = function(req,res){
    var username = req.session.uname;
    db.find("liuyan",{},function(err,arr){
        if(err){
            console.log(err);
            return;
        }
        var arr1 = arr;
        db.find("liuyan",{},{"pageSize":6,"page":1,"sort":{"time":-1}},function(err,result){
            if(err){
                console.log(err);
                return;
            }
            //console.log(result);
            res.render("index",{"username":username,"liuyan":arr1,"fenye":result});
        });

    });

};
exports.regist = function(req,res){
    res.render("regist",{"dirnames":""});
};
exports.doRegist = function(req,res){
    var uname = req.query.uname;
    var pwd = req.query.pwd;
    //将明文pwd转为密文
    pwd = md5(pwd);

    db.find("user",{"uname":uname},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        //console.log(result[0].uname);
        if(result[0]==undefined){
            //入库
            db.insertOne("user",{"uname":uname,"pwd":pwd},function(err,result){
                if(err){
                    console.log(err);

                }

                res.render("index",{"username":uname});
            })
        }
        else if(uname==result[0].uname){
            res.render("regist", {"dirnames": "用户名被占用！"});
        }
    });

};

exports.login = function(req,res){
    res.render("login",{"loginNames":""});
};
exports.doLogin = function(req,res){
    //获取用户名和密码 验证是否能登录成功
    var uname = req.query.uname;
    var pwd = req.query.pwd;
    pwd = md5(pwd);
    //根据用户名查找用户是否存在
    db.find("user",{"uname":uname},function(err,result){
        if(err){
            console.log(err);
            return;
        }
        if(result.length == 0){
            res.render("login",{"loginNames":"用户名不存在"});
            return;
        }
        //若用户存在
        var oldpwd = result[0].pwd;
        if(oldpwd==pwd){
            //密码正确  登录成功 记录登录的用户信息
            req.session.uname = result[0].uname;
            req.session.login = "1";
            res.redirect("/");

        }else{
            res.render("login",{"loginNames":"密码不正确"});

        }
    });
};

exports.back = function(req,res){
    req.session.uname = undefined;
    res.redirect("/");
};

exports.doFabiao = function(req,res){
    var username = req.session.uname;
    console.log(req.query);
    var shuo = req.query.shuo;
    var time = sd.format(new Date(),"YYYY-MM-DD HH:mm:ss");
    var insertObj = {
        "uname":username,
        "shuo":shuo,
        "time":time
    };

    db.insertOne("liuyan",insertObj,function(err,result){
        if(err){
            console.log("插入失败");
            return;
        }
        console.log("插入成功");
        res.redirect("/");
        //res.render("index",{"username":username,"liuyan":arr});

    });
};

exports.fenye = function(req,res){
    var username = req.session.uname;
    var n = req.query.n;
    n = parseInt(n);
    db.find("liuyan",{},function(err,arr){
        if(err){
            console.log(err);
            return;
        }
        var arr1 = arr;
        db.find("liuyan",{},{"pageSize":6,"page":n,"sort":{"time":-1}},function(err,result){
            if(err){
                console.log(err);
                return;
            }
            //console.log(result);
            res.render("index",{"username":username,"liuyan":arr1,"fenye":result});
        });
    });

};

exports.wode = function(req,res){
    var username = req.session.uname;
    db.find("liuyan",{"uname":username},function(err,arr){
        if(err){
            console.log(err);
            return;
        }
        var arr1 = arr;
        db.find("liuyan",{"uname":username},{"pageSize":6,"page":1,"sort":{"time":-1}},function(err,result){
            if(err){
                console.log(err);
                return;
            }
            //console.log(result);
            res.render("wode",{"username":username,"liuyan":arr1,"fenye":result});
        });

    });

};

exports.changeTou = function(req,res){
    var username = req.session.uname;
    db.find("liuyan",{},function(err,arr){
        if(err){
            console.log(err);
            return;
        }
        var arr1 = arr;
        db.find("liuyan",{},{"pageSize":6,"page":1,"sort":{"time":-1}},function(err,result){
            if(err){
                console.log(err);
                return;
            }
            //console.log(result);
            res.render("setAvatar",{"username":username,"liuyan":arr1,"fenye":result});
        });

    });


};

exports.cut = function(req,res){
    if(req.url == "/cut"&&req.method.toLowerCase() == "get"){
        var form = new formidable.IncomingForm();//将form表单转换为formidable格式
        //设置文件上传路径
        form.uploadDir="../avactor";
        //form中的内容被分成两部分
        form.parse(req,function(err,fields,files){
            if(err){
                console.log(err);
                return;
            }
            //需要将上传的文件重新命名
            //console.log(fields);
            console.log(files);
            console.log(files.file.path);
            //日期时间+随机数+后缀名
            // 方法一var extname = files.file.name;
            //console.log(extname);
            //截取 . 后面,存在弊端，如6.1.2.jpg
            //后缀名
            var fname = files.file.name;
            var extname = path.extname(fname);
            console.log(extname);//.jpg
            //日期时间
            var time = d.format(new Date(),"YYYYMMDDHHmmss");
            //随机数
            var ran = parseInt(Math.random()*9999+10000);//10000-19999之间
            //重命名   将uploads文件夹下的旧名称改成 time+ran+extname
            var old = files.file.path;
            var newpath = "uploads/"+time+ran+extname;
            fs.rename(old,newpath,function(err){
                if(err){
                    console.log(err);
                    return;
                }
            });
            res.end();
        });

    }
    res.render("cut");
};