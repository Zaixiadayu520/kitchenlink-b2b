# KitchenLink · 美国中餐/商超 B2B 批发独立站

面向在美国经营中餐厅、外卖店与华人商超的客户：日常快消批发 + 定制采购需求。

## 技术栈（前后端你都掌握）

- **前端**：Next.js 16（App Router）+ Tailwind CSS 4
- **后端**：Next.js Route Handlers（自有 API）
- **数据库**：PostgreSQL（Neon 等）+ Prisma ORM
- **能力**：中英双语、批发目录、采购单、开户审核、定制需求、管理后台

> 本机 Docker 未就绪时，用这套可立刻开发。以后若要迁 Medusa 电商引擎，目录/订单模型已按 B2B 拆好。

## 一键启动

```bash
cd d:\cusor\kitchenlink-b2b
# 先在 .env 填好 Neon DATABASE_URL
npm run setup
npm run dev
```

浏览器打开：http://localhost:3000 （自动进中文 `/zh`）

### 演示账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@kitchenlink.us | admin123 |
| 批发客户 | demo@goldenwok.us | demo1234 |

## 上线部署

完整步骤见 **[DEPLOY.md](./DEPLOY.md)**（推荐：Neon Postgres + Vercel + 自己的域名）。

Schema 已是 Postgres。把 Neon 的 `DATABASE_URL` 写入 `.env` 后执行 `npm run setup`。

## 你怎么慢慢改

1. **换品牌名/电话**：改 `src/lib/i18n.ts`、页脚 `SiteChrome.tsx`
2. **加商品**：改 `prisma/seed.ts` 后执行 `npm run db:seed`，或以后做后台商品表单
3. **改文案**：`src/lib/i18n.ts` 的 `zh` / `en`
4. **正式上线**：按 `DEPLOY.md` 切 Postgres → 推 GitHub → Vercel 配环境变量并部署

## 目录结构

```
src/app/[locale]/     # 前台页面（zh/en）
src/app/api/           # 后端 API
src/components/        # UI 组件
src/lib/               # 鉴权、购物车、i18n、Prisma
prisma/                # 数据模型 + 种子数据
```

## 业务流程（MVP）

1. 客户浏览批发目录 → 加入采购单  
2. 未开户 →「申请开户」→ 管理员后台开通  
3. 已开通批发户 → 登录提交采购单  
4. 特殊规格/贴牌 →「定制批发」表单跟进  
