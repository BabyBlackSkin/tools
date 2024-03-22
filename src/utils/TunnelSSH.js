const {createTunnel} = require("tunnel-ssh");

let SSH_server = null;

const connect = async (config) => {
    let result = await close()

    const tunnelOptions = {
        autoClose: false
    }
    //
    const sshOptions = {
        host: config.sshOptions.host,
        port: config.sshOptions.port,
        username: config.sshOptions.username,
        password: config.sshOptions.password,
        privateKey: config.sshOptions.privateKey,
        passphrase: config.sshOptions.passphrase,
    }
    //
    // // Here is where the magic happens...
    const serverOptions = {port: config.forwardOptions.srcPort}; // automatic assign port by OS
    //
    // // Note that the forwarding options does not define the srcAddr and srcPort here.
    // // to use the server configuration.
    const forwardOptions = {
        srcAddr: '127.0.0.1',
        srcPort: config.forwardOptions.srcPort,
        dstAddr: config.forwardOptions.dstAddr,
        dstPort: config.forwardOptions.dstPort
    }

    try {
        let [server, client] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
        SSH_server = server
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
        }
        if (!SSH_server.closable) {
            console.log(SSH_server.closable)
            resolve( {result: true, msg: 'SSH_server is closed'})
        }
        SSH_server.close((msg, result) => {
            // FIXME 貌似这里拿不到返回值，拿不到返回值就认为关闭成功？？
            if (result || typeof result === 'undefined') {
                resolve({result: true, msg: 'success'})
                return
            }
            // console.log("我异常了", msg, result)
            resolve({result: false, msg: 'error'})
        })
    })
}
module.exports = {
    connect,
    close,
};
