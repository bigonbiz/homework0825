# Local document workspace

이 폴더는 공개 웹앱에 올리기 전, 사용자의 PC에서 원본 자료를 보관하고 텍스트를 추출하기 위한 로컬 작업공간입니다.

## Folder layout

- `inbox/`: 새로 처리할 파일을 넣는 곳
- `originals/`: 처리된 원본 파일 보관 위치
- `parsed/`: 추출된 텍스트 파일 저장 위치
- `index.json`: 로컬 문서 목록과 처리 결과

## Basic workflow

1. `inbox/`에 `.hwpx`, `.docx`, `.txt`, `.md`, `.csv`, `.json`, `.xml`, `.html` 파일을 넣습니다.
2. PowerShell에서 `scripts/ingest-local-docs.ps1`을 실행합니다.
3. 원본은 `originals/`로 복사되고, 추출 텍스트는 `parsed/`에 저장됩니다.
4. 공개 가능한 요약·키워드·분야만 검토 후 `data/radar-data.json`에 반영합니다.

PDF와 이미지는 현재 원본 보관 및 목록화까지만 지원합니다. OCR/고급 파싱은 다음 단계에서 별도 도구를 붙입니다.
