import type { Competitor } from "@/lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-medium text-text-muted ml-1">
        {rating} ({Math.round(rating * 28)} reviews)
      </span>
    </div>
  );
}

export default function CompetitorSnapshot({
  competitors,
}: {
  competitors: Competitor[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <h2 className="text-xl font-bold text-primary-900 mb-2 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Competitor Snapshot
      </h2>
      <p className="text-text-muted text-sm mb-6">
        Businesses similar to yours operating in your area.
      </p>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-6">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> This is a sample competitor overview based on your industry and location.
          Connect your API keys for real-time competitor data from Google Maps and Yelp.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {competitors.map((comp, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-surface border border-border hover:border-primary-200 transition-colors card-hover"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-primary-900">{comp.name}</h3>
              {comp.distance && (
                <span className="text-xs text-text-muted flex-shrink-0">{comp.distance}</span>
              )}
            </div>
            <StarRating rating={comp.rating} />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {comp.strengths.map((s, j) => (
                <span
                  key={j}
                  className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              {comp.website && (
                <span className="text-xs text-primary-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  Website
                </span>
              )}
              {comp.instagram && (
                <span className="text-xs text-primary-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  {comp.instagram}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
