---
title: CentOS/7配置静态IP
date: 2021-01-16
categories:
 - centos
tags:
 - centos
 - ip
---

### 查看需要修改IP的网卡

```sh
ifconfig -a
```

或者

```sh
ip addr
```

### 修改对应网卡配置

```sh
vim /etc/sysconfig/network-scripts/ifcfg-eth1
```

内容如下：

```sh
BOOTPROTO=static
ONBOOT=yes
DEVICE=eth1
NM_CONTROLLED=no
IPADDR=192.168.1.188
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
```

修改

```sh
vim /etc/sysconfig/network
```

内容如下：

```sh
# Created by anaconda
NETWORKING=yes
GATEWAY=192.168.1.1
```

### 重启网络服务

```sh
systemctl restart network
```

