"use client";

import { useState, FormEvent } from "react";
import { askAI } from "@/app/actions/chatActions";

export function ChatForm() {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    const formData = new FormData();
    formData.append("message", inputValue);

    const result = await askAI({ response: "", error: null }, formData);

    if (result.error) {
      setResponse(`エラー: ${result.error}`);
      } else {
      setResponse(result.response);
    }
    
    setIsLoading(false);
  };
  return (
    <>
      {isFormVisible && (
      <form className="border border-2 border-primary shadow-xl p-6 rounded-lg bg-base-100" style={{width:"100%", textAlign:"center", boxShadow:"-moz-initial"}} onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-left relative -top-2 font-mono h-2">
          AIへ質問
        </h2>
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
        <br />
        <div className="controls" style={{position:"relative", top:"22px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div className="left-icons">
            <button 
              className="btn btn-soft btn-secondary rounded-full"
              onClick={() => setIsFormVisible(false)}
            >

              閉じる
            </button>
          </div>
          <div className="right-controls">
            <button
              type="submit"
              className="btn btn-soft btn-circle btn-primary rounded-full"
              title="送信"
              style={{marginTop:"10px"}}
              disabled={isLoading}
            >
              <span className="icon">➤</span>
            </button>
          </div>
        </div>
      </form>
      )}
      {!isFormVisible && (
      <button 
        className="btn btn-soft btn-secondary rounded-full"
        onClick={() => setIsFormVisible(true)}
      >
        チャットを開く
      </button>
      )}

      {response && (
        <article>
          <h3 className="text-lg font-semibold mb-2">AIの回答</h3>
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-primary">
               <div className="response-container">{response}</div>
            </div>
          </div>
        </article>
      )}

      {isLoading && (
      <div className="mt-2 text-l text-gray-500 animate-pulse">
        AIが考え中です…
      </div>
      )}

    </>
  );
}
