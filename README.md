# auto-ticketing


### 🎸 소개
이 프로그램은 In터파크의 티켓팅 과정을 자동화한 프로그램입니다.<br>
모든 과정이 자동화된 것은 아니기 때문에 사용자의 개입이 필요한 점 유의해주세요!
<br>
<b> Node.js, Electron, Puppeteer </b> 등을 사용하여 개발했습니다.

<br>
사용을 위해서는 먼저 다운로드를 받아주세요.


## 사용 방법
프로그램을 오픈하면 하단과 같은 화면이 보입니다.

<img width="1440" alt="스크린샷 2023-04-28 오후 11 11 12" src="https://user-images.githubusercontent.com/86194303/235171244-bab68205-ea01-4ee3-a14d-4c04dc8a2bad.png">

<br>

### 🎸 1. 입력창에 정보들을 입력합니다.

- 콘서트 ID

<img width="1159" alt="스크린샷 2023-04-28 오후 11 15 30" src="https://user-images.githubusercontent.com/86194303/235172510-e4ab31a6-ca5a-4c00-b320-5d306a2de05c.png">

<br>

예매하고자 하는 콘서트 예매 페이지를 열어보시면 주소에 goods/ 뒤에 숫자가 있습니다. 해당 번호를 복사해서 콘서트 ID 칸에 입력해주시면 됩니다.
<br><br>

- 몇개의 좌석을 원하시나요? (숫자만 입력)

2개의 티켓 예매를 원하시면 : 2 <br>
1개의 티켓 예매를 원하시면 : 1

<br>

- User ID, Password 는 In터파크 로그인 시에 필요한 정보입니다.
<br>

✅ 모든 정보를 입력 후 Let's go 버튼을 마우스로 클릭합니다.
<br><br>

### 🎸 2. Let's go 버튼 클릭 후 발생하는 상황 설명

- 크롬 웹페이지가 열리면서 자동으로 로그인, 예매 페이지로 이동, 날짜 선택, 예매하기 버튼 클릭까지 이루어집니다.
- 예매하기 팝업 페이지가 열린 후 <b> ✅ 구역 선택은 사용자가 직접 마우스로 클릭하셔야 합니다!! </b>
- 포도알(좌석) 선택은 자동화 되어 있습니다. 그 이후 <b>✅ 캡챠 문자열 입력 화면이 뜰텐데 직접 키보드로 입력하시고 엔터 눌러주셔야 합니다!!</b>
- 결제 페이지까지 넘어갔다면 포도알은 내 것이 확정되었습니다. 🎉 이제 긴장을 풀고 천천히 결제까지 직접 완료하시면 됩니다.

구역 선택, 문자열 입력 2개의 작업을 최대한 빨리 하시면 포도알을 잡을 수 있는 확률이 높아질겁니다.

<br><br>


---

### 🎸 유의사항
현재 인터파크 로그인이 CloudFlare로 캡챠 인식을 하여 로그인 단계에서 막힘 -> 수정중

