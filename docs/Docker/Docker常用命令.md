---
title: Docker常用命令
date: 2020-11-17
categories:
 - docker
tags:
 - docker
---

# Docker常用命令

官方文档地址：https://docs.docker.com/engine/reference/commandline/cli/

### docker version

显示安装的docker版本

### docker info

显示安装的docker详细信息

### docker search

从远程仓库搜索镜像

### docker run

在一个新的容器中运行一个命令：首先拉取镜像（如果本地没有），再创建一个容器，最后将镜像运行在容器中

```
docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```

#### [--name]

容器名字

```
docker run --name some-name hello-world
```

#### [-d]

--detach

在后台运行容器进程并打印容器ID

```
docker run -d redis:latest
```

#### [-e]

--env

设置环境变量

```
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:latest
```

#### [-i]

--interactive

进入交互模式

```
docker run -d -it redis:latest
```

#### [-t]

--tty

分配一个虚拟的终端

```
docker run -d -it redis:latest
```

#### [-p]

--publish

发布容器端口映射到宿主机

```
docker run -d -it -p 6379:6379 redis:latest
```

#### [-v]

--volume

挂载容器目录到宿主机目录

```
docker run -d -v /myredis/conf/redis.conf:/usr/local/etc/redis/redis.conf -p 6379:6379 redis:latest
```

#### [-w]

--workdir

指定容器的工作目录

### docker image

#### [build]

从dockerfile构建一个镜像

```
docker image build 
```


详情见Docker编排

#### [history]

显示镜像的历史信息

```
docker image history nginx
```

#### [import]

导入镜像

```
docker image import [OPTIONS] file | URL | -[REPOSITORY[:TAG]]
```


或

```
docker import [OPTIONS] file | URL | -[REPOSITORY[:TAG]]
```


注意与docker image load的区别

#### [inspect]

显示一个或多个镜像的详细信息

```
docker image inspect nginx mysql ...
```

#### [load]

从一个压缩包或者输入流中载入一个或多个镜像

```
docker image load -i ./combine.gz
```


镜像导出，见[save]命令

#### [ls]

列出本地的镜像

```
docker image ls
```


或

```
docker image list
docker images
```

#### [prune]

删除悬挂的镜像（没有被容器引用且没有标签的镜像）

```
docker image prune
```


删除没有被容器引用的镜像

```
docker image prune -a
```

#### [pull]

从远程仓库拉取一个镜像

```
docker image pull nginx
```


或

```
docker pull nginx
```

#### [push]

推送一个镜像到远程仓库

```
docker image push nginx:latest
```

#### [rm]

删除一个或多个镜像

```
docker image rm mysql nginx ...
```


或

```
docker rmi mysql nginx
```

#### [save]

将一个或多个镜像打包导出到压缩文件

```
docker image save mysql redis -o ./combine.gz
```


载入导出包的镜像到本地镜像仓库，见[load]命令。相关docker export

#### [tag]

给源镜像打上一个标签

```
docker image tag nginx:latest mynginx:latest
```

### docker container

### docker builder

### docker config

### docker context

### docker engine

### docker node

### docker plugin

### docker secret

### docker service

### docker stack

### docker swarm

### docker system

### docker trust

### docker volume