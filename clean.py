import csv, re, json
rows=list(csv.DictReader(open('main.csv')))
def blankish(r):
    keys=['Exchange Unit Information','P/n','S/n','Owner','Comment','Repair Quote Price']
    return all(not r[k].strip() for k in keys)
rows=[r for r in rows if not blankish(r)]

CANON={'ADVANTAGE':'Advantage','AMAPOLA':'Amapola','I-FLY':'I-Fly','JETWAYS':'Jetways',
 'TANZANIA':'Tanzania','SKY CAP':'Sky Cap','AEROSUM':'Aerosum','AEROJET':'Aerojet',
 'KUSH':'Kush','ORION':'Orion'}
def norm_cust(s):
    s=(s or '').replace('\xa0',' ').strip()
    if not s: return ''
    key=re.sub(r'\s+',' ',s.upper()).strip()
    if 'SKYWARD' in key or 'SYWARD' in key: return 'Skyward Express'
    if 'BUSYBEE' in key or 'BUSY BEE' in key: return 'BusyBee'
    if 'NEWWORLD' in key: return 'Newworld Choices'
    if 'CC&SON' in key: return 'CC&Sons'
    if key in CANON: return CANON[key]
    for k,v in CANON.items():
        if k in key: return v
    return s.title()
def norm_shop(s):
    s=(s or '').replace('\xa0',' ').strip(); return s.title() if s else ''

def parse_money(s):
    s=(s or '').strip()
    if not s: return (None,'',s)
    cur='USD' if ('$' in s or 'USD' in s.upper()) else ('EUR' if ('€' in s or 'EUR' in s.upper()) else '')
    pats=re.findall(r'\$\s*([0-9][0-9,]*\.?[0-9]*)|([0-9][0-9,]*\.?[0-9]*)\s*\$', s)
    vals=[]
    for a,b in pats:
        n=(a or b).replace(',','')
        try:
            v=float(n)
            if v>=1: vals.append(v)
        except: pass
    uniq=sorted(set(vals))
    amt=uniq[0] if len(uniq)==1 else None
    return (amt, cur if amt is not None else '', s)

def parse_nozzles(*texts):
    blob=' '.join(t or '' for t in texts).upper()
    if 'NOZ' not in blob: return 0
    m=re.search(r'(\d+)\s*(?:EA)?\s*(?:N\b|NOZ)', blob)
    if m:
        v=int(m.group(1)); return v if v<=20 else 1
    return 1 if ('NOZZLE' in blob or 'NOZZEL' in blob) else 0

def exch_status(s):
    s=(s or '').strip(); u=s.upper()
    if u.startswith('RO') and re.search(r'\d',u): return ('RO Assigned', re.sub(r'[^0-9A-Za-z]','',s))
    if 'WAITING FOR RO' in u: return ('Received - awaiting RO','')
    if 'WAITING' in u: return ('Waiting for Exchange Unit','')
    if 'RECEIVED' in u: return ('Exchange Received','')
    return ('Other','')

out=[]
for i,r in enumerate(rows,1):
    estat,ro=exch_status(r['Exchange Unit Information'])
    rqp_amt,rqp_cur,rqp_orig=parse_money(r['Repair Quote Price'])
    inv_amt,inv_cur,inv_orig=parse_money(r['Invoice shared with customer'])
    noz=parse_nozzles(r['Comment'],r['Assy Status'],r['Repair Quote Price'],r['Invoice shared with customer'])
    closed=r['Order Status (marked one are closed)'].strip()=='1'
    out.append({'ID':i,'Date':r['Date'][:8],'Customer':norm_cust(r['Owner']),
      'SoldPN':r['P/n (Sales)'].strip(),'SoldSN':r['S/n (sales)'].strip(),
      'SalesOrderNo':r['Sales order Unit Information'].strip(),
      'SalesPrice':inv_amt,'SalesCurrency':inv_cur,'SalesPriceNote':inv_orig,
      'CorePN':r['P/n'].strip(),'CoreSN':r['S/n'].strip(),
      'ExchangeStatus':estat,'RONumber':ro,'RepairShop':norm_shop(r['Repair Shop']),
      'AssyStatus':r['Assy Status'].strip(),'RepairQuotePrice':rqp_amt,
      'RepairQuoteCurrency':rqp_cur,'RepairQuoteNote':rqp_orig,'FailedNozzles':noz,
      'OwnershipChanged':norm_cust(r['Ownership Changed']) if r['Ownership Changed'].strip() else '',
      'Comment':r['Comment'].strip(),'OrderStatus':'Closed' if closed else 'Open',
      'Due':(not closed) and estat in ('Waiting for Exchange Unit','Received - awaiting RO')})

cols=list(out[0].keys())
with open('Exchanges_clean.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=cols); w.writeheader()
    for o in out: w.writerow({k:('' if o[k] is None else o[k]) for k in cols})
json.dump(out,open('exchanges.json','w'))

from collections import Counter
print("records:",len(out),"| sales-price parsed:",sum(1 for o in out if o['SalesPrice']),
      "| quote parsed:",sum(1 for o in out if o['RepairQuotePrice']))
print("nozzle recs:",[(o['Customer'],o['FailedNozzles']) for o in out if o['FailedNozzles']])
print("check #3/#4 sales:",[(o['ID'],o['SalesPrice'],o['SalesPriceNote'][:20]) for o in out if o['ID'] in (3,4)])
print("check #4 quote:",[(o['ID'],o['RepairQuotePrice'],o['RepairQuoteNote'][:25]) for o in out if o['ID']==4])
