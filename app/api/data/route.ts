import {NextRequest,NextResponse} from "next/server"
import {getSheetRanges} from "@/lib/google-sheets"
import type {DailyMetric,M238Payload,Staff,StaffMetric,Target} from "@/lib/m238-types"

const SHEET_ID="1K6BkioKmfd0u9TWUUqlQ3jyAj8wvlAsSUzA3OhVIkiY",STORE="M118"
const n=(v:unknown)=>typeof v==="number"?v:Number(String(v??"").replace(/[^0-9.-]/g,""))||0
const s=(v:unknown)=>String(v??"").trim(),up=(v:unknown)=>s(v).toUpperCase()
function iso(v:unknown){const x=s(v);if(/^\d{2}-\d{2}-\d{4}$/.test(x)){const[d,m,y]=x.split("-");return`${y}-${m}-${d}`}if(/^\d{4}-\d{2}-\d{2}/.test(x))return x.slice(0,10);if(typeof v==="number")return new Date(Date.UTC(1899,11,30)+v*86400000).toISOString().slice(0,10);return""}
function monthLabel(period:string){return new Intl.DateTimeFormat("id-ID",{month:"long",year:"numeric",timeZone:"Asia/Jakarta"}).format(new Date(`${period}-01T00:00:00Z`))}
type Row={date:string;id:string;name:string;invoice:string;article:string;description:string;type:string;qty:number;amount:number;category:string;brand:string;core:string;scheme:string;vendor:string}
function parse(r:unknown[]):Row{return{date:iso(r[0]),id:s(r[1]),name:s(r[2]),invoice:s(r[3]),article:s(r[4]),description:s(r[5]),type:s(r[6]),qty:n(r[7]),amount:n(r[8]),category:up(r[9]),brand:up(r[10]),core:up(r[11]),scheme:up(r[12]),vendor:up(r[13])}}
function valid(r:Row){return r.id&&r.date&&r.scheme!=="VOUCHER"&&!up(r.description).includes("VOUCHER")}
function kind(r:Row){const text=`${r.category} ${up(r.type)} ${up(r.description)}`;if(r.scheme==="VAS")return"vas";if(r.scheme==="ACCESSORIES")return"accessories";if(r.scheme==="DEVICES")return"device";if(/IPHONE|IPAD|MAC|APPLE WATCH/.test(text))return"device";return"other"}
function product(r:Row){const t=`${r.category} ${up(r.type)} ${up(r.description)}`;if(t.includes("MAC"))return"mac";if(t.includes("IPHONE"))return"iphone";if(t.includes("IPAD"))return"ipad";if(t.includes("APPLE WATCH")||/\bAW\b/.test(t))return"watch";if(t.includes("AIRPODS"))return"airpods";return"other"}
function accIncentive(price:number){if(price<=599000)return 5000;if(price<=2000000)return 10000;if(price<=4000000)return 20000;if(price<=6000000)return 40000;return 80000}
function aggregate(rows:Row[],person:Staff,target:Target):StaffMetric{const mine=rows.filter(r=>r.id===person.id&&valid(r)),invoices=new Set(mine.map(r=>r.invoice).filter(Boolean)),sum=(type:string)=>mine.filter(r=>kind(r)===type).reduce((a,r)=>a+r.amount,0),amount=mine.reduce((a,r)=>a+r.amount,0),qty=mine.reduce((a,r)=>a+r.qty,0),units=(p:string)=>mine.filter(r=>kind(r)==="device"&&product(r)===p).reduce((a,r)=>a+r.qty,0),qoala=mine.filter(r=>kind(r)==="vas"&&(r.brand.includes("QOALA")||r.article.toUpperCase().startsWith("KLA"))).reduce((a,r)=>a+(r.amount>=1315000?50000:15000)*Math.max(1,r.qty),0),acc=mine.filter(r=>kind(r)==="accessories").reduce((a,r)=>a+accIncentive(r.amount/Math.max(1,r.qty))*Math.max(1,r.qty),0),share=person.share;const incentive={mac:units("mac")*30000,iphone:units("iphone")*15000,ipad:units("ipad")*10000,watch:units("watch")*10000,qoala,accessories:acc,total:0};incentive.total=incentive.mac+incentive.iphone+incentive.ipad+incentive.watch+incentive.qoala+incentive.accessories;return{id:person.id,name:person.name,share,amount,device:sum("device"),accessories:sum("accessories"),vas:sum("vas"),qty,invoices:invoices.size,upt:invoices.size?qty/invoices.size:0,atv:invoices.size?amount/invoices.size:0,targets:{amount:target.amount*share,device:target.device*share,accessories:target.accessories*share,vas:target.vas*share},incentive}}
function daily(rows:Row[]):DailyMetric[]{return[...new Set(rows.filter(valid).map(r=>r.date))].sort().map(date=>{const day=rows.filter(r=>r.date===date&&valid(r)),invoices=new Set(day.map(r=>r.invoice).filter(Boolean)),sum=(type:string)=>day.filter(r=>kind(r)===type).reduce((a,r)=>a+r.amount,0),qty=day.reduce((a,r)=>a+r.qty,0),lob=(p:string)=>day.filter(r=>product(r)===p).reduce((a,r)=>a+r.qty,0),vas=(terms:string[])=>day.filter(r=>kind(r)==="vas"&&terms.some(q=>`${r.article} ${r.brand} ${r.vendor}`.toUpperCase().includes(q))).reduce((a,r)=>a+r.amount,0),amount=day.reduce((a,r)=>a+r.amount,0);return{date,amount,device:sum("device"),accessories:sum("accessories"),vas:sum("vas"),invoices:invoices.size,qty,upt:invoices.size?qty/invoices.size:0,atv:invoices.size?amount/invoices.size:0,mac:lob("mac"),ipad:lob("ipad"),iphone:lob("iphone"),watch:lob("watch"),airpods:lob("airpods"),qoala:vas(["QOALA","KLA"]),telkomsel:vas(["TELKOMSEL","TSL"]),indosat:vas(["INDOSAT","IDT"]),xl:vas(["XL","XXL"])}})}
function demo(period:string):M238Payload{
  const activePeriod=period==="2026-09"?"2026-08":period
  const target={period:activePeriod,amount:8438880582,device:7172047899,accessories:493752376,vas:773080306}
  const staff:Staff[]=[
    {id:"24023795",name:"Fernaldi Akbar",position:"Store Trainer",share:.06},{id:"26030912",name:"Nurfadila Fitrianka",position:"Cashier",share:.05},{id:"24007871",name:"Elly Yuliana",position:"Cashier",share:.05},{id:"26036926",name:"Muhammad Nishfi Azriel",position:"MT",share:.03},{id:"24021517",name:"Stephanus",position:"Sales Assistant",share:.1},{id:"26025731",name:"Alilla Aldiansyah Ramadhan",position:"Sales Assistant",share:.1},{id:"26026364",name:"Yogi Harahap",position:"Sales Assistant",share:.1},{id:"26026438",name:"Nanda Alifatul Maula",position:"Sales Assistant",share:.1},{id:"26027697",name:"Munabila Cintya",position:"Sales Assistant",share:.1},{id:"26032788",name:"Dwi Fadlyansah",position:"Sales Assistant",share:.1},{id:"26034092",name:"Fariq Daffa Insanul",position:"Sales Assistant",share:.1},{id:"26031319",name:"Abu Dujana",position:"Sales Assistant",share:.1},{id:"26035914",name:"Ilham Saputra",position:"Sales Assistant",share:.1}
  ]
  const actual:Record<string,[number,number,number,number,number,number]>={
    "26026438":[855696400,742112000,77120400,34166000,132,71],"24021517":[850084950,772120050,47919900,29396000,111,59],"26027697":[814777250,704916000,63874250,43088000,122,65],"26026364":[713135350,630067000,54148600,28919750,113,57],"24007871":[702695751,615869000,56280000,26918751,92,48],"26031319":[688804700,612250000,56797700,17758000,102,66],"26032788":[682580210,575618000,82423200,24040000,121,65],"26030912":[558104150,481975050,61389100,14740000,91,48],"24023795":[438809200,381334000,33862200,18014000,49,30],"26034092":[253014700,240837000,10372700,1805000,35,21],"26036926":[191556200,178241000,13315200,0,26,20],"26035914":[62516000,58498000,1798000,2220000,6,3],"26025731":[7848000,6799000,349000,700000,3,2]
  }
  const metric=(x:Staff):StaffMetric=>{const a=actual[x.id]??[0,0,0,0,0,0],incentive={mac:0,iphone:0,ipad:0,watch:0,qoala:0,accessories:0,total:0};return{id:x.id,name:x.name,share:x.share,amount:a[0],device:a[1],accessories:a[2],vas:a[3],qty:a[4],invoices:a[5],upt:a[5]?a[4]/a[5]:0,atv:a[5]?a[0]/a[5]:0,targets:{amount:target.amount*x.share,device:target.device*x.share,accessories:target.accessories*x.share,vas:target.vas*x.share},incentive}}
  const monthlyStaff=staff.map(metric),total={amount:6986012861,device:6162128100,accessories:564548250,vas:241765501,invoices:565,qty:1013}
  return{mode:"demo",generatedAt:new Date().toISOString(),latestDate:"2026-08-25",period:activePeriod,staff,target,dailyStaff:monthlyStaff,monthlyStaff,daily:[],summary:{...total,upt:total.qty/total.invoices,atv:total.amount/total.invoices,estimate:total.amount/25*31,point:Math.min(total.device/target.device*60,60)+Math.min(total.accessories/target.accessories*30,30)+Math.min(total.vas/target.vas*10,10),timegone:25/31*100}}
}

