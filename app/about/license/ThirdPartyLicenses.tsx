"use client";

import { useEffect, useState } from "react";

interface LicenseEntry {
  name: string;
  version: string;
  author?: string;
  repository?: string;
  source?: string;
  license: string;
  licenseText?: string;
}

export function ThirdPartyLicenses() {
  const [licenses, setLicenses] = useState<LicenseEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/_next/static/oss-licenses.json")
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => setLicenses(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <p className="opacity-60 text-sm">
        ライセンス情報の読み込みに失敗しました。
      </p>
    );
  }

  if (!licenses) {
    return (
      <div className="flex items-center gap-2 opacity-60">
        <span className="loading loading-spinner loading-sm" />
        <span>読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {licenses.map((pkg) => {
        const key = `${pkg.name}@${pkg.version}`;
        const isOpen = expanded === key;
        return (
          <div key={key} className="collapse collapse-arrow bg-base-200">
            <input
              type="checkbox"
              checked={isOpen}
              onChange={() => setExpanded(isOpen ? null : key)}
            />
            <div className="collapse-title font-mono text-sm">
              <span className="font-bold">{pkg.name}</span>
              <span className="opacity-60 ml-2">v{pkg.version}</span>
              <span className="badge badge-outline badge-sm ml-3">
                {pkg.license}
              </span>
            </div>
            <div className="collapse-content text-sm">
              {pkg.author && (
                <p className="mb-1">
                  <span className="opacity-60">Author: </span>
                  {pkg.author}
                </p>
              )}
              {pkg.repository && (
                <p className="mb-1">
                  <span className="opacity-60">Repository: </span>
                  <a
                    className="link link-primary break-all"
                    href={pkg.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pkg.repository}
                  </a>
                </p>
              )}
              {pkg.licenseText && (
                <pre className="mt-2 whitespace-pre-wrap text-xs bg-base-300 p-3 rounded-box overflow-x-auto">
                  {pkg.licenseText}
                </pre>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
