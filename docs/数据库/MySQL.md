---

---

## MySQL架构

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-A06.jpg" style="zoom:100%;" />

## MySQL数据文件

~/data目录下

MyISAM

- 文件夹为数据库名称
- .frm文件为表结构文件
- .MYD为表数据文件
- .MYI为索引文件

InnoDB

- 文件夹为数据库名称

- .frm文件为表结构文件

- .ibd为数据文件



## MySQL存储引擎

```sql
--查看数据支持的存储引擎
mysql> show engines;
mysql> show variables like '%storage_engine%';
+---------------------------------+-----------+
| Variable_name                   | Value     |
+---------------------------------+-----------+
| default_storage_engine          | InnoDB    |
| default_tmp_storage_engine      | InnoDB    |
| disabled_storage_engines        |           |
| internal_tmp_mem_storage_engine | TempTable |
+---------------------------------+-----------+
```

### InnoDB

1. 缓冲池

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-006.png" style="zoom:50%;" />

    ```sql
    mysql> show variables like '%innodb_buffer_pool_size%';
    +-------------------------+-----------+
    | Variable_name           | Value     |
    +-------------------------+-----------+
    | innodb_buffer_pool_size | 134217728 |
    +-------------------------+-----------+
    mysql> set global innodb_buffer_pool_size=134217728;
    ```

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-007.png" style="zoom:50%;" />

    优化后的LRU，新读取的页数据并不是直接放在LRU列表的首部，而是放到LRU列表的midpoint位置。默认该位置在LRU列表长度的`5/8`处。midpoint的位置可由参数`innodb_old_blocks_pct`控制，`innodb_old_blocks_time`参数表示页读取到midpoint位置后需要等待多久才会被加入到LRU列表的热端。

    ```sql
    mysql> show variables like '%innodb_old_blocks_pct%';
    +-----------------------+-------+
    | Variable_name         | Value |
    +-----------------------+-------+
    | innodb_old_blocks_pct | 37    |
    +-----------------------+-------+
    mysql> show variables like '%innodb_old_blocks_time%';
    +------------------------+-------+
    | Variable_name          | Value |
    +------------------------+-------+
    | innodb_old_blocks_time | 1000  |
    +------------------------+-------+
    ```

    

2. change buffer

    ```sql
    mysql> show variables like '%innodb_change_buffering%';
    +-------------------------+-------+
    | Variable_name           | Value |
    +-------------------------+-------+
    | innodb_change_buffering | all   |
    +-------------------------+-------+
    mysql> show variables like '%innodb_change_buffer_max_size%';
    +-------------------------------+-------+
    | Variable_name                 | Value |
    +-------------------------------+-------+
    | innodb_change_buffer_max_size | 25    |
    +-------------------------------+-------+
    ```

    

3. 自适应Hash索引

    自适应哈希索引会占用InnoDB Buffer Pool，而且只适合搜索等值的查询；对于其他查找类型，如范围查找，是不能使用的。

    ```sql
    set global innodb_adaptive_hash_index=off/on
    ```

    

4. redo log buffer

    ```sql
    show variables like '%innodb_log_buffer_size%'; -- buffer大小
    show variables like '%innodb_flush_log_at_trx_commit%'; -- 提交时，缓冲区数据落地磁盘的频率策略
    set gloal innodb_flush_log_at_trx_commit=0/1/2;
    ```

    `innodb_flush_log_at_trx_commit`的参数取值说明：

    - 设置为0：在提交事务时，InnoDB不会立即触发将缓存日志log buffer写到磁盘文件的操作，而是每秒触发一次缓存日志回写磁盘操作，并调用操作系统fsync刷新I/O缓存。

    - 设置为1：每次事物提交时，MySQL都会立即把redo log buffer的数据写入redo log file，并且调用操作系统fsync刷新I/O缓存。

    - 设置为2：每次事物提交时，MySQL都会把redo log buffer的数据写入redo log file，但是flush操作并不会同时进行，而是每秒执行一次flush。

    > 刷写起始是两个操作，即刷（flush）和写（write）。多数操作系统中，把InnoDB的log buffer进入日志文件，只是简单地把数据移动到操作系统缓存中，并没有实际持久化数据。

5. double write

    double write（两次写）技术的引入是为了提高数据写入的可靠性。

