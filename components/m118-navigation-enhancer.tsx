"use client";

import {useEffect} from "react";

export default function M118NavigationEnhancer(){
 useEffect(()=>{
  const nav=document.querySelector("aside nav") as HTMLElement|null;
  if(!nav)return;
  const enhance=()=>{
   const groups=Array.from(nav.children) as HTMLElement[];
   const dashboard=groups[0];
   if(dashboard&&!dashboard.dataset.m118Enhanced){
    dashboard.dataset.m118Enhanced="1";
    const header=dashboard.firstElementChild as HTMLElement|null;
    const items=header?.nextElementSibling as HTMLElement|null;
    if(header&&items){
     header.setAttribute("role","button");header.setAttribute("tabindex","0");header.setAttribute("aria-expanded","true");header.classList.add("m118-nav-group-head");
     const toggle=()=>{const open=header.getAttribute("aria-expanded")!=="false";header.setAttribute("aria-expanded",open?"false":"true");items.style.display=open?"none":"";const chevron=header.querySelector("svg:last-child") as SVGElement|null;if(chevron)chevron.style.transform=open?"rotate(-90deg)":"rotate(0deg)"};
     header.addEventListener("click",toggle);header.addEventListener("keydown",(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle()}});
    }
   }
   const buttons=Array.from(nav.querySelectorAll<HTMLButtonElement>("button"));
   for(const button of buttons){if(button.querySelector("span.flex-1"))button.setAttribute("aria-haspopup","true");const active=button.className.includes("bg-slate-100");if(active)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current")}
  };
  enhance();const observer=new MutationObserver(()=>requestAnimationFrame(enhance));observer.observe(nav,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});return()=>observer.disconnect();
 },[]);
 return <style jsx global>{`
  body.m118-apple-ui .m118-sidebar nav{display:flex!important;flex-direction:column!important;gap:8px!important}
  body.m118-apple-ui .m118-sidebar nav>div{background:rgba(91,105,120,.06)!important;border-radius:16px!important;padding:4px!important}
  body.m118-apple-ui .m118-sidebar nav>div>div:first-child,body.m118-apple-ui .m118-sidebar nav>div>button:first-child{min-height:44px!important;font-weight:800!important;color:#4d5560!important}
  body.m118-apple-ui .m118-sidebar nav button[aria-current="page"]{background:var(--m118-accent-soft)!important;color:#356fa9!important;box-shadow:inset 0 0 0 1px rgba(75,131,189,.10)!important}
  body.m118-apple-ui .m118-sidebar .m118-nav-group-head{cursor:pointer;border-radius:12px!important;transition:background .18s ease,color .18s ease}
  body.m118-apple-ui .m118-sidebar .m118-nav-group-head:hover{background:var(--m118-accent-soft)!important;color:#356fa9!important}
  body.m118-apple-ui .m118-sidebar .m118-nav-group-head svg:last-child{transition:transform .18s ease}
  @media(max-width:1023px){body.m118-apple-ui .m118-sidebar nav{padding-bottom:40px!important}}
 `}</style>;
}
