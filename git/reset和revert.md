# 快速学习

## git reset
回滚到每次提交，但是会改变历史，即改变之前的commit

**常用命令：**

- git reset **--soft** v1：版本回退到v1，将v1版本之后修改的内容 **存入暂存区**
- git reset **--mixed** v1: 版本回退到v1，将v1版本之后修改的内容 **存入工作区**
- git reset **--hard** v1: 版本回退到v1，v1版本之后修改的内容 **全部清除**

工作区：执行 git add 之后
暂存区：执行 git commit 之后
远端：执行 git push之后

## git revert
撤回某次提交内容，同时产生一个**新的commit**。这个新的commit，就是对某次提交内容的**相反操作**

**常用命令：**
git revert <commitHash>

如果对同一个文件进行了多次commit，在对其进行revert时，可能会出现冲突。在解决冲突之后，可以执行 ```git revert --continue```

## 使用哪个
- 考虑在于是否需要保留之前的历史记录，如果需要就revert，如果是错误提交，可以reset
- 考虑是否可能存在冲突，revert可能出现冲突，解决起来可能麻烦，reset不会

# 详情参考

[参考链接](https://www.jianshu.com/p/0a8bb254a4df)
