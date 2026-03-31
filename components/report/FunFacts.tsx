"use client";

const FACTS = [
  {
    number: 1,
    emoji: "🇺🇸",
    fact: "There are 33.2 million small businesses in the U.S. — and you're about to be one of them.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    number: 2,
    emoji: "💪",
    fact: "64% of Americans want to start their own business. You're actually doing it.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    number: 3,
    emoji: "💰",
    fact: "The average millionaire has 7 streams of income. This could be your next one.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    number: 4,
    emoji: "🌱",
    fact: "Small businesses create 1.5 million jobs every year. You're not just building a business — you're building opportunity.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    number: 5,
    emoji: "🚀",
    fact: "80% of successful founders started with less than $10,000. It's not about how much you have — it's about how smart you move.",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    number: 6,
    emoji: "⏰",
    fact: "The best time to start a business was yesterday. The second best time is right now.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    number: 7,
    emoji: "😊",
    fact: "Entrepreneurs are 50% more likely to report being happy with their work than traditional employees.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    number: 8,
    emoji: "💎",
    fact: "Over 50% of Fortune 500 companies were started during a recession. Tough times create the strongest businesses.",
    gradient: "from-primary-500 to-indigo-600",
  },
  {
    number: 9,
    emoji: "🧠",
    fact: "The average age of a successful startup founder is 45. Experience beats everything.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    number: 10,
    emoji: "🎯",
    fact: "You just took the first step that 90% of people never take — going from idea to action.",
    gradient: "from-green-500 to-emerald-600",
  },
];

export default function FunFacts() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-md p-8 sm:p-10 animate-fade-in-up">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-2xl">
            💡
          </div>
          <h2
            className="text-3xl font-bold text-primary-900"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Did You Know?
          </h2>
        </div>
        <div className="h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 ml-15 mt-2" />
        <p className="text-text-muted text-sm mt-3">
          10 reasons to be excited about the journey ahead.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
        {FACTS.map((fact) => (
          <div
            key={fact.number}
            className="relative overflow-hidden rounded-2xl p-5 card-hover"
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${fact.gradient} opacity-10`}
            />
            <div
              className={`absolute inset-0 border-2 rounded-2xl bg-gradient-to-br ${fact.gradient} opacity-20`}
              style={{ border: "1px solid transparent" }}
            />

            <div className="relative flex items-start gap-3">
              {/* Number badge */}
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${fact.gradient} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
              >
                {fact.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl mb-1">{fact.emoji}</div>
                <p className="text-sm text-primary-900 leading-relaxed font-medium">
                  {fact.fact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
