import {NextRequest,NextResponse} from "next/server"
import * as XLSX from "xlsx"
import {clearAndWrite} from "@/lib/google-sheets"

const SHEET_ID="1K6BkioKmfd0u9TWUUqlQ3jyAj8wvlAsSUzA3OhVIkiY"

function clean(v:unknown){
  if(v===null||v===undefined)return""
  if(v instanceof Date)return v.toISOString()
  return typeof v==="number"?v:String(v).replace(/\u00a0/g," ").trim()
}

export async function POST(req:NextRequest){
  const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY
  if(!email||!key)return NextResponse.json({error:"Koneksi Google Sheets belum dikonfigurasi."},{status:503})
  try{
    const form=await req.formData(),file=form.get("file")
    if(!(file instanceof File))return NextResponse.json({error:"Pilih file SOH terlebih dahulu."},{status:400})
    if(!/\.xlsx?$/i.test(file.name))return NextResponse.json({error:"Gunakan file Excel .xls atau .xlsx."},{status:400})
    const workbook=XLSX.read(await file.arrayBuffer(),{type:"array",cellDates:true})
    const sheetName=workbook.SheetNames[0],sheet=workbook.Sheets[sheetName]
    if(!sheet)throw new Error("Sheet SOH tidak ditemukan.")
    const raw=XLSX.utils.sheet_to_json<unknown[]>(sheet,{header:1,raw:true,defval:""})
    const rows=raw.map(r=>Array.from({length:9},(_,i)=>clean(r[i]))).filter(r=>r.some(v=>v!==""))
    if(!rows.length)throw new Error("File SOH kosong.")
    if(rows.length>65536)throw new Error("Data SOH melebihi kapasitas 65.536 baris.")
    await clearAndWrite(SHEET_ID,"'RAW StockPosition'!F1:N65536","'RAW StockPosition'!F1",rows,email,key,"RAW")
    return NextResponse.json({ok:true,rows:rows.length,sheet:sheetName})
  }catch(e){
    return NextResponse.json({error:e instanceof Error?e.message:"Upload SOH gagal"},{status:500})
  }
}
