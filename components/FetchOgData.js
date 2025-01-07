const FetchOgData = ({
  url,
  setUrl,
  fetchOgData,
  loading,
  setCardCount,
  error,
}) => (
  <div className="flex items-center justify-center gap-6 w-full">
    {/* URL Input */}
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="Enter URL"
      className="p-3 ring-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
    />

    {/* Fetch Button */}
    <button
      onClick={fetchOgData}
      className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
      disabled={loading}
    >
      {loading ? "Loading..." : "Fetch OG Data"}
    </button>

    {/* Number of Cards Input */}
    <label htmlFor="cardCount" className="text-gray-700">
      Number of Cards:
    </label>
    <input
      id="cardCount"
      type="number"
      onChange={(e) => setCardCount(Number(e.target.value))}
      className="p-3 ring-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
      min="1"
      max="10"
    />

    {/* Error Message */}
    {error && <p className="text-red-500">{error}</p>}
  </div>
);

export default FetchOgData;
