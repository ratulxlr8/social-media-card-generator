import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const Card = ({
  ogData,
  index,
  cardStyles,
  cardRefs,
  handleDownload,
  onTitleChange,
}) => {
  const { backgroundColor, textColor } = cardStyles[index % cardStyles.length];
  const customLoader = ({ src }) => src;
  const textareaRef = useRef();
  const [textareaHeight, setTextareaHeight] = useState("auto");

  // Adjust height dynamically based on content
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`); // Adjust to fit content
    }
  };

  // Adjust height whenever the title changes
  useEffect(() => {
    adjustHeight();
  }, [ogData.title]);

  return (
    <div className="flex flex-col items-center" key={index}>
      <div
        ref={(el) => (cardRefs.current[index] = el)}
        style={{ backgroundColor }}
        className="w-full mx-auto bg-white overflow-hidden rounded-lg shadow-md flex flex-col justify-between"
      >
        {/* Editable Title Area */}
        <div className={`px-6 py-4 ${textColor}`}>
          {/* Display Editable Title */}
          <textarea
            ref={textareaRef} // Attach the ref
            value={ogData.title || ""}
            onChange={(e) => {
              onTitleChange(e.target.value); // Update title
              adjustHeight(); // Adjust height as user types
            }}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-center text-2xl font-semibold"
            style={{
              fontFamily: `'Noto Serif Bengali', serif`, // Match the font
              fontSize: "1.5rem", // Equivalent to text-2xl
              fontWeight: "600", // Equivalent to font-semibold
              lineHeight: "1.5", // Better spacing between lines
              overflow: "hidden", // Prevent scrollbars
              height: textareaHeight, // Explicitly set height
            }}
            placeholder="Enter a title"
          />
          {/* Static Title for Download */}
          <div
            className="hidden"
            style={{
              fontFamily: `'Noto Serif Bengali', serif`,
              fontSize: "1.5rem",
              fontWeight: "600",
              lineHeight: "1.5",
              textAlign: "center",
              whiteSpace: "pre-wrap",
              height: textareaHeight, // Same height as textarea
            }}
            dangerouslySetInnerHTML={{ __html: ogData.title || "" }}
          ></div>
        </div>
        {/* OG Image */}
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
        <div className="px-6 py-3 text-center flex gap-2.5 items-center justify-center">
          <div className="flex items-center justify-center gap-1">
            <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
            <span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span>
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
          </div>
          <p className="text-gray-200">বিস্তারিত কমেন্টে</p>
          <div className="flex items-center justify-center gap-1">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="inline-block w-3 h-3 bg-gray-300 rounded-full"></span>
            <span className="inline-block w-4 h-4 bg-gray-200 rounded-full"></span>
          </div>
        </div>
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
};

export default Card;
