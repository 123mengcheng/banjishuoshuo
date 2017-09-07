//这个模块里面封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
function _connectDB(callback) {
    var url ="mongodb://localhost:27017/web1704classshuo";
    //var url = settings.dburl;   //从settings文件中，都数据库地址
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}


/*//调用connectDB
_connectDB(function(err,db){
    console.log(db);
})*/






//4.插入数据
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })
};


//删除
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        //删除
        db.collection(collectionName).deleteMany(
            json,
            function (err, results) {
                if(err){
                    console.log("删除失败");
                }
                callback(err, results);
                db.close(); //关闭数据库
            }
        );
    });
}

//修改
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(
            json1,
            json2,
            function (err, results) {
                callback(err, results);
                db.close();
            });
    })
}

exports.getAllCount = function (collectionName,callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    })
}

//自定义查询方法的封装
/*
    //db.liuyanbenli.find({});
    //db.liuyanbenli.find({"name":"张三"});
    //db.liuyanbenli.find({}).skip(5).limit(5).sort();
    集合中一共有17条数据，每页显示5条数据 ，只查第三页的数据
                    count           pageSize            page
     //1.一共多少页Math.ceil(17/pageSize)
     //2.db.liuyanbenli.find({}).skip(pageSize*(page-1)).limit(pageSize).sort();
 */

/*
 collectionName:集合名称
 json1：查询条件
 json2：对查找结果进行筛选如：skip，limit,sort
        调用时格式如：{"pageSize":5,"page":3}
 callback：回调函数
 若分页，需要传入4个参数
 若不分页，需要传入3个参数
*/
exports.find = function(collectionName,json1,C,D){
    //根据用户传入的参数个数，判断C位到底是json2，还是回调函数
    if(arguments.length == 3){
        //若传入三个参数（集合名称，查询条件，回调函数）
        var callback = C;
        var skipnum = 0;
        var limitnum = 0;
        var sort = {};
    }else if(arguments.length == 4){
        //若传入四个参数（集合名称，查询条件，筛选条件，回调函数）
        var callback = D;
        var args = C; //{"pageSize":"5","page":3,"sort":{"time":1}}
        //根据args计算出skipnum 和 limitnum 的值
        var skipnum = args.pageSize*(args.page-1)||0;
        var limitnum = args.pageSize||0;
        var sort = args.sort||{};
    }
    //1.建立连接
        _connectDB(function(err,db){
            var allData = db.collection(collectionName).find(json1).skip(skipnum).limit(limitnum).sort(sort);
            allData.toArray(function(err,arr){
                if(err){
                    //将查找结果转成数组对象报错
                    callback(err,null);
                    db.close();
                    return;
                }
                //查找结果成功转成了数组
                allData = arr;
                callback(null,allData);
                db.close();
            })
        })
};