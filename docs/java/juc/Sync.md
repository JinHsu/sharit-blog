---

---

## ReentrantLock

### Case

```java
public class Thread_01_ReentrantLock {
    static ReentrantLock lock = new ReentrantLock();
    static int count = 0;

    static class T implements Runnable {
        @Override
        public void run() {
            for (int i = 0; i < 10000; i++) {
                lock.lock(); // 加锁
                try {
                    count++;
                } finally {
                    lock.unlock(); //释放锁
                }
            }
        }
    }

    public static void main(String[] args) throws Exception {
        T t = new T();
        Thread t1 = new Thread(t);
        Thread t2 = new Thread(t);
        t1.start();t2.start();
        t1.join();t2.join();
        System.out.println(count);
    }
}
```

重入：锁可以反复进入，但仅限于一个线程。

```java
lock.lock(); // 加锁
lock.lock(); // 加锁
try {
    count++;
} finally {
    lock.unlock(); //释放锁
    lock.unlock(); //释放锁
}
```

### 中断

避免死锁

```java
public class Thread_01_ReentrantLock_interrupt {
    static ReentrantLock lock1 = new ReentrantLock();
    static ReentrantLock lock2 = new ReentrantLock();

    static class T implements Runnable {
        private final int flag;
        
        T(int flag) {
            this.flag = flag;
        }
        
        @Override
        public void run() {
            try {
                if (flag == 1) {
                    // lockInterruptibly()方法，是一个可以对中断进行响应的锁申请动作，即在等待过程中，可以响应中断。
                    lock1.lockInterruptibly(); // 获取lock1
                    Thread.sleep(500);
                    lock2.lockInterruptibly(); // 获取lock2发现被占用
                } else {
                    lock2.lockInterruptibly(); // 获取lock2
                    Thread.sleep(500);
                    lock1.lockInterruptibly(); // 获取lock1发现被占用
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                if (lock1.isHeldByCurrentThread()) {
                    lock1.unlock();
                }
                if (lock2.isHeldByCurrentThread()) {
                    lock2.unlock();
                }
                System.out.println(Thread.currentThread().getId() + " 线程退出。");
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Thread t1 = new Thread(new T(1));
        Thread t2 = new Thread(new T(2));
        t1.start();
        t2.start();
        Thread.sleep(1000);
        t1.interrupt(); // 打断一个线程
    }
}
```

### 锁申请等待限时

避免死锁：限时等待，给定的时间内没有获取到锁，则放弃等待获取。

```java
public class Thread_01_ReentrantLock_try {
    static ReentrantLock lock = new ReentrantLock();

    static class T implements Runnable {

        @Override
        public void run() {
            try {
                if (lock.tryLock(2, TimeUnit.SECONDS)) {
                    System.out.println(Thread.currentThread().getId() + " get lock success");
                    Thread.sleep(3000);
                } else {
                    System.out.println(Thread.currentThread().getId() + " get lock failed");
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                if (lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
                System.out.println(Thread.currentThread().getId() + " exit. ");
            }
        }
    }

    public static void main(String[] args) throws Exception {
        T t = new T();
        Thread t1 = new Thread(t);
        Thread t2 = new Thread(t);
        t1.start();
        t2.start();
    }
}
```

### 公平锁

公平锁看起来很优美，但是要实现公平锁必然要求系统维护一个有序队列，因此公平锁的实现成本要求较高，性能也相对低下。因此，默认情况下，锁是非公平的。如果没有特别的要求，也不需要使用公平锁。公平锁和非公平锁在线程调度上也是非常不一样的。

```java
public class Thread_01_ReentrantLock_fair {
    static ReentrantLock lock = new ReentrantLock(true); // 公平锁

    static class T implements Runnable {

        @Override
        public void run() {
            while (true) {
                try {
                    lock.lock();
                    Thread.sleep(100);
                    System.out.println(Thread.currentThread().getId() + " 获得锁");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }
        }
    }

    public static void main(String[] args) throws Exception {
        T t = new T();
        Thread t1 = new Thread(t);
        Thread t2 = new Thread(t);
        t1.start();
        t2.start();
    }
}
```

ReentrantLock几个重要的方法整理：

> - lock()：获得锁，如果锁已经被其他线程占用，则等待；
> - lockInterruptibly()：获取锁，但优先响应中断；
> - tryLock()：尝试获取锁，如果成功，立即返回true，否则，立即返回false；
> - tryLock(long time, TimeUnit unit)：在给定的时间内尝试获取锁；
> - unlock()：释放锁。

在重入锁的实现中，主要包含三个要素：

1. 原子状态。原子状态使用`CAS`操作来存储当前锁的状态，判断锁是否已经被别的线程持有。
2. 等待队列。所有没有请求到锁的线程，会进入等待队列进行等待。待有线程释放锁后，系统就能从等待队列中唤醒一个线程，继续工作。
3. 阻塞原语park()和unpark()，用来挂起和恢复线程。没有得到锁的线程将会被挂起。详见线程阻塞工具类：`LockSupport`

## Condition

利用Condition对象，我们可以让线程在合适的时间等待，或者在一个特定的时刻得到通知，继续执行。

Condition接口提供的基本方法：

