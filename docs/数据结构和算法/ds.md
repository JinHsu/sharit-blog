---
title: 数据结构
date: 2021-01-16
categories:
 - 数据结构与算法分析
tags:
 - 数据结构
---

> 物理数据结构：数组，链表
>
> 逻辑数据结构：由物理数据结构通过算法构建而来，如栈，队列，树，图，散列等。

## 数组

```java
int[] a = {1,2,3,4};
```

### 数组压缩

```java
// 原始二维数组
int[][] arr = new int[4][9];
arr[0] = {0,1,0,0,0,0,0,0,0};
arr[1] = {0,2,0,0,0,0,0,0,0};
arr[2] = {0,0,2,1,0,0,0,0,0};
arr[3] = {0,2,0,0,0,0,0,0,0};
// 转为稀疏数组
int[][] array = int[6][3]; // 固定有3列：行号，列号，值；第1行为数组{行数, 列数, 2},第2行开始为具体的数据行
array[0] = {4,9,2};
array[1] = {0,1,1};
array[2] = {1,1,2};
array[3] = {2,2,2};
array[4] = {2,3,1};
array[5] = {3,1,2};
```

## 链表

### 单向链表

```java
// 单向链表节点
public class Node<E> {
    Node<E> next; // 下一个节点的引用
    E value; // 节点的元素
    public Node(E e) {
        this.value = e;
    }
}
// 单向链表
public class LinkedList<E> {
    Node<E> head; // 头部
    Node<E> tail; // 尾部
    int size; // 链表大小
    
    public void add(E e) {
        if (this.head == null) {
            this.head = new Node<>(e);
            this.tail = this.head;
        } else {
            this.tail.next = new Node<>(e); // 在尾部添加
        }
        // ...
        this.size++;
    }
    
    public void remove(E e) {
        
    }
    
    public void size() {
        return this.size;
    }
}
```

### 双向链表

```java
// 双向链表节点
public class Node<E> {
    Node<E> pre; // 上一个节点的引用
    Node<E> next; // 下一个节点的引用
    E value; // 节点的元素
    public Node(E e) {
        this.value = e;
    }
}
// 双向链表
public class LinkedList<E> {
    Node<E> head; // 头部
    Node<E> tail; // 尾部
    int size; // 链表大小
    
    public void add(E e) {
        // ...
        this.size++;
    }
    
    public void remove(E e) {
        
    }
    
    public void size() {
        return this.size;
    }
}
```

## 栈

```java
public class Stack<E> {
    E[] arr; //
    int capacity;
    int pos = -1;
    int size = 0;
    
    public Stack(int capacity) {
        // capacity 参数检查
        this.capacity = capacity;
        arr = new Object[capacity];
    }
    
    // 出栈
    public E pop() {
        if (this.size == 0) {
            return null;
        }
        E temp = arr[pos];
        --this.pos;
        --this.size;
        return temp;
    }
    
    // 压栈
    public void push(E e) {
        if (this.pos == this.size -1) {
            // 抛出异常
            throw new RunTimeException("StackOverflowError");
            // 或者自动扩容
            // TODO
        }
        ++this.pos;
        ++this.size;
        arr[pos] = e;
    }
    
    public int size() {
        return this.size;
    }
    
    public boolean isEmpty() {
        return this.size == 0;
    }
}
```

## 队列

> 链表的操作很快，但线性访问速度太慢。



## 树

### 二叉树

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/ds-001.png" style="zoom:50%;" />

- 先序遍历

    自己，左孩子，右孩子。

    ABDEHKCFMG

- 中序遍历

    左孩子，自己，右孩子。

    DBHEKAFMCG

- 后序遍历

    左孩子，右孩子，自己。

    DHKEBMFGCA

***栈遍历方式***





### 二叉排序树

任何一个非叶子节点，其左右孩子节点的值都比当前节点的值小（左大右小，中序遍历后为降序；左小右大，中序遍历后为升序）。这样的数，进行中序遍历后就是有序的。又称二叉查找树（binary search/sort tree）。

### 二叉平衡树

平衡二叉搜索树（Self-balancing binary search tree）又被称为AVL树（有别于AVL算法），且具有以下性质：它是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵二叉平衡树。

- 左旋转

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/ds-003.png" style="zoom:50%;" />

- 右旋转

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/ds-004.png" style="zoom:50%;" />

- 双旋转

    <img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/ds-005.png" style="zoom:50%;" />

    上述(1)、(2)两者情况分别右旋转和左旋转后并不能满足二叉平衡树的要求，这时候就需要双旋转了。

    情况(1)，进行右旋转前，需要先对当前节点N1的左子树N2进行左旋转；

    情况(2)，进行左旋转前，需要先对当前节点N1的右子树N3进行右旋转



