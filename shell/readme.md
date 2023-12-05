# 常用shell收集

## 关于连接

`ln [option] source_file dist_file`

`[option]:` 

- -s 符号链接，即软连接

- -f 强制创建链接，如果目标文件已存在，则会被覆盖

- ...

本地开发一个包，将这个包link到一个指定位置

```sh
NAME=projectA

echo "删除 CLI 安装的套件..";
rm -rf ~/.CLI/node_modules/@CLI/$(echo $NAME);

# pwd 指当前工作目录

echo "将套件 link 过去.."
ln -s $(pwd) ~/.CLI/node_modules/@CLI/$(echo $NAME)

echo "done"
```