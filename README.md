# 校园二手交易平台

基于 **Java Spring Boot + React + Ant Design + MySQL** 的前后端分离校园二手交易系统，适用于软件综合课程设计。

## 项目结构

```
campus-trade/
├── backend/          # Spring Boot 后端
├── frontend/         # React + Ant Design 前端
├── sql/init.sql      # 数据库初始化脚本
└── README.md
```

## 功能模块

- 用户注册/登录（JWT 鉴权）
- 商品发布、浏览、搜索、审核
- 订单创建、确认、完成、取消
- 交易评价与信誉分
- 站内私信
- 收货地址管理
- 管理员后台（用户/分类/商品审核/统计）

## 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+

## 快速启动

### 1. 初始化数据库

```bash
mysql -u root -p < sql/init.sql
```

### 2. 修改数据库配置

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/campus_trade?...
    username: root
    password: "123456"
```

### 3. 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端地址：`http://localhost:8080`

### 4. 启动前端

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

> Windows 如从 Vue 版切换过来，请先删除 `frontend/node_modules` 再重新 `npm install`。

前端地址：`http://localhost:5173`

## 默认账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |

普通用户请在前端注册页面自行注册。

## 技术栈

| 层次 | 技术 |
|------|------|
| 后端 | Spring Boot 3.2、Spring Security、MyBatis、JWT |
| 前端 | React 18、React Router、Ant Design、Axios、Vite |
| 数据库 | MySQL 8.0（存储过程 + 触发器） |

## 数据库设计

共 7 张表，满足第三范式（3NF）：

- `sys_user` - 用户表
- `goods_category` - 分类表
- `goods` - 商品表
- `trade_order` - 订单表
- `order_review` - 评价表
- `user_message` - 消息表
- `user_address` - 地址表

## API 说明

| 模块 | 前缀 |
|------|------|
| 认证 | `/api/auth` |
| 商品 | `/api/goods` |
| 订单 | `/api/orders` |
| 消息/地址 | `/api/messages`, `/api/addresses` |
| 管理 | `/api/admin` |

## 演示流程

1. 注册两个学生账号（买家、卖家）
2. 卖家登录 → 发布商品
3. 管理员登录（admin/admin123）→ 审核通过商品
4. 买家登录 → 浏览商品 → 下单
5. 卖家确认订单 → 双方完成交易
6. 买家提交评价

## 注意事项

- 首次启动后端会自动创建管理员账号
- 图片上传保存在后端 `uploads/` 目录
- 课程验收前请确保 MySQL 服务已启动且数据库已初始化
