---
title: 安装K8s集群
date: 2021-01-13
categories:
 - k8s
tags:
 - k8s
 - docker
 - vagrant
---

## Vagrant安装虚拟机集群

### 创建virtualbox虚拟机

#### 创建Vagrantfile文件

```bash
D:\vagrant\k8s>copy con Vagrantfile
```

内容如下：

```ruby
Vagrant.configure("2") do |config|
    config.vm.box = "centos/7"
    
    (1...10).each do |i|
        
      config.vm.define "k8s-node#{i}" do |node|
        node.vm.hostname = "k8s-node#{i}"
        node.vm.network "private_network", ip: "192.168.56.#{200+i}" #, type: "dhcp"
     #   node.vm.network "public_network", ip: "192.168.1.#{200+i}"
        
        node.vm.provider "virtualbox" do |vb|
          vb.name = "k8s-node#{i}"
          vb.cpus = 4
          vb.memory = 2560
        end
        
      end
      
    end
    
  end
```

使用上述Vagrantfile创建9台虚拟机节点，每台虚拟机4核CPU，2.5GB内存

#### 批量创建虚拟机

```bash
Microsoft Windows [版本 10.0.19042.685]
(c) 2020 Microsoft Corporation. 保留所有权利。

D:\vagrant\k8s>vagrant up
Bringing machine 'k8s-node1' up with 'virtualbox' provider...
Bringing machine 'k8s-node2' up with 'virtualbox' provider...
Bringing machine 'k8s-node3' up with 'virtualbox' provider...
Bringing machine 'k8s-node4' up with 'virtualbox' provider...
Bringing machine 'k8s-node5' up with 'virtualbox' provider...
Bringing machine 'k8s-node6' up with 'virtualbox' provider...
Bringing machine 'k8s-node7' up with 'virtualbox' provider...
Bringing machine 'k8s-node8' up with 'virtualbox' provider...
Bringing machine 'k8s-node9' up with 'virtualbox' provider...
```

命令执行完成后的9台虚拟机：

![k8s-node-1](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/k8s-node-1.PNG)

### 配置虚拟机

#### 修改用户认证策略

Vagrant创建的虚拟机默认不能使用用户名密码登录，但可以使Vagrant自带的ssh命令登录：

```bash
Microsoft Windows [版本 10.0.19042.685]
(c) 2020 Microsoft Corporation. 保留所有权利。

D:\vagrant\k8s>vagrant ssh k8s-node1
[vagrant@k8s-node1 ~]$ who am i
vagrant  pts/0        2021-01-13 01:13 (10.0.2.2)
[vagrant@k8s-node1 ~]$
```

> 可以看到使用是vagrant用户，默认没有密码。

由于vagrant用户的权限问题，接下来的操作需要切换到root用户， 默认密码为：`vagrant`

```bash
[vagrant@k8s-node1 ~]$ su
Password:
[root@k8s-node1 vagrant]#
```

修改ssh配置

```bash
vi /etc/ssh/sshd_config
```

将PasswordAuthentication属性改为yes

```conf
# To disable tunneled clear text passwords, change to no here!
#PasswordAuthentication yes
#PermitEmptyPasswords no
PasswordAuthentication yes
```

重启sshd服务

```bash
systemctl restart sshd
```

按照上述步骤修改其他虚拟机的配置。然后通过Xshell连接上述9台虚拟机节点：

![k8s-node-2](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/k8s-node-2.PNG)

#### 修改虚拟机网络

给virtualbox创建一个全局的Nat网络

![k8s-node-3](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/k8s-node-3.PNG)

修改虚拟机的网络时，需要关闭虚拟机：

```bash
D:\vagrant\k8s>vagrant halt
```

修改每台虚拟机的网络，将网卡1连接方式"网络地址转换(NAT)"改为"NAT网络"，界面名称选择上述创建的全局"NAT网络"，然后重新生成Mac地址：

![k8s-node-4](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/k8s-node-4.PNG)

#### 关闭防火墙等

关闭防火墙：

```bash
systemctl stop firewalld
systemctl disable firewalld
```

关闭selinux：

```bash
setenforce 0
sed -i 's/enforcing/disabled/' /etc/selinux/config 
```

关闭swap

```bash
swapoff -a
sed -ri 's/.*swap.*/#&/' /etc/fstab
```

