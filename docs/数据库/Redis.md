---

---



Remote Dictionary Server



## 数据结构

### 1.字符串（strings）

```bash
> SET k1 sss

#追加字符串
> APPEND k1 123

#获取字符串长度
> STRLEN k1

#
> SET k2 0

#加1
> INCR k2

#减1
> DECR k2

#加
> INCRBY k2 3

#减
> DECRBY k2 2

#获取字符串的子串
> GETRANGE k1 0 2

#设置字符串指定位置的字符
> SETRANGE k1 0 tt

#
> SETEX k1 120 v1

#
> SETNX k1 2

#
> MSET k1 v1 k2 v2 k3 v3

#
> MGET k1 k2 k3

# 只要一个key存在，就都不会成功
> MSETNX k4 v4 k5 v5
```



### 2.散列（hashes）

```bash
# 
> HSET user name zhangsan

# 
> HGET user name

#
> HMSET customer name lisi age 20 sex 1

# 
> HMGET customer name age sex

# 
> HDEL user id name

#
> HLEN customer

# 
> HEXISTS customer age

# 
> HKEYS customer

#
> HVALS customer

#
> HINCRBY customer age 1
```



### 3.列表（lists）

```bash
#
> LPUSH list0 1 2 3 4 5

#
> RPUSH list1 1 2 3 4 5

#
> LRANGE list0 0 -1

#
> LPOP list0

#
> RPOP list0

#
> LINDEX list0 0

#
> LLEN list0

# LREM KEY count element
> LREM list3 2 2

# LTRIM KEY start stop
> LTRIM list2 1 3

# 
> RPOPLPUSH list0 list2

# LSET list2 index element
> LSET list2 1 xx

#
> LINSERT list2 BEFORE xx www
> LINSERT list2 AFTER xx zzz
```

list中pop完数据后，key自动删除

### 4.集合（sets）

```bash
#
> SADD set0 1 1 1 2 2 3

#
> SMEMBERS set0

#
> SCARD set0

#
> SREM set0 3

# 抽奖
> SRANDMEMBER set0 2

# 随机弹出元素
> SPOP set0 1

# 
> SMOVE set0 set1 6

# 交集
> SINTER set0 set1

# 差集
> SDIFF set0 set1

# 并集
> SUNION set0 set1

# 
```



### 5.有序集合（sorted sets）

```bash
# 
> ZADD zset0 20 v1 30 v2 50 v3 70 v4 100 v5

# 
> ZRANGE zset0 0 -1

# 
> ZRANGE zset0 0 -1 WITHSCORES

# 
> ZRANGEBYSCORE zset0 0 100

# 
> ZRANGEBYSCORE zset0 0 (100

# 
> ZRANGEBYSCORE zset0 0 100 LIMIT 1 2

# 
> ZREM zset0 v5

# 
> ZCARD zset0

# 
> ZCOUNT zset0 0 100

# 
> ZRANK zset0 v1

# 
> ZSCORE zset0 v1

# 
> ZREVRANGE zset0 0 -1

# 
> ZREVRANK zset0 v1

# 
> 

```



### 6.位图（bitmaps）



### 7.hyperloglogs 



### 8.地理空间（geospatial） 



## 配置

> redis.conf

### Units

```properties
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.
```

### INCLUDES

```properties
# include /path/to/local.conf
# include /path/to/other.conf
```

### NETWORK

```properties
# bind 192.168.1.100 10.0.0.1
# bind 127.0.0.1 ::1

port 6379
# Close the connection after a client is idle for N seconds (0 to disable)
timeout 0
tcp-keepalive 300
```



### GENERAL



### SNAPSHOTTING



### REPLICATION



### KEYS TRACKING



### SECURITY



### CLIENTS



### LAZY FREEING



### THREADED I/O



### APPEND ONLY MODE



### REDIS CLUSTER



### SLOW LOG



### EVENT NOTIFICATION



## 持久化

持久化就是把内存的数据写到磁盘中去，防止服务宕机了内存数据丢失。

Redis 提供了两种持久化方式:RDB（默认） 和AOF

**RDB**核心函数RDBSave(生成RDB文件)和RDBLoad（从文件加载内存）两个函数,按照一定的时间周期策略把内存的数据以快照的形式保存到硬盘的二进制文件。即Snapshot快照存储，对应产生的数据文件为dump.rdb，通过配置文件中的save参数来定义快照的周期。

**AOF**：Redis会将每一个收到的写命令都通过Write函数追加到文件最后，当Redis重启是会通过重新执行文件中保存的写命令来在内存中重建整个数据库的内容。
当两种方式同时开启时，**数据恢复Redis会优先选择AOF恢复**。

## 事务

### 命令

- MULTI

    标记一个事务块开始

