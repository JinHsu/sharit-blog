---

---

# Java 对象结构

| 对象头    | 实例数据      | 对齐填充 |      |
| --------- | ------------- | -------- | ---- |
| Mark Word | Klass Pointer |          |      |

| Mark Word     | 4字节（32bit）8字节(64bit)                   | 对象头   |
| ------------- | -------------------------------------------- | -------- |
| Klass Pointer | 4字节（开启指针压缩）8字节（未开启指针压缩） | 对象头   |
| Instance Data |                                              |          |
| Padding       | 4字节                                        | 对齐填充 |

> https://artisan.blog.csdn.net/article/details/106958768
>
> https://blog.csdn.net/yangshangwei/article/details/106963927

# 对象如何创建，创建对象还有那些方式 



# 内存结构，那些是线程私有的，那些是共有的 



# 内存模型、CPU 有这套架构，为什么 JVM 实现一遍 



# 线程切换的上下文要装载什么



# 有没有 JVM 调优的经验、如何 JVM 调优，Dump 日志如何分析 



# 为什么要避免 FullGC



# 新生代垃圾收集算法，会不会 STW



# 垃圾回收算法有那些 



# CMS 垃圾回收针对哪些部分 



# 老年代 GC 和 FullGC 的关系 



# Java 中有哪些垃圾回收器，CMS 的垃圾回收过程 

