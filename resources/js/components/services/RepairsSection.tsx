export default function RepairsSection() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.4em] text-slate-400 uppercase">Repairs</p>
                    <h2 className="text-2xl font-semibold text-slate-900">Body & mechanical restorations</h2>
                </div>
                <span className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-slate-500">
                    OEM & Coachbuilt
                </span>
            </header>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <article className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <h3 className="text-base font-semibold text-slate-900">Mechanical</h3>
                    <p className="mt-2">
                        Engine-out services, transmission rebuilds, hydraulic systems, and electrics handled alongside factory-trained partners.
                    </p>
                </article>
                <article className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <h3 className="text-base font-semibold text-slate-900">Coachwork</h3>
                    <p className="mt-2">Aluminum and carbon repairs, paint-matched refinishing, PPF reapplication, and concours-grade detailing.</p>
                </article>
            </div>
        </section>
    );
}
