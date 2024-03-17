const {app} = require("electron");
const sqlite3 = require("sqlite3")
const path = require('path')
const isPackaged = app.isPackaged;
let DB_PATH;
if (isPackaged) {
    DB_PATH = path.resolve('./resources/tools.db')
} else {
    // DB_PATH = path.resolve(__dirname, '../../tools.db')
    DB_PATH = 'C:\\Users\\Administrator\\Documents\\tools.db'
}


let db = null;
/**
 * @Description: 连接数据库
 * @CreationDate 2023-05-10 13:48:41
 */
const SQLiteInit = () => {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            throw err
        }
    });
}

const execute = (sql) => {
    return new Promise((resolve) => {
        db.all(sql, (err, data) => {
            if (err) {
                resolve({result: false, msg: err, data: data});
            }
            resolve({result: true, msg: '操作成功', data: data});
        });
    });
};

module.exports = {
    DB_PATH,
    SQLiteInit,
    execute,
};
