---
title: Docker安装及配置
date: 2020-11-16
categories:
 - docker
tags:
 - docker
---

# Docker安装及配置

## 环境

### 操作系统

CentOS 7

## 安装

### 安装docker

[官方文档地址](https://docs.docker.com/engine/install/centos/)

#### 删除系统已安装老版本的docker组件

```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

#### 安装docker源

```bash
sudo yum install -y yum-utils
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

#### 修改docker源地址

如果站点"https://download.docker.com"的下载速度很快，这步可以跳过。

```bash
cd /etc/yum.repos.d/
vi docker-ce.repo
```


将docker-ce.repo文件中的"https://download.docker.com"全部替换为"https://mirrors.tuna.tsinghua.edu.cn/docker-ce"。

> :%s@https://download.docker.com@https://mirrors.tuna.tsinghua.edu.cn/docker-ce@
>

#### 安装最新版的docker

```bash
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

#### 安装指定版本的docker

查看docker源中所有的docker版本

```bash
[root@localhost ~]# yum list docker-ce --showduplicates | sort -r
docker-ce.x86_64  3:18.09.1-3.el7                     docker-ce-stable
docker-ce.x86_64  3:18.09.0-3.el7                     docker-ce-stable
docker-ce.x86_64  18.06.1.ce-3.el7                    docker-ce-stable
docker-ce.x86_64  18.06.0.ce-3.el7                    docker-ce-stable
```


通过指定版本号安装特定版本的docker

```bash
sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
```

### 启动docker

```bash
sudo systemctl start docker
```


或

```bash
sudo service docker start
```

### 检查docker是否安装成功

```bash
sudo docker run hello-world
```

### 关闭docker

```bash
sudo systemctl stop docker
```


或

```bash
sudo service docker stop
```

### 重启docker

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 设置开机自启

https://docs.docker.com/engine/install/linux-postinstall/#configure-docker-to-start-on-boot

```bash
sudo systemctl enable docker
```

## 卸载

### 卸载docker组件

```bash
sudo yum remove -y docker-ce docker-ce-cli containerd.io
```

### 删除docker保留在本地的文件

```bash
sudo rm -rf /var/lib/docker
```

### 删除配置文件

## 镜像仓库

### 镜像仓库配置

https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon

```bash
mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://zt8bw0cg.mirror.aliyuncs.com","http://hubmirror.c.163.com","https://docker.mirrors.ustc.edu.cn","https://dockerhub.azk8s.cn","https://registry.docker-cn.com"]
}
EOF
systemctl daemon-reload
systemctl restart docker
```


配置完成后：需要重启docker服务

### 安装私有仓库