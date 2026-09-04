# SQL 优化

## Insert 优化

在进行大量数据的插入时, 可以考虑如下优化手段:

+ 使用批量插入

```sql
-- 单条插入
INSERT INTO table_name (column1, column2) VALUES (value1a, value2a);
INSERT INTO table_name (column1, column2) VALUES (value1b, value2b);
INSERT INTO table_name (column1, column2) VALUES (value1c, value2c);

-- 替换为批量插入
INSERT INTO table_name (column1, column2) VALUES
(value1a, value2a),
(value1b, value2b),
(value1c, value2c);
```

+ 手动提交事务

每执行一次插入语句, 都会隐式提交一次事务, 这会带来较大的性能开销. 可以通过手动开启事务, 在插入完成后再统一提交, 来提升插入性能.

+ 主键顺序插入

尽量避免随机主键插入, 例如使用自增主键或有序 UUID, 以减少页分裂和索引维护开销.

+ 使用 LOAD DATA INFILE

对于大批量数据插入, 使用 `LOAD DATA INFILE` 语句通常比多条 `INSERT` 语句更高效.

```sql
-- 语法
LOAD DATA INFILE 'file_path' INTO TABLE table_name
FIELDS TERMINATED BY 'delimiter'
LINES TERMINATED BY 'line_terminator'
(column1, column2, ...);

-- 示例
LOAD DATA INFILE 'file_path' INTO TABLE table_name
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(column1, column2, ...);
```
## Count 优化

count函数在不同的存储引擎有不同的计数方式:

+ 对于MyISAM存储引擎, 由于索引使用Hash结构, 可以直接拿到总记录数, 因此count(*)的性能非常高.
+ 对于InnoDB存储引擎, 需要把数据从表中一行行读取出来进行计数, 因此count(*)的性能较低.

**在数据量较大的情况下, 考虑手动实现计数器, 而不是依赖于count函数.**
### count 函数使用方式

+ **count(主键)**
    - InnoDB 引擎遍历整张表，取出每一行的主键 ID 值返回给服务层。服务层拿到主键后直接按行累加（主键不可能为 null）。

+ **count(字段)**
    - 无 NOT NULL 约束：InnoDB 引擎遍历整张表逐行取出字段值，返回给服务层。服务层判断是否为 null，不为 null 则累加。
    - 有 NOT NULL 约束：InnoDB 引擎遍历整张表取出每一行的字段值，返回给服务层，直接按行累加。

+ **count(1)**
    - InnoDB 引擎遍历整张表但不取值。服务层对返回的每一行放入数字"1"，直接按行累加。

+ **count(*)**
    - InnoDB 引擎不取全部字段，专门做了优化。不取值，服务层直接按行累加。

**效率排序：count(字段) < count(主键) < count(1) ≈ count(\*)，建议优先使用 count(\*)。**


## 主键优化

+ 使用顺序主键
    使用顺序主键有助于减少页分裂和索引维护开销, 提升性能.
+ 按照主键顺序插入数据
    避免随机主键插入, 以减少页分裂和索引维护开销.
+ 尽量降低主键索引的长度
    主键不仅存储于簇聚索引, 还存储在二级索引中. 选择合适长度的主键, 避免过长的主键增加索引大小和维护成本.

## Update优化

+ 尽量更新有索引的字段
    更新有索引的字段可以利用索引加速定位和更新数据, 如果更新的字段没有索引, 行锁可能会升级为表锁, 影响并发性能.

## Order By 优化

1. **利用 B+ Tree 的有序性**  

B+ Tree 索引叶子节点存储的数据天然有序, Order By想要利用索引需满足以下条件:  
+ 返回结果存在覆盖索引
+ 排序字段有索引，且按排序字段书写顺序满足最左前缀原则

```sql
-- user_info 表上创建(username, age, email)的联合索引，主键是 id
SELECT username, age, email FROM user_info ORDER BY username, age;

-- 返回结果满足覆盖索引，排序字段符合最左前缀原则，可利用索引排序
SELECT id, username FROM user_info ORDER BY username;
```

+ 排序字段顺序一致（全 ASC 或全 DESC），或与索引顺序相同/相反

```sql
-- MySQL 8.0+ 支持显式指定排序方向
CREATE INDEX idx_user ON user_info (username ASC, age DESC);

-- 以下两条 SQL 都会利用该索引
SELECT id, username FROM user_info ORDER BY username ASC, age DESC;
SELECT id, username FROM user_info ORDER BY username DESC, age ASC;
```

2. **增大排序缓冲区**

无法利用索引时, 会在排序缓冲区中排序, 如果缓存区满会利用磁盘空间来进行排序, 通过调整 `sort_buffer_size` 参数增大内存缓冲区，可减少磁盘排序次数，提升性能。

```sql
-- 查看当前缓冲区大小
SHOW VARIABLES LIKE 'sort_buffer_size';

-- 临时修改（当前会话有效）
SET sort_buffer_size = 2 * 1024 * 1024;

-- 永久修改（需重启 MySQL）
SET GLOBAL sort_buffer_size = 2 * 1024 * 1024;
```

## GROUP BY 优化

1. **利用索引优化GROUP BY**

GROUP BY 同样可以利用 B+ Tree 索引的有序性来优化查询性能。满足以下条件时可利用索引：


+ 分组字段有索引，且按分组字段书写顺序满足最左前缀原则

```sql
-- user_info 表上创建(username, age)的联合索引
SELECT username, age, COUNT(*) FROM user_info GROUP BY username, age;

-- 满足最左前缀原则，可利用索引进行分组
SELECT username, COUNT(*) FROM user_info GROUP BY username;

-- 不满足最左前缀原则，无法利用索引
SELECT age, COUNT(*) FROM user_info GROUP BY age;
```

## Limit 优化

对于大数据量的分页查询, 使用传统的 OFFSET + LIMIT 方式会随着页数增加而变慢. 可以考虑使用以下优化方式:

1. **基于上一次位置进行查询**

```sql
-- 传统分页查询
SELECT * FROM table_name ORDER BY id LIMIT 1000, 10;
-- 基于上一次位置进行查询
SELECT * FROM table_name WHERE id > last_id ORDER BY id LIMIT 10;
```