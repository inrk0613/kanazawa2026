const KEY='kanazawa-2026-journey-v2';
const INITIAL={day:0,weatherMode:'clear',teaPlan:'try21',jadeSlot:'12:30',done:{},tasks:{},memo:''};
let state={...INITIAL};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object'){state={...INITIAL,...saved,done:saved.done||{},tasks:saved.tasks||{}};}}catch{}
if(![0,1,2].includes(state.day))state.day=0;
if(!['clear','rain'].includes(state.weatherMode))state.weatherMode='clear';
if(!['try21','move22','done21'].includes(state.teaPlan))state.teaPlan='try21';
if(!['12:30','12:45','13:00'].includes(state.jadeSlot))state.jadeSlot='12:30';
const $=q=>document.querySelector(q);
const $$=q=>[...document.querySelectorAll(q)];
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
const when=(id,time,title,description,{end='',category='観光',kind='normal',address='',url='',tel='',alert='',transport='',note=''}={})=>({id,time,end,title,description,category,kind,address,url,tel,alert,transport,note});
const urls={
 hotel:'https://www.daiwaroynet.jp/kanazawa-ekinishi/',
 jade:'https://www.hotpepper.jp/strJ004660770/',
 issho:'https://issho.kagaboucha.com/',
 pool:'https://www.kanazawa21.jp/data_list.php?d=1&g=120',
 museum:'https://www.kanazawa21.jp/',
 myoryuji:'https://www.myouryuji.or.jp/',
 market:'https://ohmicho-ichiba.com/',
 marketaya:'https://noukabanzai.jp/ichibaya/menu.html',
 library:'https://www.library.pref.ishikawa.lg.jp/',
 light:'https://kenrokuen.or.jp/events/lightup-2609/',
 kenroku:'https://kenrokuen.or.jp/',
 benibotan:'https://colorfulcompany.jp/kanazawa/venues/14334',
 kanazawaMuseum:'https://www.ishibi.pref.ishikawa.jp/',
 forecast:'https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=170000'
};
const destinations={
 jade:'肉匠Jade金澤 石川県金沢市此花町3-3',
 issho:'一笑 石川県金沢市東山1丁目26-13',
 hotel:'ダイワロイネットホテル金沢駅西口 石川県金沢市広岡1丁目12-17',
 museum:'金沢21世紀美術館 石川県金沢市広坂1-2-1',
 ryo:'金沢cuisine 良 石川県金沢市堀川町8-6',
 myoryuji:'妙立寺 石川県金沢市野町1-2-12',
 omicho:'近江町市場 石川県金沢市上近江町50',
 nishi:'にし茶屋街 石川県金沢市野町2丁目',
 higashi:'ひがし茶屋街 石川県金沢市東山1丁目',
 art:'石川県立美術館 石川県金沢市出羽町2-1',
 light:'兼六園 真弓坂口 石川県金沢市広坂1丁目',
 hasuya:'はす家 本店 石川県金沢市木倉町1-10',
 kenroku:'兼六園 石川県金沢市兼六町1-20',
 kenjotei:'見城亭 石川県金沢市兼六町1-19',
 castle:'金沢城公園 石川県金沢市丸の内1-1',
 benibotan:'紅牡丹 石川県金沢市昭和町14-11',
 library:'石川県立図書館 石川県金沢市小立野2-43-1',
 station:'金沢駅 石川県金沢市木ノ新保町1-1'
};
const tasks=[
 {id:'jade',name:'Jadeの予約を確定',sub:'21日 '+state.jadeSlot+'／2名。空席表示と予約確定は別。',urgent:true,action:'予約ページ',actionUrl:urls.jade},
 {id:'myoryuji',name:'妙立寺へ電話予約',sub:'21日朝8:30以降／22日10:00頃の回を希望',urgent:true,action:'電話する',actionUrl:'tel:0762410888'},
 {id:'pool',name:'プール地下部の順番待ち',sub:'21日9:00開始／予約後も呼出し確認',urgent:true,action:'公式受付',actionUrl:urls.pool},
 {id:'ticket',name:'21世紀美術館のチケット',sub:'プール地下部は展覧会チケットが必要',urgent:false,action:'美術館公式',actionUrl:urls.museum},
 {id:'benibotan',name:'紅牡丹の祝日営業を最終確認',sub:'23日（月・祝）／通常は祝日営業・翌火曜休',urgent:false,action:'店舗情報',actionUrl:urls.benibotan},
 {id:'hasuya',name:'はす家ののどぐろ・席環境を確認',sub:'本店 木倉町1-10／19:00予約済み',urgent:false,action:'電話する',actionUrl:'tel:0762553848'}
];
function mapUrl(query,mode='walking'){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(query)+'&travelmode='+mode;}
function mapSearch(query){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);}
function createPlans(){
 const slot=state.jadeSlot;
 const jadeEnd=slot==='12:30'?'13:30':slot==='12:45'?'13:45':'14:00';
 const teaDayOne=state.teaPlan!=='move22';
 const teaCompleted=state.teaPlan==='done21';
 const jadeWarning='予約未確定。'+(slot==='12:30'?'駅到着から38分。ホテルへの荷物預けが長引く場合は、店への到着を優先。':'一笑の時間は短くなります。')+' 能登牛を注文する際は対象メニューを確認。';
 const first=[
 when('outbound','08:09','金沢へ、出発。','海浜幕張08:09発 → 東京09:20発 → 金沢11:52着。',{end:'11:52',category:'移動',kind:'fixed',address:destinations.station,alert:'東京駅では妙立寺への電話（8:30以降）と9:00のプール受付。乗り換え中は安全を優先。'}),
 when('arrive','11:52','金沢到着・荷物の判断','駅西口のホテルへ荷物を預ける。時間が押せばJade優先。',{end:'12:25',category:'余白',kind:'flex',address:destinations.hotel,url:urls.hotel,alert:'12:30のJadeを選ぶ場合、ホテルでの待ち時間が長いと遅れます。荷物を預ける順番は現場判断。'}),
 when('jade',slot,'肉匠 Jade 金澤','能登牛ランチ。JA全農いしかわ直営の焼肉店。',{end:jadeEnd,category:'能登牛',kind:state.tasks.jade?'fixed':'pending',address:destinations.jade,url:urls.jade,alert:jadeWarning})
 ];
 if(teaDayOne){first.push(when('issho21',slot==='13:00'?'14:15':'13:50','一笑で、ほうじ茶を。','東山へタクシー移動。席が空いていれば短時間で楽しむ。',{end:'14:30',category:'加賀棒茶',kind:'flex',address:destinations.issho,url:urls.issho,alert:'無理をしないための挑戦枠。Jade退店が'+(slot==='12:30'?'13:30':'13:40')+'を超える・タクシー待ち・満席なら即22日に移す。15:00の美術館を優先。',transport:'Jade → 一笑：タクシー移動が便利'}));}
 first.push(
 when('art21','15:00','21世紀美術館','特別展・スイミングプール。時間指定や呼出しに合わせ調整。',{end:'17:00',category:'アート',kind:'pending',address:destinations.museum,url:urls.museum,alert:'プール地下部は当日9:00から順番待ち。鑑賞には展覧会チケットが必要。呼出しを確認し、予定通り15時に入れるとは限りません。'}),
 when('hotelBreak','17:00','ホテル休憩 ／ 直接移動','美術館の滞在に応じて選択。休憩より18:30の夕食を優先。',{end:'18:10',category:'余白',kind:'flex',address:destinations.hotel,url:urls.hotel,alert:'ホテル往復で移動が増えるため、遅れていれば美術館から夕食へ直接向かう。'}),
 when('ryo','18:30','金沢cuisine 良','予約済み。誕生日の蟹フルコース。',{end:'20:30',category:'蟹ディナー',kind:'fixed',address:destinations.ryo,alert:'予約済み。派手な店内演出は不要。食事をゆっくり楽しむ。'})
 );
 const second=[
 when('myoryuji','10:00','妙立寺（忍者寺）','予約が取れた場合だけ訪問。取れなければ朝は自由時間に。',{end:'10:45',category:'文化',kind:state.tasks.myoryuji?'fixed':'pending',address:destinations.myoryuji,url:urls.myoryuji,tel:'076-241-0888',alert:'電話予約制。10:00の回は希望時刻であり未確定。案内開始の10分前を目安に到着。',transport:'ホテルからタクシー／路線バス'}),
 when('nishi','10:45','にし茶屋街、少しだけ。','妙立寺へ行けた場合に限り短時間散策。市場の時間を優先。',{end:'11:05',category:'街歩き',kind:'flex',address:destinations.nishi,alert:'この枠は削除可。長町・野村家は今回の優先度を下げ、朝を詰め込まない。'}),
 when('omicho','11:35','近江町市場をたっぷり。','ブリ丼・旬の海鮮・市場内の食べ歩き。約2時間を確保。',{end:'13:35',category:'ブリ・市場',kind:'normal',address:destinations.omicho,url:urls.marketaya,alert:'11/22は日曜日。営業店が限られ、ブリの入荷も変動。市場屋 → 潮屋など代替を使う。歩きながらではなく各店の指定場所で飲食。',transport:'にし茶屋街から市場までバス／タクシー移動'}),
 ];
 if(teaCompleted){second.push(when('higashi22','14:00','ひがし茶屋街をゆっくり','一笑を21日に楽しめたら、ここは路地散策と写真に。',{end:'15:15',category:'街歩き',kind:'normal',address:destinations.higashi,alert:'市場を出たら東山へ移動。写真を撮りながら無理なく歩く。'}));}
 else{
 second.push(when('issho22','14:00','一笑・ほうじ茶','初日に間に合わなかったときの本命枠。',{end:'15:00',category:'加賀棒茶',kind:'normal',address:destinations.issho,url:urls.issho,alert:'予約不可の喫茶。待ち時間があれば他の観光を圧縮してここを優先する。'}));
 second.push(when('higashi22','15:00','ひがし茶屋街','一笑周辺の街並みを短く散策。',{end:state.weatherMode==='rain'?'15:10':'15:30',category:'街歩き',kind:'flex',address:destinations.higashi,alert:'一笑の混雑で時間が押したら省略。'}));
 }
 if(state.weatherMode==='rain'){
 second.push(when('library22','15:40','石川県立図書館','雨の日の建築鑑賞。大階段と円形の書架を楽しむ。',{end:'17:20',category:'雨天ルート',kind:'normal',address:destinations.library,url:urls.library,alert:'一笑・ひがし茶屋街からタクシー推奨。日曜は18:00閉館。美術館・ライトアップは省略。'}));
 second.push(when('rest22','17:20','木倉町へ移動・休憩','雨具を整え、はす家へ余裕をもって向かう。',{end:'18:50',category:'余白',kind:'flex',address:destinations.hasuya,alert:'図書館から木倉町へはタクシー／バス移動が便利。'}));
 }else{
 second.push(when('art22','16:15','石川県立美術館','工芸・美術を味わう。短時間でも成立する鑑賞枠。',{end:'17:20',category:'アート',kind:'flex',address:destinations.art,url:urls.kanazawaMuseum,alert:'15時台の東山散策が長引いたら短縮・省略可。最終入館時刻は現地で確認。'}));
 second.push(when('light22','18:00','兼六園ライトアップ','夕方の雨と風が穏やかなら、約20分だけ立ち寄る。',{end:'18:25',category:'天候次第',kind:'flex',address:destinations.light,url:urls.light,alert:'22日開催予定。ただし悪天候・混雑なら迷わず省略。18:25頃に退園し、徒歩で木倉町のはす家へ。19:00の予約を優先。'}));
 }
 second.push(when('hasuya','19:00','はす家 本店','木倉町の予約済み夕食。のどぐろと加賀料理を。',{end:'21:00',category:'のどぐろ',kind:'fixed',address:destinations.hasuya,alert:'金沢駅前店ではなく木倉町1-10の本店。のどぐろ姿焼きの入荷・席の喫煙条件は事前確認推奨。'}));
 const third=[
 when('checkout','09:00','チェックアウト・荷物預け','ホテルにスーツケースを預けてから観光へ。',{end:'09:15',category:'移動',kind:'normal',address:destinations.hotel,url:urls.hotel,alert:'荷物預かりはホテルで確認済み。大きな荷物は持ち歩かない。'}),
 when('kenroku','09:30','兼六園の紅葉','朝の自然光で紅葉と雪吊りを楽しむ。',{end:'10:35',category:'紅葉',kind:'normal',address:destinations.kenroku,url:urls.kenroku,alert:'天候や混雑で延長してOK。22日のライトアップに行った場合も日中の景色は別の魅力。'}),
 when('kenjotei','10:40','見城亭で抹茶','庭園を見ながら抹茶・和菓子のひと息。',{end:'11:10',category:'抹茶',kind:'flex',address:destinations.kenjotei,alert:'混雑・営業状況次第。兼六園散策が長引いたら省略してもよい。'}),
 when('castle','11:10','金沢城公園','石垣・門・庭を短く歩いて城下町の景色を堪能。',{end:'11:45',category:'街歩き',kind:'flex',address:destinations.castle,alert:'紅牡丹への移動を考え11:45頃に切り上げる。'}),
 when('benibotan','12:30','紅牡丹・甘えびラーメン','初日から移した昼食。濃厚甘えびラーメン。',{end:'13:25',category:'甘えび',kind:'pending',address:destinations.benibotan,url:urls.benibotan,alert:'月曜定休だが祝日の月曜は営業・翌火曜休みとの掲載。2026年11月23日の臨時変更は未確認。現金を用意。'}),
 ];
 if(state.weatherMode==='rain' && state.done.library22){
 third.push(when('free23','14:00','午後はゆったり自由時間','22日に図書館を楽しめたら、駅周辺や気になる店を無理なく散策。',{end:'16:45',category:'余白',kind:'flex',address:destinations.station,alert:'お土産やカフェなど、ふたりの気分で調整。'}));
 }else{
 third.push(when('library23','14:00','石川県立図書館','建築が見どころ。22日に訪問済みなら省略して自由時間に。',{end:'15:30',category:'建築',kind:'flex',address:destinations.library,url:urls.library,alert:'23日は月曜・祝日なので開館対象（通常18:00まで）。紅牡丹からはバス／タクシーで移動。22日に見学できれば無理に再訪しない。'}));
 }
 third.push(
 when('souvenir','16:00','お土産・最後の街歩き','駅に戻る方向で買い物。夕方までゆっくり。',{end:'17:10',category:'余白',kind:'flex',address:destinations.station,alert:'図書館から駅方面はタクシー／バス利用が便利。'}),
 when('pickup','17:15','ホテルで荷物回収','預けたスーツケースを受け取り、金沢駅へ。',{end:'17:45',category:'移動',kind:'normal',address:destinations.hotel,url:urls.hotel,alert:'新幹線まで約1時間。お土産・駅の混雑を考え余裕を確保。'}),
 when('return','18:44','金沢から、帰路へ。','かがやき582号／東京21:20着。',{end:'21:20',category:'新幹線',kind:'fixed',address:destinations.station,alert:'予約済み。ホーム到着は発車の余裕を持って。'})
 );
 return [first,second,third];
}
const descriptions=[
 {day:'21',week:'SATURDAY',title:'到着と、美食。',desc:'能登牛 → ほうじ茶に挑戦 → 現代アート → 蟹',icon:'☂',pill:'ごちそうの日'},
 {day:'22',week:'SUNDAY',title:'市場と、城下町。',desc:'忍者寺 → 市場2時間 → 東山 → のどぐろ',icon:'☁',pill:'天候で分岐'},
 {day:'23',week:'MONDAY',title:'紅葉と、余白。',desc:'兼六園 → 抹茶 → ラーメン → 図書館',icon:'☀',pill:'9:30から観光'}
];
function renderOverview(){
 $('#dayOverview').innerHTML=descriptions.map((d,i)=>`<button class="overview-day" data-dayselect="${i}"><span class="arrow">↗</span><div><span class="weekday">${d.week}</span><div class="date">${d.day}<small style="font-size:12px;margin-left:4px;color:#8e9487">NOV</small></div></div><div><h3>${d.title}</h3><p>${d.desc}</p><span class="pill">${d.pill}</span></div></button>`).join('');
}
function renderTimeline(){
 $$('.day-tab').forEach(b=>{const selected=Number(b.dataset.day)===state.day;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
 const d=descriptions[state.day];const schedule=createPlans()[state.day];
 const completed=schedule.filter(e=>state.done[e.id]).length;
 $('#planBanner').innerHTML=`<div><span class="eyebrow">DAY 0${state.day+1} · NOVEMBER ${21+state.day}</span><h3>${d.title}</h3><p>${d.desc}</p></div><div class="day-counter">${completed} / ${schedule.length} VISITED</div>`;
 if(state.day===0){
 const note=state.jadeSlot==='13:00'?'13:00枠の場合は、一笑を22日に回すのが安全です。':'一笑は初日チャレンジ。待ち時間が出たら22日に移動。';
 $('#strategyPanel').innerHTML=`<div class="strategy-inner"><span class="strategy-icon">◷</span><div><strong>時間を守るための設定</strong><p>${note}<br>Jadeはまだ「予約確定」ではありません。</p></div></div><div class="booking-switch" role="group" aria-label="Jadeの予定時刻">${['12:30','12:45','13:00'].map(t=>`<button type="button" data-jade-slot="${t}" class="${state.jadeSlot===t?'selected':''}">${t}</button>`).join('')}</div><div class="booking-switch" role="group" aria-label="一笑の訪問予定"><button type="button" data-tea-plan="try21" class="${state.teaPlan==='try21'?'selected':''}">一笑：21日に挑戦</button><button type="button" data-tea-plan="move22" class="${state.teaPlan==='move22'?'selected':''}">一笑：22日に移す</button><button type="button" data-tea-plan="done21" class="${state.teaPlan==='done21'?'selected':''}">21日に訪問済み ✓</button></div>`;
 }else if(state.day===1){
 $('#strategyPanel').innerHTML=`<div class="strategy-inner"><span class="strategy-icon">${state.weatherMode==='rain'?'☂':'☀'}</span><div><strong>${state.weatherMode==='rain'?'雨天ルートを表示中':'通常・小雨ルートを表示中'}</strong><p>${state.weatherMode==='rain'?'県立図書館を中心に。ライトアップと美術館は省略。':'美術館を優先。18時のライトアップは現地の雨・風で判断。'} 19時のはす家は固定。</p></div><button data-switch-weather>${state.weatherMode==='rain'?'通常へ':'雨天へ'} ↗</button></div>`;
 }else{
 $('#strategyPanel').innerHTML=`<div class="strategy-inner"><span class="strategy-icon">✳</span><div><strong>最終日は遅めのスタート</strong><p>朝は9:00にチェックアウト。兼六園は9:30から。図書館は訪問済みなら自由時間へ。</p></div></div>`;
 }
 $('#timeline').innerHTML=schedule.map(ev=>{
 const done=Boolean(state.done[ev.id]); const tag=ev.kind==='fixed'?'予約済み':ev.kind==='pending'?'要確認':ev.kind==='flex'?'調整可':'予定';
 return `<article class="time-event ${ev.kind==='fixed'?'fixed':''} ${done?'completed':''}"><div class="time-col"><strong>${escapeHTML(ev.time)}</strong><small>${escapeHTML(ev.end)}</small></div><div class="event-content"><div class="event-tags"><span class="tag ${ev.kind==='fixed'?'fixed':ev.kind==='pending'?'pending':'flex'}">${tag}</span><span class="tag">${escapeHTML(ev.category)}</span></div><div class="event-title">${escapeHTML(ev.title)}</div><p class="event-desc">${escapeHTML(ev.description)}</p><label class="event-check"><input type="checkbox" data-done="${ev.id}" ${done?'checked':''}><span>${done?'訪問済み':'完了にする'}</span></label></div><button class="event-detail-button" data-detail="${ev.id}" aria-label="${escapeHTML(ev.title)}の詳細">↗</button></article>`;
 }).join('');
 $('#weatherChoiceTip').textContent=state.weatherMode==='rain'?'雨天プランへ切替済み。22日の旅程にも反映されています。':'ライトアップは18:00–18:25に短縮。雨・風・混雑なら中止します。';
 $$('[data-weather-mode]').forEach(b=>{b.classList.toggle('selected',b.dataset.weatherMode===state.weatherMode);b.setAttribute('aria-pressed',String(b.dataset.weatherMode===state.weatherMode));});
}
function renderTasks(){
 $('#essentialsList').innerHTML=tasks.map(t=>`<label class="task ${state.tasks[t.id]?'done':''}"><input type="checkbox" data-task="${t.id}" ${state.tasks[t.id]?'checked':''}><span><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.id==='jade'?`21日 ${state.jadeSlot}／2名。空席表示と予約確定は別。`:t.sub)}</small><a class="task-action" href="${t.actionUrl}" ${t.actionUrl.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${escapeHTML(t.action)} ↗</a></span></label>`).join('');
 $('#essentialCount').textContent=`${tasks.filter(t=>state.tasks[t.id]).length} / ${tasks.length}`;
 const notDone=tasks.filter(t=>!state.tasks[t.id]);
 const head=notDone.filter(t=>t.urgent);
 $('#tickerMessage').textContent=head.length?`要確認：${head.map(t=>t.name.replace('を確定','').replace('へ電話予約','')).join('・')}。予約確定前は仮予定として表示しています。`:notDone.length?`大切な予約と手続きの確認が進んでいます。残り${notDone.length}件を確認しましょう。`:'出発前の確認はすべてチェック済み。素敵な旅になりますように。';
}
let weatherDays=null;let weatherUpdate=null;let weatherError=false;
const dateKeys=['2026-11-21','2026-11-22','2026-11-23'];
function wmoIcon(code){if(code==null)return '—';if(code===0)return '☀';if([1,2,3].includes(code))return '⛅';if([45,48].includes(code))return '≋';if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return '☂';if([71,73,75,77,85,86].includes(code))return '❄';if([95,96,99].includes(code))return '⚡';return '☁';}
function renderWeather(){
 $('#weatherDays').innerHTML=dateKeys.map((date,i)=>{
 const day=weatherDays?.find(x=>x.date===date);
 return `<div class="weather-day"><span class="wd-date">${21+i} ${['SAT','SUN','MON'][i]}</span><span class="weather-glyph">${day?wmoIcon(day.code):['☂','☂','⛅'][i]}</span><strong>${day?`${day.max==null?'—':Math.round(day.max)}°`:'—'}</strong><small>${day?`最低 ${day.min==null?'—':Math.round(day.min)}°`:'予報未取得'}<br>${day&&day.rain!=null?`降水 ${day.rain}%`:''}</small></div>`;
 }).join('');
 $('#weatherFoot').innerHTML=(weatherUpdate?`Open-Meteo予報・取得 ${escapeHTML(weatherUpdate)}。`:(weatherError?'予報を取得できません。':'気象データを取得しています。'))+'<br><a class="text-link" target="_blank" rel="noopener noreferrer" href="'+urls.forecast+'">気象庁の予報で最終確認 ↗</a><br>※夕方の雨や風は当日判断。予報だけで自動確定しません。';
}
async function fetchWeather(){
 const btn=$('#refreshWeather');btn.disabled=true;btn.textContent='…';weatherError=false;
 const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),8500);
 try{
  const api='https://api.open-meteo.com/v1/forecast?latitude=36.5613&longitude=136.6562&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&start_date=2026-11-21&end_date=2026-11-23';
  const res=await fetch(api,{signal:ctl.signal,cache:'no-store'});if(!res.ok)throw Error('Weather request failed');
  const json=await res.json();const daily=json.daily;
  if(!Array.isArray(daily?.time))throw Error('Invalid weather data');
  weatherDays=daily.time.map((date,i)=>({date,code:daily.weather_code?.[i],max:daily.temperature_2m_max?.[i],min:daily.temperature_2m_min?.[i],rain:daily.precipitation_probability_max?.[i]}));
  weatherUpdate=new Intl.DateTimeFormat('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Tokyo'}).format(new Date());
  try{localStorage.setItem(KEY+'-weather',JSON.stringify({days:weatherDays,time:weatherUpdate,at:Date.now()}));}catch{}
 }catch(e){weatherError=true;try{const c=JSON.parse(localStorage.getItem(KEY+'-weather')||'null');if(c?.days?.length){weatherDays=c.days;weatherUpdate=c.time+'（保存済み）';}}catch{}}
 finally{clearTimeout(timer);btn.disabled=false;btn.textContent='↻';renderWeather();}
}
function openDetail(id){
 const found=createPlans().flat().find(e=>e.id===id);if(!found)return;
 $('#detailCategory').textContent=`${found.category} · ${found.time}${found.end?'–'+found.end:''}`;
 $('#detailTitle').textContent=found.title;
 $('#detailMeta').innerHTML=`<div class="detail-meta-row"><span>日付</span>${['11月21日（土）','11月22日（日）','11月23日（月・祝）'][state.day]}</div>`+(found.address?`<div class="detail-meta-row"><span>場所</span>${escapeHTML(found.address)}</div>`:'');
 $('#detailDescription').textContent=found.description+(found.transport?'\n\n'+found.transport:'');
 $('#detailDescription').style.whiteSpace='pre-line';
 $('#detailWarning').textContent=found.alert;
 const actions=[];
 if(found.address)actions.push(`<a class="primary" href="${mapUrl(found.address)}" target="_blank" rel="noopener noreferrer">経路を開く ↗</a>`);
 if(found.url)actions.push(`<a href="${found.url}" target="_blank" rel="noopener noreferrer">公式・参考サイト ↗</a>`);
 if(found.id==='omicho') actions.push(`<a href="${urls.market}" target="_blank" rel="noopener noreferrer">市場全体の案内 ↗</a>`);
 if(found.id==='art21') actions.push(`<a href="${urls.pool}" target="_blank" rel="noopener noreferrer">プール受付 ↗</a>`);
 if(found.tel)actions.push(`<a href="tel:${found.tel}">電話する ${found.tel}</a>`);
 actions.push(`<button id="detailComplete" data-complete="${found.id}">${state.done[found.id]?'完了を取り消す':'訪問済みにする ✓'}</button>`);
 $('#detailActions').innerHTML=actions.join('');
 $('#detailDialog').showModal();
}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>el.classList.remove('show'),3200);}
function setState(patch){state={...state,...patch};persist();render();}
function render(){renderOverview();renderTimeline();renderTasks();renderWeather();$$('.mobile-nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav==='itinerary'&&location.hash==='#itinerary'));}
function eventToICS({title,start,end,location,description}){
 const esc=s=>String(s).replace(/\\/g,'\\\\').replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n');
 return ['BEGIN:VEVENT','UID:'+start+'-'+title.replace(/\W/g,'')+'@kanazawa2026','DTSTAMP:20261120T130000Z','DTSTART;TZID=Asia/Tokyo:'+start,'DTEND;TZID=Asia/Tokyo:'+end,'SUMMARY:'+esc(title),'DESCRIPTION:'+esc(description||''),'LOCATION:'+esc(location||''),'END:VEVENT'].join('\r\n');
}
function downloadICS(){
 const events=[
 {title:'金沢旅行｜往路 新幹線',start:'20261121T092000',end:'20261121T115200',location:'東京駅 → 金沢駅',description:'往路予約済み。海浜幕張08:09発。'},
 {title:'金沢｜金沢cuisine 良 蟹ディナー',start:'20261121T183000',end:'20261121T203000',location:destinations.ryo,description:'2名予約済み・誕生日ディナー。'},
 {title:'金沢｜はす家 本店 夕食',start:'20261122T190000',end:'20261122T210000',location:destinations.hasuya,description:'2名予約済み・木倉町本店。'},
 {title:'金沢旅行｜復路 かがやき582号',start:'20261123T184400',end:'20261123T212000',location:'金沢駅 → 東京駅',description:'復路予約済み。'}
 ];
 if(state.tasks.jade)events.push({title:'金沢｜Jade 能登牛ランチ',start:'20261121T'+state.jadeSlot.replace(':','')+'00',end:'20261121T'+({ '12:30':'133000','12:45':'134500','13:00':'140000'}[state.jadeSlot]),location:destinations.jade,description:'2名予約済みとしてチェックした場合のみ書き出し。'});
 const str='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Kanazawa Journey//JP\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME:金沢誕生日旅行\r\n'+events.map(eventToICS).join('\r\n')+'\r\nEND:VCALENDAR\r\n';
 const file=new Blob([str],{type:'text/calendar;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(file);link.download='kanazawa-trip-2026.ics';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1500);toast('予約済み予定をカレンダー用ファイルに書き出しました');
}
// Single delegated click handler: no inline JS, safe external navigation.
document.addEventListener('click',e=>{
 const day=e.target.closest('[data-day],[data-dayselect]');
 if(day){state.day=Number(day.dataset.day??day.dataset.dayselect);persist();render();if(day.dataset.dayselect!=null)$('#itinerary').scrollIntoView({behavior:'smooth'});return;}
 const weather=e.target.closest('[data-weather-mode]');if(weather){setState({weatherMode:weather.dataset.weatherMode});return;}
 if(e.target.closest('[data-switch-weather]')){setState({weatherMode:state.weatherMode==='rain'?'clear':'rain'});return;}
 const slot=e.target.closest('[data-jade-slot]');if(slot){setState({jadeSlot:slot.dataset.jadeSlot});return;}
 const tea=e.target.closest('[data-tea-plan]');if(tea){setState({teaPlan:tea.dataset.teaPlan});return;}
 const detail=e.target.closest('[data-detail]');if(detail){openDetail(detail.dataset.detail);return;}
 const complete=e.target.closest('[data-complete]');if(complete){state.done[complete.dataset.complete]=!state.done[complete.dataset.complete];if(complete.dataset.complete==='issho21')state.teaPlan=state.done.issho21?'done21':'try21';persist();$('#detailDialog').close();render();return;}
 const map=e.target.closest('[data-map]');if(map){window.open(mapSearch(map.dataset.map),'_blank','noopener,noreferrer');return;}
 const jump=e.target.closest('[data-jump]');if(jump){$('#'+jump.dataset.jump)?.scrollIntoView({behavior:'smooth'});return;}
});
document.addEventListener('change',e=>{
 const target=e.target;
 if(target.matches('[data-done]')){state.done[target.dataset.done]=target.checked;if(target.dataset.done==='issho21')state.teaPlan=target.checked?'done21':'try21';persist();renderTimeline();return;}
 if(target.matches('[data-task]')){state.tasks[target.dataset.task]=target.checked;persist();renderTasks();renderTimeline();return;}
});
$('#travelMemo').value=state.memo;
$('#travelMemo').addEventListener('input',e=>{state.memo=e.target.value;persist();});
$('#resetDay').addEventListener('click',()=>{const ids=createPlans()[state.day].map(v=>v.id);ids.forEach(id=>delete state.done[id]);persist();render();toast('この日の完了状態を戻しました');});
$('#refreshWeather').addEventListener('click',fetchWeather);
$('#downloadIcs').addEventListener('click',downloadICS);
$('#closeDialog').addEventListener('click',()=>$('#detailDialog').close());
$('#detailDialog').addEventListener('click',e=>{if(e.target.id==='detailDialog')$('#detailDialog').close();});
$('#shareButton').addEventListener('click',async()=>{
 const payload={title:'金沢、二人の秋。',text:'11月21〜23日、金沢2泊3日の旅のしおり',url:location.href};
 try{if(navigator.share){await navigator.share(payload);}else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);toast('リンクをコピーしました');}else{toast('公開URLができたら共有できます');}}catch(e){if(e.name!=='AbortError')toast('共有操作を完了できませんでした');}
});
function networkStatus(){const el=$('#networkStatus');el.innerHTML=`<span class="status-dot"></span>${navigator.onLine?' ONLINE':' OFFLINE'}`;document.body.classList.toggle('offline',!navigator.onLine);}
window.addEventListener('online',()=>{networkStatus();fetchWeather();});window.addEventListener('offline',networkStatus);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
window.addEventListener('hashchange',()=>{$$('.mobile-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===location.hash));});
render();networkStatus();fetchWeather();