6. 后台线程

    

7. redo log

    

8. undo log

    undo log是InnoDB MVCC（Multi-Version Concurrency Control，多版本并发控制）事务特性的重要组成部分。

9. Query Cache

    ```sql
    show variables like '%query_cache_type%';
    ```

    > MySQL8.0开始这个功能被砍掉了。



### MyISAM



|          | InnoDB                                                       | MyISAM                                                       |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 主外键   | 不支持                                                       | 支持                                                         |
| 事务/XA  | 不支持/不支持                                                | 支持/支持                                                    |
| 行表锁   | 表锁，即使操作一条记录也会锁住整个表，<br />不适合高并发的操作 | 行锁，操作时只锁某一行，不对其他行有影响，<br />适合高并发的操作 |
| 缓存     | 只缓存索引，不缓存真实数据                                   | 不存缓存索引还要缓存真实数据，对内存要求较高，<br />而且内存大小对性能有决定性的影响 |
| 表空间   | 小                                                           | 大                                                           |
| 关注点   | 性能                                                         | 事物                                                         |
| 默认安装 | Y                                                            | Y                                                            |



## MySQL事务和锁

### 事务隔离级别

事务的隔离级别是通过锁的机制来实现的。

- 读未提交

    读到其他事务未提交的数据，产生脏读

- 读已提交

    

- 可重复读

    

- 序列化

```sql
show variables like '%tx_isolation%';
```



### InnoDB锁机制

InnoDB主要使用两种级别的锁机制：表锁和行锁（默认）。（MyISAM只有表锁）

行锁：写锁（又称排它锁），读锁（又称共享锁）。

行锁数据锁定范围又分为：

- 记录锁
- 间隙锁（Gap Locks，又称区间锁）
- Net-key Lock

#### 锁等待和死锁

#### 锁的监控

```sql
--查看表的锁信息
show open tables;
--上锁 read 读锁，write 写锁
lock table user read, emp write;
--释放锁
unlock tables;
```



## MySQL性能优化

### 查询执行的过程

1. 客户端向MySQL服务器发送一条查询请求。
2. 服务器首先检查查询缓存，如果命中缓存，则立即返回存储在缓存中的结果，否则进入下一阶段。
3. 服务器进行SQL解析、预处理，再由优化器生成对应的执行计划。
4. MySQL根据执行计划，调用存储引擎的API来执行查询。
5. 查询执行的最后一个阶段是将结果返回给客户端。即使查询并不需要返回结果给客户端，MySQL仍然会返回这个查询的一些信息。

### 索引优化

MySql中，主要有四种类型的索引，分别是B-Tree索引，Hash索引，FullText索引和R-Tree索引。

#### 联合索引

联合索引也叫复合索引。Mysql从左到右的使用索引中的字段，一个查询可以只使用索引中的一部份，但只能是最左侧部分。

例如索引是`key index (a,b,c)`，可以支持`a`或`a,b`或`a,b,c`3种组合进行查找，但不支持`b,c`进行查找 .当最左侧字段是常量引用时，索引就十分有效。



手写

```sql
SELECT DISTINCT
    < select_list >
FROM
    < left_table > < join_type >
JOIN < right_table > ON < join_condition >
WHERE
    < where_condition >
GROUP BY
    < group_by_list >
HAVING
    < having_condition >
ORDER BY
    < order_by_condition >
LIMIT < number offset >
```

机读

```sql
FROM < left_table > 
ON < join_condition >     
< join_type > JOIN < right_table > 
WHERE < where_condition >
GROUP BY < group_by_list >
HAVING < having_condition >
SELECT 
DISTINCT < select_list >
ORDER BY < order_by_condition >
LIMIT < limit number offset >
```





#### 优化

- 单表索引优化

    查询条件字段添加（联合）索引，**范围查询**字段不要建立索引（范围查询字段会导致索引失效）。

    

- 两表索引优化

    左连接，给右表的连接字段添加索引；

    右连接，给左表的连接字段添加索引；

    

- 三表索引优化

    