#### 修改hosts

```bash
[root@k8s-node4 ~]# vi /etc/hosts
10.0.2.15 k8s-node1
10.0.2.30 k8s-node2
10.0.2.31 k8s-node3
10.0.2.32 k8s-node4
10.0.2.33 k8s-node5
10.0.2.34 k8s-node6
10.0.2.35 k8s-node7
10.0.2.36 k8s-node8
10.0.2.37 k8s-node9
[root@k8s-node4 ~]# systemctl restart network
```

#### 修改虚拟机时区

```sh
timedatectl set-timezone Asia/Shanghai
```

#### 网络流量配置

```bash
[root@k8s-node1 ~]# cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
[root@k8s-node1 ~]# sysctl --system
```

> 虚拟机环境配置好后，建议对所有节点做一个备份。

## 安装K8s组件

### 安装docker

#### 删除旧版本：

```bash
yum remove -y docker \
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
yum install -y yum-utils
yum-config-manager \
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

#### 安装docker

```bash
yum install -y docker-ce-19.03.0 docker-ce-cli-19.03.0 containerd.io
```

#### 配置镜像加速

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

#### 启动docker

```bash
systemctl start docker
systemctl enable docker
```

### 安装kube

#### 安装kube源

```sh
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

#### 安装kube

```sh
yum install -y kubelet-1.17.16 kubeadm-1.17.16 kubectl-1.17.16
```

#### 启动kubelet

```sh
systemctl start kubelet
systemctl enable kubelet
```

> 查看kubelet状态，此处为activiting，因为还没有jion到master

```sh
systemctl status kubelet
```

### 部署kebeadm

初始化kubeadm

```
echo "1" >/proc/sys/net/bridge/bridge-nf-call-iptables
```

```sh
kubeadm init \
--kubernetes-version=v1.17.16 \
--image-repository registry.aliyuncs.com/google_containers \
--apiserver-advertise-address 10.0.2.15 \
--pod-network-cidr=10.244.0.0/16
```

按提示执行：

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

或者

```
export KUBECONFIG=/etc/kubernetes/admin.conf
```

#### 部署Pod网络

```sh
cd ~ && mkdir k8s && cd k8s
curl -O https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

> [kube-flannel.yml](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/attachments/kube-flannel.yml)

修改kube-flannel.yml，使`Network`与kubeadm的`--pod-network-cidr`保持一致：

```yaml
net-conf.json: |
    {
        "Network": "10.244.0.0/16",
        "Backend": {
        	"Type": "vxlan"
    	}
    }
```

应用

```sh
kubectl apply -f ~/k8s/kube-flannel.yml
```

> 如果长时间没有起来，建议重启节点

查看所有的Pods

```sh
kubectl get pods --all-namespaces
```

查看Node：

```
[root@k8s-node1 flannel]# kubectl get nodes
NAME        STATUS   ROLES                  AGE   VERSION
k8s-node1   Ready    control-plane,master   38m   v1.20.1
```

### 注册Node

```sh
echo "1" >/proc/sys/net/bridge/bridge-nf-call-iptables
kubeadm join 10.0.2.15:6443 --token 46jmx6.dmgawbd78v4fvpwa \
    --discovery-token-ca-cert-hash sha256:16960ea73977a5ea364b6debc226f23ce44d5d84ca7d29af671da2bc53a41b68 
```

> 如果长时间没有起来，建议重启节点。token有效期一般为24小时，可查看token是否有效，然后重新生成token

```
kubeadm token list
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

### 监控Node的Pod状态：

```
watch kubectl get pod -n kube-system -o wide
```

> 如果遇到错误，可以重启服务

```sh
systemctl restart kubelet
systemctl restart docker
```

## 遇到的问题

### 节点的状态为NotReady

检查网络配置：如1.2.2.中所示，确保master和所有的节点都能相互ping通

### 卸载k8s

```sh
kubeadm reset -f
rm -rf ~/.kube/
rm -rf /etc/kubernetes/
rm -rf /etc/systemd/system/kubelet.service.d
rm -rf /etc/systemd/system/kubelet.service
rm -rf /usr/bin/kube*
rm -rf /etc/cni
rm -rf /opt/cni
rm -rf /var/lib/etcd
rm -rf /var/etcd
```

