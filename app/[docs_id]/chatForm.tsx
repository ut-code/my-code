"use client";

import { useState, FormEvent } from "react";
import { askAI } from "@/app/actions/chatActions";
import { StyledMarkdown } from "./markdown";
import useSWR from "swr";
import { getQuestionExample } from "../actions/questionExample";
import { getLanguageName } from "../pagesList";

export function ChatForm({
  docs_id,
  documentContent,
}: {
  docs_id: string;
  documentContent: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const lang = getLanguageName(docs_id);
  const { data: exampleData, error: exampleError } = useSWR(
    // 質問フォームを開いたときだけで良い
    isFormVisible ? { lang, documentContent } : null,
    getQuestionExample,
    {
      // リクエストは古くても構わないので1回でいい
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (exampleError) {
    console.error("Error getting question example:", exampleError);
  }
  // 質問フォームを開くたびにランダムに選び直し、
  // exampleData[Math.floor(exampleChoice * exampleData.length)] を採用する
  const [exampleChoice, setExampleChoice] = useState<number>(0); // 0〜1

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    let userQuestion = inputValue;
    if(!userQuestion && exampleData){
      // 質問が空欄なら、質問例を使用
      userQuestion = exampleData[Math.floor(exampleChoice * exampleData.length)];
      setInputValue(userQuestion);
    }

    const result = await askAI({
      userQuestion,
      documentContent: documentContent,
    });

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
      <form className="border border-2 border-secondary shadow-md rounded-lg bg-base-100" style={{width:"100%", textAlign:"center", boxShadow:"-moz-initial"}} onSubmit={handleSubmit}>
        <div className="input-area">
            <textarea
              className="textarea textarea-ghost textarea-md rounded-lg"
              placeholder={
                "質問を入力してください" +
                (exampleData
                  ? ` (例:「${exampleData[Math.floor(exampleChoice * exampleData.length)]}」)`
                  : "")
              }
              style={{
                width: "100%",
                height: "110px",
                resize: "none",
                outlineStyle: "none",
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>
        <div className="controls" style={{margin:"10px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
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
                className="btn btn-soft btn-circle btn-accent border-2 border-accent rounded-full"
                title="送信"
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
          onClick={() => {
            setIsFormVisible(true);
            setExampleChoice(Math.random());
          }}
        >
          チャットを開く
        </button>
      )}

      {response && (
        <article>
          <h3 className="text-lg font-semibold mb-2">AIの回答</h3>
          <div className="chat chat-start">
            <div className="chat-bubble bg-secondary-content text-black" style={{maxWidth: "100%", wordBreak: "break-word"}}>
              <div className="response-container"><StyledMarkdown content={response}/></div>
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
