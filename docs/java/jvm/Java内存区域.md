---
title: Java内存区域
date: 2021-02-01
categories:
 - jvm
tags:
 - Java内存区域
---

## 运行时数据区

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-005.png" style="zoom:50%;" />

### 程序计数器

线程私有，此内存区域是唯一一个在Java虚拟机规范中没有规定任何OutOfMemoryError情况的区域。

### Java虚拟机栈

线程私有，生命周期与线程相同。

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-008.png" style="zoom:50%;" />

可能出现的2种异常：

1. StackOverflowError，线程请求的栈深度大于虚拟机所允许的深度
2. OutOfMemoryError，在动态扩展虚拟机栈时，如果无法申请到足够的内存空间。

### 本地方法栈

线程私有，本地方法执行时使用到的栈。也会出现和Java虚拟机栈2种相同异常。

### 方法区

线程共享，存储：已被虚拟机加载的**类信息**、**常量**、**静态变量**、**即时编译器编译后的代码**等数据。

方法区是一个虚拟机规范、逻辑概念，具体的实现有永久代（Permanent Generation）或元空间（MetaSpace）。

> String.intern()方法在不同版本的虚拟机版本中，表现不同。在JDK1.7的HotSpot中，已经把原本放在永久代的字符串常量池移出（堆）。

方法区内存的回收主要是针对常量池的回收和对类型的卸载。当方法区无法满足内存分配需求时，将抛出OutOfMemoryError异常。

运行时常量池是方法区的一部分。

> 永久代参数：
>
> -XX:PermSize
>
> -XX:MaxPermSize
>
> 元空间参数：
>
>  -XX:MetaspaceSize
>
> -XX:MaxMetaspaceSize
>
> -XX:MinMetaspaceFreeRatio
>
> -XX:MaxMetaspaceFreeRatio

### 堆

线程共享，存放实例对象和数组。随着JIT编译器的发展与逃逸分析技术逐渐成熟，**栈上分配**、**标量替换**优化技术，所有对象的堆上分配也并不是那么绝对。

Java堆是垃圾收集器管理的主要区域，分代模型将堆分为：新生代（Young）和老年代（Old）。

新生代细致一点分为：Eden区，From Survivor区（S0），To Survivor区（S1）。

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-006.png" style="zoom: 50%;" />

Java堆中可能划分出多个线程私有的分配缓冲区（Thread Local Allocation Buffer，TLAB），以减小内存分配时锁的竞争，提高效率。

> -XX:+/-UseTLAB

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-007.png" style="zoom: 50%;" />

进一步划分的目的都是为了有效高效的回收内存。

> 堆参数设置：
>
> -Xms:初始堆大小(最小堆)。
>
> -Xmx:最大堆大小。
>
> -Xmn:年轻代大小（Sun官方推荐配置为整个堆的3/8）。
>
> -Xss:每个线程的堆大小（在相同物理内存下，减小这个值能生成更多的线程）。
>
> -Xms和-Xmx设置成一致的值可以避免堆动态扩展。
>
> JVM内存大小 = 新生代大小 + 老年代大小 + 方法区大小（永久代/元空间）。

如果堆中没有内存完成实例分配，也无法进行扩展时，将会抛出OutOfMemoryError异常。

### 直接内存

在JDK1.4中加入了NIO（New Input/Output）类，引入了一种基于通道（Channel）与缓冲区（Buffer）的I/O方式，它可以使用Native函数库直接分配堆外内存，然后通过一个存储在Java堆中的DirectByteBuffer对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了在Java堆和Native堆中来回复制数据。

## 虚拟机对象

以下基于HotSpot虚拟机进行讨论。

### 对象的创建

#### 对象的创建方式

- new关键字

    ```java
    Object o = new Object();
    ```

- 反射

    ```java
    // Class newInstance()
    Class clazz = Class.forName("com.mysql.jdbc.Driver");
    com.mysql.jdbc.Driver driver = (com.mysql.jdbc.Driver) clazz.newInstance();
    // Constructor newInstance()
    Constructor constructor = clazz.getConstructor();
    Driver h =(Driver) constructor.newInstance();
    ```

- 反序列化

    ```java
    Hello h = new Hello();
    //准备一个文件用于存储该对象的信息
    File f = new File("hello.obj");
    FileOutputStream fos = new FileOutputStream(f);
    ObjectOutputStream oos = new ObjectOutputStream(fos);
    FileInputStream fis = new FileInputStream(f);
    ObjectInputStream ois = new ObjectInputStream(fis);
    //序列化对象，写入到磁盘中
    oos.writeObject(h);
    //反序列化对象
    Hello newHello = (Hello) ois.readObject();
    //测试方法
    newHello.sayWorld();
    ```

- clone

    ```java
    // 实现Cloneable接口
    public class Hello implements Cloneable {
        public void sayWorld() {
            System.out.println("Hello world!");
        }
    
        public static void main(String[] args) throws Exception {
            Hello h1 = new Hello();
            Hello h2 = (Hello)h1.clone();
            h2.sayWorld();
        }
    }
    ```

#### 普通对象创建过程

1. 类加载

