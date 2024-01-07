from flask import Flask, jsonify, send_from_directory, request
import json
from flask_cors import CORS
import os
import tensorflow as tf
from transformers import BertTokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow import keras
import numpy as np


os.environ['TF.KERAS'] = '1'

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

# 모델 로드
encoder_model = tf.keras.models.load_model('C:/Users/aischool271/improject/test/multi_model/multi_encoder_model_200.h5')
decoder_model = tf.keras.models.load_model('C:/Users/aischool271/improject/test/multi_model/multi_decoder_model_200.h5')

# Decoder_모델의 Infernece 출력을 
# 저장된 토크나이저 파일을 읽습니다
with open('C:/Users/aischool271/improject/test/multi_model/song_tokenizer_none_audio_30000.json', 'r', encoding='utf-8') as f:
    loaded_song_tokenizer_json = json.load(f)  # json.load를 사용하여 직접 JSON 객체로 변환

# JSON 객체에서 토크나이저를 복원합니다.
song_tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(loaded_song_tokenizer_json)

# Encoder_입력을 전처리(토큰화 및 전처리) 하기 위한 Bert 토크나이저
playlist_title_tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')

# JSON 파일로부터 식별자 딕셔너리 로드
# song(Decoder_dict)가 있어야만 반드시 출력 숫자-> '노래 제목'으로 출력할 수 있음! 필수
with open('C:/Users/aischool271/improject/test/multi_model/song_identifiers_30000.json', 'r', encoding='utf-8') as file:
    song_identifiers = json.load(file)


# 하이퍼 파라미터 설정
## 입력 패딩 파라미터
max_playlist_title_length = 25
max_songs = 10

## 2차원 입력 데이터, feature_length
lyric_length = 150
#audio_length = 7

## 임베딩 레이어 파라미터
### 임베딩 출력
embed_output_dim = 128
embed_outpu_dim = 128
### 임베딩 어휘 갯수
### 인코더-디코더
playlist_vocab = 119548
song_vocab = 261228      # 노래제목의 갯수

### 임베딩에 속한 어휘(토큰) 갯수
artist_vocab = 64384
album_vocab = 167466
genre_vocab = 79
release_date_vocab = 58
lyric_vocab = 119517

## LSTM units 파라미터
lstm_units = 128

start_token_id = 261226
stop_token_id = 261227

def inference_songs(input_seq):

    # 인코더 모델을 사용하여 전체 출력과 상태 얻기
    encoder_output, state_h, state_c = encoder_model.predict(input_seq)
    states_value = [state_h, state_c]

    # 초기 입력 시퀀스 생성 (SOS 토큰)
    target_seq = np.zeros((1, 1))
    target_seq[0, 0] = start_token_id

    # 예측을 위한 루프
    stop_condition = False
    decoded_sentence = []
    while not stop_condition:
        output_tokens, h, c = decoder_model.predict([target_seq, state_h, state_c, encoder_output])

        # 예측된 토큰 ID 가져오기
        sampled_token_id = np.argmax(output_tokens[0, -1, :])
        if sampled_token_id != stop_token_id:
            decoded_sentence.append(sampled_token_id)

        # 종료 조건 검사
        if sampled_token_id == stop_token_id or len(decoded_sentence) >= max_songs:
            stop_condition = True

        # 시퀀스와 상태 업데이트
        target_seq[0, 0] = sampled_token_id
        state_h, state_c = h, c

    return decoded_sentence

def find_key_by_value(value_to_find, dictionary):
    for key, value in dictionary.items():
        if value == value_to_find:
            return key
    return "Unknown Identifier"  # 값이 사전에 없는 경우

# 예시 사용
# identifier = 'song_name_1202'
# song_title = find_key_by_value(identifier, song_identifiers)
# print("노래 제목:", song_title)

def convert_sequence_to_titles(sequence, identifier_to_song):
    song_titles = []
    for seq in sequence:
        
        # 숫자 인덱스를 식별자 형태로 변환
        identifier = f'song_name_{seq}'
        
        # 식별자를 노래 제목으로 변환
        song_title = find_key_by_value(identifier, identifier_to_song)
        song_titles.append(song_title)
    return song_titles

input_data = " " # 여기가 사용자 input(query)를 받는 부분이 될 것.

input_seq = playlist_title_tokenizer.encode(input_data, 
                                            add_special_tokens= True  # 향후 수정대상.
                                            )
input_seq_padded = pad_sequences([input_seq], maxlen=max_playlist_title_length, padding='post')

# 인퍼런스 실행
decoded_sequence = inference_songs(input_seq_padded)

song_titles = convert_sequence_to_titles(decoded_sequence, song_identifiers)

@app.route('/api/predict', methods=['POST'])
def predict_songs():
    input_data = request.json['playlist_title']
    input_seq = playlist_title_tokenizer.encode(input_data, add_special_tokens=True)
    input_seq_padded = pad_sequences([input_seq], maxlen=max_playlist_title_length, padding='post')

    decoded_sequence = inference_songs(input_seq_padded)
    song_titles = convert_sequence_to_titles(decoded_sequence, song_identifiers)

    # 순서를 유지하면서 중복 제거
    unique_song_titles_ordered = []
    for title in song_titles:
        if title not in unique_song_titles_ordered:
            unique_song_titles_ordered.append(title)

    return jsonify({"song_titles": unique_song_titles_ordered})

# Flask 애플리케이션 실행
if __name__ == '__main__':
    app.run(debug=True)