- 索引失效
    1. 字段值精确匹配
    2. 最佳左前缀法则（查询从索引的最左列开始并且不能跳过索引的中间的列）；
    3. 不要在索引列上做任何操作（计算、函数、类型转换）；
    4. 存储引擎不能使用索引中范围条件右边的列；
    5. 尽量使用覆盖索引（只访问索引列的查询，也是索引列和查询列一致，不用`select *`）
    6. 不要使用不等于(`!=`或则`<>`)逻辑判断;
    7. 不要使用`IS NULL`或者`IS NOT NULL`;
    8. 不要使用`like`以通配符(`'%abc_'`)开头，通配符只能在右边，创建覆盖索引(遵循第4条)以避免
    9. 字符串不加单引号；索引列进行了类型转换（违背第2条）
    10. 少用`OR`



### 慢SQL优化

1. 慢查询的开启并捕获。
2. explain+慢SQL分析。
3. show profile查询SQL在MySQL服务器里的执行细节和生命周期。
4. MySQL数据库服务器的参数调优。

#### 1.慢查询开启

```sql
show variables like '%slow_query_log%';
set global slow_query_log = 1;--当前数据库生效
--永久生效需要需改配置文件
show variables like 'long_query_time%';--默认慢查询的时间（大于）
set global long_query_time = 3;
show global status like 'Slow_queries%';--显示慢SQL的条数
```

#### 2.explain分析

```sql
explain select * from rbac_user;
```

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-005.png" />

- id

    id相同，执行顺序由上至下；id不同，如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行

- Select_type

    主要有：`SIMPLE`，`PRIMARY`，`SUBQUERY`，`DERIVED`，`UNION`，`UNION RESULT`

    

- table

    

- type

    访问类型：`system` > `const` > `eq_ref` > `ref` > `range` > `index` > `ALL`

- possible_keys

    

- key

- Key_len

- ref

- rows

- Extra



#### 3.show profile

```sql
show variables like 'profiling';
set profiling=on;
show profiles;
show profile cpu, block io for query 4;
```

#### 4.服务器参数调优



## 常用命令

### 1.字符集

```sql
--查看MySQL支持的字符集
show charset;
--查看MySQL数据库和服务器的字符集
show variables like '%char%';
--查看MySQL数据表的字符集
show table status from test like '%user%';
--查看MySQL数据列的字符集
show full columns from user;
```

### 2.存储引擎

```sql
show engines;
show variables like '%storage_engine%';
```

### 3.表信息

```sql
show create table user;
```



## 附录

### OLTP和OLAP

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-A05.jpg" style="zoom:50%;" />



### ACID

事务具有4个特征，分别是原子性、一致性、隔离性和持久性，简称事务的ACID特性；

- 原子性（Atomicity)

    一个事务要么全部提交成功，要么全部失败回滚，不能只执行其中的一部分操作，这就是事务的原子性。

- 一致性（Consistency)

    事务的执行不能破坏数据库数据的完整性和一致性，一个事务在执行之前和执行之后，数据库都必须处于一致性状态。

    如果数据库系统在运行过程中发生故障，有些事务尚未完成就被迫中断，这些未完成的事务对数据库所作的修改有一部分已写入物理数据库，这是数据库就处于一种不正确的状态，也就是不一致的状态。

- 隔离性（Isolation）

    事务的隔离性是指在并发环境中，并发的事务是相互隔离的，一个事务的执行不能被其他事务干扰。不同的事务并发操作相同的数据时，每个事务都有各自完整的数据空间，即一个事务内部的操作及使用的数据对其他并发事务是隔离的，并发执行的各个事务之间不能相互干扰。

    在标准SQL规范中，定义了4个事务隔离级别，不同的隔离级别对事务的处理不同，分别是：未授权读取，授权读取，可重复读取和串行化：

    1. 读未提交（Read Uncommited），该隔离级别允许脏读取，其隔离级别最低；比如事务A和事务B同时进行，事务A在整个执行阶段，会将某数据的值从1开始一直加到10，然后进行事务提交，此时，事务B能够看到这个数据项在事务A操作过程中的所有中间值（如1变成2，2变成3等），而对这一系列的中间值的读取就是未授权读取。
    2. 授权读取也称为已提交读（Read Commited），授权读取只允许获取已经提交的数据。比如事务A和事务B同时进行，事务A进行+1操作，此时，事务B无法看到这个数据项在事务A操作过程中的所有中间值，只能看到最终的10。另外，如果说有一个事务C，和事务A进行非常类似的操作，只是事务C是将数据项从10加到20，此时事务B也同样可以读取到20，即授权读取允许不可重复读取。
    3. 可重复读（Repeatable Read)，就是保证在事务处理过程中，多次读取同一个数据时，其值都和事务开始时刻是一致的，因此该事务级别禁止不可重复读取和脏读取，但是有可能出现幻影数据。所谓幻影数据，就是指同样的事务操作，在前后两个时间段内执行对同一个数据项的读取，可能出现不一致的结果。在上面的例子中，可重复读取隔离级别能够保证事务B在第一次事务操作过程中，始终对数据项读取到1，但是在下一次事务操作中，即使事务B（注意，事务名字虽然相同，但是指的是另一个事务操作）采用同样的查询方式，就可能读取到10或20；
    4. 串行化（Serializable），是最严格的事务隔离级别，它要求所有事务被串行执行，即事务只能一个接一个的进行处理，不能并发执行。

