"use client";

import {useEffect} from "react";

const SPV_FORM="https://forms.cloud.microsoft/pages/responsepage.aspx?id=iAw5Rakbn0eYpYaKADRxVqklIyFb72JDrV7GtVMqEcNUMUdNM1Q1VU4zTU9PTlpVTERHVUpZUk9BQS4u&route=shorturl";
const STAFF_FORM="https://forms.cloud.microsoft/pages/responsepage.aspx?id=iAw5Rakbn0eYpYaKADRxVqklIyFb72JDrV7GtVMqEcNUQVpVV1hBVTdHTDVDWVlMRkE0V0lRVDQySS4u&route=shorturl";
function text(el:Element|null){return(el?.textContent||"").replace(/\s+/g," ").trim()}
function findGroup(nav:HTMLElement,label:string){return Array.from(nav.children).find(x=>text(x.firstElementChild)?.startsWith(label)) as HTMLElement|undefined}
function itemButton(group:HTMLElement|undefined,label:string){return group?Array.from(group.querySelectorAll<HTMLButtonElement>("button")).find(b=>text(b)===label):undefined}
function itemsBox(group:HTMLElement|undefined){if(!group)return null;const head=group.firstElementChild as HTMLElement|null;return head?.nextElementSibling as HTMLElement|null}
function appendIfNeeded(box:HTMLElement,node:HTMLElement|null|undefined){if(node&&node.parentElement!==box)box.appendChild(node)}
function setHidden(el:HTMLElement|undefined,hidden:boolean){if(!el)return;const next=hidden?"none":"";if(el.style.display!==next)el.style.display=next}

export default function M118NavigationEnhancer(){
 useEffect(()=>{
  const nav=document.querySelector("aside nav") as HTMLElement|null;if(!nav)return;
  let scheduled=false;
  const enhance=()=>{
   scheduled=false;
   const dashboard=findGroup(nav,"Dashboard");
   if(dashboard&&!dashboard.dataset.m118Enhanced){dashboard.dataset.m118Enhanced="1";const header=dashboard.firstElementChild as HTMLElement|null,items=header?.nextElementSibling as HTMLElement|null;if(header&&items){header.setAttribute("role","button");header.setAttribute("tabindex","0");header.setAttribute("aria-expanded","true");header.classList.add("m118-nav-group-head");const toggle=()=>{const open=header.getAttribute("aria-expanded")!=="false";header.setAttribute("aria-expanded",open?"false":"true");items.style.display=open?"none":"";const chevron=header.querySelector("svg:last-child") as SVGElement|null;if(chevron)chevron.style.transform=open?"rotate(-90deg)":"rotate(0deg)"};header.addEventListener("click",toggle);header.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle()}})}}
   const admin=findGroup(nav,"Administrasi"),report=findGroup(nav,"Reporting"),system=findGroup(nav,"System"),adminBox=itemsBox(admin),reportBox=itemsBox(report);
   if(adminBox){
    const mading=itemButton(admin,"Mading"),bnpl=itemButton(admin,"BNPL & Trade-In"),check=itemButton(admin,"Checklist Store"),upload=itemButton(system,"Data Upload");
    appendIfNeeded(adminBox,mading);appendIfNeeded(adminBox,bnpl);setHidden(check,true);
    let spv=adminBox.querySelector<HTMLAnchorElement>("[data-m118-check-spv]"),staff=adminBox.querySelector<HTMLAnchorElement>("[data-m118-check-staff]");
    if(!spv){spv=document.createElement("a");spv.dataset.m118CheckSpv="1";spv.href=SPV_FORM;spv.target="_blank";spv.rel="noopener noreferrer";spv.className="m118-nav-link";spv.innerHTML='<span class="m118-nav-bullet">✓</span><span>Checklist Store - SPV</span>';adminBox.appendChild(spv)}
    if(!staff){staff=document.createElement("a");staff.dataset.m118CheckStaff="1";staff.href=STAFF_FORM;staff.target="_blank";staff.rel="noopener noreferrer";staff.className="m118-nav-link";staff.innerHTML='<span class="m118-nav-bullet">✓</span><span>Checklist Store - Staff</span>';adminBox.appendChild(staff)}
    appendIfNeeded(adminBox,upload);
   }
   if(reportBox){const desired=["Feedback","NPS/CX & Member","Weekly Report","Weekly Reason"].map(name=>itemButton(report,name)).filter(Boolean) as HTMLElement[];desired.forEach((el,i)=>{const current=Array.from(reportBox.children).filter(x=>(x as HTMLElement).style.display!=="none")[i];if(current!==el)reportBox.insertBefore(el,current||null)})}
   setHidden(itemButton(system,"Robot AI Help"),true);setHidden(itemButton(admin,"Checklist Store"),true);
   for(const button of Array.from(nav.querySelectorAll<HTMLButtonElement>("button"))){if(button.querySelector("span.flex-1"))button.setAttribute("aria-haspopup","true");const active=button.className.includes("bg-slate-100");if(active)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current")}
  };
  const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(enhance)};enhance();const observer=new MutationObserver(schedule);observer.observe(nav,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});return()=>observer.disconnect();
 },[]);
 return <style jsx global>{`
  body.m118-apple-ui .m118-sidebar nav{display:flex!important;flex-direction:column!important;gap:8px!important}
  body.m118-apple-ui .m118-sidebar nav>div{background:rgba(91,105,120,.06)!important;border-radius:16px!important;padding:4px!important}
  body.m118-apple-ui .m118-sidebar nav>div>div:first-child,body.m118-apple-ui .m118-sidebar nav>div>button:first-child{min-height:44px!important;font-weight:800!important;color:#4d5560!important}
  body.m118-apple-ui .m118-sidebar nav button[aria-current="page"]{background:var(--m118-accent-soft)!important;color:#356fa9!important;box-shadow:inset 0 0 0 1px rgba(75,131,189,.10)!important}
  body.m118-apple-ui .m118-sidebar .m118-nav-group-head{cursor:pointer;border-radius:12px!important;transition:background .18s ease,color .18s ease}
  body.m118-apple-ui .m118-sidebar .m118-nav-group-head:hover{background:var(--m118-accent-soft)!important;color:#356fa9!important}
  body.m118-apple-ui .m118-sidebar .m118-nav-group-head svg:last-child{transition:transform .18s ease}
  body.m118-apple-ui .m118-sidebar .m118-nav-link{display:flex;align-items:center;gap:8px;width:100%;border-radius:10px;padding:10px 12px;font-size:12px;font-weight:700;color:#4d5560;text-decoration:none;transition:background .18s ease,color .18s ease}body.m118-apple-ui .m118-sidebar .m118-nav-link:hover{background:var(--m118-accent-soft);color:#356fa9}.m118-nav-bullet{display:grid;width:14px;height:14px;place-items:center;font-size:11px;flex:0 0 auto}
  @media(min-width:1024px){body.m118-apple-ui .m118-sidebar .m118-nav-link{padding-left:28px}}
  @media(max-width:1023px){body.m118-apple-ui .m118-sidebar nav{padding-bottom:40px!important}}
 `}</style>;
}
