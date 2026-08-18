import { Check, CreditCard, Eye, MessageCircle, Search, ShoppingBag, Sparkles, Volume2 } from "lucide-react"

const SectionLabel = ({ children, tone = "indigo" }: { children: React.ReactNode; tone?: "indigo" | "amber" }) => (
  <p className={`font-mono text-xs font-semibold uppercase tracking-[0.22em] ${tone === "indigo" ? "text-indigo-600" : "text-amber-600"}`}>
    {children}
  </p>
)

export function LunaCaseStudy() {
  const states = [
    { name: "Listening", detail: "A soft pulse confirms Luna is present without interrupting.", icon: Eye },
    { name: "Reasoning", detail: "Visible motion communicates that the system is processing context.", icon: Sparkles },
    { name: "Speaking", detail: "Voice and movement align so responses feel intentional and human.", icon: Volume2 },
  ]

  return (
    <article className="bg-[#f8f7ff] font-sans text-[#17152b]">
      <header className="border-b border-indigo-200 bg-[#17152b] px-6 py-20 text-white md:px-12">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Luna case study</SectionLabel>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-bold leading-tight md:text-6xl">Designing behavior for agentic AI</h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-indigo-100">
            Luna explores how an AI meeting participant can communicate presence, attention, and intent before it ever says a word.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-indigo-100">
            {["Product Designer", "Agentic AI", "Behavior Design", "Figma"].map((item) => <span key={item} className="rounded-full border border-indigo-300/30 px-4 py-2">{item}</span>)}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
        <section className="grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
          <div><SectionLabel>The agentic gap</SectionLabel><h2 className="mt-3 text-3xl font-bold text-balance">AI can work, but can people understand what it is doing?</h2></div>
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-[#4b4864]">
            <p>Most AI interfaces explain themselves through text after an action. In a live meeting, that is too late. People need to know whether an agent is listening, thinking, or preparing to speak in the moment.</p>
            <p>The design challenge was not another chatbot. It was a visible meeting presence with clear non-verbal communication, predictable system states, and behavior people could trust.</p>
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-indigo-100 md:p-10">
          <SectionLabel>Behavior system</SectionLabel>
          <h2 className="mt-3 text-3xl font-bold">Presence through state</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {states.map(({ name, detail, icon: Icon }, index) => (
              <div key={name} className="rounded-2xl bg-indigo-50 p-6">
                <div className="flex items-center justify-between"><Icon className="h-6 w-6 text-indigo-600" /><span className="font-mono text-xs text-indigo-400">0{index + 1}</span></div>
                <h3 className="mt-8 text-xl font-semibold">{name}</h3><p className="mt-2 leading-relaxed text-[#5d5975]">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl bg-[#2f2963] p-8 text-white">
            <MessageCircle className="h-8 w-8 text-indigo-200" />
            <h2 className="mt-8 text-2xl font-bold">The technical bridge</h2>
            <p className="mt-4 leading-relaxed text-indigo-100">Each visual cue maps to a real system event. Listening, reasoning, interruption, response readiness, and error recovery have distinct states, giving engineering a shared behavioral contract instead of a decorative animation spec.</p>
          </div>
          <div className="p-2 md:p-8">
            <SectionLabel>Result</SectionLabel>
            <h2 className="mt-3 text-3xl font-bold text-balance">A participant that feels legible, not magical</h2>
            <ul className="mt-6 flex flex-col gap-4 text-[#4b4864]">
              {["Clear feedback before spoken responses", "Non-verbal cues that reduce uncertainty", "System states designed for implementation", "A reusable behavior language for future agent actions"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" /><span>{item}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="mt-20 border-t border-indigo-200 pt-12">
          <SectionLabel>What I learned</SectionLabel>
          <p className="mt-4 max-w-3xl text-2xl font-medium leading-relaxed text-balance">Agentic products need choreography. Trust is built in the transitions: showing attention, exposing uncertainty, and making the next action understandable before it happens.</p>
        </section>
      </div>
    </article>
  )
}

export function BankOfDanielCaseStudy() {
  const features = [
    { title: "Attached receipts", text: "Every transaction opens into a clear, itemized record of what was purchased.", icon: CreditCard },
    { title: "Searchable history", text: "People can search by merchant, product, category, or memory—not just a statement code.", icon: Search },
    { title: "Reusable lists", text: "Purchased items can become a shopping list without rebuilding the basket from scratch.", icon: ShoppingBag },
  ]

  return (
    <article className="bg-[#f6f4ef] font-sans text-[#171a18]">
      <header className="bg-[#10251d] px-6 py-20 text-white md:px-12">
        <div className="mx-auto max-w-5xl">
          <SectionLabel tone="amber">Bank of Daniel case study</SectionLabel>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-bold leading-tight md:text-6xl">Turning transactions into useful memory</h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#d6dfd9]">A digital receipt experience that transforms the banking statement from a dead-end ledger into searchable, reusable shopping context.</p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-[#d6dfd9]">{["Product Designer", "Fintech", "Information Architecture", "Figma"].map((item) => <span key={item} className="rounded-full border border-white/20 px-4 py-2">{item}</span>)}</div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16 md:px-12">
        <section className="grid gap-10 md:grid-cols-2">
          <div><SectionLabel tone="amber">The transaction black box</SectionLabel><h2 className="mt-3 text-3xl font-bold text-balance">A charge tells you where money went, but not what happened.</h2></div>
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-[#58605b]"><p>Traditional bank activity reduces a purchase to a merchant name, date, and total. The useful details—the items, quantities, and reasons behind the purchase—disappear.</p><p>Bank of Daniel reconnects that lost context by attaching an itemized digital receipt directly to each transaction.</p></div>
        </section>

        <section className="mt-20 rounded-3xl bg-[#10251d] p-6 text-white md:p-10">
          <SectionLabel tone="amber">Transaction to action</SectionLabel>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Transaction", "Digital receipt", "Reusable list"].map((step, index) => <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-6"><span className="font-mono text-xs text-amber-400">STEP 0{index + 1}</span><h3 className="mt-8 text-xl font-semibold">{step}</h3><p className="mt-2 text-sm leading-relaxed text-[#bdc9c1]">{index === 0 ? "Start with a familiar banking record." : index === 1 ? "Reveal exactly what was purchased." : "Save items for the next trip or reorder."}</p></div>)}
          </div>
        </section>

        <section className="mt-20">
          <SectionLabel tone="amber">Core experience</SectionLabel><h2 className="mt-3 text-3xl font-bold">Designed around retrieval</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{features.map(({ title, text, icon: Icon }) => <div key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"><Icon className="h-6 w-6 text-amber-600" /><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 leading-relaxed text-[#636963]">{text}</p></div>)}</div>
        </section>

        <section className="mt-20 grid gap-10 border-t border-black/10 pt-12 md:grid-cols-[1.2fr_0.8fr]">
          <div><SectionLabel tone="amber">Outcome</SectionLabel><h2 className="mt-3 text-3xl font-bold text-balance">Banking history becomes a personal inventory</h2><p className="mt-5 text-lg leading-relaxed text-[#58605b]">The concept makes statements more transparent, supports faster recall, and turns past purchases into useful actions. Instead of leaving the bank app to search email or a retailer account, the evidence and next step stay connected.</p></div>
          <ul className="flex flex-col gap-4 rounded-3xl bg-[#efe9dc] p-8">{["Clearer transaction context", "Faster product retrieval", "Repeat-shopping support", "Saved-item continuity"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><span className="font-medium">{item}</span></li>)}</ul>
        </section>
      </div>
    </article>
  )
}
