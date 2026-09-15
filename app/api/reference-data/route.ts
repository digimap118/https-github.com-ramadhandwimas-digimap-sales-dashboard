import {NextRequest,NextResponse} from "next/server";
import {getSheetRanges} from "@/lib/google-sheets";

const DASHBOARD_ID="1K6BkioKmfd0u9TWUUqlQ3jyAj8wvlAsSUzA3OhVIkiY";
const MASTER_DATA_ID="1fMxCSBRY8qtNfPU-eRASVo1vimnf8RSs0ADlPKjluOM";
const ranges:Record<string,{id:string;range:string}>={
  bnpl:{id:DASHBOARD_ID,range:"'BNPL - Trade In'!A1:Z100"},
  mading:{id:DASHBOARD_ID,range:"'Mading'!A1:Z120"},
  lob:{id:DASHBOARD_ID,range:"'LOB Target'!A1:V120"},
  weekly:{id:MASTER_DATA_ID,range:"'Dashboard Weekly Reason'!A1:D5000"},
};
const clean=(v:unknown)=>typeof v==="string"?v.replace(/M238/g,"M118"):v;

export async function GET(req:NextRequest){
 const view=req.nextUrl.searchParams.get("view")||"";const config=ranges[view];if(!config)return NextResponse.json({error:"View tidak dikenal."},{status:400});
 const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY;if(!email||!key)return NextResponse.json({error:"Google Sheets belum dikonfigurasi."},{status:503});
 try{const [rows]=await getSheetRanges(config.id,[config.range],email,key);return NextResponse.json({view,rows:(rows||[]).map(r=>r.map(clean)),source:view==="weekly"?"MASTER DATA M118":"Master Dashboard M118 2026"},{headers:{"Cache-Control":"no-store"}})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Gagal membaca data M118"},{status:500})}
}