const CACHE_TTL=60*1000
const responseCache=new Map<string,{expiresAt:number;data:M238Payload}>()
const pendingRequests=new Map<string,Promise<M238Payload>>()

async function buildPayload(period:string,email:string,key:string):Promise<M238Payload>{
  const[configRows,dateRows,rawDateRows]=await getSheetRanges(SHEET_ID,["Config!A1:AG55","'Data Copas'!A2:A40576","'RAW SalesPerson'!AB2:AB65536"],email,key)
  const label=monthLabel(period).toLowerCase(),targetRow=configRows.find(r=>s(r[16]).toLowerCase()===label),target:Target={period,amount:n(targetRow?.[17]),device:n(targetRow?.[18]),accessories:n(targetRow?.[19]),vas:n(targetRow?.[20])}
  const staff:Staff[]=configRows.slice(27,45).filter(r=>s(r[7])===STORE&&s(r[8])&&s(r[9])&&!/SUPERVISOR|ONLINE/i.test(s(r[10]))).map(r=>({id:s(r[8]),name:s(r[9]),position:s(r[10]),share:n(r[11])}))
  const matching:number[]=[]
  dateRows.forEach((r,i)=>{if(iso(r[0]).startsWith(period))matching.push(i+2)})
  const rawDates=rawDateRows.map(r=>iso(r[0])).filter(Boolean),latestDate=rawDates.sort().at(-1)||`${period}-01`,dailyMatches:number[]=[]
  rawDateRows.forEach((r,i)=>{if(iso(r[0])===latestDate)dailyMatches.push(i+2)})

  const detailRanges:string[]=[],monthRangeIndex=matching.length?detailRanges.push(`'Data Copas'!A${matching[0]}:S${matching.at(-1)}`)-1:-1,dailyRangeIndex=dailyMatches.length?detailRanges.push(`'RAW SalesPerson'!AB${dailyMatches[0]}:AR${dailyMatches.at(-1)}`)-1:-1
  const detailRows=detailRanges.length?await getSheetRanges(SHEET_ID,detailRanges,email,key):[]
  const monthRows=monthRangeIndex>=0?detailRows[monthRangeIndex]:[],todayRows=dailyRangeIndex>=0?detailRows[dailyRangeIndex]:[]
  const parsed=monthRows.map(parse).filter(r=>r.date.startsWith(period)),current=todayRows.map(parse),monthlyStaff=staff.map(p=>aggregate(parsed,p,target))
  const weekDay=new Intl.DateTimeFormat("id-ID",{weekday:"long",timeZone:"Asia/Jakarta"}).format(new Date(`${latestDate}T00:00:00Z`)).toLowerCase(),dailyTargetRow=configRows.find(r=>s(r[22]).toLowerCase()===weekDay),dailyTarget={period:latestDate,amount:n(dailyTargetRow?.[23]),device:n(dailyTargetRow?.[23]),accessories:n(dailyTargetRow?.[24]),vas:n(dailyTargetRow?.[25])},dailyStaff=staff.map(p=>aggregate(current,p,dailyTarget)),days=daily(parsed),total=days.reduce((a,d)=>({amount:a.amount+d.amount,device:a.device+d.device,accessories:a.accessories+d.accessories,vas:a.vas+d.vas,invoices:a.invoices+d.invoices,qty:a.qty+d.qty}),{amount:0,device:0,accessories:0,vas:0,invoices:0,qty:0}),lastDay=Math.max(1,...days.map(d=>Number(d.date.slice(8,10)))),dim=new Date(Number(period.slice(0,4)),Number(period.slice(5,7)),0).getDate(),point=Math.min(target.device?total.device/target.device*60:0,60)+Math.min(target.accessories?total.accessories/target.accessories*30:0,30)+Math.min(target.vas?total.vas/target.vas*10:0,10)
  return{mode:"live",generatedAt:new Date().toISOString(),latestDate,period,staff,target,dailyStaff,monthlyStaff,daily:days,summary:{...total,upt:total.invoices?total.qty/total.invoices:0,atv:total.invoices?total.amount/total.invoices:0,estimate:total.amount/lastDay*dim,point,timegone:lastDay/dim*100}}
}

