# RESTful API

## 概述

**REST**（Representational State Transfer）是一种**架构风格**，不是协议或标准。

**RESTful API** = 遵循 REST 约束的 HTTP API。

## 核心约束

**1. 资源导向**

一切皆资源，用 **URI** 标识：

```
/users          → 用户集合
/users/123      → 单个用户
/users/123/orders → 用户的订单
```

**2. 统一接口**

用 **HTTP 动词** 表示操作：

| 动词 | 语义 | 示例 |
|------|------|------|
| GET | 读取 | 获取用户 |
| POST | 创建 | 新建用户 |
| PUT | 全量更新 | 替换用户信息 |
| PATCH | 部分更新 | 修改用户名 |
| DELETE | 删除 | 删除用户 |

**3. 无状态**

每个请求独立，服务端不保存客户端状态。认证信息（如 Token）随请求发送。

**4. 可缓存**

响应必须声明是否可缓存，提升性能。

**5. 分层系统**

客户端无需知道是否直连服务器，中间层（负载均衡、代理）对客户端透明。

## 非 RESTful vs RESTful

```
❌ 非 RESTful:
POST /api/getUser
POST /api/createUser
POST /api/deleteUser?id=123

✅ RESTful:
GET    /api/users/123
POST   /api/users
DELETE /api/users/123
```

当有人说"这个 API 是 RESTful 的"，意味着：

- 资源用名词路径表示
- 操作用 HTTP 方法表示
- 无状态通信
- 使用标准 HTTP 状态码

注意：现实中很少有 API 100% 符合 REST 所有约束，大多是"REST 风格"。

## API 设计等级

### Level 0：非RESTful

**路径混乱、命名不一致：**

```
GET    /api/getUser?id=123        → 获取用户
POST   /api/createUser            → 创建用户
POST   /api/updateUser            → 更新用户
POST   /api/deleteUser?id=123     → 删除用户
GET    /api/userList              → 用户列表
POST   /api/getUserOrder          → 获取用户订单
```

**问题清单：**

- 命名混用：`getUser`、`createUser`、`userList` 风格不统一
- 滥用 GET/POST：删除用 GET、更新用 GET/POST 而非 PUT/PATCH
- 查询参数暴露在路径中：`?id=123`
- 所有操作都是 POST，无语义区分

**响应格式随意：**

```json
// 成功
{ "status": "ok", "result": { "id": 123, "name": "John" } }

// 失败（永远返回 200）
{ "status": "error", "msg": "user not found" }

// 另一种成功格式
{ "code": 0, "data": { "id": 123, "name": "John" } }
```

**状态码滥用：** 所有请求都返回 `200 OK`，错误藏在 body 里

**适用场景：** 内部工具、MVP、快速验证

### Level 1：标准RESTful

**遵循 REST 约束，资源建模清晰：**

```
# 资源层级关系
GET    /api/v1/users              → 用户列表（分页）
POST   /api/v1/users              → 创建用户
GET    /api/v1/users/:id          → 用户详情
PATCH  /api/v1/users/:id          → 部分更新
DELETE /api/v1/users/:id          → 删除

# 子资源
GET    /api/v1/users/:id/orders   → 用户的订单
POST   /api/v1/users/:id/orders   → 为用户创建订单

# 标准响应格式
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

**关键改进：**

- 统一命名规范（复数名词、kebab-case）
- 正确使用 HTTP 方法（GET 幂等、POST 创建、PATCH 更新）
- 语义化状态码（201 Created、404 Not Found、422 Validation Error）
- 版本控制（URL 或 Header）
- 统一错误响应格式

**适用场景：** 公开 API、大多数业务系统、团队协作

### Level 2：企业级RESTful

**HATEOAS、幂等性、限流、完整文档：**

```
# HATEOAS（超媒体驱动）
{
  "data": {
    "id": 123,
    "name": "John",
    "_links": {
      "self": { "href": "/api/v1/users/123" },
      "orders": { "href": "/api/v1/users/123/orders" },
      "avatar": { "href": "/api/v1/users/123/avatar" }
    }
  }
}

# 幂等性设计（安全重试）
POST   /api/v1/payments          → 创建支付（Idempotency-Key）
DELETE /api/v1/payments/:id      → 删除（天然幂等）

# 限流响应
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
Retry-After: 60

# 批量操作
POST   /api/v1/users/batch       → 批量创建
DELETE /api/v1/users/batch       → 批量删除
```

**关键特性：**

- **幂等性保证：** 客户端安全重试，网络异常恢复
- **HATEOAS：** 服务端驱动导航，客户端无需硬编码路径
- **限流与节流：** 令牌桶/滑动窗口，防止滥用
- **异步操作：** 长时任务返回 202 + 轮询 URL
- **OpenAPI 文档：** 自动生成、版本同步
- **灰度/蓝绿：** Header 路由（`X-Api-Version`）

**适用场景：** 公开平台 API、金融/支付系统、高并发服务
