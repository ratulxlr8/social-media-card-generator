"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [url, setUrl] = useState("");
  const [ogImage, setOgImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOgImage = async () => {
    setLoading(true);
    setError("");
    setOgImage(null);

    try {
      // Fetch OG data using the Microlink API
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      // Extract the OG image URL
      const ogImageUrl = data?.data?.image?.url;

      if (ogImageUrl) {
        setOgImage(ogImageUrl);
      } else {
        setError("No OG image found.");
      }
    } catch (err) {
      setError("Failed to fetch OG image.");
    } finally {
      setLoading(false);
    }
  };

  // Custom loader to allow any image domain
  const customLoader = ({ src }) => src;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">OG Image Fetcher</h1>
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchOgImage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch OG Image"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      {ogImage && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-medium">Fetched OG Image:</h2>
          <div className="relative w-64 h-64">
            <Image
              loader={customLoader}
              src={ogImage}
              alt="OG Image"
              width={1200}
              height={630}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
