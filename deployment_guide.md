# 🚀 배포 가이드

이 문서는 경기도 AI 등록제 대시보드를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📋 목차

1. [GitHub Pages 배포](#github-pages-배포)
2. [자동 배포 설정](#자동-배포-설정)
3. [수동 배포](#수동-배포)
4. [도메인 설정](#도메인-설정)
5. [트러블슈팅](#트러블슈팅)

## 🌐 GitHub Pages 배포

### 1단계: 저장소 생성 및 설정

```bash
# 1. 새 저장소 생성
git clone https://github.com/yourusername/gyeonggi-ai-dashboard.git
cd gyeonggi-ai-dashboard

# 2. 파일 업로드
git add .
git commit -m "🎉 초기 대시보드 배포"
git push origin main
```

### 2단계: GitHub Pages 활성화

1. GitHub 저장소 → **Settings** 탭
2. 왼쪽 메뉴에서 **Pages** 선택
3. **Source** 드롭다운에서 `GitHub Actions` 선택
4. **Custom domain** (선택사항) 입력
5. **Enforce HTTPS** 체크박스 활성화

### 3단계: 배포 확인

- 저장소의 **Actions** 탭에서 배포 진행상황 확인
- 배포 완료 후 `https://yourusername.github.io/gyeonggi-ai-dashboard` 접속

## ⚙️ 자동 배포 설정

### GitHub Actions 워크플로

`.github/workflows/update-data.yml` 파일이 다음 상황에서 자동 실행됩니다:

- **Push 트리거**: `main` 브랜치에 데이터 파일 변경 시
- **스케줄**: 매월 1일 오전 9시 (한국시간)
- **수동 실행**: GitHub Actions에서 직접 실행

### 환경 변수 설정 (선택사항)

저장소 **Settings** → **Secrets and variables** → **Actions**:

```bash
# Slack 알림 (선택사항)
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Google Analytics (선택사항)
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

## 🔧 수동 배포

### 로컬에서 테스트

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 서버 실행
npm start
# 또는
python -m http.server 8000

# 3. 브라우저에서 확인
open http://localhost:8000
```

### 수동 배포 명령어

```bash
# 1. 빌드 및 최적화
npm run build

# 2. GitHub Pages에 배포
npm run deploy

# 3. 또는 직접 push
git add .
git commit -m "📊 수동 배포 $(date +'%Y-%m-%d')"
git push origin main
```

## 🔗 도메인 설정

### 사용자 정의 도메인 설정

1. **DNS 설정** (도메인 제공업체에서):
   ```
   # CNAME 레코드 추가
   www.yourdomain.com → yourusername.github.io
   
   # A 레코드 추가 (루트 도메인용)
   yourdomain.com → 185.199.108.153
   yourdomain.com → 185.199.109.153
   yourdomain.com → 185.199.110.153
   yourdomain.com → 185.199.111.153
   ```

2. **GitHub Pages 설정**:
   - Settings → Pages → Custom domain에 도메인 입력
   - `CNAME` 파일이 자동 생성됨

3. **SSL 인증서**:
   - "Enforce HTTPS" 옵션 활성화
   - 인증서 발급까지 최대 24시간 소요

## 🐛 트러블슈팅

### 일반적인 문제들

#### 1. 404 에러 발생
```bash
# 해결방법 1: 저장소 이름 확인
Repository name: gyeonggi-ai-dashboard
URL: yourusername.github.io/gyeonggi-ai-dashboard

# 해결방법 2: index.html 파일 존재 확인
ls -la index.html

# 해결방법 3: 브랜치 확인
git branch -r
```

#### 2. 데이터가 로드되지 않음
```bash
# CSV 파일 확인
head -5 data.csv

# 파일 권한 확인
ls -la data.csv

# CORS 에러 해결 (로컬 개발 시)
python -m http.server 8000 --bind 127.0.0.1
```

#### 3. 자동 배포 실패
```bash
# 워크플로 로그 확인
GitHub → Actions → 실패한 워크플로 클릭

# 권한 확인
Settings → Actions → General → Workflow permissions
"Read and write permissions" 선택
```

#### 4. 차트가 표시되지 않음
```javascript
// 브라우저 콘솔에서 확인
console.log('Chart.js loaded:', typeof Chart !== 'undefined');
console.log('Data loaded:', globalData);

// 네트워크 탭에서 CDN 로딩 확인
// Chart.js, PapaParse 라이브러리 로딩 상태 확인
```

### 성능 최적화

#### 1. 이미지 최적화
```bash
# 이미지 압축 (선택사항)
npm install -g imagemin-cli
imagemin images/*.png --out-dir=images/optimized
```

#### 2. CSS/JS 최적화
```bash
# CSS 압축
npm run minify:css

# JavaScript 압축
npm run minify:js

# 빌드 후 배포
npm run build && npm run deploy
```

#### 3. 캐싱 설정
```yaml
# _config.yml에 추가
plugins:
  - jekyll-sitemap
  - jekyll-feed

# 캐시 헤더 (선택사항)
include:
  - .htaccess
```

### 모니터링 및 분석

#### 1. Google Analytics 설정
```html
<!-- index.html head 태그에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXXXX-X');
</script>
```

#### 2. 성능 측정
```bash
# Lighthouse 성능 측정
npm run lighthouse

# 결과 확인
open lighthouse-report.html
```

#### 3. 업타임 모니터링
- [Uptime Robot](https://uptimerobot.com/) 또는 유사 서비스 사용
- Webhook을 통한 Slack 알림 설정

## 📞 지원

배포 관련 문제가 발생하면:

1. **GitHub Issues**: 기술적 문의사항
2. **Discussion**: 일반적인 질문
3. **Email**: critical-support@example.com

## 🔄 업데이트 프로세스

### 정기 업데이트
1. 분기별 데이터 파일 업데이트
2. 의존성 라이브러리 업데이트
3. 보안 패치 적용
4. 성능 최적화

### 응급 업데이트
1. 중요한 버그 수정
2. 보안 취약점 패치
3. 데이터 오류 수정

---

💡 **팁**: 배포 전에 항상 로컬에서 테스트하고, 스테이징 환경에서 검증 후 프로덕션에 배포하세요!