// 전역 변수
let globalData = null;
let charts = {};

// 색상 팔레트
const COLORS = [
    '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', 
    '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// CSV 데이터 로드 함수
async function loadData() {
    try {
        showLoading(true);
        
        // CSV 파일 로드
        const response = await fetch('data.csv');
        const csvText = await response.text();
        
        // Papa Parse로 CSV 파싱
        const parsedData = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });
        
        if (parsedData.errors.length > 0) {
            console.warn('CSV 파싱 경고:', parsedData.errors);
        }
        
        globalData = parsedData.data;
        console.log('데이터 로드 완료:', globalData.length, '개 서비스');
        
        // 데이터 분석 및 차트 생성
        analyzeAndRenderData();
        
        // 마지막 업데이트 시간 표시
        document.getElementById('lastUpdate').textContent = 
            `마지막 업데이트: ${new Date().toLocaleString('ko-KR')}`;
        
        showLoading(false);
        
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        showError('데이터를 불러오는데 실패했습니다. 새로고침을 시도해주세요.');
        showLoading(false);
    }
}

// 로딩 상태 표시/숨김
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.style.display = 'block';
    } else {
        loading.style.display = 'none';
    }
}

// 에러 메시지 표시
function showError(message) {
    const loading = document.getElementById('loading');
    loading.innerHTML = `
        <div style="color: #ef4444; text-align: center; padding: 2rem;">
            <h3>오류 발생</h3>
            <p>${message}</p>
            <button onclick="loadData()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;">다시 시도</button>
        </div>
    `;
}

// 데이터 분석 및 렌더링
function analyzeAndRenderData() {
    if (!globalData || globalData.length === 0) {
        console.error('분석할 데이터가 없습니다.');
        return;
    }
    
    // 데이터 정제 및 분석
    const analysis = analyzeData(globalData);
    
    // 메트릭 카드 업데이트
    updateMetrics(analysis);
    
    // 인사이트 업데이트
    updateInsights(analysis);
    
    // 차트 생성
    createCharts(analysis);
    
    // 테이블 생성
    createTables(analysis);
}

// 데이터 분석 함수
function analyzeData(data) {
    const analysis = {
        total: data.length,
        categories: {},
        agencies: {},
        operators: {},
        targets: {},
        aiTypes: {},
        years: {}
    };
    
    data.forEach(row => {
        // 활용분야 분석
        if (row['활용분야']) {
            const category = cleanCategory(row['활용분야']);
            analysis.categories[category] = (analysis.categories[category] || 0) + 1;
        }
        
        // 도입지자체 분석
        if (row['도입 지자체']) {
            const agency = row['도입 지자체'].trim();
            analysis.agencies[agency] = (analysis.agencies[agency] || 0) + 1;
        }
        
        // 운영기관 분석
        if (row['운영 기관']) {
            const operator = row['운영 기관'].trim();
            analysis.operators[operator] = (analysis.operators[operator] || 0) + 1;
        }
        
        // 서비스대상 분석
        if (row['서비스 대상']) {
            const target = cleanTarget(row['서비스 대상']);
            analysis.targets[target] = (analysis.targets[target] || 0) + 1;
        }
        
        // AI 유형 분석
        if (row['AI 서비스 유형']) {
            const aiType = cleanAIType(row['AI 서비스 유형']);
            analysis.aiTypes[aiType] = (analysis.aiTypes[aiType] || 0) + 1;
        }
        
        // 연도별 분석
        if (row['서비스 개시일']) {
            const year = extractYear(row['서비스 개시일']);
            if (year) {
                analysis.years[year] = (analysis.years[year] || 0) + 1;
            }
        }
    });
    
    // 정렬된 배열로 변환
    analysis.categoriesArray = Object.entries(analysis.categories).sort(([,a], [,b]) => b - a);
    analysis.agenciesArray = Object.entries(analysis.agencies).sort(([,a], [,b]) => b - a);
    analysis.operatorsArray = Object.entries(analysis.operators).sort(([,a], [,b]) => b - a);
    analysis.targetsArray = Object.entries(analysis.targets).sort(([,a], [,b]) => b - a);
    analysis.aiTypesArray = Object.entries(analysis.aiTypes).sort(([,a], [,b]) => b - a);
    analysis.yearsArray = Object.entries(analysis.years).sort(([a,], [b,]) => parseInt(a) - parseInt(b));
    
    return analysis;
}

