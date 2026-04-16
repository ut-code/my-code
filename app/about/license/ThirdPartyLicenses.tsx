"use client";

import { StyledSyntaxHighlighter } from "@/markdown/styledSyntaxHighlighter";
import { langConstants } from "@my-code/runtime/languages";
import { useState } from "react";

export interface LicenseEntry {
  name: string;
  version: string;
  author?: string;
  repository?: string;
  source?: string;
  license: string;
  licenseText?: string;
}

export function ThirdPartyLicenses({ licenses }: { licenses: LicenseEntry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {licenses.map((pkg) => {
        const key = `${pkg.name}@${pkg.version}`;
        const isOpen = expanded === key;
        let repositoryURL: string | undefined = undefined;
        if (pkg.repository?.startsWith("http")) {
          repositoryURL = pkg.repository;
        } else if (pkg.repository?.startsWith("git+http")) {
          repositoryURL = pkg.repository?.slice(4);
        } else if (pkg.repository?.startsWith("git@")) {
          repositoryURL =
            "https://" +
            pkg.repository
              .slice(4)
              .replace(":", "/")
              .replace(/\.git$/, "");
        } else if (
          pkg.repository &&
          /github:[\w-]+\/[\w-]+/.test(pkg.repository)
        ) {
          repositoryURL = `https://github.com/${pkg.repository.slice(7)}`;
        } else if (pkg.repository && /[\w-]+\/[\w-]+/.test(pkg.repository)) {
          // assume github username/repository
          repositoryURL = `https://github.com/${pkg.repository}`;
        } else {
          // fallback to source url
          // repositoryURL = pkg.source ?? "";
        }
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
              {repositoryURL && (
                <p className="mb-1">
                  <span className="opacity-60">Repository: </span>
                  <a
                    className="link link-info break-all"
                    href={repositoryURL}
                    target="_blank"
                  >
                    {repositoryURL}
                  </a>
                </p>
              )}
              {pkg.licenseText && (
                <StyledSyntaxHighlighter
                  className="text-sm"
                  language={langConstants(undefined)}
                >
                  {pkg.licenseText}
                </StyledSyntaxHighlighter>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