export async function GET(req:NextRequest){
  const period=req.nextUrl.searchParams.get("period")||new Date().toISOString().slice(0,7),force=req.nextUrl.searchParams.get("refresh")==="1",email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY
  if(!email||!key)return NextResponse.json(demo(period))
  const cacheKey=`${email}:${period}`,cached=responseCache.get(cacheKey)
  if(!force&&cached&&cached.expiresAt>Date.now())return NextResponse.json(cached.data,{headers:{"cache-control":"public, max-age=15, s-maxage=60, stale-while-revalidate=120","x-dashboard-cache":"hit"}})
  try{
    let request=pendingRequests.get(cacheKey)
    if(!request||force){
      request=buildPayload(period,email,key)
      pendingRequests.set(cacheKey,request)
    }
    const data=await request
    responseCache.set(cacheKey,{data,expiresAt:Date.now()+CACHE_TTL})
    return NextResponse.json(data,{headers:{"cache-control":force?"no-store":"public, max-age=15, s-maxage=60, stale-while-revalidate=120","x-dashboard-cache":"miss"}})
  }catch(error){
    return NextResponse.json({...demo(period),error:error instanceof Error?error.message:"Gagal membaca master Sheet"},{status:200,headers:{"cache-control":"no-store"}})
  }finally{
    pendingRequests.delete(cacheKey)
  }
}