// 데이터 정제 함수들
function cleanCategory(category) {
    const cat = category.trim();
    if (cat.includes('교통') || cat.includes('안전')) return '교통·안전';
    if (cat.includes('문화') || cat.includes('관광')) return '문화·관광';
    if (cat.includes('환경') || cat.includes('에너지')) return '환경·에너지';
    if (cat.includes('산업') || cat.includes('경제')) return '산업·경제';
    return cat;
}

function cleanTarget(target) {
    const tgt = target.trim();
    if (tgt.includes('시민') || tgt.includes('주민') || tgt.includes('도민')) return '일반 시민';
    if (tgt.includes('공무원') || tgt.includes('직원')) return '공무원/직원';
    if (tgt.includes('장애')) return '장애인';
    if (tgt.includes('노인') || tgt.includes('고령')) return '노인/고령자';
    if (tgt.includes('청년') || tgt.includes('학생')) return '청년/학생';
    if (tgt.includes('교통약자')) return '교통약자';
    if (tgt.includes('취약')) return '취약계층';
    return '기타';
}

function cleanAIType(aiType) {
    const type = aiType.trim();
    if (type.includes('자연어') || type.includes('NLP')) return '자연어처리';
    if (type.includes('머신러닝') || type.includes('기계학습')) return '기계학습/머신러닝';
    if (type.includes('생성형') || type.includes('GPT') || type.includes('LLM')) return '생성형 AI';
    if (type.includes('딥러닝')) return '딥러닝';
    if (type.includes('음성') || type.includes('STT') || type.includes('TTS')) return '음성인식';
    if (type.includes('영상') || type.includes('이미지') || type.includes('컴퓨터비전')) return '영상/이미지 분석';
    if (type.includes('챗봇')) return '챗봇';
    if (type.includes('로봇') || type.includes('자율주행')) return '로봇/자율주행';
    return type;
}

function extractYear(dateStr) {
    if (typeof dateStr === 'number' && dateStr > 2000 && dateStr < 2030) {
        return dateStr;
    }
    if (typeof dateStr === 'string') {
        const match = dateStr.match(/(\d{4})/);
        if (match) {
            const year = parseInt(match[1]);
            if (year > 2000 && year < 2030) return year;
        }
    }
    return null;
}

// 메트릭 업데이트
function updateMetrics(analysis) {
    document.getElementById('totalServices').textContent = analysis.total;
    document.getElementById('totalAgencies').textContent = Object.keys(analysis.agencies).length;
    document.getElementById('totalOperators').textContent = Object.keys(analysis.operators).length;
    document.getElementById('totalCategories').textContent = Object.keys(analysis.categories).length;
    
    // 2024년 신규 서비스 수
    const recent2024 = analysis.years['2024'] || 0;
    document.getElementById('recentServices').textContent = recent2024;
}

// 인사이트 업데이트
function updateInsights(analysis) {
    const topCategory = analysis.categoriesArray[0];
    const topAgency = analysis.agenciesArray[0];
    
    document.getElementById('topCategory').textContent = 
        `${topCategory[0]} 분야에서 ${topCategory[1]}개의 AI 서비스가 운영 중으로 가장 활발합니다.`;
    
    document.getElementById('topAgency').textContent = 
        `${topAgency[0]}가 ${topAgency[1]}개 서비스로 가장 많이 도입했습니다.`;
    
    document.getElementById('operatorInsight').textContent = 
        `총 ${Object.keys(analysis.operators).length}개 운영 기관이 참여하여 다양한 운영 모델을 보여줍니다.`;
    
    document.getElementById('categoryInsight').textContent = 
        `지자체별로 특화된 분야가 다르며, 전체적으로 ${Object.keys(analysis.categories).length}개 분야에서 AI 서비스가 활용되고 있습니다.`;
}

