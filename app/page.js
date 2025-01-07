"use client";
import SkeletonCard from "@/components/SkeletonCard";
import html2canvas from "html2canvas";
import Head from "next/head";
import { useRef, useState } from "react";
import Card from "../components/Card";
import FetchOgData from "../components/FetchOgData";
import cardStyles from "../utils/cardStyles";
import { getOgDataFromUrl as fetchOgDataUtil } from "../utils/getOgDataFromUrl";

export default function Home() {
  const [url, setUrl] = useState("");
  const [ogData, setOgData] = useState({ image: null, title: null });
  const [titleOverrides, setTitleOverrides] = useState({}); // New state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardCount, setCardCount] = useState(4);
  const cardRefs = useRef([]);

  const fetchOgData = async () => {
    setLoading(true);
    setError("");
    setOgData({ image: null, title: null });
    setTitleOverrides({}); // Reset overrides

    try {
      const data = await fetchOgDataUtil(url);
      setOgData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (index, newTitle) => {
    setTitleOverrides((prev) => ({
      ...prev,
      [index]: newTitle,
    }));
  };

  const handleDownload = async (index) => {
    const cardElement = cardRefs.current[index];
    if (cardElement) {
      try {
        // Temporarily hide textarea and show the static block
        const textarea = cardElement.querySelector("textarea");
        const staticBlock = cardElement.querySelector("div.hidden");
        if (textarea && staticBlock) {
          textarea.style.display = "none";
          staticBlock.style.display = "block";
        }

        // Render the card using html2canvas
        const canvas = await html2canvas(cardElement, {
          useCORS: true,
          allowTaint: true,
          scale: 6,
          backgroundColor: null,
        });

        // Restore visibility of textarea after rendering
        if (textarea && staticBlock) {
          textarea.style.display = "block";
          staticBlock.style.display = "none";
        }

        // Download the rendered image
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
    <div className="items-center justify-items-center w-full container mx-auto">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h1 className="text-2xl my-10">Social Media Card Generator</h1>

      <FetchOgData
        url={url}
        setUrl={setUrl}
        fetchOgData={fetchOgData}
        loading={loading}
        setCardCount={setCardCount}
        error={error}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 w-full">
        {loading
          ? [...Array(cardCount)].map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : [...Array(cardCount)].map((_, index) => (
              <Card
                key={index}
                ogData={{
                  ...ogData,
                  title: titleOverrides[index] || ogData.title,
                }}
                index={index}
                cardStyles={cardStyles}
                cardRefs={cardRefs}
                handleDownload={handleDownload}
                onTitleChange={(newTitle) => handleTitleChange(index, newTitle)} // Pass the handler
              />
            ))}
      </div>
    </div>
  );
}
