"use client";

import {useEffect,useState} from "react";
import {Menu} from "lucide-react";

export default function M118AppleUI(){
 const[hidden,setHidden]=useState(true);
 useEffect(()=>{
  const mobile=window.matchMedia("(max-width:1023px)").matches;
  const saved=localStorage.getItem("m118-sidebar-hidden")==="1";
  const initialHidden=mobile?true:saved;
  setHidden(initialHidden);
  document.body.classList.add("m118-apple-ui");
  document.body.classList.toggle("m118-sidebar-hidden",initialHidden);
  const setSidebarHidden=(next:boolean)=>{setHidden(next);document.body.classList.toggle("m118-sidebar-hidden",next);if(!mobile)localStorage.setItem("m118-sidebar-hidden",next?"1":"0")};
  const toggle=()=>setHidden(current=>{const next=!current;document.body.classList.toggle("m118-sidebar-hidden",next);if(!mobile)localStorage.setItem("m118-sidebar-hidden",next?"1":"0");return next});
  const closeAfterNav=(event:MouseEvent)=>{if(!mobile)return;const target=event.target as HTMLElement|null,control=target?.closest("nav a, nav button") as HTMLElement|null;if(!control||control.querySelector("span.flex-1"))return;setSidebarHidden(true)};
  window.addEventListener("m118-sidebar-toggle",toggle);
  document.addEventListener("click",closeAfterNav,true);
  const apply=()=>{
   const aside=document.querySelector("aside") as HTMLElement|null;
   const main=document.querySelector("main") as HTMLElement|null;
   if(!aside||!main)return;
   aside.parentElement?.classList.add("m118-app-shell");
   aside.classList.add("m118-sidebar");
   main.classList.add("m118-main");
   const brand=aside.querySelector("div.flex.items-center.gap-3.border-b") as HTMLElement|null;
   if(brand&&!brand.querySelector("[data-m118-sidebar-close]")){
    const btn=document.createElement("button");
    btn.type="button";btn.dataset.m118SidebarClose="1";btn.className="m118-brand-close";btn.title="Tutup menu";btn.setAttribute("aria-label","Tutup menu M118");
    btn.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>';
    btn.onclick=()=>window.dispatchEvent(new Event("m118-sidebar-toggle"));brand.appendChild(btn);
   }
  };
  apply();
  const mo=new MutationObserver(apply);mo.observe(document.body,{childList:true,subtree:true});
  return()=>{mo.disconnect();window.removeEventListener("m118-sidebar-toggle",toggle);document.removeEventListener("click",closeAfterNav,true);document.body.classList.remove("m118-apple-ui","m118-sidebar-hidden")};
 },[]);
 return <>{hidden&&<button type="button" onClick={()=>window.dispatchEvent(new Event("m118-sidebar-toggle"))} className="m118-menu-open" title="Buka menu" aria-label="Buka menu"><Menu className="size-5"/></button>}<style jsx global>{`
 body.m118-apple-ui{--m118-bg:#f2f4f6;--m118-panel:#fbfcfd;--m118-panel-2:#f6f8fa;--m118-text:#22262b;--m118-muted:#6d7580;--m118-border:rgba(33,40,48,.09);--m118-shadow:0 8px 24px rgba(27,35,44,.045);--m118-hover:#f3f7fb;--m118-accent:#4b83bd;--m118-accent-soft:#eaf2fa;background:var(--m118-bg)!important;color:var(--m118-text)!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue",Arial,sans-serif;color-scheme:light}
 body.m118-apple-ui .m118-app-shell,body.m118-apple-ui .m118-main{background:var(--m118-bg)!important}
 body.m118-apple-ui .m118-app-shell>button[aria-label="Buka menu"]{display:none!important}
 body.m118-apple-ui .m118-sidebar{background:rgba(251,252,253,.94)!important;color:var(--m118-text)!important;border-right:1px solid var(--m118-border)!important;box-shadow:6px 0 24px rgba(30,38,47,.035);backdrop-filter:saturate(150%) blur(20px);-webkit-backdrop-filter:saturate(150%) blur(20px);overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(80,88,98,.22) transparent;transform:none!important}
 body.m118-apple-ui .m118-sidebar>div{min-height:100%;height:auto!important;padding:12px!important}body.m118-apple-ui .m118-sidebar nav{padding-bottom:32px!important}
 body.m118-apple-ui .m118-sidebar [class*="text-white"]{color:#4d5560!important}body.m118-apple-ui .m118-sidebar [class*="border-white"],body.m118-apple-ui .m118-sidebar .border-b{border-color:var(--m118-border)!important}
 body.m118-apple-ui .m118-sidebar [class*="bg-slate-100/85"]{background:rgba(91,105,120,.06)!important;border-radius:16px!important}
 body.m118-apple-ui .m118-sidebar .text-slate-950,body.m118-apple-ui .m118-sidebar .text-slate-900,body.m118-apple-ui .m118-sidebar .text-slate-800,body.m118-apple-ui .m118-sidebar .text-slate-700,body.m118-apple-ui .m118-sidebar .text-slate-600,body.m118-apple-ui .m118-sidebar .text-slate-500{color:#4d5560!important}
 body.m118-apple-ui .m118-sidebar button{color:#4d5560!important;border-radius:12px!important;transition:background .18s ease,color .18s ease;border-color:transparent!important}body.m118-apple-ui .m118-sidebar button:hover{background:var(--m118-accent-soft)!important;color:#356fa9!important}body.m118-apple-ui .m118-sidebar button.bg-slate-100{background:var(--m118-accent-soft)!important;color:#356fa9!important;box-shadow:inset 0 0 0 1px rgba(75,131,189,.10)!important}
 body.m118-apple-ui .m118-sidebar .size-11{background:linear-gradient(145deg,#3b424a,#59626d)!important;color:#f7f8f9!important;border-radius:14px!important;box-shadow:0 6px 16px rgba(25,32,39,.12)!important}
 body.m118-apple-ui .m118-sidebar span.hidden.text-xl{display:none!important}
 body.m118-apple-ui .m118-sidebar button[aria-label="Tutup menu"]{display:none!important}
 .m118-brand-close{margin-left:auto!important;width:34px;height:34px;display:grid!important;place-items:center!important;border:0!important;background:transparent!important;color:var(--m118-muted)!important;padding:0!important;flex:0 0 auto}.m118-brand-close:hover{background:rgba(91,105,120,.08)!important;color:var(--m118-text)!important}
 .m118-menu-open{position:fixed;z-index:90;left:14px;top:14px;width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--m118-border);border-radius:12px;background:rgba(251,252,253,.92);color:var(--m118-text);box-shadow:0 8px 22px rgba(27,35,44,.09);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
 body.m118-apple-ui .m118-main{min-width:0;width:100%;background:var(--m118-bg)!important}body.m118-apple-ui .m118-main>header{position:sticky!important;top:0!important;z-index:45!important;background:rgba(247,249,251,.86)!important;border-color:var(--m118-border)!important;backdrop-filter:saturate(150%) blur(18px)!important;-webkit-backdrop-filter:saturate(150%) blur(18px)!important}
 body.m118-apple-ui .m118-main>header>div{min-height:58px!important;height:auto!important;padding-top:12px!important;padding-bottom:12px!important}
 body.m118-apple-ui .m118-main>header button{border-radius:12px!important;background:var(--m118-panel)!important;border-color:var(--m118-border)!important;color:var(--m118-text)!important}
 body.m118-apple-ui .m118-main>.px-4.pt-7{display:none!important}body.m118-apple-ui .m118-main>.mt-5.px-4{margin-top:0!important;padding-top:24px!important}
 body.m118-apple-ui .m118-main article,body.m118-apple-ui .m118-main section[class*="rounded-2xl"],body.m118-apple-ui .m118-main section[class*="rounded-3xl"]{background:var(--m118-panel)!important;border-color:var(--m118-border)!important;box-shadow:var(--m118-shadow)!important;color:var(--m118-text)!important}
 body.m118-apple-ui .m118-main article{border-radius:16px!important}
 body.m118-apple-ui .m118-main h1,body.m118-apple-ui .m118-main h2,body.m118-apple-ui .m118-main h3,body.m118-apple-ui .m118-main h4{letter-spacing:-.02em;color:var(--m118-text)!important}body.m118-apple-ui .m118-main p[class*="text-slate-500"],body.m118-apple-ui .m118-main span[class*="text-slate-500"]{color:var(--m118-muted)!important}
 body.m118-apple-ui .m118-main table{background:var(--m118-panel)!important;color:var(--m118-text)!important}body.m118-apple-ui .m118-main thead{background:var(--m118-panel-2)!important}body.m118-apple-ui .m118-main th{color:var(--m118-muted)!important}body.m118-apple-ui .m118-main td{color:var(--m118-text)}body.m118-apple-ui .m118-main tbody tr:hover{background:var(--m118-hover)!important}
 body.m118-apple-ui .m118-main select,body.m118-apple-ui .m118-main input,body.m118-apple-ui .m118-main textarea{border-color:var(--m118-border)!important;border-radius:12px!important;background:var(--m118-panel)!important;color:var(--m118-text)!important}
 body.m118-apple-ui .m118-main .rounded-full{border-color:var(--m118-border)!important}
 @media(min-width:1024px){body.m118-sidebar-hidden .m118-app-shell{display:block!important;grid-template-columns:none!important}body.m118-sidebar-hidden .m118-sidebar{display:none!important}body.m118-sidebar-hidden .m118-main{width:100%!important;max-width:none!important;margin:0!important}body.m118-sidebar-hidden .m118-main>div[class*="px-4"]{width:100%!important;max-width:none!important;margin:0!important;padding-left:28px!important;padding-right:28px!important}}
 @media(max-width:1023px){body.m118-apple-ui .m118-app-shell{display:block!important}body.m118-apple-ui .m118-sidebar{position:fixed!important;top:0!important;bottom:0!important;left:0!important;width:min(86vw,320px)!important;height:100dvh!important;z-index:80!important;border-bottom:0!important}body.m118-apple-ui .m118-main{width:100%!important;max-width:none!important;margin:0!important}body.m118-sidebar-hidden .m118-sidebar{display:none!important}.m118-menu-open{top:12px;left:12px}body.m118-apple-ui .m118-main>header>div{padding-left:64px!important}}
 @media(max-width:640px){body.m118-apple-ui .m118-main>div[class*="px-4"]{padding-left:14px!important;padding-right:14px!important}}
 .dark body.m118-apple-ui{--m118-bg:#111419;--m118-panel:#181c22;--m118-panel-2:#1d2229;--m118-text:#e6e9ed;--m118-muted:#9ba3ad;--m118-border:rgba(225,231,238,.09);--m118-shadow:0 8px 24px rgba(0,0,0,.16);--m118-hover:#1e252d;--m118-accent:#7ba7d5;--m118-accent-soft:rgba(83,126,170,.16);background:var(--m118-bg)!important;color:var(--m118-text)!important;color-scheme:dark}
 .dark body.m118-apple-ui .m118-app-shell,.dark body.m118-apple-ui .m118-main{background:var(--m118-bg)!important}.dark body.m118-apple-ui .m118-sidebar{background:rgba(24,28,34,.95)!important;color:var(--m118-text)!important;border-color:var(--m118-border)!important}.dark body.m118-apple-ui .m118-sidebar button{color:#c7cdd4!important}.dark body.m118-apple-ui .m118-sidebar button:hover,.dark body.m118-apple-ui .m118-sidebar button.bg-slate-100{background:var(--m118-accent-soft)!important;color:#a9c8e7!important}.dark body.m118-apple-ui .m118-main>header{background:rgba(17,20,25,.88)!important}
 .dark body.m118-apple-ui .m118-main .bg-white{background:var(--m118-panel)!important}.dark body.m118-apple-ui .m118-main .bg-slate-50{background:var(--m118-panel-2)!important}.dark body.m118-apple-ui .m118-main .text-slate-900,.dark body.m118-apple-ui .m118-main .text-slate-800{color:var(--m118-text)!important}.dark body.m118-apple-ui .m118-main .border-slate-200{border-color:var(--m118-border)!important}
 `}</style></>;
}