// 차트 생성
function createCharts(analysis) {
    // 기존 차트 파괴
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
    
    // 1. 활용분야별 막대 차트
    createBarChart('categoryChart', '활용분야', analysis.categoriesArray.slice(0, 8));
    
    // 2. 연도별 선 차트
    createLineChart('timelineChart', '연도별 추이', analysis.yearsArray);
    
    // 3. 분야별 상세 차트
    createBarChart('categoryDetailChart', '활용분야 상세', analysis.categoriesArray);
    
    // 4. AI 유형별 차트
    createBarChart('aiTypeChart', 'AI 유형', analysis.aiTypesArray.slice(0, 10));
    
    // 5. 도입 지자체 차트
    createBarChart('adoptionChart', '도입 지자체', analysis.agenciesArray.slice(0, 10));
    
    // 6. 운영 기관 차트
    createBarChart('operatingChart', '운영 기관', analysis.operatorsArray.slice(0, 10));
    
    // 7. 시계열 상세 차트
    createLineChart('timelineDetailChart', '연도별 상세 추이', analysis.yearsArray);
    createBarChart('timelineBarChart', '연도별 막대', analysis.yearsArray);
    
    // 8. 서비스 대상 차트
    createPieChart('targetPieChart', '서비스 대상', analysis.targetsArray);
    createBarChart('targetBarChart', '서비스 대상', analysis.targetsArray);
}

// 막대 차트 생성
function createBarChart(canvasId, label, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(([name,]) => name),
            datasets: [{
                label: label,
                data: data.map(([, count]) => count),
                backgroundColor: COLORS[0],
                borderColor: COLORS[0],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });
}

