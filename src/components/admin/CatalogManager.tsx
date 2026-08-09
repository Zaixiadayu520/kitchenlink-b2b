"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductImage } from "@/components/ProductImage";

type Category = {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  sortOrder: number;
  _count?: { products: number };
};

type Product = {
  id: string;
  sku: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  unitZh: string;
  unitEn: string;
  packSize: string;
  wholesalePrice: number;
  moq: number;
  imageEmoji: string;
  imageUrl: string | null;
  featured: boolean;
  active: boolean;
  categoryId: string;
  category?: Category | null;
};

const emptyProduct = {
  sku: "",
  nameZh: "",
  nameEn: "",
  descriptionZh: "",
  descriptionEn: "",
  unitZh: "箱",
  unitEn: "case",
  packSize: "",
  wholesalePrice: 0,
  moq: 1,
  imageEmoji: "📦",
  imageUrl: "" as string,
  featured: false,
  active: true,
  categoryId: "",
};

export function CatalogManager() {
  const [tab, setTab] = useState<"categories" | "products">("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [catForm, setCatForm] = useState({ nameZh: "", nameEn: "", sortOrder: 0 });
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [productForm, setProductForm] = useState({ ...emptyProduct });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  async function refresh() {
    const [cRes, pRes] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/products"),
    ]);
    const cData = await cRes.json();
    const pData = await pRes.json();
    if (cRes.ok) setCategories(cData.categories || []);
    if (pRes.ok) setProducts(pData.products || []);
  }

  useEffect(() => {
    refresh().catch(() => setMsg("加载失败，请重新登录管理员账号"));
  }, []);

  const sortedCats = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  async function uploadImage(file: File) {
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "上传失败");
      return;
    }
    setProductForm((f) => ({ ...f, imageUrl: data.imageUrl }));
    setMsg("图片已上传，保存商品后生效");
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const res = await fetch(
      editingCat ? `/api/admin/categories/${editingCat.id}` : "/api/admin/categories",
      {
        method: editingCat ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catForm),
      },
    );
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "保存品类失败");
      return;
    }
    setCatForm({ nameZh: "", nameEn: "", sortOrder: 0 });
    setEditingCat(null);
    setMsg("品类已保存");
    await refresh();
  }

  async function deleteCategory(id: string) {
    if (!confirm("确定删除该品类？")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "删除失败");
      return;
    }
    setMsg("品类已删除");
    await refresh();
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const payload = {
      ...productForm,
      imageUrl: productForm.imageUrl || null,
      wholesalePrice: Number(productForm.wholesalePrice),
      moq: Number(productForm.moq),
    };
    const res = await fetch(
      editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products",
      {
        method: editingProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "保存商品失败");
      return;
    }
    setProductForm({ ...emptyProduct, categoryId: categories[0]?.id || "" });
    setEditingProduct(null);
    setMsg("商品已保存");
    await refresh();
  }

  async function deleteProduct(id: string) {
    if (!confirm("确定删除该商品？若已有订单会改为下架。")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "删除失败");
      return;
    }
    setMsg(data.softDeleted ? "商品已下架（有历史订单）" : "商品已删除");
    await refresh();
  }

  function startEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({
      sku: p.sku,
      nameZh: p.nameZh,
      nameEn: p.nameEn,
      descriptionZh: p.descriptionZh,
      descriptionEn: p.descriptionEn,
      unitZh: p.unitZh,
      unitEn: p.unitEn,
      packSize: p.packSize,
      wholesalePrice: p.wholesalePrice,
      moq: p.moq,
      imageEmoji: p.imageEmoji,
      imageUrl: p.imageUrl || "",
      featured: p.featured,
      active: p.active,
      categoryId: p.categoryId,
    });
    setTab("products");
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">品类与商品管理</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              tab === "products" ? "bg-ink text-white" : "border border-line bg-white"
            }`}
            onClick={() => setTab("products")}
          >
            商品
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              tab === "categories" ? "bg-ink text-white" : "border border-line bg-white"
            }`}
            onClick={() => setTab("categories")}
          >
            品类
          </button>
        </div>
      </div>
      {msg && <p className="mt-3 text-sm text-accent-2">{msg}</p>}

      {tab === "categories" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={saveCategory} className="card grid gap-3 p-5">
            <h3 className="font-semibold">{editingCat ? "编辑品类" : "新增品类"}</h3>
            <div>
              <label className="label">中文名</label>
              <input
                className="input"
                value={catForm.nameZh}
                onChange={(e) => setCatForm({ ...catForm, nameZh: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">英文名</label>
              <input
                className="input"
                value={catForm.nameEn}
                onChange={(e) => setCatForm({ ...catForm, nameEn: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">排序（数字越小越靠前）</label>
              <input
                className="input"
                type="number"
                value={catForm.sortOrder}
                onChange={(e) => setCatForm({ ...catForm, sortOrder: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" disabled={loading} type="submit">
                {editingCat ? "保存修改" : "新增品类"}
              </button>
              {editingCat && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditingCat(null);
                    setCatForm({ nameZh: "", nameEn: "", sortOrder: 0 });
                  }}
                >
                  取消
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            {sortedCats.map((c) => (
              <div key={c.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="font-semibold">
                    {c.nameZh} / {c.nameEn}
                  </div>
                  <div className="text-xs text-muted">
                    slug: {c.slug} · 排序 {c.sortOrder} · 商品 {c._count?.products ?? 0}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-sm font-semibold text-accent-2"
                    onClick={() => {
                      setEditingCat(c);
                      setCatForm({
                        nameZh: c.nameZh,
                        nameEn: c.nameEn,
                        sortOrder: c.sortOrder,
                      });
                    }}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="text-sm font-semibold text-accent"
                    onClick={() => deleteCategory(c.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={saveProduct} className="card grid gap-3 p-5 md:grid-cols-2">
            <h3 className="font-semibold md:col-span-2">
              {editingProduct ? "编辑商品" : "新增商品"}
            </h3>
            <div>
              <label className="label">中文名</label>
              <input
                className="input"
                value={productForm.nameZh}
                onChange={(e) => setProductForm({ ...productForm, nameZh: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">英文名</label>
              <input
                className="input"
                value={productForm.nameEn}
                onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">SKU</label>
              <input
                className="input"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                required
                disabled={!!editingProduct}
              />
            </div>
            <div>
              <label className="label">品类</label>
              <select
                className="input"
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                required
              >
                <option value="">选择品类</option>
                {sortedCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameZh}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">批发价 (USD)</label>
              <input
                className="input"
                type="number"
                step="0.01"
                value={productForm.wholesalePrice}
                onChange={(e) =>
                  setProductForm({ ...productForm, wholesalePrice: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="label">起订量</label>
              <input
                className="input"
                type="number"
                value={productForm.moq}
                onChange={(e) => setProductForm({ ...productForm, moq: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="label">规格</label>
              <input
                className="input"
                value={productForm.packSize}
                onChange={(e) => setProductForm({ ...productForm, packSize: e.target.value })}
                required
                placeholder="如 6×1.8L"
              />
            </div>
            <div>
              <label className="label">单位（中/英）</label>
              <div className="flex gap-2">
                <input
                  className="input"
                  value={productForm.unitZh}
                  onChange={(e) => setProductForm({ ...productForm, unitZh: e.target.value })}
                  required
                />
                <input
                  className="input"
                  value={productForm.unitEn}
                  onChange={(e) => setProductForm({ ...productForm, unitEn: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="label">中文描述</label>
              <textarea
                className="input min-h-20"
                value={productForm.descriptionZh}
                onChange={(e) => setProductForm({ ...productForm, descriptionZh: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">英文描述</label>
              <textarea
                className="input min-h-20"
                value={productForm.descriptionEn}
                onChange={(e) => setProductForm({ ...productForm, descriptionEn: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">商品图片（上传或填外链）</label>
              <div className="flex flex-wrap items-start gap-4">
                <div className="w-28">
                  <ProductImage
                    imageUrl={productForm.imageUrl || null}
                    imageEmoji={productForm.imageEmoji}
                    alt={productForm.nameZh || "preview"}
                    className="h-28 w-28 object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    className="input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImage(f);
                    }}
                  />
                  <input
                    className="input"
                    placeholder="或粘贴图片 URL"
                    value={productForm.imageUrl.startsWith("data:") ? "" : productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="无图时的表情占位，如 🍜"
                    value={productForm.imageEmoji}
                    onChange={(e) => setProductForm({ ...productForm, imageEmoji: e.target.value })}
                  />
                  {productForm.imageUrl && (
                    <button
                      type="button"
                      className="text-sm text-accent"
                      onClick={() => setProductForm({ ...productForm, imageUrl: "" })}
                    >
                      清除图片
                    </button>
                  )}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={productForm.featured}
                onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
              />
              首页主推
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={productForm.active}
                onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
              />
              上架销售
            </label>
            <div className="flex gap-2 md:col-span-2">
              <button className="btn btn-primary" disabled={loading} type="submit">
                {editingProduct ? "保存修改" : "新增商品"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ ...emptyProduct, categoryId: categories[0]?.id || "" });
                  }}
                >
                  取消编辑
                </button>
              )}
            </div>
          </form>

          <div className="max-h-[70vh] space-y-3 overflow-auto pr-1">
            {products.map((p) => (
              <div key={p.id} className="card flex gap-3 p-3">
                <div className="w-16 shrink-0">
                  <ProductImage
                    imageUrl={p.imageUrl}
                    imageEmoji={p.imageEmoji}
                    alt={p.nameZh}
                    className="h-16 w-16 object-cover"
                    emojiClassName="text-2xl"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">
                    {p.nameZh}
                    {!p.active && <span className="ml-2 text-xs text-accent">已下架</span>}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {p.nameEn} · {p.sku} · ${p.wholesalePrice}
                  </div>
                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      className="text-sm font-semibold text-accent-2"
                      onClick={() => startEditProduct(p)}
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold text-accent"
                      onClick={() => deleteProduct(p.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
