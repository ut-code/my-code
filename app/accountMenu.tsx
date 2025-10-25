"use client";

import { authClient } from "@/lib/auth-client";

export const AccountMenu = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="w-10 h-10 skeleton rounded-full"></div>;
  }

  if (session) {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-8 h-8 rounded-full">
            <img
              src={
                session.user?.image ??
                `https://avatar.vercel.sh/${session.user?.name}`
              }
              alt="user avatar"
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a onClick={() => authClient.signOut()}>ログアウト</a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-8 h-8 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
      </label>
      <ul className="z-1 shadow-md dropdown-content bg-base-100 rounded-box menu w-64">
        <li className="menu-title">
          ログインすると、チャット履歴を保存し別のデバイスからもアクセスできるようになります。
        </li>
        <li>
          <button
            onClick={() => authClient.signIn.social({ provider: "github" })}
          >
            GitHub でログイン
          </button>
        </li>
        <li>
          <button
            onClick={() => authClient.signIn.social({ provider: "google" })}
          >
            Google でログイン
          </button>
        </li>
      </ul>
    </div>
  );
};
