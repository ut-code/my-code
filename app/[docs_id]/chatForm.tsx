"use client";

import { useState, FormEvent } from "react";

interface ChatApiResponse {
  response: string;
}

export function ChatForm() {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = (await res.json()) as ChatApiResponse;
      if (!res.ok) {
        throw new Error(data.response || "エラーが発生しました。");
      }
      setResponse(data.response);
    } catch (error: any) {
      setResponse(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <style jsx>{`
        /* 簡単なCSSで見た目を整える（オプション） */
        .form-container {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(67, 204, 216, 0.86);
          padding: 20px;
          width: 90%;
          max-width: 1000px;
          display: flex;
          flex-direction: column;
        }
        .input-area {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 5px 15 px;
          margin-bottom: 15px;
          min-height: 150px; /* 入力欄の高さ */
          display: flex;
        }
        .text-input {
          border: none;
          outline: none;
          flex-grow: 1;
          font-size: 16px;
          resize: none; /* テキストエリアのリサイズを無効化 */
          overflow: auto;
          padding: 10px;
        }
        .controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .left-icons button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #555;
          margin-right: 15px;
          padding: 5px;
        }
        .left-icons button:hover {
          color: #000;
        }
        .left-icons span {
          font-size: 14px;
          vertical-align: middle;
          margin-left: 5px;
          color: #555;
        }
        .right-controls {
          display: flex;
          align-items: center;
        }
        .voice-icon button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #555;
          margin-right: 15px;
          padding: 5px;
        }
        .voice-icon button:hover {
          color: #000;
        }
        .send-button {
          background-color: #007bff; /* 青色の送信ボタン */
          color: white;
          border: none;
          border-radius: 50%; /* 丸いボタン */
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease;
        }
        .send-button:hover {
          background-color: #0056b3;
        }
      `}</style>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-area">
          <textarea
            className="text-input"
            placeholder="質問を入力してください"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          ></textarea>
        </div>
        <div className="controls">
          <div className="left-icons"></div>
          <div className="right-controls">
            <button
              type="submit"
              className="send-button"
              title="送信"
              disabled={isLoading}
            >
              <span className="icon">➤</span>
            </button>
          </div>
        </div>
      </form>
      {response && <div className="response-container">{response}</div>}
    </>
  );
}
