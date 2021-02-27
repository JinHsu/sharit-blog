---
title: 算法分析
date: 2021-01-16
categories:
 - 数据结构与算法分析
tags:
 - 算法分析
---

## 排序算法

### 1.冒泡排序

```java
public void sort(int[] arr) {
    // TODO arr数组检查
    for (int i = 0; i < arr.length; i++) {
        for (int j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
            }
        }
    }
}

private void swap(int arr[], int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

需要`n`趟，每趟通过交换把最大（或最小）的元素移动到了**队尾**。

### 2.快速排序

```java
public void sort(int[] arr) {
    // TODO arr数组检查
    sort(arr, 0, arr.length - 1);
}

public void sort(int[] arr, int low, int high) {
    if (low < high) {
        int mid = sort2(arr, low, high);
        sort(arr, low, mid - 1);
        sort(arr, mid + 1, high);
    }
}

public int sort2(int[] arr, int low, int high) {
    int base = arr[low]; // 基数
    while (low < high) {
        while (low < high && arr[high] > base) {
            high--;
        }
        arr[low] = arr[high];// 找到了小于base的数
        while (low < high && arr[low] <= base) {
            low++;
        }
        arr[high] = arr[low]; // 找到了大于base的数
    }
    // arr[high] = base;
    arr[low] = base; //
    return low;
}
```

1. 先从数列中取出一个数作为基准数。
2. 分区过程，将比这个数大的数全放到它的右边，小于或等于它的数全放到它的左边。
3. 再对左右区间重复第二步，直到各区间只有一个数。 

### 3.插入排序

```java
public void sort(int[] arr) {
    // TODO arr数组检查
    for (int i = 1; i < arr.length; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[j] > arr[i]) {
                int temp = arr[i]; // 暂存
                System.arraycopy(arr, j, arr, j + 1, i - j);// 后移
                arr[j] = temp;// 复原
            }
        }
    }
}
```

需要`n-1`趟，每趟遍历，通过**比较交换**将元素插入到前面有序数组的合适位置。

### 4.希尔排序

希尔排序也是一种分步的插入排序。

```java
public void sort(int[] arr) {
    // TODO arr数组检查
    for (int step = arr.length / 2; step > 0; step /= 2) {
        for (int i = 0; i < step; i++) {
            // 对每个步长进行插入排序
            for (int j = i + step; j < arr.length; j += step) {
                for (int k = i; k < j; k += step) {
                    if (arr[k] > arr[j]) {
                        int temp = arr[j]; // 暂存
                        // 后移
                        for (int m = j; m > k; m -= step) {
                            arr[m] = arr[m - step];
                        }
                        arr[k] = temp;// 复原
                    }
                }
            }
        }
    }
}
```

按照**步长**（大于0）将数组切分成小块，每个小块内部使用**插入排序**。

### 5.基数（桶）排序

```java
public class RadixSort {

	int[] arr;
	int[][] buckets;
	int[] size;

	public RadixSort(int[] arr) {
		this.arr = arr;
		buckets = new int[10][arr.length];
		size = new int[10];
	}

	private void sort() {
		// TODO arr数组检查
		int maxLength = maxLength();
		for (int i = 0, n = 1; i < maxLength; i++, n *= 10) {
			for (int j = 0; j < arr.length; j++) {
				int val = arr[j] / n % 10;
				buckets[val][size[val]] = arr[j];
				size[val]++;
			}
			// 取出数据
			int idx = 0;
			for (int k = 0; k < buckets.length; k++) {
				for (int m = 0; m < size[k]; m++) {
					arr[idx] = buckets[k][m];
					idx++;
				}
				size[k] = 0; // 重置size数组
			}
		}
	}

