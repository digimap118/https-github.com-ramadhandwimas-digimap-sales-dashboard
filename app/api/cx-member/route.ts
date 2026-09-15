import {NextRequest,NextResponse} from "next/server"
import {appendSheetValues,getSheetRanges} from "@/lib/google-sheets"

const MASTER_ID="1fMxCSBRY8qtNfPU-eRASVo1vimnf8RSs0ADlPKjluOM"
const TAB="Dashboard CX Member"
const text=(v:unknown)=>String(v??"").trim()
const num=(v:unknown)=>Number(v)||0
function isoDate(v:unknown){if(typeof v==="number")return new Date(Date.UTC(1899,11,30)+v*86400000).toISOString().slice(0,10);const x=text(v);if(/^\d{4}-\d{2}-\d{2}/.test(x))return x.slice(0,10);if(/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(x)){const[a,b,c]=x.split(/[/-]/);return`${c}-${b.padStart(2,"0")}-${a.padStart(2,"0")}`}return x}
type Row={timestamp:string;date:string;staffId:string;name:string;cx:number;member:number}
function mapRows(rows:unknown[][]):Row[]{return rows.map(r=>({timestamp:text(r[0]),date:isoDate(r[1]),staffId:text(r[2]),name:text(r[3]),cx:num(r[4]),member:num(r[5])})).filter(r=>r.date&&r.staffId)}
async function readAll(email:string,key:string){const[rows]=await getSheetRanges(MASTER_ID,[`'${TAB}'!A2:F5000`],email,key);return mapRows(rows)}

export async function GET(req:NextRequest){const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY;if(!email||!key)return NextResponse.json({rows:[],error:"Google Sheets belum tersambung"},{status:503});try{const all=await readAll(email,key),period=req.nextUrl.searchParams.get("period")||"",date=req.nextUrl.searchParams.get("date")||"";const filtered=all.filter(r=>(!period||r.date.startsWith(period))&&(!date||r.date===date));return NextResponse.json({rows:filtered,storage:"MASTER DATA M118"})}catch(e){return NextResponse.json({rows:[],error:e instanceof Error?e.message:"Gagal membaca CX dan member"},{status:500})}}

export async function POST(req:NextRequest){const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY;if(!email||!key)return NextResponse.json({error:"Google Sheets belum tersambung"},{status:503});try{const body=await req.json() as {date?:string;staffId?:string;name?:string;cx?:number;member?:number};const date=isoDate(body.date),staffId=text(body.staffId),name=text(body.name),cx=Math.max(0,num(body.cx)),member=Math.max(0,num(body.member));if(!date||!staffId||!name)return NextResponse.json({error:"Staff dan tanggal wajib diisi"},{status:400});const timestamp=new Date().toISOString();await appendSheetValues(MASTER_ID,`'${TAB}'!A:F`,[[timestamp,date,staffId,name,cx,member]],email,key);return NextResponse.json({ok:true,timestamp,date,staffId,name,cx,member,storage:"MASTER DATA M118"})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Gagal menyimpan CX dan member"},{status:500})}}
