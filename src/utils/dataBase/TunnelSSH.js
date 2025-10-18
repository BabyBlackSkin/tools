// 表名
const TABLE_NAME = 'tunnel_ssh_config'
// 查看DDL
const GET_TABLE_DDL= `PRAGMA table_info ([${TABLE_NAME}]);`
//
const TunnelSSH_TABLE_CONFIG = [
    {column: 'id', type: 'INTEGER', notnull: 1, pk: 1},
    {column: 'name', type: 'TEXT', notnull: 1, pk: 0},
    {column: 'src_port', type: 'TEXT', notnull: 1},
    {column: 'dst_host', type: 'TEXT', notnull: 1},
    {column: 'dst_port', type: 'TEXT', notnull: 1},
    {column: 'ssh_host', type: 'TEXT', notnull: 1},
    {column: 'ssh_port', type: 'TEXT', notnull: 1},
    {column: 'ssh_user_name', type: 'TEXT', notnull: 0},
    {column: 'ssh_password', type: 'TEXT', notnull: 0},
    {column: 'private_key', type: 'TEXT', notnull: 0},
    {column: 'passphrase', type: 'TEXT', notnull: 0},
]

