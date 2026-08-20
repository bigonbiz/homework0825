"use client";

import { useMemo, useState } from "react";

type Signal = {
  id: number; name: string; field: string; type: string; score: number; change: number;
  policy: number; market: number; gap: number; urgency: number; stage: string; summary: string;
  evidence: string[]; direction: string; color: string;
};

const signals: Signal[] = [
  { id:1, name:"에이전틱 AI", field:"인공지능", type:"기술+시장", score:89, change:24, policy:91, market:94, gap:76, urgency:93, stage:"집중 관찰", summary:"자율형 AI 에이전트의 산업 적용이 빨라지며 신뢰성·상호운용성 이슈가 부상합니다.", evidence:["정책 문서 언급량 급증", "글로벌 제품 출시 가속", "에이전트 표준 논의 확대"], direction:"신뢰 가능한 에이전틱 AI 핵심기술 및 산업 적용", color:"#2256ff" },
  { id:2, name:"온디바이스 AI 반도체", field:"AI반도체", type:"기술+시장", score:84, change:13, policy:86, market:91, gap:80, urgency:78, stage:"사업 후보", summary:"저전력 추론과 데이터 주권 요구가 AI 반도체·SW 공동최적화 수요를 키우고 있습니다.", evidence:["AI 반도체 정책 연계", "엣지 추론 시장 성장", "경량화 기술격차 존재"], direction:"초저전력 온디바이스 AI 반도체·SW 공동최적화", color:"#26a77a" },
  { id:3, name:"피지컬 AI", field:"피지컬AI", type:"정책+시장", score:92, change:18, policy:96, market:91, gap:84, urgency:95, stage:"사업 후보", summary:"제조·로봇·지역산업 실증 수요가 정책 투자와 동시에 확대되고 있습니다.", evidence:["국가 AI 정책 우선순위 상승", "지역 주도 실증사업 확대", "제조·로봇 민간투자 증가"], direction:"지역 주력산업 연계 피지컬 AI 실증·확산 사업", color:"#8a5cf6" },
  { id:4, name:"양자 네트워크", field:"양자", type:"정책+기술", score:78, change:7, policy:89, market:61, gap:92, urgency:70, stage:"기술 축적", summary:"시장 형성 전 단계이나 국가안보와 기술주권 관점의 장기 축적 필요성이 높습니다.", evidence:["국가전략기술 지정", "선도국 투자 지속", "국내 핵심부품 격차"], direction:"양자 네트워크 핵심부품·검증 인프라 기술축적", color:"#17a6b5" },
  { id:5, name:"AI 네이티브 SW", field:"SW", type:"기술+수요", score:81, change:14, policy:82, market:87, gap:73, urgency:84, stage:"문제 정의", summary:"개발·운영 전주기에 AI가 결합되며 공공·산업 SW 생산성 혁신 요구가 커지고 있습니다.", evidence:["SW 공급망 자동화 수요", "AI 개발도구 확산", "공공 정보화 AX 전환"], direction:"AI 네이티브 SW 개발·검증 플랫폼 기술개발", color:"#497594" },
  { id:6, name:"6G 위성통신", field:"통신/전파위성", type:"기술+정책", score:79, change:8, policy:86, market:66, gap:88, urgency:73, stage:"기술 축적", summary:"지상망·비지상망 통합과 주파수 경쟁이 차세대 통신 기획 이슈로 부상합니다.", evidence:["국제표준 선점 경쟁", "위성·지상망 통합 요구", "핵심장비 기술격차"], direction:"6G·저궤도 위성 연계 통신/전파 핵심기술", color:"#6f7bd8" },
  { id:7, name:"생성형 미디어 콘텐츠", field:"미디어/콘텐츠", type:"시장+사회", score:77, change:16, policy:75, market:89, gap:68, urgency:78, stage:"수요 발굴", summary:"생성형 AI 기반 제작·유통 혁신과 저작권·신뢰성 대응 기술 수요가 동시에 확대됩니다.", evidence:["콘텐츠 제작 자동화 확산", "저작권·출처 검증 이슈", "K-콘텐츠 글로벌 경쟁"], direction:"신뢰 가능한 생성형 미디어 제작·검증 기술개발", color:"#d36b7d" },
  { id:8, name:"AI 보안", field:"정보보안", type:"정책+수요", score:86, change:11, policy:94, market:88, gap:70, urgency:94, stage:"사업 후보", summary:"생성형 AI 확산으로 모델·데이터·에이전트 전주기 보안 수요가 빠르게 커지고 있습니다.", evidence:["AI 기본법 대응 수요", "기업 보안사고 위험 증가", "AI 공급망 검증 필요"], direction:"AI 전주기 안전성 검증 및 보안 대응 기술개발", color:"#e4962c" },
  { id:9, name:"공공 AX 디지털융합", field:"디지털융합", type:"정책+사회", score:75, change:9, policy:88, market:62, gap:67, urgency:82, stage:"수요 발굴", summary:"공공서비스와 산업현장의 디지털 융합 전환이 실증·확산형 R&D 수요로 구체화되고 있습니다.", evidence:["공공서비스 AX 확대", "지역 현안 디지털 전환", "수요처 참여형 실증 필요"], direction:"공공·지역 문제해결형 디지털융합 실증 사업", color:"#2f8f8d" },
];

