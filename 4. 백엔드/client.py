import requests

# 서버 URL 설정 (Flask 앱이 실행 중인 주소)
url = "http://localhost:5000/api/predict"

# 헤더 설정
headers = {'Content-Type': 'application/json'}

# 보낼 데이터 설정
data = {'playlist_title': '눈 오늘 날'}

# POST 요청을 서버에 보내고 응답 받기
response = requests.post(url, json=data, headers=headers)

# 응답 출력
print(response.json())