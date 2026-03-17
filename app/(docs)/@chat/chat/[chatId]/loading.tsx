import { ChatAreaContainer } from "./chatArea";

export default function Loading() {
  return (
    <ChatAreaContainer chatId={"loading"}>
      <div className="skeleton h-7 w-full mt-2 mb-3">{/* heading2 */}</div>
      <div className="skeleton h-5 w-2/4 my-2">{/* breadcrumbs */}</div>
      <div className="skeleton h-5 w-35 my-1.5">{/* date */}</div>
      <div className="divider" />
      <div className="skeleton h-15 ml-auto w-2/3 my-1">{/* chat */}</div>
      <div className="skeleton h-40 w-full my-2">{/* <p> */}</div>
      <div className="skeleton h-15 ml-auto w-2/3 my-1">{/* chat */}</div>
      <div className="skeleton h-40 w-full my-2">{/* <p> */}</div>
    </ChatAreaContainer>
  );
}