const fields = ["전체", "인공지능", "AI반도체", "피지컬AI", "양자", "SW", "통신/전파위성", "미디어/콘텐츠", "정보보안", "디지털융합"];
const trendData = [
  { keyword:"피지컬 AI", values:[31,38,42,55,69,82], change:164, color:"#2256ff" },
  { keyword:"에이전틱 AI", values:[18,24,39,53,71,88], change:389, color:"#8a5cf6" },
  { keyword:"AI 반도체", values:[29,34,41,48,57,72], change:148, color:"#26a77a" },
  { keyword:"6G 위성통신", values:[24,29,33,43,52,64], change:167, color:"#6f7bd8" },
  { keyword:"AI 보안", values:[42,47,51,60,67,76], change:81, color:"#e4962c" },
  { keyword:"생성형 미디어", values:[22,31,38,44,58,70], change:218, color:"#d36b7d" },
];

function Radar({ signal }: { signal: Signal }) {
  const metrics = [["정책성", signal.policy], ["시장성", signal.market], ["기술격차", signal.gap], ["시급성", signal.urgency]];
  return (
    <div className="radar-wrap" aria-label={`${signal.name} 4대 지표`}>
      <div className="radar-visual">
        <div className="radar-ring ring-1" /><div className="radar-ring ring-2" /><div className="radar-ring ring-3" />
        <div className="radar-cross horizontal" /><div className="radar-cross vertical" />
        <div className="radar-core"><strong>{signal.score}</strong><span>종합점수</span></div>
        <span className="axis-label north">정책성 {signal.policy}</span><span className="axis-label east">시장성 {signal.market}</span>
        <span className="axis-label south">시급성 {signal.urgency}</span><span className="axis-label west">격차 {signal.gap}</span>
      </div>
      <div className="metric-list">
        {metrics.map(([label, value]) => <div className="metric" key={label}><span>{label}</span><div><i style={{width:`${value}%`, background:signal.color}} /></div><strong>{value}</strong></div>)}
      </div>
    </div>
  );
}

