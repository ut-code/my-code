# .env ファイルを作成して環境変数を設定してください
# `uvicorn chat:app --reload --port 8000` でサーバーを起動できます
# pip install fastapi uvicorn  python-dotenv google-generativeai
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS設定
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    genai.configure(api_key=os.getenv("API_KEY"))
except Exception as e:
    print(f"APIキーの設定に失敗しました: {e}")


# フロントエンドから受け取るデータ構造を定義
class ChatMessage(BaseModel):
    message: str

# APIエンドポイント
@app.post("/api/chat")
async def create_chat(chat_message: ChatMessage):
    """
    ユーザーからのメッセージを受け取り、Gemini 1.5 Flashからの応答を返す
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(chat_message.message)      
        return {"response": response.text}

    except Exception as e:
        print(f"Error: {e}")
        return {"response": "エラーが発生しました。"}