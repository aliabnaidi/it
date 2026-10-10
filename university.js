(()=>{
const events=[{"title": "السحب والإضافة", "start": "2026-10-04", "end": "2026-10-08", "category": "registration"}, {"title": "بدء التدريس في الفصل", "start": "2026-10-10", "end": "2026-10-10", "category": "study"}, {"title": "آخر موعد لتقديم غير مكتمل لمواد الفصل الصيفي", "start": "2026-11-05", "end": "2026-11-05", "category": "registration"}, {"title": "امتحان الكفاية المعرفية لطلبة الدكتوراه — الجلسة الأولى", "start": "2026-11-17", "end": "2026-11-17", "category": "exam"}, {"title": "امتحان الكفاية المعرفية لطلبة الدكتوراه — الجلسة الثانية", "start": "2026-11-22", "end": "2026-11-22", "category": "exam"}, {"title": "فترة امتحانات منتصف الفصل", "start": "2026-11-29", "end": "2026-12-14", "category": "exam"}, {"title": "الامتحان الشامل لطلبة الماجستير — الجلسة الأولى", "start": "2026-12-06", "end": "2026-12-06", "category": "exam"}, {"title": "الامتحان الشامل لطلبة الماجستير — الجلسة الثانية", "start": "2026-12-09", "end": "2026-12-09", "category": "exam"}, {"title": "فترة التسجيل للفصل الثاني", "start": "2026-12-27", "end": "2026-12-31", "category": "registration"}, {"title": "رأس السنة الميلادية", "start": "2027-01-01", "end": "2027-01-01", "category": "holiday"}, {"title": "فترة التقدم للانتقال من تخصص لآخر", "start": "2027-01-10", "end": "2027-01-14", "category": "registration"}, {"title": "انتهاء فترة الانسحاب", "start": "2027-01-12", "end": "2027-01-12", "category": "registration"}, {"title": "آخر يوم تدريس في الفصل الأول", "start": "2027-01-14", "end": "2027-01-14", "category": "study"}, {"title": "ذكرى الإسراء والمعراج «تقديرًا»", "start": "2027-01-16", "end": "2027-01-16", "category": "holiday"}, {"title": "فترة امتحانات نهاية الفصل", "start": "2027-01-16", "end": "2027-01-28", "category": "exam"}];
const el=id=>document.getElementById(id), labels={registration:'التسجيل والإجراءات',study:'التدريس',exam:'الامتحانات',holiday:'المناسبات'};
const months=['2026-10','2026-11','2026-12','2027-01'];
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Amman',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let month=Math.max(0,months.indexOf(today.slice(0,7))), selected=null;
const date=s=>new Date(s+'T12:00:00Z');
const fmt=s=>new Intl.DateTimeFormat('ar-JO',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date(s));
const iso=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const filtered=()=>events.filter(e=>el('calendarFilter').value==='all'||e.category===el('calendarFilter').value);
function render(){
 const [y,m]=months[month].split('-').map(Number), count=new Date(Date.UTC(y,m,0)).getUTCDate();
 el('calendarMonth').textContent=new Intl.DateTimeFormat('ar-JO',{month:'long',year:'numeric',timeZone:'UTC'}).format(date(months[month]+'-01'));
 el('previousMonth').disabled=month===0;el('nextMonth').disabled=month===3;
 const list=filtered(),first=months[month]+'-01',last=months[month]+'-'+count;
 el('calendarDays').innerHTML='<span class="calendar-gap" aria-hidden="true"></span>'.repeat(date(first).getUTCDay())+Array.from({length:count},(_,i)=>{
  const s=iso(y,m-1,i+1),matches=list.filter(e=>e.start<=s&&e.end>=s);
  return `<button class="calendar-day ${matches.length?'has-event':''} ${s===today?'is-today':''}" data-date="${s}" aria-pressed="${s===selected}" aria-label="${fmt(s)}، ${matches.length} موعد${s===today?'، اليوم':''}"><span>${i+1}</span><span class="day-dots" aria-hidden="true">${[...new Set(matches.map(e=>e.category))].map(c=>`<i class="${c}"></i>`).join('')}</span></button>`;
 }).join('');
 const visible=list.filter(e=>e.start<=(selected||last)&&e.end>=(selected||first));
 el('calendarStatus').textContent=(selected?fmt(selected):'مواعيد الشهر')+' · '+visible.length+' موعد';
 el('clearCalendarDay').hidden=!selected;
 el('calendarEvents').innerHTML=visible.length?visible.map(e=>`<article class="calendar-event ${e.category}"><span class="event-label">${labels[e.category]}</span><h4>${e.title}</h4><p><time datetime="${e.start}">${fmt(e.start)}</time>${e.end!==e.start?` — <time datetime="${e.end}">${fmt(e.end)}</time>`:''}</p></article>`).join(''):'<p class="empty">لا توجد مواعيد لهذا الاختيار.</p>';
}
el('previousMonth').onclick=()=>{if(month>0){month--;selected=null;render()}};
el('nextMonth').onclick=()=>{if(month<3){month++;selected=null;render()}};
el('calendarFilter').onchange=()=>{selected=null;render()};
el('clearCalendarDay').onclick=()=>{selected=null;render()};
el('calendarDays').onclick=e=>{const b=e.target.closest('[data-date]');if(b){selected=selected===b.dataset.date?null:b.dataset.date;render();el('calendarDays').querySelector(`[data-date="${b.dataset.date}"]`).focus()}};
el('downloadCalendar').onclick=()=>{
 const escape=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sanafer IT//Academic Calendar//AR','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:الفصل الأول 2026-2027'];
 events.forEach((e,i)=>{const end=date(e.end);end.setUTCDate(end.getUTCDate()+1);lines.push('BEGIN:VEVENT',`UID:sanafer-2026-${i}@sanafer-it`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;VALUE=DATE:${e.start.replace(/-/g,'')}`,`DTEND;VALUE=DATE:${end.toISOString().slice(0,10).replace(/-/g,'')}`,`SUMMARY:${escape(e.title)}`,'END:VEVENT')});lines.push('END:VCALENDAR');
 // RFC 5545: fold by UTF-8 octets without splitting an Arabic character.
 const folded=lines.map(line=>{let result='',part='',size=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(size+n>75){result+=part+'\r\n';part=' ';size=1}part+=c;size+=n}return result+part}).join('\r\n')+'\r\n';
 const url=URL.createObjectURL(new Blob([folded],{type:'text/calendar;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='sanafer-calendar-2026-2027.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};render();

})();