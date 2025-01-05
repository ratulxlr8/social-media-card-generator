"use client";
import html2canvas from "html2canvas";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [ogData, setOgData] = useState({ image: null, title: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardCount, setCardCount] = useState(4); // Default number of cards

  const cardRefs = useRef([]);

  const fetchOgData = async () => {
    setLoading(true);
    setError("");
    setOgData({ image: null, title: null });

    try {
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

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
        const canvas = await html2canvas(cardElement, {
          useCORS: true,
          allowTaint: true,
          scale: 6,
          backgroundColor: null,
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

  // Predefined styles for cards
  const cardStyles = [
    { backgroundColor: "#2c3e50", textColor: "text-white" },
    { backgroundColor: "#1B5E20", textColor: "text-white" },
    { backgroundColor: "#F57F17", textColor: "text-black" },
    { backgroundColor: "#c0392b", textColor: "text-white" },
    { backgroundColor: "#8e44ad", textColor: "text-white" },
    { backgroundColor: "#2980b9", textColor: "text-white" },
    { backgroundColor: "#27ae60", textColor: "text-white" },
    { backgroundColor: "#e74c3c", textColor: "text-white" },
    { backgroundColor: "#34495e", textColor: "text-white" },
    { backgroundColor: "#16a085", textColor: "text-white" },
  ];

  return (
    <div className="items-center justify-items-center w-full container mx-auto">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h1 className="text-2xl my-10">Social Media Card Generator</h1>

      {/* Input Section */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <div className="flex items-center gap-4 w-full">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 w-full p-3 ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchOgData}
            className="inline px-6 py-3.5 bg-blue-500 text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch OG Data"}
          </button>
        </div>
        <div className="flex items-center gap-4 w-full">
          <label htmlFor="cardCount" className="text-gray-700">
            Number of Cards:
          </label>
          <input
            id="cardCount"
            type="number"
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
            className="p-3 ring-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="10"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 w-full">
        {[...Array(cardCount)].map((_, index) => {
          const { backgroundColor, textColor } =
            cardStyles[index % cardStyles.length];
          return (
            <div className="flex flex-col items-center" key={index}>
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                style={{ backgroundColor }}
                className="w-full mx-auto bg-white overflow-hidden rounded-lg shadow-md flex flex-col justify-between"
              >
                {/* Card Content */}
                <div className={`px-6 py-4 ${textColor}`}>
                  <h2 className="text-2xl text-center">
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
                  বিস্তারিত কমেন্টে
                </div>
                {/* Download Button */}
              </div>
              <div className="px-6 py-4">
                <button
                  onClick={() => handleDownload(index)}
                  className="w-full px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md"
                >
                  Download Card {index + 1}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
