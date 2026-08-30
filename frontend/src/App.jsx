import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shortenUrl = async (event) => {
    event.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();

      setShortUrl(
        `${window.location.origin}/${data.short_code}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            DevOps Project
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight">
            URL Shortener
          </h1>

          <p className="mt-4 text-slate-400">
            Simple URL shortener built with React, FastAPI and PostgreSQL.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <form onSubmit={shortenUrl}>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Enter your URL
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://github.com"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="mt-6 rounded-xl border border-emerald-900 bg-emerald-950/30 p-5">
              <p className="text-sm text-slate-400">
                Your shortened URL
              </p>

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block break-all text-lg font-semibold text-emerald-400 hover:text-emerald-300"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-600">
          React • FastAPI • PostgreSQL • Docker • Jenkins
        </div>
      </div>
    </div>
  );
}

export default App;