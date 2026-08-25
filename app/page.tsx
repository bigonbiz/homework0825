"use client";

import { useMemo, useState } from "react";
import radarData from "../data/radar-data.json";

type Signal = {
  id: number; name: string; field: string; type: string; score: number; change: number;
  policy: number; market: number; gap: number; urgency: number; stage: string; summary: string;
  evidence: string[]; direction: string; color: string;
};

type Trend = { keyword: string; values: number[]; change: number; color: string };
type SourceRecord = { name: string; type: string; records: number; updateCycle: string; status: string };

const signals = radarData.signals as Signal[];
const fields = ["전체", ...radarData.fields];
const trendData = radarData.trends as Trend[];
const sources = radarData.sourceInventory as SourceRecord[];
const metadata = radarData.metadata;
const totalRecords = sources.reduce((sum, source) => sum + source.records, 0);

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
        <a className="brand" href="#top" aria-label="IITP ICT R&D Signal Radar 홈"><span className="brand-org">IITP</span><span className="brand-divider" aria-hidden="true">|</span><span>ICT R&amp;D Signal Radar</span></a>
        <nav aria-label="주요 메뉴"><a className="active" href="#radar">① 신호 레이더</a><a href="#trends">② 키워드 트렌드</a><a href="#generator">③ 기획 후보 생성</a><a href="#data">④ 데이터 현황</a></nav>
        <button className="outline-button">데이터 버전 <strong>{metadata.version}</strong></button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> IITP ICT R&amp;D 사업·과제기획 지원도구</div>
        <h1>신호를 읽고,<br /><em>ICT R&amp;D를 기획합니다.</em></h1>
        <p>정책·기술·시장 신호를 한눈에 비교하고<br />신규 사업기획의 근거와 우선순위를 발견하세요.</p>
        <div className="hero-actions"><a className="primary-button" href="#radar">레이더 살펴보기 <span>↗</span></a><span className="update-note"><i /> {metadata.mode} · 최근 업데이트 {metadata.lastUpdated}</span></div>
      </section>

      <section className="overview" id="radar">
        <div className="section-heading"><div><span className="kicker">01 SIGNAL OVERVIEW</span><h2>① 신호 레이더</h2></div><p>초기 버전의 점수와 근거는 화면 구조 검증을 위한 샘플입니다.<br />실제 활용 전 데이터 출처와 산식 검증이 필요합니다.</p></div>
        <div className="stat-strip">
          <div><span>관측 분야</span><strong>{radarData.fields.length}</strong><small>개</small></div><div><span>색인 자료</span><strong>{totalRecords}</strong><small>건</small></div><div><span>상승 신호</span><strong>31</strong><small>개</small></div><div><span>기획 검토 후보</span><strong>{signals.length}</strong><small>개</small></div>
        </div>
        <div className="radar-panel">
          <div className="panel-copy"><span className="status-pill">{selected.stage}</span><h3>{selected.name}</h3><p>{selected.summary}</p><Radar signal={selected} /></div>
          <div className="evidence-box"><span className="mini-label">WHY IT MATTERS</span><h4>핵심 관측 근거</h4>{selected.evidence.map((item, i) => <div className="evidence" key={item}><b>0{i+1}</b><span>{item}</span></div>)}<div className="direction"><span>추천 기획 방향</span><strong>{selected.direction}</strong></div></div>
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

      <section className="data-section" id="data">
        <div className="section-heading"><div><span className="kicker">04 DATA OPERATIONS</span><h2>④ 데이터 관리 현황</h2></div><p>현재 웹앱은 자동 수집이 아니라 파일을 갱신하는 방식입니다.<br />담당자가 공개자료를 확인하고 데이터 파일에 반영하면 화면이 함께 바뀝니다.</p></div>
        <div className="data-ops-grid">
          <div className="data-status">
            <span className="mini-label">UPDATE POLICY</span>
            <h3>{metadata.mode}</h3>
            <dl>
              <div><dt>갱신 주기</dt><dd>{metadata.updateCycle}</dd></div>
              <div><dt>저장 위치</dt><dd>{metadata.storage}</dd></div>
              <div><dt>정리 방식</dt><dd>{metadata.collector}</dd></div>
              <div><dt>원문 저장</dt><dd>{metadata.rawDocumentStorage}</dd></div>
            </dl>
            <p>{metadata.note}</p>
          </div>
          <div className="data-totals">
            <div><span>저장된 출처 그룹</span><strong>{sources.length}</strong><small>개</small></div>
            <div><span>색인 자료 건수</span><strong>{totalRecords}</strong><small>건</small></div>
            <div><span>분야 분류</span><strong>{radarData.fields.length}</strong><small>개</small></div>
            <div><span>관측 신호</span><strong>{signals.length}</strong><small>개</small></div>
            <div><span>트렌드 키워드</span><strong>{trendData.length}</strong><small>개</small></div>
            <div><span>데이터 버전</span><strong>{metadata.version}</strong><small>파일</small></div>
          </div>
        </div>
        <div className="local-workflow">
          <div className="local-paths">
            <span className="mini-label">LOCAL STORAGE</span>
            <h3>로컬 자료 저장 위치</h3>
            <dl>
              <div><dt>파일 투입</dt><dd>{metadata.inboxPath}</dd></div>
              <div><dt>원본 보관</dt><dd>{metadata.originalsPath}</dd></div>
              <div><dt>텍스트 저장</dt><dd>{metadata.parsedPath}</dd></div>
              <div><dt>문서 목록</dt><dd>{metadata.indexPath}</dd></div>
            </dl>
          </div>
          <div className="workflow-steps">
            <span className="mini-label">MANUAL INGEST</span>
            <h3>수동 업데이트 절차</h3>
            <ol>
              <li><span>01</span><p>자료 파일을 로컬 `inbox` 폴더에 넣습니다.</p></li>
              <li><span>02</span><p>로컬 파싱 스크립트를 실행해 원본과 추출 텍스트를 저장합니다.</p></li>
              <li><span>03</span><p>공개 가능한 요약·키워드·분야만 검토해 웹앱 데이터에 반영합니다.</p></li>
            </ol>
            <div className="format-row"><strong>텍스트 추출</strong>{metadata.supportedLocalParsing.map(item => <b key={item}>{item}</b>)}</div>
            <div className="format-row muted"><strong>원본 보관 우선</strong>{metadata.storedOnlyFormats.map(item => <b key={item}>{item}</b>)}</div>
          </div>
        </div>
        <div className="source-table">
          <div className="source-table-head"><span>자료 출처별 보유 현황</span><strong>총 {totalRecords}건 색인</strong></div>
          <table><thead><tr><th>출처</th><th>자료유형</th><th>건수</th><th>갱신주기</th><th>상태</th></tr></thead><tbody>{sources.map(source => <tr key={source.name}><td>{source.name}</td><td>{source.type}</td><td><strong>{source.records}</strong>건</td><td>{source.updateCycle}</td><td><span>{source.status}</span></td></tr>)}</tbody></table>
        </div>
      </section>

      <footer><div className="brand"><span className="brand-org">IITP</span><span className="brand-divider" aria-hidden="true">|</span><span>ICT R&amp;D Signal Radar</span></div><p>IITP 사업·과제기획 지원을 위한 내부 탐색 도구 · Prototype v0.1</p><a href="#top">맨 위로 ↑</a></footer>
    </main>
  );
}
