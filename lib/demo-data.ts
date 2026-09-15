import type { DashboardPayload, SaleRow, StockRow, StoreTarget } from "./dashboard-types"

const stores = [
  ["M117","DIGIMAP PLAZA SENAYAN"],["M118","Digimap Pondok Indah Mall 3"],["M124","DIGIMAP PACIFIC PLACE"],
  ["M127","DIGIMAP LOTTE AVENUE"],["M217","DIGIMAP BLOK M PLAZA"],["M227","Digimap Aeon Tanjung Barat"],
  ["M238","Digimap AAR Pondok Indah Mall 2"],["M255","Digimap Antasari Place"],["M264","Digimap Plaza Semanggi"],
].map(([code,name])=>({code,name}))

const targets:Array<[string,number,number,number,number]>=[
  ["M117",5248800000,4159970712,528328196,560501092],["M118",8438880582,7172047899,493752376,773080306],
  ["M124",10539279939,8904143939,1033155800,601980200],["M127",8195619086,7304571804,573377393,317669889],
  ["M217",3802350812,3433232866,235299562,133818384],["M227",4861492448,4342787103,298344394,220360951],
  ["M238",17215992944,13778880348,1505501619,1931610978],["M255",1940800000,1822253085,64414728,54132187],
  ["M264",2355638871,2156953624,131385079,67300167],
]
const storeTargets:StoreTarget[]=targets.map(([storeCode,total,device,accessories,vas])=>({period:"2026-08",storeCode,total,device,accessories,vas}))

const sale=(storeCode:string,date:string,employeeNumber:string,staffName:string,lob:SaleRow["lob"],type:string,article:string,description:string,qty:number,amount:number,transactionNo:string):SaleRow=>({storeCode,date,employeeNumber,staffName,lob,type,article,description,qty,amount,transactionNo})
const sales:SaleRow[]=[
  sale("M117","2026-08-01","24009055","Gilang Yabi Bakar Hakim","Apple Watch","Apple Watch S11","APPMEQW4ID/A","APPLE WATCH 11 42 SG AL BK SB",1,6149000,"100057786"),
  sale("M117","2026-08-01","24009055","Gilang Yabi Bakar Hakim","iPhone","iPhone 17 Pro Max","APPMFYM4ID/A","IPHONE 17 PRO MAX 256GB SILVER",1,26499000,"100057787"),
  sale("M117","2026-08-01","24009055","Gilang Yabi Bakar Hakim","VAS","Qoala","KLAGOLD(24-10)","PROTEKSI GOLD 24-10",1,700000,"100057786"),
  sale("M117","2026-08-01","24004809","Randa Dwi Saputra","iPhone","iPhone 17 Pro","APPMG8J4ID/A","IPHONE 17 PRO 256GB DEEP BLUE",1,24499000,"100057797"),
  sale("M117","2026-08-02","24004809","Randa Dwi Saputra","Accessories","Headphone","APPMXP93ID/A","AIRPODS 4 ACTIVE NOISE CANCELLATION",1,2949000,"100057790"),
  sale("M238","2026-08-01","24009050","Asri Annisa","iPhone","iPhone 17","APPMG6J4ID/A","IPHONE 17 256GB BLACK",1,17999000,"238001"),
  sale("M238","2026-08-01","24009050","Asri Annisa","Accessories","Charger","APPMD3J4ZA/A","20W USB-C POWER ADAPTER",1,499000,"238001"),
  sale("M238","2026-08-02","22016004","Rusli Siregar","Mac","MacBook Neo","APPMHFJ4ID/A","MBN 13 BLS 8GB 512GB",1,15499000,"238002"),
  sale("M238","2026-08-02","22016004","Rusli Siregar","VAS","Telkomsel","TSLHALOIPH250","HALO IPHONE 250",1,2775000,"238002"),
  sale("M238","2026-08-03","25021585","Andhea Fitri","iPad","iPad Pro","APPMDYJ4PA/A","IPAD PRO 13-INCH M5 WI-FI 256",1,32499000,"238003"),
  sale("M238","2026-08-03","26036994","Muhammad Farabi Raharja Hakim","Apple Watch","Apple Watch S11","APPMEU04ID/A","APPLE WATCH 11 42 RG AL LB SB",1,6149000,"238004"),
  sale("M238","2026-08-04","26027910","Aprilia Nur Rachmawati","iPhone","iPhone 15","APPMTP03ID/A","IPHONE 15 128GB BLACK",1,12499000,"238005"),
  sale("M238","2026-08-04","26027910","Aprilia Nur Rachmawati","Accessories","Screen Protector","KOATGF-IP17PM","TEMPERED GLASS IPHONE",1,599000,"238005"),
  sale("M227","2026-08-01","25012917","Muhamad Aqmal","iPhone","iPhone 17 Pro","APPMG8G4ID/A","IPHONE 17 PRO 256GB SILVER",1,24499000,"227001"),
  sale("M264","2026-08-01","25001145","Desvina Mardiana Putri","Apple Watch","Apple Watch S11","APPMEU04ID/A","APPLE WATCH 11 42 RG AL",1,6149000,"264001"),
]

const stock:StockRow[]=[
  {storeCode:"M238",article:"APPMG8G4ID/A",description:"IPHONE 17 PRO 256GB SILVER",lob:"iPhone",type:"iPhone 17 Pro",qty:4},
  {storeCode:"M238",article:"APPMDYJ4PA/A",description:"IPAD PRO 13-INCH M5 WI-FI 256",lob:"iPad",type:"iPad Pro",qty:2},
  {storeCode:"M238",article:"APPMEU04ID/A",description:"APPLE WATCH 11 42 RG AL LB SB",lob:"Apple Watch",type:"Apple Watch S11",qty:3},
  {storeCode:"M238",article:"APPMHFJ4ID/A",description:"MBN 13 BLS 8GB 512GB",lob:"Mac",type:"MacBook Neo",qty:1},
  {storeCode:"M238",article:"APPMXP93ID/A",description:"AIRPODS 4 ACTIVE NOISE CANCELLATION",lob:"Accessories",type:"Headphone",qty:5},
  {storeCode:"M117",article:"APPMG8G4ID/A",description:"IPHONE 17 PRO 256GB SILVER",lob:"iPhone",type:"iPhone 17 Pro",qty:3},
  {storeCode:"M117",article:"APPMXP93ID/A",description:"AIRPODS 4 ACTIVE NOISE CANCELLATION",lob:"Accessories",type:"Headphone",qty:6},
]

const staffTargets=[
  ["M117","24009055","Gilang Yabi Bakar Hakim","Sales Assistant",.12],["M117","24004809","Randa Dwi Saputra","Cashier",.09],
  ["M238","24009050","Asri Annisa","Sales Assistant",.11],["M238","22016004","Rusli Siregar","Sales Assistant",.11],
  ["M238","25021585","Andhea Fitri","Sales Assistant",.11],["M238","26027910","Aprilia Nur Rachmawati","Sales Assistant",.11],
  ["M238","26036994","Muhammad Farabi Raharja Hakim","Sales Assistant",.11],
].map(([storeCode,employeeNumber,staffName,position,share])=>({storeCode:String(storeCode),employeeNumber:String(employeeNumber),staffName:String(staffName),position:String(position),share:Number(share)}))

export const demoPayload:DashboardPayload={mode:"demo",generatedAt:new Date().toISOString(),stores,sales,stock,storeTargets,staffTargets}
