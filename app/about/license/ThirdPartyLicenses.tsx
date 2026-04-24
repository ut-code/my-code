"use client";

import { FallbackPre } from "@/markdown/styledSyntaxHighlighter";
import { LicenseEntry } from "next-license-list";
import { useState } from "react";

export function ThirdPartyLicenses({ licenses }: { licenses: LicenseEntry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

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
            <div className="collapse-title font-mono">
              <span className="font-bold">{pkg.name}</span>
              <span className="opacity-60 ml-2">v{pkg.version}</span>
              <span className="badge badge-primary badge-soft badge-sm ml-3">
                {pkg.license}
              </span>
            </div>
            <div className="collapse-content">
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
                    className="link link-info break-all"
                    href={pkg.repository}
                    target="_blank"
                  >
                    {pkg.repository}
                  </a>
                </p>
              )}
              {pkg.licenseText && (
                <FallbackPre className="text-sm">{pkg.licenseText}</FallbackPre>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
