import {NextRequest,NextResponse} from "next/server"
import {clearAndWrite} from "@/lib/google-sheets"

const SHEET_ID="1K6BkioKmfd0u9TWUUqlQ3jyAj8wvlAsSUzA3OhVIkiY"

export async function POST(req:NextRequest){
  const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY
  if(!email||!key)return NextResponse.json({error:"Koneksi Google Sheets belum dikonfigurasi."},{status:503})
  try{
    const body=await req.json() as {target?:string,confirm?:string}
    const target=String(body.target||"").toUpperCase(),confirm=String(body.confirm||"").toUpperCase()
    if(confirm!=="CLEAR")return NextResponse.json({error:"Konfirmasi admin clear tidak valid."},{status:400})
    if(target!=="SPW"&&target!=="SOH")return NextResponse.json({error:"Target clear harus SPW atau SOH."},{status:400})
    const range=target==="SPW"?"'RAW SalesPerson'!R1:T65536":"'RAW StockPosition'!F1:N65536"
    await clearAndWrite(SHEET_ID,range,range.split(":")[0],[],email,key,"RAW")
    return NextResponse.json({ok:true,target})
  }catch(e){
    return NextResponse.json({error:e instanceof Error?e.message:"Admin clear gagal"},{status:500})
  }
}
