"use client";

import {useEffect} from "react";

export default function M118ContentParity(){
 useEffect(()=>{
  const apply=()=>{
   const main=document.querySelector("main.m118-main") as HTMLElement|null;if(!main)return;
   const heading=Array.from(main.querySelectorAll("h2")).find(x=>x.textContent?.trim()==="Overview");if(heading)heading.textContent="Dashboard";
   const desc=Array.from(main.querySelectorAll("p")).find(x=>x.textContent?.trim()==="Ringkasan performa store dan team M118.");if(desc)desc.textContent="Ringkasan performa penjualan dan tren tahunan.";
   const perf=Array.from(main.querySelectorAll("h3")).find(x=>x.textContent?.trim()==="Store Performance");
   if(perf){const wrap=perf.parentElement;if(wrap){wrap.classList.add("m118-section-heading")}}
   main.querySelectorAll("article").forEach((el,i)=>{el.classList.add("m118-kpi-card");if(i%4===1)el.classList.add("m118-tone-violet");if(i%4===2)el.classList.add("m118-tone-green");if(i%4===3)el.classList.add("m118-tone-amber")});
   main.querySelectorAll("section.rounded-2xl").forEach(el=>el.classList.add("m118-panel"));
   main.querySelectorAll("table").forEach(el=>el.classList.add("m118-table"));
   main.querySelectorAll("thead").forEach(el=>el.classList.add("m118-table-head"));
   const overview=heading?.closest("div.space-y-5") as HTMLElement|null;
   if(overview&&!overview.querySelector("[data-m118-hero]")){
    const cards=Array.from(overview.querySelectorAll<HTMLElement>("article.m118-kpi-card")).slice(0,4);
    if(cards.length===4){
      const hero=document.createElement("section");hero.dataset.m118Hero="1";hero.className="m118-sales-hero";
      const vals=cards.map(c=>({label:c.querySelector("p")?.textContent||"",value:c.querySelectorAll("p")[1]?.textContent||""}));
      hero.innerHTML=`<div><p class="m118-hero-kicker">Welcome back</p><h2>M118 Sales Overview</h2></div><div class="m118-hero-grid">${vals.map(v=>`<div><span>${v.label}</span><b>${v.value}</b></div>`).join("")}</div>`;
      const anchor=Array.from(overview.children).find((x:any)=>x.classList?.contains("m118-section-heading"));
      if(anchor)overview.insertBefore(hero,anchor);else overview.prepend(hero);
    }
   }
   const daily=Array.from(main.querySelectorAll("h2")).find(x=>x.textContent?.trim()==="Daily Sales Store");if(daily)daily.closest("section")?.classList.add("m118-primary-report");
   const staff=Array.from(main.querySelectorAll("h2")).find(x=>x.textContent?.trim()==="Staff Ranking");if(staff)staff.closest("section")?.classList.add("m118-primary-report");
   const incentive=Array.from(main.querySelectorAll("h2")).find(x=>x.textContent?.trim()==="Estimasi Incentive");if(incentive)incentive.closest("section")?.classList.add("m118-primary-report");
  };
  apply();const mo=new MutationObserver(()=>requestAnimationFrame(apply));mo.observe(document.body,{childList:true,subtree:true});return()=>mo.disconnect();
 },[]);
 return <style jsx global>{`
 body.m118-apple-ui .m118-main>.mt-5.px-4{padding-bottom:40px!important}
 body.m118-apple-ui .m118-main .space-y-5>div:first-child>p:first-child{font-size:12px!important;font-weight:700!important;letter-spacing:.18em!important;color:#4b83bd!important}
 body.m118-apple-ui .m118-main .space-y-5>div:first-child>h2{margin-top:8px!important;font-size:30px!important;font-weight:900!important;letter-spacing:-.035em!important}
 body.m118-apple-ui .m118-main .m118-sales-hero{display:grid!important;grid-template-columns:1fr 1.7fr;gap:20px;align-items:center;border:0!important;border-radius:24px!important;padding:20px!important;background:linear-gradient(135deg,#0872b9,#075b97)!important;color:#fff!important;box-shadow:0 12px 30px rgba(7,91,151,.18)!important}
 body.m118-apple-ui .m118-main .m118-sales-hero h2{margin-top:8px!important;font-size:30px!important;font-weight:900!important;color:#fff!important}.m118-hero-kicker{font-size:14px;color:#dbeafe}.m118-hero-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.m118-hero-grid>div{min-width:0;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.1);border-radius:16px;padding:12px}.m118-hero-grid span{display:block;font-size:11px;color:#dbeafe}.m118-hero-grid b{display:block;margin-top:4px;font-size:17px;line-height:1.15;overflow-wrap:anywhere}
 body.m118-apple-ui .m118-main .m118-kpi-card{padding:20px!important;border-radius:16px!important;box-shadow:var(--m118-shadow)!important}body.m118-apple-ui .m118-main .m118-kpi-card>p:first-child{font-size:14px!important;font-weight:600!important;color:var(--m118-muted)!important}body.m118-apple-ui .m118-main .m118-kpi-card>p:nth-child(2){margin-top:16px!important;font-size:22px!important;font-weight:900!important;letter-spacing:-.035em!important}body.m118-apple-ui .m118-main .m118-kpi-card>div:last-child,body.m118-apple-ui .m118-main .m118-kpi-card>p:last-child{margin-top:12px!important;border-top:1px dashed var(--m118-border)!important;padding-top:12px!important}
 body.m118-apple-ui .m118-main .m118-panel{border-radius:16px!important;box-shadow:var(--m118-shadow)!important}body.m118-apple-ui .m118-main .m118-panel>div.border-b{padding:16px 20px!important}body.m118-apple-ui .m118-main .m118-panel>div.border-b h2{font-weight:800!important}
 body.m118-apple-ui .m118-main .m118-table{font-size:13px!important}body.m118-apple-ui .m118-main .m118-table th{font-size:12px!important;font-weight:800!important;white-space:nowrap}body.m118-apple-ui .m118-main .m118-table td{vertical-align:middle}body.m118-apple-ui .m118-main .m118-table tbody tr{transition:background .15s ease}
 body.m118-apple-ui .m118-main .m118-primary-report{overflow:hidden!important}
 body.m118-apple-ui .m118-main select{height:44px!important;border-radius:12px!important;font-weight:600!important}
 body.m118-apple-ui .m118-main button{transition:background-color .18s ease,color .18s ease,border-color .18s ease,transform .18s ease}
 body.m118-apple-ui .m118-main button:active{transform:scale(.985)}
 body.m118-apple-ui .m118-main .inline-flex.rounded-full{border-radius:14px!important;padding:4px!important;background:var(--m118-panel)!important;box-shadow:var(--m118-shadow)!important}body.m118-apple-ui .m118-main .inline-flex.rounded-full button{border-radius:10px!important}
 body.m118-apple-ui .m118-main .rounded-full.bg-blue-600{background:#4b83bd!important}
 @media(max-width:900px){body.m118-apple-ui .m118-main .m118-sales-hero{grid-template-columns:1fr!important}.m118-hero-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:520px){body.m118-apple-ui .m118-main .m118-sales-hero{padding:16px!important;border-radius:20px!important}.m118-hero-grid{grid-template-columns:1fr!important}body.m118-apple-ui .m118-main .m118-sales-hero h2{font-size:24px!important}}
 `}</style>;
}
