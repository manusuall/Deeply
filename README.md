# Deeply
Deeply : Playlist Generation Model
Deeply는 Playlist 생성형 모델 Prototype 입니다.
<br>
## 0. 개요
- Deeply는 사용자의 자연어를 입력 받아, 노래의 제목을 출력해주는 Seq2Seq 모델입니다.
- 이는 사용자 정보와 컨텐츠 데이터가 부족한 경우를 극복하기 위한 아이디어 입니다.
- 데이터의 형태는 아래와 같습니다. <br>
  **플레이리스트 제목 : '혼자만의 시간을 갖는다는 것.'** <br>
  **곡 제목 : ['기억의 습작', 'Let it be', '기다리다', 'parade', ...]** <br>
  **가   수 : [  '전람회' ,   'Beatles' ,  'YOUNHA',  'YOUNHA', ... ]** <br>
  **장   르 : [...]** <br>

## 1. 데이터 특성 및 전처리
-  플레이리스 데이터 자체만으로, Source 언어로서 자연어를, Target 언어로서 메타데이터로 나누어 학습을 진행.
- 전처리에는 Source는 ‘bert-base-multilingual-cased’ 토크나이저를 사용. Target은 기본의 토크나이저를 사용.
- Target은 각각의 메타데이터(제목, 가수, 장르 등)을 별개의 토크나이저를 만들어 처리. 띄어쓰기의 문제는 별도의 식별자(딕셔너리)를 구성해 매핑.

## 2. 모델링
- Seq2Seq의 인코더는 자연어 단일 입력이지만, 디코더는 각 메타데이터별로 다중출력 구조로 설계함.
- 하나의 디코더 LSTM에 5개의 메타데이터(제목, 가수, 장르, 앨범, 발매일자)의 입출력 구조를 생성하여, 5개 속성의 문맥을 학습을 유도.
- 디코더의 5개의 입출력에 대해서, 인코더의 Context-Vector와의 Attention을 진행함.
- Inference에서는 노래 제목만을 출력하도록 함.
<br>

![Deeply_arch](https://github.com/manusuall/Deeply/assets/124496957/86655c47-93c0-4778-be68-c23e7b37a283)

## 3. 서비스 기능 구현
- 백엔드는 Flask를 사용 모델의 출력 값을, 식별자의 값으로 매핑하여 노래 제목의 값으로 변경해서 출력
- 프론트는 React를 사용, Youtube API를 이용해 해당 곡 정보를 가져와 서비스할 수 있도록 작성<br>

https://github.com/manusuall/Deeply/assets/124496957/c5af0200-64f2-4f96-a689-e410e901d04f