### 红黑树



### B树

B树和平衡二叉树稍有不同的是B树属于多叉树，又名平衡多路查找树（查找路径不只两个）。数据库索引技术里大量使用者B树和B+树的数据结构。

1. 排序方式：所有节点关键字是按递增次序排列，并遵循左小右大原则。
2. 子节点数：非叶节点的子节点数>1，且<=M ，且M>=2，空树除外（注：M阶代表一个树节点最多有多少个查找路径，M=M路，当M=2则是2叉树，M=3则是3叉树）。
3. 关键字数：枝节点的关键字数量大于等于`ceil(m/2)-1`个且小于等于M-1个（注：ceil()是个朝正无穷方向取整的函数 如`ceil(1.1)`结果为2)。
4. 所有叶子节点均在同一层、叶子节点除了包含了关键字和关键字记录的指针外也有指向其子节点的指针只不过其指针地址都为null对应下图最后一层节点的空格子。

### B+树

B+树是B树的一个升级版，相对于B树来说B+树更充分的利用了节点的空间，让查询速度更加稳定，其速度完全接近于二分法查找。

规则：

1. B+跟B树不同B+树的**非叶子**节点不保存关键字记录的指针，只进行数据索引，这样使得B+树每个**非叶子**节点所能保存的关键字大大增加。
2. B+树**叶子**节点保存了父节点的所有关键字记录的指针，所有数据地址必须要到叶子节点才能获取到。所以每次数据查询的次数都一样。
3. B+树叶子节点的关键字从小到大有序排列，左边结尾数据都会保存右边节点开始数据的指针。
4. 非叶子节点的子节点数=关键字数（来源百度百科）（根据各种资料，这里有两种算法的实现方式，另一种为非叶节点的关键字数=子节点数-1（来源维基百科)，虽然他们数据排列结构不一样，但其原理还是一样的，Mysql 的B+树是用第一种方式实现）。

特点：

1. B+**树的层级更少**：相较于B树，B+每个**非叶子**节点存储的关键字数更多，树的层级更少所以查询数据更快；
2. B+**树查询速度更稳定**：B+所有关键字数据地址都存在**叶子**节点上，所以每次查找的次数都相同所以查询速度要比B树更稳定;
3. B+**树天然具备排序功能：**B+树所有的**叶子**节点数据构成了一个有序链表，在查询大小区间的数据时候更方便，数据紧密性很高，缓存的命中率也会比B树高。
4. B+**树全节点遍历更快：**B+树遍历整棵树只需要遍历所有的**叶子**节点即可，而不需要像B树一样需要对每一层进行遍历，这有利于数据库做全表扫描。

> **B树**相对于**B+树**的优点是，如果经常访问的数据离根节点很近，而**B树**的**非叶子**节点本身存有关键字其数据的地址，所以这种数据检索的时候会要比**B+树**快。

### B*树

B*树是B+树的变种，相对于B+树他们的不同之处如下：

1. 首先是关键字个数限制问题，B+树初始化的关键字初始化个数是`ceil(m/2)`，B*树的初始化个数为`ceil(2/3*m)`。
2. B+树节点满时就会分裂，而B*树节点满时会检查兄弟节点是否满（因为每个节点都有指向兄弟的指针），如果兄弟节点未满则向兄弟节点转移关键字，如果兄弟节点已满，则从当前节点和兄弟节点各拿出1/3的数据创建一个新的节点出来。

在B+树的基础上因其初始化的容量变大，使得节点空间使用率更高，而又存有兄弟节点的指针，可以向兄弟节点转移关键字的特性使得B*树额分解次数变得更少。

> 从平衡二叉树、B树、B+树、B*树总体来看它们的贯彻的思想是相同的，都是采用二分法和数据平衡策略来提升查找数据的速度；
>
> 不同点是他们一个一个在演变的过程中通过IO从磁盘读取数据的原理进行一步步的演变，每一次演变都是为了让节点的空间更合理的运用起来，从而使树的层级减少达到快速查找数据的目的；

## 图

<img src="https://bucket-sharit-beijing.oss-cn-beijing.aliyuncs.com/blog/images/ds-006.png" style="zoom:50%;" />

顶点(vertex)、边(edge)、路径、无向图、有向图、带权图

图的两种表示方式：二维数组表示（邻接矩阵）；链表表示（邻接表）。

```shell
[0, 1, 1, 0, 0]
[1, 0, 1, 1, 1]
[1, 1, 0, 0, 0]
[0, 1, 0, 0, 0]
[0, 1, 0, 0, 0]
```



### 深度优先遍历



### 广度优先遍历



## 堆



## 散列