// 선 차트 생성
function createLineChart(canvasId, label, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(([year,]) => year + '년'),
            datasets: [{
                label: label,
                data: data.map(([, count]) => count),
                borderColor: COLORS[1],
                backgroundColor: COLORS[1] + '20',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// 원형 차트 생성
function createPieChart(canvasId, label, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    charts[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(([name,]) => name),
            datasets: [{
                label: label,
                data: data.map(([, count]) => count),
                backgroundColor: COLORS
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 테이블 생성
function createTables(analysis) {
    // 활용분야 테이블
    createDataTable('categoryTable', analysis.categoriesArray, analysis.total);
    
    // AI 유형 테이블
    createDataTable('aiTypeTable', analysis.aiTypesArray, analysis.total);
    
    // 도입 지자체 테이블
    createRankedTable('adoptionTable', analysis.agenciesArray, analysis.total);
    
    // 운영 기관 테이블
    createOperatorTable('operatingTable', analysis.operatorsArray);
    
    // 운영 기관 유형 통계
    createOperatorTypeStats('operatingTypeStats', analysis.operatorsArray);
    
    // 연도별 통계
    createYearStats('yearStats', analysis.yearsArray);
    
    // 서비스 대상 그리드
    createTargetGrid('targetGrid', analysis.targetsArray, analysis.total);
}

// 기본 데이터 테이블 생성
function createDataTable(containerId, data, total) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = data.map(([name, count]) => `
        <div class="data-item">
            <span class="data-name">${name}</span>
            <span>
                <span class="data-value">${count}개</span>
                <span class="data-percent">(${((count / total) * 100).toFixed(1)}%)</span>
            </span>
        </div>
    `).join('');
}

// 순위가 있는 테이블 생성
function createRankedTable(containerId, data, total) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-height: 400px; overflow-y: auto;">
            ${data.map(([name, count], index) => `
                <div class="data-item">
                    <span style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="background: #4f46e5; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">${index + 1}</span>
                        <span class="data-name">${name}</span>
                    </span>
                    <span>
                        <span class="data-value">${count}개</span>
                        <span class="data-percent">(${((count / total) * 100).toFixed(1)}%)</span>
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

// 운영 기관 테이블 생성
function createOperatorTable(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-height: 400px; overflow-y: auto;">
            ${data.map(([name, count], index) => {
                const type = getOperatorType(name);
                return `
                    <div class="data-item">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="background: #4f46e5; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">${index + 1}</span>
                            <span class="data-name">${name}</span>
                        </span>
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="data-value">${count}개</span>
                            <span class="type-badge ${type.class}">${type.name}</span>
                        </span>
                    </div>
                `;
            }).join('')}
        </div>
        <style>
            .type-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            .type-badge.government { background: #dbeafe; color: #1e40af; }
            .type-badge.corporation { background: #d1fae5; color: #065f46; }
            .type-badge.institute { background: #e9d5ff; color: #6b21a8; }
            .type-badge.other { background: #f3f4f6; color: #374151; }
        </style>
    `;
}

// 운영 기관 유형 분류
function getOperatorType(name) {
    if (name.includes('시') || name.includes('군') || name.includes('구') || name === '경기도') {
        return { name: '지자체', class: 'government' };
    } else if (name.includes('공사') || name.includes('공단')) {
        return { name: '공사/공단', class: 'corporation' };
    } else if (name.includes('진흥') || name.includes('테크노파크') || name.includes('재단')) {
        return { name: '전문기관', class: 'institute' };
    }
    return { name: '기타', class: 'other' };
}

// 운영 기관 유형별 통계
function createOperatorTypeStats(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const typeStats = {
        government: 0,
        corporation: 0,
        institute: 0
    };
    
    data.forEach(([name, count]) => {
        const type = getOperatorType(name);
        if (type.class === 'government') typeStats.government += count;
        else if (type.class === 'corporation') typeStats.corporation += count;
        else if (type.class === 'institute') typeStats.institute += count;
    });
    
    container.innerHTML = `
        <div class="type-stat government">
            <h3>지방자치단체</h3>
            <p>직접 운영하는 지자체가 다수를 차지합니다.</p>
            <div class="type-number">${typeStats.government}개 서비스</div>
        </div>
        <div class="type-stat corporation">
            <h3>공사/공단</h3>
            <p>도시개발공사, 주택도시공사 등 공공기관입니다.</p>
            <div class="type-number">${typeStats.corporation}개 서비스</div>
        </div>
        <div class="type-stat institute">
            <h3>전문기관</h3>
            <p>테크노파크, 진흥원 등 전문 운영기관입니다.</p>
            <div class="type-number">${typeStats.institute}개 서비스</div>
        </div>
    `;
}

// 연도별 통계 생성
function createYearStats(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const maxCount = Math.max(...data.map(([, count]) => count));
    
    container.innerHTML = data.map(([year, count], index) => {
        const prevCount = index > 0 ? data[index - 1][1] : 0;
        const growth = prevCount > 0 ? ((count - prevCount) / prevCount * 100) : 0;
        const growthClass = growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'neutral';
        const growthText = growth > 0 ? `+${growth.toFixed(1)}%` : growth < 0 ? `${growth.toFixed(1)}%` : '신규';
        
        return `
            <div class="year-stat">
                <div class="year-info">
                    <h4>${year}년</h4>
                    ${index > 0 ? `<div class="year-growth ${growthClass}">${growthText} 증감</div>` : ''}
                </div>
                <div class="year-value">
                    <div class="year-number">${count}개</div>
                    <div class="year-bar">
                        <div class="year-bar-fill" style="width: ${(count / maxCount * 100)}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 서비스 대상 그리드 생성
function createTargetGrid(containerId, data, total) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const maxCount = Math.max(...data.map(([, count]) => count));
    
    container.innerHTML = data.map(([name, count]) => `
        <div class="target-item">
            <div class="target-number">${count}개</div>
            <div class="target-label">${name}</div>
            <div class="target-bar">
                <div class="target-bar-fill" style="width: ${(count / maxCount * 100)}%"></div>
            </div>
            <div class="target-percent">${((count / total) * 100).toFixed(1)}%</div>
        </div>
    `).join('');
}

// 탭 전환 함수
function showTab(tabName) {
    // 모든 탭 콘텐츠 숨기기
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // 모든 탭 버튼 비활성화
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    const selectedTab = document.getElementById(tabName);
    const selectedBtn = event.target;
    
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // 차트 리사이즈 (탭 전환 시 차트가 제대로 표시되도록)
    setTimeout(() => {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }, 100);
}

// CSV 다운로드 함수
function downloadCSV() {
    if (!globalData || globalData.length === 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
    }
    
    // CSV 문자열 생성
    const csvContent = Papa.unparse(globalData);
    
    // 다운로드 링크 생성
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `경기도_AI등록제_서비스현황_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 창 크기 변경 시 차트 리사이즈
window.addEventListener('resize', () => {
    setTimeout(() => {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }, 100);
});