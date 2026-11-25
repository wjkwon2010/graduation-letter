# graduation-letter

졸업 축하 카드 웹사이트입니다. 포함된 암호문은 **가짜 학생** 데이터입니다.

## 미리보기 (Codespaces)
    python3 -m http.server 8000
PORTS 탭에서 8000번 주소를 엽니다. (파일을 직접 더블클릭하면 동작하지 않습니다.)

시험 입력: 가나다 / 010-0000-0001 / 0101 / 7 / 학습부

## 꾸미기: data/public-config.json
- 학교 이름과 문구를 바꿉니다.
- 사진: `assets/images/`에 넣고 `"gallery": [{"src": "assets/images/a.jpg", "caption": "체육대회"}]`
- 음악: `assets/sounds/`에 넣고 `"music": "assets/sounds/bgm.mp3"` (사용 권한이 있는 파일만)

**주의:** 여기 올린 사진은 본인 확인 없이 누구나 볼 수 있고 기록에 남습니다.
사진 속 사람의 동의를 받고, 촬영 위치 정보(EXIF)를 지운 뒤 올리세요.

## 배포
Settings > Pages > Source를 **GitHub Actions**로 선택한 뒤 main에 push합니다.

## 보안 한계
개인별 편지는 암호화되어 있지만, 학생의 정보를 아는 사람은 대입해서 열 수 있습니다.
화면의 시도 제한(5회 실패 시 60초)은 우회할 수 있습니다.
`data/encrypted-messages.json`은 Private 저장소의 Actions가 갱신하므로 직접 고치지 마세요.
