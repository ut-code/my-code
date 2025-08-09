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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponse(`エラー: ${error.message}`);
      } else {
        setResponse(`エラー: ${String(error)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className="border border-2 border-primary shadow-xl p-6 rounded-lg bg-base-100" style={{width:"70%", textAlign:"center", boxShadow:"-moz-initial", position:"fixed", bottom:"10px", marginLeft:"20px"}} onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4"　style={{textAlign:"left", position:"relative", bottom:"10px", fontFamily:"monospace", height:"10px"}}>AIへ質問</h2>
        <div className="input-area" style={{height:"80px"}}>
          <textarea
            className="textarea textarea-white textarea-md"
            placeholder="質問を入力してください"
            style={{width: "100%", height: "110px", resize: "none"}}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          ></textarea>
        </div>
        <div className="controls" style={{position:"relative", top:"22px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div className="left-icons"></div>
          <div className="right-controls">
            <button
              type="submit"
              className="btn btn-soft btn-primary rounded-full"
              title="送信"
              style={{marginTop:"10px"}}
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