export default function Home() {
  const [field, setField] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [compare, setCompare] = useState<number[]>([1, 3]);
  const [problem, setProblem] = useState("지역 제조기업의 AI 도입 지연과 현장 실증 부족");
  const [beneficiary, setBeneficiary] = useState("지역 중소·중견 제조기업 및 AI 솔루션 기업");
  const [generated, setGenerated] = useState(false);
  const selected = signals.find(s => s.id === selectedId) || signals[0];
  const filtered = useMemo(() => signals.filter(s => (field === "전체" || s.field === field) && (s.name.includes(query) || s.summary.includes(query))), [field, query]);
  const toggleCompare = (id:number) => setCompare(prev => prev.includes(id) ? prev.filter(item => item !== id) : prev.length < 3 ? [...prev, id] : [...prev.slice(1), id]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="R&D Signal Radar 홈"><span className="brand-mark">R</span><span>R&amp;D Signal Radar</span></a>
        <nav aria-label="주요 메뉴"><a className="active" href="#radar">① 신호 레이더</a><a href="#trends">② 키워드 트렌드</a><a href="#generator">③ 기획 후보 생성</a></nav>
        <button className="outline-button">데이터 기준 <strong>2026.08</strong></button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> ICT R&amp;D 전략기획 워크벤치</div>
        <h1>흩어진 변화를 읽고,<br /><em>다음 R&amp;D를 설계합니다.</em></h1>
        <p>정책·기술·시장 신호를 한눈에 비교하고<br />신규 사업기획의 근거와 우선순위를 발견하세요.</p>
        <div className="hero-actions"><a className="primary-button" href="#radar">레이더 살펴보기 <span>↗</span></a><span className="update-note"><i /> 공개 데이터 기반 · 최근 업데이트 8월 18일</span></div>
      </section>

      <section className="overview" id="radar">
        <div className="section-heading"><div><span className="kicker">01 SIGNAL OVERVIEW</span><h2>① 신호 레이더</h2></div><p>초기 버전의 점수와 근거는 화면 구조 검증을 위한 샘플입니다.<br />실제 활용 전 데이터 출처와 산식 검증이 필요합니다.</p></div>
        <div className="stat-strip">
          <div><span>관측 분야</span><strong>9</strong><small>개</small></div><div><span>이번 달 신규</span><strong>12</strong><small>개</small></div><div><span>상승 신호</span><strong>31</strong><small>개</small></div><div><span>기획 검토 후보</span><strong>9</strong><small>개</small></div>
        </div>
        <div className="radar-panel">
          <div className="panel-copy"><span className="status-pill">{selected.stage}</span><h3>{selected.name}</h3><p>{selected.summary}</p><Radar signal={selected} /></div>
          <div className="evidence-box"><span className="mini-label">WHY IT MATTERS</span><h4>핵심 관측 근거</h4>{selected.evidence.map((item, i) => <div className="evidence" key={item}><b>0{i+1}</b><span>{item}</span></div>)}<div className="direction"><span>추천 기획 방향</span><strong>{selected.direction}</strong></div></div>
        </div>
      </section>

      <section className="trends-section" id="trends">
        <div className="section-heading"><div><span className="kicker">02 KEYWORD MOMENTUM</span><h2>② 키워드 트렌드</h2></div><p>최근 6개월 정책·사업·시장 문서의 상대적 관심도입니다.<br />현재는 동작 검증을 위한 샘플 지수입니다.</p></div>
        <div className="trend-layout">
          <div className="trend-chart">
            <div className="chart-head"><span>관심도 지수</span><div><i /> 3월 <i /> 8월</div></div>
            {trendData.map(row => <div className="trend-row" key={row.keyword}><strong>{row.keyword}</strong><div className="spark-bars">{row.values.map((v,i)=><i key={i} style={{height:`${v}%`,background:row.color,opacity:.35+i*.12}} />)}</div><b>+{row.change}%</b></div>)}
            <div className="month-axis"><span>3월</span><span>4월</span><span>5월</span><span>6월</span><span>7월</span><span>8월</span></div>
          </div>
          <aside className="trend-summary"><span className="mini-label">FASTEST RISING</span><strong>에이전틱 AI</strong><em>+389%</em><p>정책 언급과 민간 제품 출시가 동시에 증가했습니다. 신뢰성·상호운용성·평가체계를 중심으로 신규 기획 가능성을 검토할 시점입니다.</p><button onClick={()=>{setSelectedId(1);document.getElementById("generator")?.scrollIntoView()}}>이 신호로 기획하기 →</button></aside>
        </div>
      </section>

      <section className="explorer" id="signals">
        <div className="section-heading"><div><span className="kicker">FIELD TAXONOMY</span><h2>분야별 신호 탐색</h2></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="기술·이슈 검색" aria-label="기술·이슈 검색" /></label></div>
        <div className="filter-row" role="group" aria-label="기술 분야 필터">{fields.map(item => <button className={field === item ? "selected" : ""} onClick={()=>setField(item)} key={item}>{item}</button>)}</div>
        <div className="table-wrap">
          <table><thead><tr><th>신호</th><th>분야</th><th>신호 유형</th><th>종합점수</th><th>전월 대비</th><th>단계</th><th><span className="sr-only">비교</span></th></tr></thead>
          <tbody>{filtered.map(signal => <tr className={selectedId === signal.id ? "current" : ""} key={signal.id} onClick={()=>setSelectedId(signal.id)}><td><button className="signal-name" onClick={()=>setSelectedId(signal.id)}><i style={{background:signal.color}} />{signal.name}</button></td><td>{signal.field}</td><td><span className="type-badge">{signal.type}</span></td><td><strong>{signal.score}</strong></td><td className="up">↑ {signal.change}%</td><td>{signal.stage}</td><td><button className={`compare-button ${compare.includes(signal.id)?"on":""}`} onClick={e=>{e.stopPropagation();toggleCompare(signal.id)}} aria-label={`${signal.name} 비교 ${compare.includes(signal.id)?"해제":"추가"}`}>{compare.includes(signal.id)?"✓":"+"}</button></td></tr>)}</tbody></table>
          {filtered.length === 0 && <div className="empty">검색 결과가 없습니다. 다른 키워드를 입력해 보세요.</div>}
        </div>
      </section>

      <section className="insights" id="insights">
        <div className="section-heading light"><div><span className="kicker">PLANNING INSIGHT</span><h2>기획 검토를 시작할 신호</h2></div><p>선택한 신호를 나란히 보고<br />사업화 질문을 구체화합니다.</p></div>
        <div className="compare-grid">{compare.map(id => { const s=signals.find(item=>item.id===id)!; return <article key={s.id}><button className="remove" onClick={()=>toggleCompare(s.id)} aria-label={`${s.name} 비교에서 제거`}>×</button><span className="card-index">0{s.id}</span><h3>{s.name}</h3><strong className="big-score">{s.score}</strong><div className="mini-bars"><span>정책성 <i><b style={{width:`${s.policy}%`}} /></i>{s.policy}</span><span>시장성 <i><b style={{width:`${s.market}%`}} /></i>{s.market}</span><span>기술격차 <i><b style={{width:`${s.gap}%`}} /></i>{s.gap}</span></div><p>{s.direction}</p></article>})}<article className="question-card"><span className="mini-label">NEXT QUESTION</span><h3>전문가 검토 질문</h3><ul><li>정부 R&amp;D가 개입해야 할 시장실패는 무엇인가?</li><li>기존 사업과 구분되는 임무와 수혜자는 누구인가?</li><li>3~5년 내 검증 가능한 도전적 목표는 무엇인가?</li></ul><button onClick={()=>document.getElementById("signals")?.scrollIntoView()}>다른 신호 선택하기 →</button></article></div>
      </section>

      <section className="generator" id="generator">
        <div className="section-heading"><div><span className="kicker">03 IDEA GENERATOR</span><h2>③ 기획 후보 자동 생성</h2></div><p>선택 신호와 현장 문제를 결합해<br />사전기획 논의용 후보를 만듭니다.</p></div>
        <div className="generator-grid">
          <div className="generator-form">
            <label>전략 신호<select value={selectedId} onChange={e=>{setSelectedId(Number(e.target.value));setGenerated(false)}}>{signals.map(s=><option key={s.id} value={s.id}>{s.name} · {s.score}점</option>)}</select></label>
            <label>해결하려는 문제<textarea value={problem} onChange={e=>{setProblem(e.target.value);setGenerated(false)}} rows={3} /></label>
            <label>주요 수혜자<input value={beneficiary} onChange={e=>{setBeneficiary(e.target.value);setGenerated(false)}} /></label>
            <button className="generate-button" onClick={()=>setGenerated(true)}>기획 후보 생성하기 <span>→</span></button>
            <small>입력 내용은 서버에 저장하지 않는 화면 시연용 기능입니다.</small>
          </div>
          <div className={`generated-card ${generated?"ready":""}`}>
            {!generated ? <div className="generator-empty"><span>03</span><strong>입력 내용을 바탕으로<br />기획 후보 구조를 생성합니다.</strong><p>정책 연계성 · 해결 문제 · 사업 목표 · 추진 방향</p></div> : <>
              <div className="generated-head"><span>기획 후보 2026-{String(selected.id).padStart(2,"0")}</span><b>{selected.stage}</b></div>
              <h3>{selected.direction}</h3>
              <dl><div><dt>문제 정의</dt><dd>{problem}</dd></div><div><dt>정책·시장 근거</dt><dd>{selected.evidence.join(" · ")}</dd></div><div><dt>사업 목표</dt><dd>{beneficiary}이 활용할 수 있는 핵심기술과 실증 레퍼런스를 확보하고, 기술개발 결과의 산업 확산 경로를 구축</dd></div><div><dt>권고 추진방식</dt><dd>{selected.policy >= selected.market ? "임무지향형 기술개발과 공공·지역 실증을 연계" : "시장수요 기반 기술개발과 수요기업 참여형 실증을 연계"}</dd></div></dl>
              <div className="generated-note">초안 결과는 전문가 검토와 출처 검증이 필요합니다.</div>
            </>}
          </div>
        </div>
      </section>

      <footer><div className="brand"><span className="brand-mark">R</span><span>R&amp;D Signal Radar</span></div><p>ICT R&amp;D 사업기획을 위한 공개형 탐색 도구 · Prototype v0.1</p><a href="#top">맨 위로 ↑</a></footer>
    </main>
  );
}
