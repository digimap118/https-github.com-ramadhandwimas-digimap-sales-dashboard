"use client";

import {useCallback,useEffect,useMemo,useState} from "react";
import {createPortal} from "react-dom";
import {CreditCard,Gauge,RefreshCw,TrendingUp,WalletCards} from "lucide-react";

type View="bnpl"|"mading"|"lob"|"weekly";
type Payload={view:View;rows:unknown[][];source:string;error?:string};
const viewFor=(label:string):View|null=>label==="BNPL & Trade-In"?"bnpl":label==="Mading"?"mading":label==="LOB Target Fokus"?"lob":label==="Weekly Reason"?"weekly":null;
const s=(v:unknown)=>String(v??"").trim();
const num=(v:unknown)=>Number(String(v??0).replace(/[^0-9.-]/g,""))||0;
const money=(v:unknown)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(num(v));

function Card({label,value,sub,icon:Icon=TrendingUp}:{label:string;value:string;sub?:string;icon?:typeof TrendingUp}){return <article className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><p className="text-sm font-semibold text-slate-500">{label}</p><span className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Icon className="size-5"/></span></div><p className="mt-4 break-words text-xl font-black tracking-[-.035em] sm:text-2xl">{value}</p>{sub&&<p className="mt-3 border-t border-dashed pt-3 text-xs text-slate-500">{sub}</p>}</article>}
function TableBlock({title,sub,headers,rows}:{title:string;sub:string;headers:string[];rows:string[][]}){return <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-sm text-slate-500">{sub}</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="bg-slate-50"><tr>{headers.map(h=><th key={h} className="whitespace-nowrap p-3 text-left text-xs font-extrabold text-slate-500">{h}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i} className="border-t hover:bg-slate-50/70">{headers.map((_,j)=><td key={j} className={`p-3 ${j>1?"text-right":""} ${j===0?"font-bold":""}`}>{r[j]||"—"}</td>)}</tr>):<tr><td colSpan={headers.length} className="p-8 text-center text-slate-400">Belum ada data.</td></tr>}</tbody></table></div></section>}

function BNPL({rows}:{rows:unknown[][]}){
 const data=rows.slice(12).filter(r=>s(r[2]));
 const providers=[{name:"HCI",q:4,a:5},{name:"Indodana",q:6,a:7},{name:"Kredivo",q:8,a:9},{name:"Akulaku",q:10,a:11},{name:"SPaylater",q:12,a:13}],trade=[{name:"Laku6 Master Device",q:19,a:20},{name:"OnePulse",q:21,a:22}];
 const sum=(list:{q:number;a:number}[],field:"q"|"a")=>data.reduce((t,r)=>t+list.reduce((x,p)=>x+num(r[p[field]]),0),0),bnplQty=sum(providers,"q"),bnplAmt=sum(providers,"a"),tradeQty=sum(trade,"q"),tradeAmt=sum(trade,"a");
 const table=data.map(r=>[s(r[2]),s(r[3]),String(providers.reduce((a,p)=>a+num(r[p.q]),0)),money(providers.reduce((a,p)=>a+num(r[p.a]),0)),String(trade.reduce((a,p)=>a+num(r[p.q]),0)),money(trade.reduce((a,p)=>a+num(r[p.a]),0))]);
 return <div className="space-y-5"><div><h1 className="text-3xl font-black">BNPL & Trade-In</h1><p className="mt-1 text-sm text-slate-500">Daily tracking transaksi BNPL dan trade-in M118.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card label="BNPL Qty" value={String(bnplQty)} sub="Total transaksi BNPL" icon={CreditCard}/><Card label="BNPL Amount" value={money(bnplAmt)} sub="Total value BNPL" icon={WalletCards}/><Card label="Trade-In Qty" value={String(tradeQty)} sub="Total transaksi trade-in" icon={CreditCard}/><Card label="Trade-In Amount" value={money(tradeAmt)} sub="Total value trade-in" icon={WalletCards}/></div><TableBlock title="Daily Tracking" sub="Ringkasan BNPL dan trade-in per tanggal." headers={["Date","Day","BNPL Qty","BNPL Amount","Trade-In Qty","Trade-In Amount"]} rows={table}/></div>
}

function Mading({rows}:{rows:unknown[][]}){
 const target=rows[8]||[],mtd=rows[9]||[],ach=rows[10]||[],est=rows[12]||[],estPct=rows[13]||[],point=rows[14]||[];
 const lob=rows.slice(20,40).filter(r=>s(r[8])&&!/CATEGORY|BRAND/i.test(s(r[8]))).map(r=>[s(r[8]),s(r[9]),s(r[10])]);
 return <div className="space-y-5"><div><h1 className="text-3xl font-black">Mading</h1><p className="mt-1 text-sm text-slate-500">Ringkasan target, MTD, estimasi, LFL, LOB dan VAS M118.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card label="Target" value={money(target[4])} sub={`Device ${money(target[5])}`}/><Card label="MTD Sales" value={money(mtd[4])} sub={`Achievement ${s(ach[4])||"—"}`}/><Card label="Estimate" value={money(est[4])} sub={`Estimate ${s(estPct[4])||"—"}`}/><Card label="Point Store" value={s(point[4])||"—"} sub="Ringkasan point store" icon={Gauge}/></div><TableBlock title="LOB Month to Date" sub="Qty dan value per kategori dari tab Mading M118." headers={["Category","Qty","Value"]} rows={lob}/></div>
}

function LOB({rows}:{rows:unknown[][]}){
 const block=rows.slice(20,120).filter(r=>s(r[15])||s(r[16])||s(r[18]));
 const table=block.map(r=>[s(r[15]),s(r[16]),s(r[17]),s(r[18])]).filter(r=>r.some(Boolean));
 const totalQty=block.reduce((a,r)=>a+num(r[16]),0),target=block.reduce((a,r)=>a+num(r[18]),0);
 return <div className="space-y-5"><div><h1 className="text-3xl font-black">LOB Target Fokus</h1><p className="mt-1 text-sm text-slate-500">Pencapaian dan target LOB M118 dari tab LOB Target.</p></div><div className="grid gap-4 sm:grid-cols-3"><Card label="Achievement Qty" value={String(totalQty)} sub="Akumulasi item pada block target"/><Card label="Target Qty" value={String(target)} sub="Akumulasi target fokus"/><Card label="Gap Qty" value={String(target-totalQty)} sub="Target dikurangi achievement" icon={Gauge}/></div><TableBlock title="Product Target Focus" sub="Produk, pencapaian, value, dan target pada week aktif." headers={["Category / Type","Achievement Qty","Amount","Target Qty"]} rows={table}/></div>
}

function WeeklyReason({rows}:{rows:unknown[][]}){
 const snapshots=useMemo(()=>rows.slice(1).flatMap(r=>{const week=s(r[0]),compareWeek=s(r[1]),raw=s(r[2]),updatedAt=s(r[3]);if(!week||!raw)return[];try{const parsed=JSON.parse(raw) as {data?:Record<string,unknown>};return[{week,compareWeek,updatedAt,data:(parsed.data||parsed) as Record<string,unknown>}] }catch{return[]}}).sort((a,b)=>{const rank=(x:string)=>{const m=x.match(/Week\s*0?(\d+)\s*Q(\d+)/i);return m?Number(m[2])*100+Number(m[1]):0};return rank(b.week)-rank(a.week)}),[rows]);
 const[selected,setSelected]=useState("");
 useEffect(()=>{if(snapshots.length&&!snapshots.some(x=>x.week===selected))setSelected(snapshots[0].week)},[snapshots,selected]);
 const current=snapshots.find(x=>x.week===selected)||snapshots[0];
 if(!current)return <section className="rounded-2xl border bg-white p-8 text-center text-slate-400">Belum ada snapshot Weekly Reason di MASTER DATA M118.</section>;
 const d=current.data as any,analysis=(d.analysis||{}) as Record<string,{review?:string;actionPlan?:string;target?:number;achievement?:number;gap?:number}>;
 const lobOrder:[[string,string],[string,string],[string,string],[string,string],[string,string]]=[["IPHONE","iPhone"],["IPAD","iPad"],["MAC","MacBook"],["APPLE WATCH","Apple Watch"],["AIRPODS","AirPods"]];
 const trafficA=num(d.trafficA),trafficB=num(d.trafficB),dailyA=d.dailyA||{},dailyB=d.dailyB||{};
 return <div className="space-y-5">
  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-3xl font-black">Weekly Reason</h1><p className="mt-1 text-sm text-slate-500">Reason dan action plan tersimpan permanen di MASTER DATA M118.</p></div><label className="text-sm font-semibold text-slate-600">Week<select value={current.week} onChange={e=>setSelected(e.target.value)} className="mt-1 block min-w-52 rounded-xl border bg-white px-3 py-2.5 font-semibold text-slate-900">{snapshots.map(x=><option key={x.week} value={x.week}>{x.week}</option>)}</select></label></div>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card label="Compare" value={current.compareWeek||s(d.labelA)||"—"} sub={`vs ${current.week}`}/><Card label="Traffic" value={String(trafficB)} sub={`${trafficA} → ${trafficB}`}/><Card label="Invoice" value={String(num(dailyB.invoices))} sub={`${num(dailyA.invoices)} → ${num(dailyB.invoices)}`}/><Card label="Qty" value={String(num(dailyB.qty))} sub={`${num(dailyA.qty)} → ${num(dailyB.qty)}`}/></div>
  {s(d.feedbackSummary)&&<section className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="font-extrabold">Feedback Summary</h2><p className="mt-2 text-sm leading-6 text-slate-600">{s(d.feedbackSummary)}</p></section>}
  <div className="grid gap-4 xl:grid-cols-2">{lobOrder.map(([key,label])=>{const a=analysis[key];if(!a)return null;return <section key={key} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-black">{label}</h2><p className="text-xs text-slate-500">{current.compareWeek} → {current.week}</p></div>{a.target? <div className="rounded-xl bg-blue-50 px-3 py-2 text-right"><p className="text-[11px] font-bold uppercase text-blue-500">Achievement</p><p className="font-black text-blue-700">{num(a.achievement).toFixed(0)}%</p></div>:null}</div><div className="mt-4"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Weekly Review</p><p className="mt-1 text-sm leading-6 text-slate-700">{a.review||"—"}</p></div><div className="mt-4 border-t pt-4"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Action Plan</p><p className="mt-1 text-sm leading-6 text-slate-700">{a.actionPlan||"—"}</p></div></section>})}</div>
  <p className="text-xs text-slate-400">Last snapshot: {current.updatedAt||s(d.savedAt)||"—"}</p>
 </div>
}

export default function M118ReferenceViews(){
 const[host,setHost]=useState<HTMLElement|null>(null),[view,setView]=useState<View|null>(null),[data,setData]=useState<Payload|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
 const load=useCallback(async(v:View)=>{setLoading(true);setError("");try{const r=await fetch(`/api/reference-data?view=${v}&t=${Date.now()}`,{cache:"no-store"}),j=await r.json();if(!r.ok)throw new Error(j.error||"Gagal membaca data");setData(j)}catch(e){setData(null);setError(e instanceof Error?e.message:"Gagal membaca data")}finally{setLoading(false)}},[]);
 useEffect(()=>{if(view)void load(view)},[view,load]);
 useEffect(()=>{const apply=()=>{const main=document.querySelector("main.m118-main") as HTMLElement|null;if(!main)return;const next=viewFor(main.querySelector("header b")?.textContent?.trim()||"");setView(next);const root=main.querySelector(":scope > .mt-5.px-4") as HTMLElement|null;if(root){let h=root.querySelector("[data-m118-reference-host]") as HTMLElement|null;if(!h){h=document.createElement("div");h.dataset.m118ReferenceHost="1";root.appendChild(h)}setHost(h)}document.body.classList.toggle("m118-reference-active",Boolean(next))};apply();const mo=new MutationObserver(()=>requestAnimationFrame(apply));mo.observe(document.body,{subtree:true,childList:true,characterData:true});return()=>{mo.disconnect();document.body.classList.remove("m118-reference-active")}},[]);
 const body=useMemo(()=>{if(!view)return null;if(loading)return <section className="rounded-2xl border bg-white p-8 text-center text-slate-400">Memuat data M118…</section>;if(error)return <section className="rounded-2xl border bg-white p-8 text-center text-rose-600">{error}</section>;const rows=data?.rows||[];if(view==="bnpl")return <BNPL rows={rows}/>;if(view==="mading")return <Mading rows={rows}/>;if(view==="lob")return <LOB rows={rows}/>;return <WeeklyReason rows={rows}/>},[view,loading,error,data]);
 if(!host)return null;return <>{createPortal(<div style={{display:view?"block":"none"}}>{body}</div>,host)}<style jsx global>{`body.m118-reference-active .m118-main>.mt-5.px-4>*:not([data-m118-reference-host]){display:none!important}body.m118-reference-active [data-m118-reference-host]{display:block!important}`}</style></>;
}
