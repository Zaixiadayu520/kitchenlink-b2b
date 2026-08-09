/** 对外展示的联系方式（改这里即可全局更新） */
export const siteContact = {
  phoneDisplay: "137-5520-7375",
  phoneTel: "+8613755207375",
  email: "247416514@qq.com",
  wechat: "Lingjianj0219",
  qq: "247416514",
  whatsappE164: "8613755207375",
  hoursZh: "周一至周六 9:00–18:00（中国时间可约）",
  hoursEn: "Mon–Sat 9:00–18:00 (China time / by appointment)",
};

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${siteContact.whatsappE164}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
