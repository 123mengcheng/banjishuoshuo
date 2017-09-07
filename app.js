var express = require("express");
var router = require("./controller");
var session = require("express-session");
var app = express();
app.listen(4000);
app.use(session({
    secret:"keyboard cat",
    resave:false,
    saveUninitialized:true
}));
app.set("view engine","ejs");
app.use(express.static("./public"));
app.get("/",router.showIndex);
app.get("/regist",router.regist);
app.get("/doRegist",router.doRegist);
app.get("/login",router.login);
app.get("/doLogin",router.doLogin);
app.get("/back",router.back);
app.get("/doFabiao",router.doFabiao);
app.get("/fenye",router.fenye);
app.get("/wode",router.wode);
app.get("/changeTou",router.changeTou);
app.get("/cut",router.cut);