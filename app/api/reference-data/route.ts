import {NextRequest,NextResponse} from "next/server";
import {getSheetRanges} from "@/lib/google-sheets";

const SHEET_ID="1K6BkioKmfd0u9TWUUqlQ3jyAj8wvlAsSUzA3OhVIkiY";
const ranges:Record<string,string>={
  bnpl:"'BNPL - Trade In'!A1:Z100",
  mading:"'Mading'!A1:Z120",
  lob:"'LOB Target'!A1:V120",
  weekly:"'Weekly Report'!A1:Z180",
};
const clean=(v:unknown)=>typeof v==="string"?v.replace(/M238/g,"M118"):v;

export async function GET(req:NextRequest){
 const view=req.nextUrl.searchParams.get("view")||"";const range=ranges[view];if(!range)return NextResponse.json({error:"View tidak dikenal."},{status:400});
 const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY;if(!email||!key)return NextResponse.json({error:"Google Sheets belum dikonfigurasi."},{status:503});
 try{const [rows]=await getSheetRanges(SHEET_ID,[range],email,key);return NextResponse.json({view,rows:(rows||[]).map(r=>r.map(clean)),source:"M118"},{headers:{"Cache-Control":"no-store"}})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Gagal membaca data M118"},{status:500})}
}
