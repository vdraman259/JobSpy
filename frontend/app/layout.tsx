import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobSpy – Search Jobs",
  description: "Search jobs across LinkedIn, Indeed, Glassdoor, ZipRecruiter, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
