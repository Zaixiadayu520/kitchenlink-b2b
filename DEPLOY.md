# KitchenLink 上线部署指南

本地 SQLite 只适合开发。**上线必须用 Postgres**（Vercel 等无服务器环境写不进本地文件）。

推荐路线（第一次上线最省事）：

**Neon（免费 Postgres）+ Vercel（托管 Next.js）+ 你自己的域名**

---

## 一、准备 Postgres（Neon）

1. 打开 [https://neon.tech](https://neon.tech) 注册并新建项目（区域可选 `US East`）
2. 复制连接串，类似：
   ```
   postgresql://USER:PASSWORD@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
3. 项目 schema **已改为 `postgresql`**。把 Neon 连接串写入本地 `.env` 的 `DATABASE_URL`，然后执行：

```bash
cd d:\cusor\kitchenlink-b2b
npx prisma db push
npm run db:seed
```

种子跑完后，演示账号即可用（记得上线后改密码）。

---

## 二、部署到 Vercel

### 1. 代码推到 GitHub

```bash
cd d:\cusor\kitchenlink-b2b
git init
git add .
git commit -m "Initial KitchenLink B2B store"
```

到 GitHub 新建仓库，再：

```bash
git remote add origin https://github.com/你的用户名/kitchenlink-b2b.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 打开 [https://vercel.com](https://vercel.com) → Add New Project → 选该仓库  
2. Framework 会自动识别 Next.js  
3. **Environment Variables** 添加：

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon 的 Postgres 连接串 |
| `AUTH_SECRET` | 一长串随机密钥（不要用开发默认值） |
| `NEXT_PUBLIC_SITE_NAME` | `KitchenLink`（可改） |

生成密钥示例（PowerShell）：

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

4. Deploy

### 3. 构建说明

项目已配置：

- `build`：`prisma generate && next build`
- `postinstall`：`prisma generate`（Vercel 安装依赖时生成客户端）

一般不需要改 Build Command。首次部署前务必已对 Neon 执行过 `prisma db push` + seed。

---

## 三、绑定域名

1. Vercel 项目 → Settings → Domains → 添加 `www.你的域名.com`  
2. 在域名注册商（Cloudflare / Namecheap / 阿里云等）按提示加：
   - `A` / `CNAME` 记录（Vercel 页面会显示）
3. 等 DNS 生效（几分钟到几小时）后即可用 HTTPS 访问

---

## 四、上线后必做（安全）

1. **改掉演示密码**（admin / demo）
2. **不要把 `.env` 提交到 Git**（仓库已 ignore）
3. 把页脚电话、邮箱改成真实联系方式
4. 生产数据用 Neon 控制台或以后做后台维护，不要随便 `db:reset`

---

## 五、备选方案（若不想拆 Vercel + Neon）

| 平台 | 适合 | 说明 |
|------|------|------|
| [Railway](https://railway.app) | 想一个面板搞定 | 可同时开 Postgres + Next 服务 |
| [Render](https://render.com) | 同上 | Web Service + Postgres |
| 云服务器（阿里云/AWS） | 要完全自管 | 自己装 Node + Nginx + Postgres，运维成本高 |

第一次建议仍走 **Vercel + Neon**。

---

## 六、常见问题

**Q: 部署成功但页面报错 / 商品为空？**  
A: 多半没对生产库执行 `db push` + `seed`，或 `DATABASE_URL` 配错。

**Q: 登录后立刻掉线？**  
A: 检查 `AUTH_SECRET` 是否在 Vercel 配好；自定义域名后 Cookie 一般没问题（当前是同站 cookie）。

**Q: 以后要加支付（Stripe）？**  
A: 批发站可先「采购单 + 线下/账期付款」；要在线收款再接 Stripe，属下一阶段。

---

需要我帮你：**改成 Postgres schema、初始化 git、或一步步对着 Neon/Vercel 点选**，直接说你卡在哪一步即可。
