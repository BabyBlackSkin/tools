// worker.js

// 使用 require 导入常量
const constants = require('./constants.js');
const SSH_EVENT = constants.SSH_EVENT;

const {createTunnel} = require("tunnel-ssh");
const net = require('net');
const { exec } = require('child_process');

let SSH_server = null;
let SSH_client = null;

// 检查端口是否可用
const checkPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.listen(port, '127.0.0.1', () => {
            server.once('close', () => {
                resolve(true);
            });
            server.close();
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                resolve(true); // 其他错误不算端口占用
            }
        });
    });
};

process.on('message', async (msg) => {
    console.log('connect', SSH_EVENT)
    let result;
    if (msg.event === SSH_EVENT.CONNECT) {
        result = await connect(msg.data)
    }else if (msg.event === SSH_EVENT.CLOSE){
        result = await close()
    }
    console.log('connect result:', result)
    let message = Object.assign({}, result)
    process.send(message)
})

const connect = async (config) => {
    // 检查端口是否空闲，否则等待释放
    let retries = 5;
    while (retries-- > 0) {
        const available = await checkPortAvailable(config.forwardOptions.srcPort);
        if (available) break;
        console.log(`Port ${config.forwardOptions.srcPort} still in use, waiting...`);
        await new Promise(resolve => setTimeout(resolve, 500)); // 等 0.5 秒
    }

    // 再次检查
    const available = await checkPortAvailable(config.forwardOptions.srcPort);
    if (!available) {
        console.warn(`Port ${config.forwardOptions.srcPort} is still occupied, forcing close...`);
        return {result: false, msg: `端口 ${config.forwardOptions.srcPort} 被占用`}
    }


    const tunnelOptions = {
        autoClose: true
    }
    const sshOptions = {...config.sshOptions};
    sshOptions.keepaliveInterval = 10000
    sshOptions.keepaliveCountMax = 3

    const serverOptions = {port: config.forwardOptions.srcPort};
    //
    // // Note that the forwarding options does not define the srcAddr and srcPort here.
    // // to use the server configuration.
    const forwardOptions = {
        srcAddr: config.forwardOptions.srcAddr,
        srcPort: config.forwardOptions.srcPort,
        dstAddr: config.forwardOptions.dstAddr,
        dstPort: config.forwardOptions.dstPort
    }

    try {
        let [server, client] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
        SSH_server = server
        SSH_client = client

        // 监听连接错误事件
        // server.on('error', (err) => {
        //     console.log('SSH Server error:', err.message);
        //     SSH_server = null;
        //     SSH_client = null;
        // });
        //
        // client.on('error', (err) => {
        //     console.log('SSH Client error:', err.message);
        //     SSH_server = null;
        //     SSH_client = null;
        // });

        // 监听连接关闭事件
        server.on('close', () => {
            console.log('SSH Server closed');
            SSH_server = null;
            SSH_client = null;
        });

        client.on('close', () => {
            console.log('SSH Client closed');
            SSH_server = null;
            SSH_client = null;
        });

        //
        // // Example how to get the server port information.
        return {result: true, msg: `server listen on ${SSH_server.address().port}`}
    } catch (e) {
        return {result: false, msg: e}
    }
}

const close = () => {
    return new Promise((resolve, reject) => {
        if (null == SSH_server) {
            resolve({result: true, msg: 'SSH_server is closed'})
            return
        }

        try {
            // 先关闭客户端连接
            if (SSH_client) {
                SSH_client.end();
                SSH_client.destroy && SSH_client.destroy();
                SSH_client = null;
            }

            // 再关闭服务器
            if (SSH_server) {
                // 移除所有事件监听器，防止内存泄漏
                SSH_server.removeAllListeners();

                SSH_server.close((err) => {
                    if (err) {
                        console.log('SSH Server close error:', err.message);
                    } else {
                        console.log('SSH Server closed successfully');
                    }
                    SSH_server = null;
                    // 等待一小段时间确保端口完全释放
                    setTimeout(() => {
                        resolve({result: true, msg: 'success'});
                    }, 100);
                });
            } else {
                SSH_server = null;
                resolve({result: true, msg: 'SSH_server is already closed'});
            }
        } catch (error) {
            console.log('Close SSH tunnel error:', error.message);
            SSH_server = null;
            SSH_client = null;
            resolve({result: false, msg: error.message});
        }
    })
}
// 杀死占用指定端口的进程
const killProcessOnPort = (port) => {
    return new Promise((resolve) => {
        const isWindows = process.platform === 'win32';
        let command;

        if (isWindows) {
            // Windows命令
            command = `netstat -ano | findstr :${port}`;
        } else {
            // Linux/Mac命令
            command = `lsof -ti:${port}`;
        }

        exec(command, (error, stdout, stderr) => {
            if (error || !stdout.trim()) {
                resolve(true); // 没有进程占用端口
                return;
            }

            if (isWindows) {
                // 解析Windows netstat输出
                const lines = stdout.trim().split('\n');
                const pids = new Set();

                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length >= 5) {
                        const pid = parts[parts.length - 1];
                        if (pid && pid !== '0') {
                            pids.add(pid);
                        }
                    }
                });

                // 杀死所有占用端口的进程
                const killPromises = Array.from(pids).map(pid => {
                    return new Promise((killResolve) => {
                        exec(`taskkill /F /PID ${pid}`, (killError) => {
                            if (killError) {
                                console.log(`Failed to kill process ${pid}:`, killError.message);
                            }
                            killResolve();
                        });
                    });
                });

                Promise.all(killPromises).then(() => {
                    resolve(true);
                });
            } else {
                // Linux/Mac: 直接杀死进程
                const pids = stdout.trim().split('\n');
                const killPromises = pids.map(pid => {
                    return new Promise((killResolve) => {
                        exec(`kill -9 ${pid}`, (killError) => {
                            if (killError) {
                                console.log(`Failed to kill process ${pid}:`, killError.message);
                            }
                            killResolve();
                        });
                    });
                });

                Promise.all(killPromises).then(() => {
                    resolve(true);
                });
            }
        });
    });
};

// 强制释放端口
const forceClose = async (port) => {
    try {
        // 先尝试正常关闭
        if (SSH_client) {
            SSH_client.end();
            SSH_client.destroy && SSH_client.destroy();
            SSH_client = null;
        }

        if (SSH_server) {
            SSH_server.removeAllListeners();
            SSH_server.close();
            SSH_server = null;
        }

        // 等待一下
        await new Promise(resolve => setTimeout(resolve, 500));

        // 如果指定了端口，尝试杀死占用该端口的进程
        if (port) {
            await killProcessOnPort(port);
            // 再等待一下确保端口释放
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return {result: true, msg: 'Force closed'};
    } catch (error) {
        console.log('Force close error:', error.message);
        SSH_server = null;
        SSH_client = null;
        return {result: true, msg: 'Force closed with error'};
    }
}

// 获取SSH连接状态
const getStatus = () => {
    return {
        isConnected: SSH_server !== null && SSH_client !== null
    }
}
//
// module.exports = {
//     connect,
//     close,
//     forceClose,
//     getStatus,
// };
