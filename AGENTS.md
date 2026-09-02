<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 개발 코딩 룰 및 패턴 가이드 (Project & SCSS Coding Rules)

이 프로젝트에서 작업할 때는 아래의 코딩 룰과 패턴을 엄격하게 준수해야 합니다.

---

## 1. SCSS/CSS 코딩 룰 (SCSS/CSS Coding Rules)

### 1-1. 구조와 정렬 순서의 표준화
스타일 선언 시 미디어 쿼리와 마우스 호버 상태는 반드시 파일의 **최하부(루트 레벨)**에 배치합니다.
* **작성 순서**: `[루트 클래스 스타일]` ➔ `@include mobile { ... }` ➔ `@include pc { ... }` ➔ `@include hover { ... }`
* **구조 예시**:
  ```scss
  .component {
    display: flex;
    .child {
      color: var(--foreground);
    }
  }

  @include mobile {
    .component {
      padding: 1rem;
    }
  }

  @include pc {
    .component {
      padding: 2rem;
    }
  }

  @include hover {
    .component:hover {
      opacity: 0.8;
    }
  }
  ```

### 1-2. 불필요한 공백 라인 완전 억제 (Zero Tolerance for Blank Lines)
코드가 장황해지지 않도록 불필요한 줄바꿈을 절대 금지합니다.
* CSS 속성들 사이에 빈 줄을 넣지 마십시오. (예: `display`와 `flex-direction`은 줄바꿈 없이 바로 인접해야 함)
* 셀렉터와 그 첫 번째 속성 사이, 혹은 중첩된(nested) 자식 요소 사이에 빈 줄을 넣지 마십시오.
* 같은 부모 내부에서 중첩된 셀렉터들 사이에 빈 줄을 넣지 마십시오.
* **빈 줄 허용 범위**: 오직 서로 다른 **최상위 루트 클래스** 간의 구분을 위해서만 빈 줄 1줄을 허용합니다.
* 블록의 끝(`}`) 직전에 빈 줄을 넣지 마십시오.

### 1-3. 정의된 CSS 변수(Variables)의 엄격한 사용
* 코드 내에 하드코딩된 색상 값(Hex, RGB 등)을 절대 직접 사용하지 마십시오.
* 항상 글로벌 CSS 변수(예: `var(--background)`, `var(--primary-color)`, `var(--gray-alpha-200)`)를 사용해야 합니다.
* 이를 통해 테마 대응(라이트/다크 모드)과 디자인 시스템의 일관성을 유지합니다.

### 1-4. 클린 코드 유지 및 불필요한 주석 제거
* 구조적으로 유추 가능한 주석(예: `// List Page`, `// Responsive Styles`, `// Interaction`)은 작성하지 않거나 삭제합니다.
* 모든 SCSS 파일에서 **2-스페이스 들여쓰기(indentation)**를 엄격하게 유지합니다.

---

## 2. 프로젝트 일반 규칙 (General Project Rules)

### 2-1. UI/UX 우선순위 및 글로벌 레퍼런스
* 모던하고 감각적인 최신 웹 트렌드(글래스모피즘, 그라데이션, HSLTailored colors, 마이크로 인터랙션 등)의 UI/UX 스타일을 최우선으로 적용합니다.
* 디자인 참고 시 국내 환경에만 국한하지 않고, 전 세계적인 고품질 웹/앱 디자인 패러다임과 디자인 시스템의 베스트 프랙티스를 참고하여 프리미엄 급 결과물을 만들어 냅니다.

### 2-2. 완벽한 반응형 웹 디자인 (Responsive Web)
* 모바일, 태블릿, PC 등 모든 뷰포트에서 깨짐 없이 미려하게 표현되어야 합니다.
* 미디어 쿼리 믹스인(예: `@include mobile`, `@include pc`)을 정확하게 구사하여 레이아웃을 최적화합니다.