2. 内存分配

    - **指针碰撞**（Dump the Pointer）
    - **空闲列表**（Free List）

    内存的分配方式是由Java堆是否规整（连续）决定，而Java堆是否规整又由所采用的的垃圾回收器是否带压缩整理功能决定。

    Serial、ParNew等带Compact过程的收集器，系统采用分配算法为指针碰撞；而使用CMS这种基于Mark-Sweep算法的收集器时，通常采用空闲列表。

    > **线程安全**
    >
    > - 内存分配动作做同步处理，实际上虚拟机采用CAS（Compare And Swap）配上失败重试的方式（**自旋锁**）保证更新操作的原子性；
    > - 每个线程在Java堆中预先分配一小块内存，称为线程本地分配缓冲区（Thread Local Allocation Buffer，TLAB），在TLAB上分配即可。只有TLAB用完并分配新的TLAB时，才需要同步锁。

3. 初始化零值

    虚拟机要将分配到的内存空间都初始化为零值（不包括对象头）。如果使用TLAB，这一工作可提前至TLAB分配时进行。这一步保证了对象的实例字段在Java代码中可以不赋初始值就直接使用，程序能访问到这些字段的数据类型所对应的零值。

    ”半初始化状态“的对象：

    ```java
    Object o = new Object();
    ```

    字节码指令

    ```properties
     0 new #2 <java/lang/Object>
     4 invokespecial #1 <java/lang/Object.<init>>
     7 astore_1
    ```

    > 0 为对象申请内存空间；4 调用构造方法；7 将变量的引用指向申请的内存空间地址
    >
    > 4和7可能发生指令重排序

4. 对象头设置

    对对象头进行一些必要的设置。例如，类的实例信息，类的元数据信息，对象的哈希码，对象的GC分代年龄信息等。

5. 执行构造方法

    执行`<init>`方法，有字节码指令`invokespecial`决定，也就是构造方法的执行。

### 对象内存布局

对象在内存中存储着3块区域：对象头（Header）、实例数据（Instance Data）、对齐填充（Padding）。

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-009.png" style="zoom:50%;" />

#### 对象头

对象头一般包含3部分：

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-011.png" style="zoom:50%;" />

Mark Word存储对象自身的运行时数据。

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-010.png" style="zoom:50%;" />

类型指针，即对象指向它的类元数据的指针，虚拟机通过这个指针来确定这个对象是哪个类的实例。并不是所有的虚拟机实现都必须在对象数据上保留类型指针，也就是说，查找对象的元数据信息并不一定要经过对象本身。

#### 实例数据

各种字段内容，包括父类继承下来的。

#### 对齐填充

并不是一定存在，也没有特别的含义。HotSpot VM自动内存管理系统要求对象起始地址必须是8字节的整数倍，因此当对象实例数据部分没有对齐时，就需要通过对齐填充来补全。

#### 查看对象的内存布局

JOL（java object layout）工具插件:

```xml
<!-- https://mvnrepository.com/artifact/org.openjdk.jol/jol-core -->
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.14</version>
</dependency>
```

- 普通对象

```java
public class JVM_JOL {
    public static void main(String[] args) {
        Object o = new Object();
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
    }
}
```

输出结果：

```properties
java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

虚拟机默认开启了”对象指针压缩“，且使用的是`Java HotSpot(TM) 64-Bit Server VM (build 25.271-b09, mixed mode)`

```properties
-XX:+/-UseCompressedOops
```

关闭对象指针压缩：

```properties
java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           00 1c 60 37 (00000000 00011100 01100000 00110111) (929045504)
     12     4        (object header)                           03 00 00 00 (00000011 00000000 00000000 00000000) (3)
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```

- 普通对象数组

```java
public class JVM_JOL {
    public static void main(String[] args) {
        Object[] arr = new Object[7];
        System.out.println(ClassLayout.parseInstance(arr).toPrintable());
    }
}
```

输出结果：

```properties
[Ljava.lang.Object; object internals:
 OFFSET  SIZE               TYPE DESCRIPTION                               VALUE
      0     4                    (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4                    (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4                    (object header)                           4c 23 00 f8 (01001100 00100011 00000000 11111000) (-134208692)
     12     4                    (object header)                           07 00 00 00 (00000111 00000000 00000000 00000000) (7)
     16    28   java.lang.Object Object;.<elements>                        N/A
     44     4                    (loss due to the next object alignment)
Instance size: 48 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

关闭对象指针压缩：

```properties
[Ljava.lang.Object; object internals:
 OFFSET  SIZE               TYPE DESCRIPTION                               VALUE
      0     4                    (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4                    (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4                    (object header)                           48 4b 3a 08 (01001000 01001011 00111010 00001000) (138038088)
     12     4                    (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
     16     4                    (object header)                           07 00 00 00 (00000111 00000000 00000000 00000000) (7)
     20     4                    (alignment/padding gap)                  
     24    56   java.lang.Object Object;.<elements>                        N/A
Instance size: 80 bytes
Space losses: 4 bytes internal + 0 bytes external = 4 bytes total
```

### 对象访问定位

目前主流的访问方式有使用句柄和直接指针两种。

- 使用句柄访问

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-012.png" style="zoom:50%;" />

- 使用直接指针访问

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/jvm-013.png" style="zoom:50%;" />

这2种对象访问方式各有优势，使用句柄来访问的最大好处就是reference中存储的是稳定的句柄地址，在对象被移动（垃圾收集时移动对象是非常普遍的行为）时只会改变句柄中的实例数据指针，而reference本身不需要修改。（便于垃圾回收）

使用直接指针访问方式的最大好处就是速度快，它节省了一次指针定位的时间开销，由于对象的访问在Java中非常频繁，因此这类开销积少成多后也是一项非常可观的执行成本。HotSpot虚拟机使用的是直接指针访问的方式。

