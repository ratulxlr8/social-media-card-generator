"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import html2canvas from "html2canvas";

export default function Home() {
  const [url, setUrl] = useState("");
  const [ogData, setOgData] = useState({ image: null, title: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cardRefs = useRef([]);

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

  const customLoader = ({ src }) => src;

  const handleDownload = async (index) => {
    const cardElement = cardRefs.current[index];
    if (cardElement) {
      try {
        // Adjust html2canvas options to capture the full content without cropping
        const canvas = await html2canvas(cardElement, {
          useCORS: true, // Ensure external images are fetched and included
          allowTaint: true, // Allow tainting for external images
          scale: 6, // Set scale for better quality
          backgroundColor: null, // Make background transparent
          x: 0, // Adjust starting X position
          y: 0, // Adjust starting Y position
          width: cardElement.offsetWidth, // Match the card's width
          height: cardElement.offsetHeight, // Match the card's height
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `card_${index + 1}.png`;
        link.click();
      } catch (error) {
        console.error("Error capturing the card image:", error);
      }
    }
  };

  return (
    <div className="items-center justify-items-center w-full">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h1 className="text-2xl my-10">Social Media Card Generato</h1>

      <div className="flex items-center gap- w-full max-w-xl">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="flex-1 w-full p-3 ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchOgData}
          className="inline px-6 py-3.5 bg-blue-500 text-white    hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch OG Data"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 w-full">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{
              backgroundColor:
                index === 0
                  ? "#2c3e50"
                  : index === 1
                  ? "#1B5E20"
                  : index === 2
                  ? "#F57F17"
                  : "#c0392b",
            }}
            className="max-w-xs mx-auto bg-white overflow-hidden"
          >
            <div className="px-6 py-4     -gray-200">
              <h2 className="text-2xl text-center text-white">
                {ogData.title || "কোনো শিরোনাম পাওয়া যায়নি"}
              </h2>
            </div>
            <div>
              {ogData.image && (
                <Image
                  loader={customLoader}
                  src={ogData.image}
                  alt="OG Image"
                  width={640}
                  height={360}
                />
              )}
            </div>
            <div className="px-6 py-3 text-center text-gray-200">
              {`   বিস্তারিত কমেন্টে`}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 justify-between w-full">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex justify-center">
            <button
              onClick={() => handleDownload(index)}
              className="inline-block col-span-1 px-6 py-3 bg-green-500 text-white    hover:bg-green-600 mt-4"
            >
              Download Card {index + 1}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
