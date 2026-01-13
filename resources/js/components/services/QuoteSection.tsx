export default function QuoteSection() {
    return (
        <section className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-6 text-center">
            <p className="text-xs font-semibold tracking-[0.4em] text-rose-400 uppercase">Quote</p>
            <blockquote className="mt-4 text-2xl font-semibold text-rose-900">
                “Craft takes time. Reliability takes orchestration. We promise both.”
            </blockquote>
            <p className="mt-4 text-sm text-rose-700">— Luque Atelier service charter, updated quarterly with incoming client feedback.</p>
        </section>
    );
}
