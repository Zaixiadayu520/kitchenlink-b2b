"use client";

import Script from "next/script";

const PROPERTY_ID = "6a7890eb7a08051d4abf1c0d";
const WIDGET_ID = "1jvjfc6o2";

export function TawkChat() {
  return (
    <Script id="tawk-to" strategy="afterInteractive">{`
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
      })();
    `}</Script>
  );
}