	private int maxLength() {
		int max = arr[0];
		for (int value : arr) {
			if (max < value) {
				max = value;
			}
		}
		return (max + "").length();
	}

}
```

按照非负整数的特性，个位数分布为[0,1,2,3,4,5,6,7,8,9]，建立这10个桶（每个桶的大小为数组的长度）；再建立一个长度为10整数数组，用于存放每个桶实际的数据个数。

先遍历数组的个位，依次把元素放入对应的桶，同时记录桶的实际元素个数；然后按照桶的顺序将桶内元素全部取出放到原数组中。

按照个位数方法，遍历十位数，百位数等等。最后就得到一个有序的数组。

> 例子中支持**负数**

### 6.归并排序

```java
public void sort(int[] arr, int low, int high, int[] temp) {
    // TODO arr数组检查
    if (low < high) {
        int mid = (low + high) / 2;
        // 分
        sort(arr, low, mid, temp);
        sort(arr, mid + 1, high, temp);
        // 治
        merge(arr, low, mid, high, temp);
    }
}

private void merge(int[] arr, int low, int mid, int high, int[] temp) {
    int i = low;
    int j = mid + 1;
    int idx = 0;

    while (i <= mid && j <= high) {
        if (arr[i] < arr[j]) {
            temp[idx] = arr[i];
            i++;
        } else {
            temp[idx] = arr[j];
            j++;
        }
        idx++;
    }

    while (i <= mid) {
        temp[idx] = arr[i];
        idx++;
        i++;
    }

    while (j <= high) {
        temp[idx] = arr[j];
        idx++;
        j++;
    }

    System.arraycopy(temp, 0, arr, low, high - low + 1);
}
```

### 7.选择排序

```java
public void sort(int[] arr) {
    // TODO arr数组检查
    for (int i = 0; i < arr.length - 1; i++) {
        // 取出最小的元素
        int min = arr[i];
        int minIndex = i;
        for (int j = i; j < arr.length; j++) {
            if (arr[j] < min) {
                min = arr[j];
                minIndex = j;
            }
        }
        // 交换位置
        swap(arr, i, minIndex);
    }
}

private void swap(int arr[], int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

需要`n-1`趟，每趟遍历，在剩余未排序的元素数组中选出一个最小的元素与第一个元素交换位置。

### 8.堆排序

```java
public void sort(int[] arr) {
    // TODO arr数组检查
    // 构造大顶堆或小顶堆
    for (int i = arr.length / 2 - 1; i >= 0; i--) {
        adjustHeap(arr, i, arr.length);
    }
    for (int i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i);
        adjustHeap(arr, 0, i);
    }
}

private void adjustHeap(int[] arr, int i, int length) {
    int temp = arr[i];
    for (int k = 2 * i + 1; k < length; k = 2 * k + 1) { // 第1个非叶子节点开始
        if (k + 1 < length && arr[k] < arr[k + 1]) { // 右子节点大
            k++;
        }
        if (arr[k] > temp) {
            arr[i] = arr[k]; // 当前节点和右子节点交换
            i = k;
        } else {
            break;
        }
    }
    arr[i] = temp;
}

private void swap(int arr[], int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

1. 构造大顶推（或小顶堆）。
2. 交换数组首末元素。
3. 数组最后一个为最大或最小值，重复1、2步骤，对前`n-1`个元素进行同样的排序。

| 排序方法 | 时间复杂度 | 空间复杂度 | 稳定性 |
| -------- | ---------- | ---------- | ------ |
| 插入排序 | O(n^2)     | O(1)       | 稳定   |
| 希尔排序 | O(n^1.3)   | O(1)       | 不稳定 |
| 选择排序 | O(n^2)     | O(1)       | 不稳定 |
| 堆排序   | O(nlogn)   | O(1)       | 不稳定 |
| 冒泡排序 | O(n^2)     | O(1)       | 稳定   |
| 快速排序 | O(nlogn)   | O(nlogn)   | 不稳定 |
| 归并排序 | O(nlogn)   | O(N)       | 稳定   |
| 基数排序 | O(d(r+n))  | O(rd+n)    | 稳定   |

> 基数排序的复杂度中，r代表关键字的基数，d代表长度，n代表关键字的个数。

## 查找算法

### 1.顺序查找



### 2.二分查找



### 3.插值查找



### 4.斐波那契（黄金分割）查找



## 背包问题



## KMP算法



## 贪心算法



## Prim算法



## Kruskal算法



## Dijkstra算法



## Floyd算法



