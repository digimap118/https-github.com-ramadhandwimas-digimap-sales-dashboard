export type Lob = "iPhone" | "iPad" | "Apple Watch" | "Mac" | "Accessories" | "VAS" | "Lainnya"
export type Store = { code: string; name: string }
export type SaleRow = { storeCode:string; date:string; employeeNumber:string; staffName:string; position?:string; lob:Lob; type:string; article:string; description:string; qty:number; amount:number; transactionNo:string; vasType?:"Telkomsel"|"XL"|"Indosat"|"Qoala" }
export type StockRow = { storeCode:string; article:string; description:string; lob:Lob; type:string; qty:number }
export type StoreTarget = { period:string; storeCode:string; total:number; device:number; accessories:number; vas:number }
export type StaffTarget = { storeCode:string; employeeNumber:string; staffName:string; position:string; share:number }
export type DashboardPayload = { mode:"demo"|"live"; generatedAt:string; stores:Store[]; sales:SaleRow[]; stock:StockRow[]; storeTargets:StoreTarget[]; staffTargets:StaffTarget[] }
