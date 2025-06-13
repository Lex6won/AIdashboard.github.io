# 경기도 AI 등록제 서비스 현황 대시보드

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![Data Count](https://img.shields.io/badge/Services-73-blue) ![Last Update](https://img.shields.io/badge/Updated-2025.06-orange)

## 📊 프로젝트 개요

경기도 AI 등록제에 등록된 AI 서비스들의 현황을 한눈에 파악할 수 있는 인터랙티브 대시보드입니다. 

### 🎯 주요 기능

- **실시간 데이터 연동**: CSV 파일 업데이트 시 자동으로 대시보드에 반영
- **다양한 분석 관점**: 활용분야별, 지자체별, 운영기관별, 시계열별 분석
- **인터랙티브 차트**: Chart.js를 활용한 동적 차트 및 그래프
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 UI
- **데이터 다운로드**: 분석된 데이터를 CSV 형태로 다운로드 가능

## 🔢 현재 데이터 현황 (2025.06 기준)

- **총 AI 서비스**: 73개
- **참여 지자체**: 19개
- **운영 기관**: 36개
- **활용 분야**: 8개 (복지, 행정, 의료, 교통·안전, 교육, 산업·경제, 문화·관광, 환경·에너지)

### 📈 주요 인사이트

1. **복지 분야**가 18개 서비스로 가장 활발 (24.7%)
2. **경기도**가 21개 서비스로 최다 도입 (28.8%)
3. **2024년**에 22개 신규 서비스 도입으로 급성장
4. **생성형 AI**와 **자연어처리** 기술이 주요 트렌드

## 🚀 사용 방법

### 웹사이트 접속
- **GitHub Pages**: [https://yourusername.github.io/gyeonggi-ai-dashboard](https://yourusername.github.io/gyeonggi-ai-dashboard)

### 로컬 실행
```bash
# 저장소 클론
git clone https://github.com/yourusername/gyeonggi-ai-dashboard.git

# 디렉토리 이동
cd gyeonggi-ai-dashboard

# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js 사용
npx http-server

# 브라우저에서 http://localhost:8000 접속
```

## 📁 프로젝트 구조

```
gyeonggi-ai-dashboard/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # JavaScript 로직
├── data.csv            # AI 서비스 데이터 (CSV)
├── README.md           # 프로젝트 설명서
├── _config.yml         # GitHub Pages 설정
└── .github/
    └── workflows/
        └── update-data.yml  # 자동 데이터 업데이트 워크플로
```

## 🔄 데이터 업데이트 방법

### 1. 수동 업데이트
1. 새로운 엑셀 파일을 CSV로 변환
2. `data.csv` 파일 교체
3. Git에 커밋 & 푸시

### 2. 자동 업데이트 (권장)
1. `data/` 폴더에 새로운 엑셀 파일 업로드
2. GitHub Actions이 자동으로 CSV 변환 및 배포
3. 대시보드 자동 업데이트

```bash
# 새로운 데이터 추가 예시
git add data/새로운_AI등록제_데이터.xlsx
git commit -m "📊 2025년 3분기 데이터 업데이트"
git push origin main
```

## 🛠️ 기술 스택

### Frontend
- **HTML5/CSS3**: 시맨틱 마크업 및 반응형 디자인
- **JavaScript (ES6+)**: 동적 기능 및 데이터 처리
- **Chart.js**: 차트 및 그래프 렌더링
- **Papa Parse**: CSV 파싱 라이브러리

### 데이터 처리
- **CSV 형식**: 구조화된 데이터 저장
- **실시간 파싱**: 브라우저에서 직접 CSV 처리
- **데이터 정제**: 자동 카테고리 분류 및 통계 생성

### 배포
- **GitHub Pages**: 정적 사이트 호스팅
- **GitHub Actions**: 자동 배포 및 데이터 업데이트

## 📊 대시보드 구성

### 1. 전체 현황
- 핵심 지표 카드
- 주요 인사이트
- 활용분야별 차트
- 연도별 추이

### 2. 분야별 분석
- 활용분야 상세 분포
- AI 서비스 유형별 분석
- 분야별 통계 테이블

### 3. 도입 지자체
- 지자체별 도입 현황
- 지자체별 분야 분석
- 상세 도입 현황 테이블

### 4. 운영 기관
- 운영 기관별 현황
- 기관 유형별 분류
- 운영 기관 상세 정보

### 5. 시계열 분석
- 연도별 도입 추이
- 증감률 분석
- 트렌드 변화

### 6. 서비스 대상
- 대상별 분포 분석
- 서비스 대상 상세 현황

## 🤝 기여 방법

### 데이터 개선
- 오류 데이터 신고: Issues 탭에 오류 내용 작성
- 새로운 데이터 제공: Pull Request로 기여

### 기능 개선
- 새로운 차트 유형 추가
- UI/UX 개선
- 성능 최적화

### 버그 신고
- GitHub Issues에 버그 리포트 작성
- 재현 가능한 단계 및 스크린샷 포함

## 📋 데이터 출처

- **원본 데이터**: 경기도 AI 등록제 공식 데이터
- **업데이트 주기**: 분기별 (3개월마다)
- **데이터 검증**: 수동 검토 및 자동 검증 시스템

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙋‍♂️ 문의사항

- **GitHub Issues**: 기술적 문의사항
- **Email**: contact@example.com
- **Website**: https://github.com/yourusername/gyeonggi-ai-dashboard

## 🏆 Changelog

### 2025.06.13 - v1.0.0
- 초기 대시보드 런칭
- 73개 AI 서비스 데이터 등록
- 6개 분석 탭 구현
- 반응형 디자인 적용

### 향후 계획
- [ ] 실시간 API 연동
- [ ] 다국어 지원 (영어)
- [ ] 고급 필터링 기능
- [ ] 데이터 시각화 확장
- [ ] 모바일 앱 개발

---

⭐ **이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**

![Footer](https://img.shields.io/badge/Made%20with-❤️-red) ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
