# mer_pc

#### Description
多商户PC商城

```

## 开发

```bash
# node版本
node版本建议使用v16.18以上

# 进入项目目录
cd ##

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build

# 代码格式检查并自动修复
npm run prettier
```