- EXEC

    执行所有MULTI之后发的命令

- DISCARD

    丢弃所有MULTI之后发的命令

- WATCH

    类似一个乐观锁。监视一个（或多个）key，如果在事务执行之前这个（或这些）key被其他命令修改了，那么事务将被打断。

- UNWATCH

    取消WATCH命令对所有key的监视。



```bash

```



## 发布与订阅

### 命令

- PSUBSCRIBE

    订阅一个或多个符合给定模式的频道

- PUBSUB

    查看订阅与发布系统状态

- PUBLISH

    将信息发送到指定的频道

- PUNSUBSCRIBE

    退订所有给定模式的频道

- SUBSCRIBE

    订阅给定的一个或多个频道的信息

- UNSUBSCRIBE

    退订给定的频道



## 架构模式

### 单机架构

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/redis-001.jpeg" style="zoom:25%;" />

特点：简单

问题：1、内存容量有限 2、处理能力有限 3、无法高可用。

### 主从复制

主写从读，读写分离。

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/redis-002.jpeg" style="zoom:25%;" />

*Redis的主从复制（replication）是异步的*，其中被复制的服务器为主服务器（master），而通过复制创建出来的服务器复制品则为从服务器（slave）。 只要主从服务器之间的网络连接正常，主从服务器两者会具有相同的数据，主服务器就会一直将发生在自己身上的数据更新同步 给从服务器，从而一直保证主从服务器的数据相同。**主从复制，读写分离，主数据库可以进行读写操作，当发生写操作的时候自动将数据同步到从数据库，而从数据库一般是只读的，并接收主数据库同步过来的数据，一个主数据库可以有多个从数据库，而一个从数据库只能有一个主数据库。**

特点：

1、master/slave 数据相同

2、降低 master 读压力，客户端可以从slave读取数据

问题：

- 无法保证高可用
- 没有解决 master 写的压力

### 哨兵模式

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/redis-003.jpeg" style="zoom:25%;" />

Redis sentinel 是一个分布式系统中监控 redis 主从服务器，并在主服务器下线时自动进行故障转移。其中三个特性：

监控（Monitoring）： Sentinel 会不断地检查你的主服务器和从服务器是否运作正常。

提醒（Notification）： 当被监控的某个 Redis 服务器出现问题时， Sentinel 可以通过 API 向管理员或者其他应用程序发送通知。

自动故障迁移（Automatic failover）： 当一个主服务器不能正常工作时， Sentinel 会开始一次自动故障迁移操作。

特点：

1、保证高可用

2、监控各个节点

3、自动故障迁移

缺点：

- 主从模式，切换需要时间丢数据
- 没有解决 master 写的压力

### Proxy集群

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/redis-004.jpeg" style="zoom:50%;" />

添加了Twemproxy代理服务器，需要维护代理服务器的高可用。

### 直连集群

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/redis-005.jpeg" style="zoom:30%;" />

redis-cluster集群，Redis-Cluster采用无中心结构，每个节点保存数据和整个集群状态,每个节点都和其他所有节点连接。

特点：

1、无中心架构（不存在哪个节点影响性能瓶颈），少了 proxy 层。

2、数据按照 slot 存储分布在多个节点，节点间数据共享，可动态调整数据分布。

3、可扩展性，可线性扩展到 1000 个节点，节点可动态添加或删除。

4、高可用性，部分节点不可用时，集群仍可用。通过增加 Slave 做备份数据副本

5、实现故障自动 failover，节点之间通过 gossip 协议交换状态信息，用投票机制完成 Slave到 Master 的角色提升。

缺点

1、资源隔离性较差，容易出现相互影响的情况。

2、数据通过异步复制,不保证数据的强一致性



## 其他命令

```bash
#清空当前库
> FLUSHDB

#清空所有库
> FLUSHALL

#列出所有key
> KEYS *

#判断某个key是否存在
> EXISTS k1

#移动key:k1到2号库
> MOVE k1 2

#给key设置过期时间(单位秒)
> EXPIRE k1 120

#查看key的过期时间, -1永不过期, -2已过期
> TTL k1

#查看key的类型
> TYPE k1

#删除key
> DEL key


```



## 附录

### 参考文章

> [图解redis五种数据结构底层实现(动图版)](https://www.toutiao.com/i6766770175002804748/)
>
> [揭秘金三银四Redis面试内幕](https://www.toutiao.com/i6932327611892892164/)
>
> [Redis缓存与数据库数据一致性多方案分析及实践](https://www.toutiao.com/i6776603189761278475/)



### CAP和Base

- 强一致性（Consistency）
- 可用性（Availability）
- 分区容错性（Partition tolerance）

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/db-008.png" style="zoom:50%;" />

### 互联网三高

高并发、高性能、高可用

