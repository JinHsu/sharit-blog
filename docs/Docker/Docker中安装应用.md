---
title: Docker中安装应用
date: 2020-11-19
categories:
 - docker
tags:
 - docker
---

# Docker中安装应用

## 安装Nginx

### 拉取镜像

```sh
docker image pull nginx:1.19
```

### 运行容器实例

## 安装Mysql

### 拉取镜像

```sh
docker image pull mysql:5.7
```

### 运行容器实例

```sh
docker run \
	--name Mysql \
	--restart=always \
	-p 3306:3306 \
	-e MYSQL_ROOT_PASSWORD=root \
	-v /mydata/mysql/data:/var/lib/mysql \
	-v /mydata/mysql/conf:/etc/mysql \
	-v /mydata/mysql/log:/var/log/mysql \
	-d mysql:5.7
```

### 修改默认的字符集编码

```sh
vi /mydata/mysql/conf/my.cnf
```


加入以下配置：

```conf
[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
collation-server = utf8_unicode_ci
init-connect='SET NAMES utf8'
character-set-server = utf8
```

重启容器实例

```sh
docker restart Mysql
```

## 安装Redis

### 拉取镜像

```sh
docker image pull redis:5.0
```

### 运行容器实例

务必先创建Redis本地配置文件

```sh
touch /mydata/redis/conf/redis.conf
docker run \
	--name Redis \
	--restart=always \
	-p 6379:6379 \
	-v /mydata/redis/data:/data \
	-v /mydata/redis/conf/redis.conf:/etc/redis/redis.conf \
	-d redis:5.0 \
	redis-server /etc/redis/redis.conf
```

### 测试

```sh
docker exec -it Redis redis-cli
```

### 开启数据持久化

```sh
vi /mydata/redis/conf/redis.conf
```


开启aof持久化模式，在redis.conf中添加

```sh
appendonly yes
```


重启容器实例

```sh
docker restart Redis
```

## 安装ElasticSearch

### 安装ElasticSearch服务

```sh
docker image pull elasticsearch:7.9.0
```

### 安装可视化界面工具Kibana

```sh
docker image pull kibana:7.9.0
```

## 安装RabbitMQ

```sh
docker image pull rabbitmq:3.8.9-management
```

## 安装Nacos

## 安装Sentinel

## 安装Zipkin