```java
void await() throws InterruptedException;
void awaitUninterruptibly();
long awaitNanos(long nanosTimeout) throws InterruptedException;
boolean await(long time, TimeUnit unit) throws InterruptedException;
boolean awaitUntil(Date deadline) throws InterruptedException;
void signal();
void signalAll();
```

### Case

```java
public class Thread_02_Condition {

    static ReentrantLock lock = new ReentrantLock();
    static Condition condition = lock.newCondition();

    static class T implements Runnable {

        @Override
        public void run() {
            try {
                lock.lock();
                System.out.println(Thread.currentThread().getId() + " await");
                condition.await(); // 当前线程等待，并释放锁
                System.out.println(Thread.currentThread().getId() + " exit");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Thread t = new Thread(new T());
        t.start();

        Thread.sleep(1000);
		System.out.println(lock.getHoldCount()); // 0, 说明condition.await();方法以释放了锁
        try {
            lock.lock(); // signal前需要获取锁
            System.out.println(Thread.currentThread().getId() + " before signal");
            condition.signal(); // 被唤醒的线程重新获得锁，继续执行
            System.out.println(Thread.currentThread().getId() + " after signal");
        } finally {
        	lock.unlock(); // 需要释放锁。虽然signal唤醒了其他线程，如果不释放锁，那么其他线程将拿不到这把锁，永远阻塞。
        }
    }
}
```

## Semaphore

信号量：允许多个线程同时访问，为多线程协作提供了更为强大的控制方法。无论是内部锁synchronized还是重入锁ReentrantLock，一次都只允许一个线程访问一个资源，而信号量却可以指定多个线程，同时访问某一个资源。

```java
public Semaphore(int permits) //permits：准入树，同时申请的线程数。即指定同时有多少个线程可以访问某一个资源。
public Semaphore(int permits, boolean fair) //fair：是否公平
```

主要逻辑方法：

```java
public void acquire() throws InterruptedException
public void acquire(int permits) throws InterruptedException
public void acquireUninterruptibly()
public void acquireUninterruptibly(int permits)    
public boolean tryAcquire()
public boolean tryAcquire(int permits)
public boolean tryAcquire(long timeout, TimeUnit unit)
public boolean tryAcquire(int permits, long timeout, TimeUnit unit)    
public void release()
public void release(int permits) 
```

### Case

```java
public class Thread_02_Semaphore {

    static Semaphore semaphore = new Semaphore(5);

    static class T implements Runnable {

        @Override
        public void run() {
            try {
                semaphore.acquire();
                Thread.sleep(100);
                System.out.println(Thread.currentThread().getId() + " ok ");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                semaphore.release();
                System.out.println("========" + semaphore.availablePermits());
            }
        }
    }

    public static void main(String[] args) {
        ExecutorService exec = Executors.newFixedThreadPool(20);
        for (int i = 0; i < 100; i++) {
            exec.submit(new T());
        }
        exec.shutdown();
    }
}
```

## ReadWriteLock

|      | 读     | 写   |
| ---- | ------ | ---- |
| 读   | 非阻塞 | 阻塞 |
| 写   | 阻塞   | 阻塞 |

### Case

```java
public class Thread_03_ReadWriteLock {
    static Lock lock = new ReentrantLock();
    static ReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    static Lock readLock = readWriteLock.readLock();
    static Lock writeLock = readWriteLock.writeLock();

    static class Demo {

        public int value;

        public int doRead(Lock lock) {
            try {
                lock.lock();
                Thread.sleep(1000);
                return value;
            } catch (InterruptedException e) {
                e.printStackTrace();
                return -1;
            } finally {
                lock.unlock();
            }
        }

        public void doWrite(Lock lock, int value) {
            try {
                lock.lock();
                Thread.sleep(1000);
                this.value += value;
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }

    }

    public static void main(String[] args) {
        final Demo demo = new Demo();

        Runnable readThread = new Runnable() {
            @Override
            public void run() {
                demo.doRead(readLock);
//                demo.doRead(lock);
                System.out.println(System.currentTimeMillis());
            }
        };

        Runnable writeThread = new Runnable() {
            @Override
            public void run() {
                demo.doWrite(writeLock, 1);
//                demo.doWrite(lock, 1);
                System.out.println(System.currentTimeMillis());
            }
        };

        for (int i = 0; i < 20; i++) {
            new Thread(readThread).start();
        }

        for (int i = 0; i < 5; i++) {
            new Thread(writeThread).start();
        }

    }

}
```

## CountDownLatch

CountDownLatch是一个非常实用的多线程控制工具类。

### Case

```java
public class Thread_04_CountDownLatch {

    static CountDownLatch countDownLatch = new CountDownLatch(10);

    static class T implements Runnable {

        @Override
        public void run() {
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (this) {
                countDownLatch.countDown();
                System.out.println(Thread.currentThread().getId() + " : " + countDownLatch.getCount());
            }
        }
    }

    public static void main(String[] args) throws Exception {
        final T t = new T();
        for (int i = 0; i < 10; i++) {
            new Thread(t).start();
        }

        countDownLatch.await();
        System.out.println(Thread.currentThread().getId() + " : " + countDownLatch.getCount());
    }
}
```

## CyclicBarrier

### Case

```java

```



## LockSupport

### Case

```java

```

