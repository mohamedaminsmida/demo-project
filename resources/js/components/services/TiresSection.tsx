export default function TiresSection() {
    return (
        <section id="tires-section" className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                    <p className="text-xs font-semibold tracking-[0.4em] text-slate-400 uppercase">Tires & Wheels</p>
                    <h2 className="text-2xl font-semibold text-slate-900">Grip, posture, and presence</h2>
                    <p className="text-sm text-slate-500">
                        OEM-spec sourcing, performance compounds, forged wheel fitments, and seasonal storage—managed as a single, proactive program.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>• Multi-compound tire programs with telemetry feedback</li>
                        <li>• Wheel refinishing, ceramic coating, and balancing</li>
                        <li>• Storage, rotation, and rapid install appointments</li>
                    </ul>
                </div>
                <div className="flex-1 rounded-2xl bg-slate-900 p-6 text-white">
                    <p className="text-sm text-white/70">Featured setup</p>
                    <h3 className="mt-2 text-xl font-semibold">Michelin Pilot Sport 4S • HRE P107SC</h3>
                    <p className="mt-2 text-sm text-white/80">Delivered, heat-cycled, and road-force balanced within 72 hours of approval.</p>
                </div>
            </div>
        </section>
    );
}
