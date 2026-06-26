import json
data=json.load(open('exchanges.json'))
DATA=json.dumps(data,separators=(',',':'))

html = r'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Amapola — 3rd Party Exchange Tracker</title>
<style>
:root{--bg:#0f1724;--panel:#fff;--ink:#1f2937;--mut:#6b7280;--line:#e5e7eb;
--brand:#0b4f8a;--brand2:#1769aa;--open:#b45309;--openbg:#fef3c7;--closed:#15803d;--closedbg:#dcfce7;
--due:#b91c1c;--duebg:#fee2e2;--noz:#7c3aed;--nozbg:#ede9fe;}
*{box-sizing:border-box}
body{margin:0;font-family:'Segoe UI',system-ui,Arial,sans-serif;background:#eef2f6;color:var(--ink);font-size:14px}
header{background:linear-gradient(120deg,#0b4f8a,#1769aa);color:#fff;padding:18px 26px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
header .logo{width:42px;height:42px;border-radius:9px;background:#fff;color:#0b4f8a;display:grid;place-items:center;font-weight:800;font-size:20px}
header h1{font-size:19px;margin:0;font-weight:700}
header .sub{font-size:12.5px;opacity:.85;margin-top:2px}
.cfg{margin-left:auto;display:flex;align-items:center;gap:8px;font-size:12px}
.cfg input{padding:6px 9px;border-radius:6px;border:none;font-size:12px;width:200px}
.wrap{max-width:1320px;margin:0 auto;padding:18px}
.kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px}
.kpi{background:#fff;border-radius:11px;padding:14px 16px;box-shadow:0 1px 3px rgba(0,0,0,.07);border-left:4px solid var(--brand)}
.kpi .n{font-size:26px;font-weight:800;line-height:1}
.kpi .l{font-size:11.5px;color:var(--mut);margin-top:5px;text-transform:uppercase;letter-spacing:.4px}
.kpi.due{border-color:var(--due)} .kpi.open{border-color:var(--open)} .kpi.closed{border-color:var(--closed)} .kpi.noz{border-color:var(--noz)}
.bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.tabs{display:flex;gap:6px;background:#fff;padding:5px;border-radius:9px;box-shadow:0 1px 3px rgba(0,0,0,.07)}
.tab{padding:7px 14px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;color:var(--mut);border:none;background:none}
.tab.on{background:var(--brand);color:#fff}
.bar input[type=text],.bar select{padding:8px 11px;border:1px solid var(--line);border-radius:8px;font-size:13px;background:#fff}
.bar input[type=text]{flex:1;min-width:180px}
.count{margin-left:auto;color:var(--mut);font-size:12.5px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:11px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.07)}
th{background:#f1f5f9;text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:#475569;border-bottom:1px solid var(--line)}
td{padding:10px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px}
tr:hover td{background:#f8fafc;cursor:pointer}
.badge{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
.b-open{background:var(--openbg);color:var(--open)} .b-closed{background:var(--closedbg);color:var(--closed)}
.b-due{background:var(--duebg);color:var(--due)} .b-noz{background:var(--nozbg);color:var(--noz)}
.mono{font-family:'Consolas',monospace;font-size:12.5px}
.dim{color:var(--mut)}
.unit{line-height:1.5}
.unit b{font-weight:700}
.modal{position:fixed;inset:0;background:rgba(15,23,36,.55);display:none;align-items:flex-start;justify-content:center;padding:30px 16px;overflow:auto;z-index:50}
.modal.on{display:flex}
.card{background:#fff;border-radius:14px;max-width:760px;width:100%;padding:0;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.card .hd{background:linear-gradient(120deg,#0b4f8a,#1769aa);color:#fff;padding:16px 22px;display:flex;align-items:center;gap:12px}
.card .hd h2{margin:0;font-size:17px} .card .hd .x{margin-left:auto;cursor:pointer;font-size:22px;opacity:.9}
.card .bd{padding:20px 22px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fld{margin-bottom:11px}
.fld .k{font-size:10.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--mut);margin-bottom:3px}
.fld .v{font-weight:600}
.sec{margin:16px 0 8px;font-size:12px;font-weight:800;color:var(--brand);text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #e2e8f0;padding-bottom:5px}
textarea{width:100%;border:1px solid var(--line);border-radius:8px;padding:9px;font-family:inherit;font-size:13px;min-height:64px;resize:vertical}
.btn{background:var(--brand);color:#fff;border:none;padding:10px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px}
.btn.gray{background:#e2e8f0;color:#334155}
.btnrow{display:flex;gap:10px;margin-top:14px}
.note{background:#f8fafc;border:1px dashed var(--line);border-radius:8px;padding:9px 11px;font-size:12px;color:var(--mut);margin-bottom:12px}
@media(max-width:900px){.kpis{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}.hidem{display:none}}
</style></head><body>
<header>
 <div class="logo">A</div>
 <div><h1>3rd Party Exchange &amp; Sales Tracker</h1><div class="sub">Amapola · Fokker 50 aircraft parts · outright &amp; exchange sales</div></div>
 <div class="cfg">CC colleague: <input id="cc" type="text" placeholder="colleague@amapola.nu" value="colleague@amapola.nu"></div>
</header>
<div class="wrap">
 <div class="note">Working prototype loaded with your real 114 exchange records (cleaned from the Access file). This is the visual blueprint for the Power Apps build — comment edits and reminders work in-browser; the production version saves to SharePoint and sends mail automatically. The <b>Send reminder</b> button opens Outlook pre-filled with the customer + CC.</div>
 <div class="kpis" id="kpis"></div>
 <div class="bar">
  <div class="tabs" id="tabs">
   <button class="tab on" data-f="all">All</button>
   <button class="tab" data-f="due">Due</button>
   <button class="tab" data-f="open">Open</button>
   <button class="tab" data-f="closed">Closed</button>
   <button class="tab" data-f="noz">Nozzle claims</button>
  </div>
  <input type="text" id="q" placeholder="Search P/N, S/N, customer, RO, SO…">
  <select id="cust"><option value="">All customers</option></select>
  <div class="count" id="count"></div>
 </div>
 <table><thead><tr>
  <th>Status</th><th>Customer</th><th>Sold to customer</th><th class="hidem">Core received</th>
  <th>Exchange</th><th class="hidem">RO / Shop</th><th>Sales $</th><th class="hidem">Quote $</th><th>Noz</th>
 </tr></thead><tbody id="rows"></tbody></table>
</div>

<div class="modal" id="modal"><div class="card">
 <div class="hd"><h2 id="mTitle"></h2><span class="x" onclick="closeM()">&times;</span></div>
 <div class="bd" id="mBody"></div>
</div></div>

<script>
const DATA = __DATA__;
let filter='all', q='', custF='';
const $=s=>document.querySelector(s);
const money=(a,c)=> a==null?'<span class="dim">—</span>':(c||'USD')+' '+Number(a).toLocaleString();
const esc=s=>(s||'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));

function statusBadge(r){
 if(r.OrderStatus==='Closed') return '<span class="badge b-closed">● Closed</span>';
 if(r.Due) return '<span class="badge b-due">▲ Due</span>';
 return '<span class="badge b-open">○ Open</span>';
}
function passes(r){
 if(filter==='open'&&r.OrderStatus!=='Open')return false;
 if(filter==='closed'&&r.OrderStatus!=='Closed')return false;
 if(filter==='due'&&!r.Due)return false;
 if(filter==='noz'&&!r.FailedNozzles)return false;
 if(custF&&r.Customer!==custF)return false;
 if(q){const b=(r.Customer+' '+r.SoldPN+' '+r.SoldSN+' '+r.CorePN+' '+r.CoreSN+' '+r.RONumber+' '+r.SalesOrderNo).toUpperCase();
   if(!b.includes(q.toUpperCase()))return false;}
 return true;
}
function renderKPIs(){
 const open=DATA.filter(r=>r.OrderStatus==='Open').length;
 const closed=DATA.filter(r=>r.OrderStatus==='Closed').length;
 const due=DATA.filter(r=>r.Due).length;
 const noz=DATA.reduce((s,r)=>s+r.FailedNozzles,0);
 const sales=DATA.filter(r=>r.SalesPrice).reduce((s,r)=>s+r.SalesPrice,0);
 $('#kpis').innerHTML=[
  ['open',open,'Open orders'],['closed',closed,'Closed orders'],
  ['due',due,'Customers due (core owed)'],['noz',noz,'Failed nozzles to claim'],
  ['',('USD '+sales.toLocaleString()),'Sales value (parsed)']
 ].map(([c,n,l])=>`<div class="kpi ${c}"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
}
function render(){
 const list=DATA.filter(passes);
 $('#count').textContent=list.length+' of '+DATA.length+' records';
 $('#rows').innerHTML=list.map(r=>`<tr onclick="openM(${r.ID})">
  <td>${statusBadge(r)}</td>
  <td><b>${esc(r.Customer)||'<span class=dim>—</span>'}</b><div class="dim" style="font-size:11px">${esc(r.Date)}</div></td>
  <td class="unit"><span class="mono">${esc(r.SoldPN)||'—'}</span>${r.SoldSN?' · <span class="mono">'+esc(r.SoldSN)+'</span>':''}${r.SalesOrderNo?'<div class="dim" style="font-size:11px">'+esc(r.SalesOrderNo)+'</div>':''}</td>
  <td class="unit hidem"><span class="mono">${esc(r.CorePN)||'—'}</span>${r.CoreSN?' · <span class="mono">'+esc(r.CoreSN)+'</span>':''}</td>
  <td>${esc(r.ExchangeStatus)}</td>
  <td class="hidem"><span class="mono">${esc(r.RONumber)||'—'}</span>${r.RepairShop?'<div class="dim" style="font-size:11px">'+esc(r.RepairShop)+'</div>':''}</td>
  <td>${money(r.SalesPrice,r.SalesCurrency)}</td>
  <td class="hidem">${money(r.RepairQuotePrice,r.RepairQuoteCurrency)}</td>
  <td>${r.FailedNozzles?'<span class="badge b-noz">'+r.FailedNozzles+'</span>':'<span class="dim">—</span>'}</td>
 </tr>`).join('') || '<tr><td colspan=9 class=dim style="padding:30px;text-align:center">No matching records</td></tr>';
}
function fld(k,v){return `<div class="fld"><div class="k">${k}</div><div class="v">${v||'<span class=dim>—</span>'}</div></div>`}
function openM(id){
 const r=DATA.find(x=>x.ID===id);
 $('#mTitle').innerHTML=esc(r.Customer)+' &nbsp; '+statusBadge(r);
 $('#mBody').innerHTML=`
  <div class="sec">What we sold to the customer</div>
  <div class="grid2">${fld('Part No (P/N)','<span class=mono>'+esc(r.SoldPN)+'</span>')}${fld('Serial No (S/N)','<span class=mono>'+esc(r.SoldSN)+'</span>')}
   ${fld('Sales Order','<span class=mono>'+esc(r.SalesOrderNo)+'</span>')}${fld('Sales Price',money(r.SalesPrice,r.SalesCurrency)+(r.SalesPriceNote&&r.SalesPrice==null?' <span class=dim>('+esc(r.SalesPriceNote)+')</span>':''))}</div>
  <div class="sec">Core we expect / received back</div>
  <div class="grid2">${fld('Core Part No','<span class=mono>'+esc(r.CorePN)+'</span>')}${fld('Core Serial No','<span class=mono>'+esc(r.CoreSN)+'</span>')}
   ${fld('Exchange status',esc(r.ExchangeStatus))}${fld('Ownership',esc(r.OwnershipChanged))}</div>
  <div class="sec">Repair</div>
  <div class="grid2">${fld('Repair Order (RO)','<span class=mono>'+esc(r.RONumber)+'</span>')}${fld('Repair Shop',esc(r.RepairShop))}
   ${fld('Assy status',esc(r.AssyStatus))}${fld('Repair quote',money(r.RepairQuotePrice,r.RepairQuoteCurrency)+(r.RepairQuoteNote&&r.RepairQuotePrice==null?' <span class=dim>('+esc(r.RepairQuoteNote)+')</span>':''))}
   ${fld('Failed nozzles to charge', r.FailedNozzles?('<span class="badge b-noz">'+r.FailedNozzles+' nozzle(s)</span>'):'—')}</div>
  <div class="sec">Comment</div>
  <textarea id="cmt">${esc(r.Comment)}</textarea>
  <div class="btnrow">
   <button class="btn" onclick="remind(${r.ID})">✉ Send reminder to customer</button>
   <button class="btn gray" onclick="saveC(${r.ID})">Save comment</button>
   <button class="btn gray" onclick="closeM()">Close</button>
  </div>`;
 $('#modal').classList.add('on');
}
function closeM(){$('#modal').classList.remove('on')}
function saveC(id){DATA.find(x=>x.ID===id).Comment=$('#cmt').value; closeM(); render();}
function remind(id){
 const r=DATA.find(x=>x.ID===id);
 const cc=$('#cc').value.trim();
 const sub=`Reminder: Exchange core due — ${r.SoldPN} (SO ${r.SalesOrderNo||'-'})`;
 const body=`Dear ${r.Customer},%0D%0A%0D%0AThis is a reminder regarding the exchange order below.%0D%0A%0D%0AUnit we supplied:%0D%0A  Part No: ${r.SoldPN}%0D%0A  Serial No: ${r.SoldSN}%0D%0A  Sales Order: ${r.SalesOrderNo}%0D%0A%0D%0AWe are still awaiting your exchange core unit (P/N ${r.CorePN||r.SoldPN}). Kindly advise the dispatch/tracking details at your earliest convenience.%0D%0A%0D%0ABest regards,%0D%0AAmapola — 3rd Party Sales`;
 location.href=`mailto:?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(sub)}&body=${body}`;
}
// init
renderKPIs();
[...new Set(DATA.map(r=>r.Customer).filter(Boolean))].sort().forEach(c=>{
 const o=document.createElement('option');o.value=o.textContent=c;$('#cust').appendChild(o);});
$('#tabs').onclick=e=>{if(e.target.dataset.f){[...document.querySelectorAll('.tab')].forEach(t=>t.classList.remove('on'));e.target.classList.add('on');filter=e.target.dataset.f;render();}};
$('#q').oninput=e=>{q=e.target.value;render();};
$('#cust').onchange=e=>{custF=e.target.value;render();};
$('#modal').onclick=e=>{if(e.target.id==='modal')closeM();};
render();
</script></body></html>'''

html=html.replace('__DATA__',DATA)
open('Exchange_Tracker_Prototype.html','w').write(html)
print("written, bytes:",len(html))
