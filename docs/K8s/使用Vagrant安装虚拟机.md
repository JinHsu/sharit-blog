---
title: 使用Vagrant安装虚拟机
date: 2021-01-13
categories:
 - k8s
tags:
 - vagrant
---

## 资源下载

[下载最新版本的Vagrant](https://www.vagrantup.com/downloads)

[下载最新版本的Virtualbox](https://www.virtualbox.org/wiki/Downloads)

## 安装虚拟机

### 快速安装

```sh
mkdir test
cd test
vagrant init centos/7
vagrant up
```

### 自定义安装

创建工程

```sh
mkdir custom
cd custom
```


创建一个Vagrantfile，内容如下：

```ruby
Vagrant.configure("2") do |config|
	#镜像
	config.vm.box = "centos/7"
	#安装操作系统的host名称
	config.vm.hostname = "custom"
	#添加一个私有网络（Host-only模式）
	config.vm.network "private_network", type: "dhcp"
	#添加一个共有网络（Bridged模式）
	config.vm.network "public_network", ip: "192.168.1.100"

	#虚拟机参数
	config.vm.provider "virtualbox" do |vb|
		#虚拟机名称
	vb.name = "custom"
	#虚拟机cpu核数
		vb.cpus = 4
	#虚拟机内存大小
		vb.memory = "2048"
	end

end
```

安装并启动虚拟机

```sh
vagrant up
```


停止休眠虚拟机

```sh
vagrant halt
vagrant suspend
```


重启虚拟机

```sh
vagrant reload
```


删除虚拟机

```sh
vagrant destroy
```

### 集群安装

创建工程

```sh
mkdir cluster
cd cluster
```


创建一个Vagrantfile，内容如下：

```ruby
Vagrant.configure("2") do |config|

	config.vm.box = "centos/7"
	
	#master节点
	config.vm.define "master" do |cfg|
		cfg.vm.hostname = "master"
		cfg.vm.network "private_network", type: "dhcp"
		cfg.vm.network "public_network", ip: "192.168.1.200"
	
		cfg.vm.provider "virtualbox" do |vb|
			vb.name = "master"
			vb.cpus = 4
			vb.memory = "2048"
		end
	end
	
	#node节点
	config.vm.define "node1" do |cfg|
		cfg.vm.hostname = "node1"
		cfg.vm.network "private_network", type: "dhcp"
		cfg.vm.network "public_network", ip: "192.168.1.201"
	
		cfg.vm.provider "virtualbox" do |vb|
			vb.name = "node1"
			vb.cpus = 2
			vb.memory = "1024"
		end
	end

end
```


使用循环命令创建多个虚拟机

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"

  #10个节点
  (1...11).each do |i|
  	

    config.vm.define "node#{i}" do |cfg|
      cfg.vm.hostname = "k8s-node#{i}"
      cfg.vm.network "private_network", type: "dhcp"
      cfg.vm.network "public_network", ip: "192.168.1.#{199+i}"
      
      cfg.vm.provider "virtualbox" do |vb|
        vb.name = "k8s-node#{i}"
        vb.cpus = 4
        vb.memory = "2048"
      end
      
    end

  end

end
```


安装并启动虚拟机

```sh
vagrant up
```

## 网络配置

Vagrant默认不能使用密码进行ssh远程连接，也不允许root用户登录，需要作如下配置：

```sh
vagrant ssh k8s-node1
su root
vi /etc/ssh/sshd_config
```


将sshd_config作如下修改：

```
PermitRootLogin yes
PasswordAuthentication yes
```


重启sshd服务

```sh
systemctl restart sshd
```

