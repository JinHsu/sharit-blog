---
title: 基于K8s安装KubeSphere
date: 2021-01-13
categories:
 - k8s
tags:
 - k8s
 - kubesphere
 - openebs
---

## 部署openebs

- ### 去掉污点


```sh
kubectl describe node k8s-node1 | grep Taint
kubectl taint nodes k8s-node1 node-role.kubernetes.io/master:NoSchedule-
```

- ### 安装 openebs


```sh
kubectl apply -f https://openebs.github.io/charts/openebs-operator-1.10.0.yaml
```

> [openebs-operator-1.10.0.yaml](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/attachments/openebs-operator-1.10.0.yaml)

或者使用 Helm

```sh
helm install --namespace openebs --name openebs stable/openebs --version 1.10.0
```

- ### 设置默认的 StorageClass


```sh
kubectl patch storageclass openebs-hostpath -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
kubectl get sc
```

## 部署KubeSphere

- ### 最小化安装


```sh
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/kubesphere-installer.yaml
kubectl apply -f https://github.com/kubesphere/ks-installer/releases/download/v3.0.0/cluster-configuration.yaml
```

> [kubesphere-installer.yaml](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/attachments/kubesphere-installer.yaml)，[cluster-configuration.yaml](https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/attachments/cluster-configuration.yaml)

- 查看部署日志


```sh
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

