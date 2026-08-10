export type Locale = "zh" | "en";

export const locales: Locale[] = ["zh", "en"];
export const defaultLocale: Locale = "zh";

export function isLocale(v: string): v is Locale {
  return v === "zh" || v === "en";
}

const dict = {
  zh: {
    brand: "厨联 KitchenLink",
    tagline: "中国供应商 · 全美中餐厅日常耗材批发",
    nav: {
      catalog: "批发目录",
      custom: "定制需求",
      apply: "申请开户",
      about: "关于我们",
      cart: "采购单",
      login: "登录",
      account: "账户",
      admin: "后台",
      logout: "退出",
    },
    hero: {
      title: "餐巾纸、热敏纸、菜单灯箱、打包盒、餐具——一站式供应全美中餐厅",
      subtitle:
        "中国源头供应商，服务美国中餐厅与华人商超。常规耗材箱规批发，菜单/灯箱/包装支持定制。",
      ctaCatalog: "浏览耗材目录",
      ctaCustom: "提交定制需求",
      ctaApply: "申请批发开户",
    },
    trust: {
      t1: "中国源头 · 出口美国",
      t2: "餐厅高频耗材齐全",
      t3: "菜单灯箱可定制",
      t4: "中英双语对接",
    },
    categories: "热门品类",
    featured: "主推商品",
    viewAll: "查看全部",
    wholesaleOnly: "批发价（登录后下单）",
    moq: "起订",
    pack: "规格",
    addToCart: "加入采购单",
    priceUnit: "美元 /",
    catalogTitle: "批发商品目录",
    catalogHint: "按品类筛选，价格为建议批发价（USD）。正式客户可提交采购单。",
    allCategories: "全部品类",
    customTitle: "批发定制需求",
    customHint: "缺货、贴牌、指定品牌或特殊规格？提交需求，我们 1–2 个工作日回电报价。",
    applyTitle: "申请批发开户",
    applyHint: "审核通过后解锁采购单与账户价。请填写真实餐厅/商超信息。",
    aboutTitle: "关于厨联",
    aboutBody:
      "厨联 KitchenLink 是面向全美中餐厅的中国供应商，主营餐巾纸、热敏纸、菜单印刷、灯箱菜谱、打包盒、餐具与厨房用品，并承接客户的定制化需求。我们关注箱规、起订量与稳定补货。",
    form: {
      name: "联系人",
      email: "邮箱",
      phone: "电话",
      company: "公司 / 店名",
      businessType: "业态",
      restaurant: "中餐厅 / 外卖",
      supermarket: "商超 / 便利",
      distributor: "分销商",
      cityState: "城市 / 州",
      volume: "预估月采购额",
      message: "补充说明",
      productNeed: "需要什么货",
      quantity: "预估数量",
      targetPrice: "目标价（可选）",
      deadline: "期望到货时间",
      notes: "备注",
      submit: "提交",
      submitting: "提交中…",
      success: "已提交，我们会尽快联系您。",
      password: "密码",
      login: "登录",
      noAccount: "还没有账户？先申请开户。",
    },
    cart: {
      title: "采购单",
      empty: "采购单是空的。先去目录挑货。",
      qty: "数量",
      total: "合计",
      note: "备注（送货/档口）",
      submit: "提交采购单",
      needLogin: "请先登录已开通的批发账户。",
      needWholesale: "账户审核中，暂不能下单。请联系我们开通。",
      submitted: "采购单已提交。请用微信或支付宝付款，并备注订单号。",
      orderId: "订单号",
    },
    payment: {
      title: "付款方式",
      wechat: "微信支付",
      alipay: "支付宝",
      wechatId: "微信号",
      tip: "扫码付款时请备注餐厅名或订单号，便于我们对账。",
    },
    footer: {
      contact: "联系我们",
      phone: "电话",
      email: "邮箱",
      wechat: "微信",
      qq: "QQ",
      whatsapp: "WhatsApp",
      hours: "服务时间",
      rights: "© KitchenLink Wholesale. 仅面向合格批发客户。",
    },
    admin: {
      title: "管理后台",
      applications: "开户申请",
      customs: "定制需求",
      orders: "采购单",
      products: "商品",
      approve: "开通批发",
    },
  },
  en: {
    brand: "KitchenLink",
    tagline: "China supplier · Consumables for U.S. Chinese restaurants",
    nav: {
      catalog: "Catalog",
      custom: "Custom Order",
      apply: "Apply",
      about: "About",
      cart: "Order sheet",
      login: "Log in",
      account: "Account",
      admin: "Admin",
      logout: "Log out",
    },
    hero: {
      title: "Napkins, thermal paper, menus, lightboxes, packaging & utensils — for Chinese restaurants nationwide",
      subtitle:
        "Source from China, supply U.S. Chinese restaurants and markets. Case wholesale plus custom print & signage.",
      ctaCatalog: "Browse consumables",
      ctaCustom: "Request custom quote",
      ctaApply: "Apply for wholesale",
    },
    trust: {
      t1: "China-origin supply",
      t2: "Restaurant daily consumables",
      t3: "Custom menus & lightboxes",
      t4: "Chinese & English support",
    },
    categories: "Categories",
    featured: "Featured items",
    viewAll: "View all",
    wholesaleOnly: "Wholesale (login to order)",
    moq: "MOQ",
    pack: "Pack",
    addToCart: "Add to order sheet",
    priceUnit: "USD /",
    catalogTitle: "Wholesale catalog",
    catalogHint: "Filter by category. Prices are suggested wholesale USD. Approved accounts can submit order sheets.",
    allCategories: "All categories",
    customTitle: "Custom wholesale request",
    customHint: "Private label, special pack sizes, or hard-to-find brands? Submit and we’ll reply in 1–2 business days.",
    applyTitle: "Apply for a wholesale account",
    applyHint: "Approved accounts unlock order sheets. Please use your real restaurant or market details.",
    aboutTitle: "About KitchenLink",
    aboutBody:
      "KitchenLink is a China-based supplier for Chinese restaurants across the U.S. — napkins, thermal paper, menu printing, lightboxes, takeout packaging, utensils, kitchen supplies, and custom jobs. We optimize for case packs, MOQs, and replenishment.",
    form: {
      name: "Contact name",
      email: "Email",
      phone: "Phone",
      company: "Business name",
      businessType: "Business type",
      restaurant: "Restaurant / takeout",
      supermarket: "Market / grocery",
      distributor: "Distributor",
      cityState: "City / State",
      volume: "Est. monthly volume",
      message: "Notes",
      productNeed: "What do you need?",
      quantity: "Estimated quantity",
      targetPrice: "Target price (optional)",
      deadline: "Needed by",
      notes: "Notes",
      submit: "Submit",
      submitting: "Submitting…",
      success: "Submitted. We’ll contact you soon.",
      password: "Password",
      login: "Log in",
      noAccount: "No account yet? Apply for wholesale access.",
    },
    cart: {
      title: "Order sheet",
      empty: "Your order sheet is empty. Browse the catalog first.",
      qty: "Qty",
      total: "Total",
      note: "Note (delivery / station)",
      submit: "Submit order sheet",
      needLogin: "Please log in with an approved wholesale account.",
      needWholesale: "Your account is pending approval.",
      submitted: "Order submitted. Please pay via WeChat or Alipay and note the order ID.",
      orderId: "Order ID",
    },
    payment: {
      title: "Payment",
      wechat: "WeChat Pay",
      alipay: "Alipay",
      wechatId: "WeChat ID",
      tip: "Please note your restaurant name or order ID when paying so we can match payment.",
    },
    footer: {
      contact: "Contact us",
      phone: "Phone",
      email: "Email",
      wechat: "WeChat",
      qq: "QQ",
      whatsapp: "WhatsApp",
      hours: "Hours",
      rights: "© KitchenLink Wholesale. For qualified wholesale buyers only.",
    },
    admin: {
      title: "Admin",
      applications: "Applications",
      customs: "Custom requests",
      orders: "Orders",
      products: "Products",
      approve: "Approve wholesale",
    },
  },
} as const;

export type Dictionary = {
  [K in keyof (typeof dict)["zh"]]: (typeof dict)["zh"][K] extends string
    ? string
    : { [P in keyof (typeof dict)["zh"][K]]: string };
};

export function getDict(locale: Locale): Dictionary {
  return dict[locale] as Dictionary;
}

export function productName(p: { nameZh: string; nameEn: string }, locale: Locale) {
  return locale === "zh" ? p.nameZh : p.nameEn;
}

export function productDesc(p: { descriptionZh: string; descriptionEn: string }, locale: Locale) {
  return locale === "zh" ? p.descriptionZh : p.descriptionEn;
}

export function categoryName(c: { nameZh: string; nameEn: string }, locale: Locale) {
  return locale === "zh" ? c.nameZh : c.nameEn;
}

export function unitName(p: { unitZh: string; unitEn: string }, locale: Locale) {
  return locale === "zh" ? p.unitZh : p.unitEn;
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
