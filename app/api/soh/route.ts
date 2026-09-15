import {NextRequest,NextResponse} from "next/server";
import {getSheetRanges} from "@/lib/google-sheets";

const SOURCE_ID="1K6BkioKmfd0u9TWUUqlQ3jyAj8wvlAsSUzA3OhVIkiY";
const s=(v:unknown)=>String(v??"").trim();
const n=(v:unknown)=>Number(String(v??0).replace(/[^0-9.-]/g,""))||0;
function isoDate(v:unknown){if(typeof v==="number"&&v>30000&&v<70000)return new Date(Date.UTC(1899,11,30)+v*86400000).toISOString().slice(0,10);const x=s(v);let m=x.match(/\b(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})\b/);if(m)return`${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;m=x.match(/\b(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})\b/);if(m)return`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;return""}
function displayDate(v:string){if(!v)return"";if(/^\d{2}-\d{2}-\d{4}$/.test(v))return v;const[y,m,d]=v.split("-");return`${d}-${m}-${y}`}

export async function GET(req:NextRequest){
 const e=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,k=process.env.GOOGLE_PRIVATE_KEY;if(!e||!k)return NextResponse.json({error:"Google Sheets belum dikonfigurasi"},{status:503});
 try{
  const ranges=["'SOH'!D6:D6","'RAW StockPosition'!F1:N40","'SOH'!C10:E200","'SOH'!J10:L200","'SOH'!Q10:S200","'SOH'!X10:Z200","'SOH'!AE10:AG200","'RAW SalesPerson'!AB2:AJ65536"];
  const[dateRange,rawHead,iphone,ipad,mac,watch,airpods,rawSales]=await getSheetRanges(SOURCE_ID,ranges,e,k),q=(req.nextUrl.searchParams.get("q")||"").toLowerCase(),groups:[string,unknown[][]][]= [["IPHONE",iphone],["IPAD",ipad],["MACBOOK",mac],["APPLE WATCH",watch],["AIRPODS, PENCIL & KEYBOARD",airpods]];
  const salesDates=rawSales.map(r=>isoDate(r[0])).filter(Boolean).sort(),soldDate=salesDates.at(-1)||"",soldByArticle=new Map<string,number>();
  if(soldDate)for(const r of rawSales){const date=isoDate(r[0]),article=s(r[4]),qty=n(r[7]);if(date!==soldDate||!article||!qty)continue;soldByArticle.set(article.toUpperCase(),(soldByArticle.get(article.toUpperCase())||0)+qty)}
  const rows:{article:string;description:string;qty:number;soldQty:number;category:string}[]=[];for(const[category,data]of groups)for(const r of data){const article=s(r[0]),description=s(r[1]),qty=n(r[2]);if(!article||article.toUpperCase()==="ARTICLE"||article.toUpperCase()==="GRAND TOTAL"||qty<=0)continue;if(/DEMO|\-D(?:\b|$)/i.test(`${article} ${description}`))continue;if(q&&!`${article} ${description}`.toLowerCase().includes(q))continue;rows.push({article,description,qty,soldQty:soldByArticle.get(article.toUpperCase())||0,category})}
  const rawDates=rawHead.flat().map(isoDate).filter(Boolean).sort(),sheetDate=isoDate(dateRange?.[0]?.[0]);return NextResponse.json({updated:displayDate(rawDates.at(-1)||sheetDate),soldDate:displayDate(soldDate),rows,source:"M118"},{headers:{"Cache-Control":"no-store"}})
 }catch(err){return NextResponse.json({error:err instanceof Error?err.message:"Gagal membaca SOH M118"},{status:500})}
}
