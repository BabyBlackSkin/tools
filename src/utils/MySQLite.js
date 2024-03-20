const os = require('os');
const sqlite3 = require("sqlite3")
const fileUtils = require('./FileUtils');
let configPath = os.homedir() + '/.tools'
let DB_PATH = configPath + '/tools.db'

const init_sql = `
CREATE TABLE  if not exists "tunnel_ssh_config" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "src_port" TEXT NOT NULL,
  "dst_host" TEXT,
  "dst_port" TEXT,
  "ssh_host" TEXT NOT NULL,
  "ssh_port" TEXT NOT NULL,
  "ssh_user_name" TEXT NOT NULL,
  "ssh_password" TEXT NOT NULL
);
`

let db = null;
/**
 * @Description: 连接数据库
 * @CreationDate 2023-05-10 13:48:41
 */
const SQLiteInit = () => {
    fileUtils.mkdir(configPath)

    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            throw err
        }
    });
    db.run(init_sql)
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
