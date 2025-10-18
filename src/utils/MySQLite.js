const os = require('os');
const Database = require('better-sqlite3');
const fileUtils = require('./FileUtils');

const configPath = os.homedir() + '/.tools';
const DB_PATH = configPath + '/tools.db';

const init_sql = `
CREATE TABLE IF NOT EXISTS "tunnel_ssh_config" (
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
`;

let db = null;

/**
 * 初始化数据库
 */
const SQLiteInit = () => {
    // 确保配置目录存在
    fileUtils.mkdir(configPath);

    console.log('DB_PATH:', DB_PATH)
    // 打开数据库（如果不存在会自动创建）
    db = new Database(DB_PATH,{ verbose: console.log })

    // 初始化表结构
    db.exec(init_sql);
};

/**
 * 执行 SQL 语句（查询）
 * @param {string} sql
 * @returns {Promise<{result: boolean, msg: string, data?: any}>}
 */
const execute = (sql) => {
    return new Promise((resolve) => {
        try {
            const stmt = db.prepare(sql);
            let data;

            // 判断是查询还是执行类语句
            if (/^\s*select/i.test(sql)) {
                data = stmt.all(); // 查询全部数据
            } else {
                data = stmt.run();
            }

            resolve({ result: true, msg: '操作成功', data });
        } catch (err) {
            resolve({ result: false, msg: err.message, data: null });
        }
    });
};

module.exports = {
    DB_PATH,
    SQLiteInit,
    execute,
};
