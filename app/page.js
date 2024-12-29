"use client";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [url, setUrl] = useState("");
  const [ogData, setOgData] = useState({ image: null, title: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOgData = async () => {
    setLoading(true);
    setError("");
    setOgData({ image: null, title: null });

    try {
      // Fetch OG data using the Microlink API
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      // Extract the OG image URL and title
      const ogImageUrl = data?.data?.image?.url;
      const ogTitle = data?.data?.title;

      if (ogImageUrl && ogTitle) {
        setOgData({ image: ogImageUrl, title: ogTitle });
      } else {
        setError("No OG data found.");
      }
    } catch (err) {
      setError("Failed to fetch OG data.");
    } finally {
      setLoading(false);
    }
  };

  // Custom loader to allow any image domain
  const customLoader = ({ src }) => src;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h1 className="text-2xl font-bold">OG Data Fetcher</h1>
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchOgData}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch OG Data"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      {ogData.image && (
        <div
          className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden mt-8"
          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
        >
          {/* Title Section */}
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {ogData.title || "কোনো শিরোনাম পাওয়া যায়নি"}
            </h2>
          </div>
          {/* Image Section */}
          <div className="">
            <Image
              loader={customLoader}
              src={ogData.image}
              alt="OG Image"
              width={640} // Fixed width
              height={360} // 16:9 ratio height
            />
          </div>
          {/* Footer Section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-center text-gray-600 font-medium">
              বিস্তারিত কমেন্টে
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