- 持久性（Durability）

    一旦事务提交，那么它对数据库中的对应数据的状态的变更就会永久保存到数据库中。即使发生系统崩溃或机器宕机等故障，只要数据库能够重新启动，那么一定能够将其恢复到事务成功结束的状态。

### SQL JOIN

1. 内连接

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-001.png" style="zoom:50%;" />

    ```sql
    SELECT <select_list> FROM A INNER JOIN B
    ON A.key = B.key
    ```

2. 左连接

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-002.png" style="zoom:50%;" />

    ```sql
    SELECT <select_list> FROM A LEFT JOIN B
    ON A.key = B.key
    --
    SELECT <select_list> FROM A LEFT JOIN B
    ON A.key = B.key
    WHERE B.key IS NULL
    ```

3. 右连接

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-003.png" style="zoom:50%;" />

    ```sql
    SELECT <select_list> FROM A RIGHT JOIN B
    ON A.key = B.key
    --
    SELECT <select_list> FROM A RIGHT JOIN B
    ON A.key = B.key
    WHERE A.key IS NULL
    ```

4. 全连接

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-004.png" style="zoom:50%;" />

    ```sql
    SELECT <select_list> FROM A FULL OUTER JOIN B
    ON A.key = B.key
    --
    SELECT <select_list> FROM A FULL OUTER JOIN B
    WHERE A.key IS NULL OR B.key IS NULL
    ```

    MySQL不支持`FULL OUTER JOIN`

    ```sql
    SELECT <select_list> FROM A LEFT JOIN B ON A.key = B.key
    UNION
    SELECT <select_list> FROM A RIGHT JOIN B ON A.key = B.key
    --
    SELECT <select_list> FROM A LEFT JOIN B ON A.key = B.key WHERE B.key IS NULL
    UNION
    SELECT <select_list> FROM A RIGHT JOIN B ON A.key = B.key WHERE A.key IS NULL
    ```



### 聚集索引和非聚集索引

InnoDB使用聚集索引，MyISAM使用非聚集索引。

主键的单值索引即为聚集索引，其他列创建的索引为二级索引（也称辅助索引，或非聚集索引）。InnoDB的二级索引叶子节点存放的主键和索引页的数据，所以在返回整行数据时，需要根据主键进行回表查询；而MyISAM存储的是主键和对应的数据的磁盘地址。

> 参考：
>
> https://blog.csdn.net/qq_20143059/article/details/82809712
>
> https://blog.csdn.net/qq_28584889/article/details/88778741

### 隔离级别问题

- 脏读（Dirty Read）：当前事务能够看到别的事物中未提交的数据。

    解决办法：如果第一个事务提交前，任何其他事务不可读取其修改过的值，则可以避免该问题。

- 不可重复读（Non-Repeatabble Reads）：一个事务对同一行数据重复读取2次，但是却得到了不同的结果。

    解决办法：在修改完数据，事务完全提交之后才可以读取数据，则可避免该问题。

- 幻读（虚读，Phantom Reads）：在其中一个事务中读取到了其他事务新增的数据。

    解决办法：在操作事务完成数据处理前，任何其他事务都不可以添加数据，则可避免该问题。

### Spring事务

- 5种隔离级别
- 7种传播行为



