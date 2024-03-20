const fs = require('fs');
const SysOptResult = require("@/utils/SysOptResult");

const mkdir = (path) => {
    console.log(path)
    fs.mkdir(`${path}`, (err) => {
        if (err) {
            return new SysOptResult(false, err)
        }
        return new SysOptResult(true)
    })
}

const writeFile = (file, data) => {
    fs.mkdir(`${file}`, `${data}`, (err) => {
        if (err) {
            return new SysOptResult(false, err)
        }
        return new SysOptResult(true)
    })
}

const canAccess = (file) => {
    fs.access(`${file}`, fs.constants.F_OK, (err) => {
        if (err) {
            return new SysOptResult(false, err)
        }
        return new SysOptResult(true)
    })
}
/**
 * 文件是否可读
 * @param file
 */
const canRead = (file) => {
    fs.access(`${file}`, fs.constants.R_OK, (err) => {
        if (err) {
            return new SysOptResult(false, err)
        }
        return new SysOptResult(true)
    })
}
/**
 * 文件是否可写
 * @param file
 */
const canWrite = (file) => {
    fs.access(`${file}`, fs.constants.W_OK, (err) => {
        if (err) {
            return new SysOptResult(false, err)
        }
        return new SysOptResult(true)
    })
}

/**
 * 文件是否可写
 * @param file
 */
const canExe = (file) => {
    fs.access(`${file}`, fs.constants.X_OK, (err) => {
        if (err) {
            return new SysOptResult(false, err)
        }
        return new SysOptResult(true)
    })
}


module.exports = {
    mkdir,
    writeFile
}
