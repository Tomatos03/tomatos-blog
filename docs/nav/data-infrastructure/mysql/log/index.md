# 日志

MySQL 的日志大致分为两类：一类是 **server 层日志**，如错误日志、慢查询日志、二进制日志等；另一类是 **InnoDB 存储引擎日志**，如 redo log、undo log。本章先介绍 server 层的日志类型与慢查询配置，InnoDB 的事务日志则以单独章节深入讲解。

## 深入阅读

| 主题 | 说明 |
| --- | --- |
| [Redo Log](./redo-log/) | InnoDB 事务日志：WAL 预写策略、记录内容与崩溃恢复 |
| [Undo Log](./undo-log/) | InnoDB 事务日志：记录修改前旧值，支持回滚与 MVCC 快照读 |

> [!NOTE]
> Undo Log 用于事务回滚与 MVCC 快照读，详细介绍见 [Undo Log](./undo-log/) 章节，其在 MVCC 中的作用见 [MVCC](../mvcc/) 章节。

## 日志类型

MySQL 主要有以下几种日志类型：

| 日志类型 | 说明 | 用途 |
|---|---|---|
| 错误日志（Error Log） | 记录服务器启动、运行和停止过程中发生的错误信息 | 诊断问题 |
| 查询日志（General Query Log） | 记录所有客户端连接和执行的 SQL 语句 | 调试和审计 |
| 慢查询日志（Slow Query Log） | 记录执行时间超过指定阈值的 SQL 语句 | 识别性能瓶颈 |
| 二进制日志（Binary Log）| 记录所有更改数据库数据的操作 | 用于数据恢复和主从复制。|

## 慢SQL日志配置

MySQL 的慢查询日志用于记录执行时间超过指定阈值的 SQL 语句。配置方式有以下两种:

### 临时配置

**针对单个会话**

在会话关闭后失效

```sql
SET @@slow_query_log = 'ON';
SET @@long_query_time = 2; -- 设置阈值为2秒
SET @@log_queries_not_using_indexes = 'ON'; -- 记录未使用索引的查询
SET @@slow_query_log_file = '/var/log/mysql/slow.log'; -- 设置日志文件路径
SET @@log_output = 'FILE'; -- 设置日志输出方式为文件
```
**针对全局配置**

在MySQL重启后失效

```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2; -- 设置阈值为2秒
SET GLOBAL log_queries_not_using_indexes = 'ON'; -- 记录未使用索引的查询
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log'; -- 设置日志文件路径
SET GLOBAL log_output = 'FILE'; -- 设置日志输出方式为文件
```

### 持久化配置

修改 MySQL 配置文件(my.cnf 或 my.ini), 在`[mysqld]`下添加以下内容：

```ini
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = 1
log_output = FILE
```

然后重启 MySQL 服务以应用更改。

> [!NOTE]
> 配置完成后, 执行的SQL语句如果满足慢查询条件, 会被记录到指定的日志文件中。
