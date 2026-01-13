export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-semibold text-white">Lumina Studio</p>
                    <p>Building elegant digital products from concept to launch.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div>
                        <p className="text-xs tracking-[0.2em] text-white/30 uppercase">Contact</p>
                        <p>hello@lumina.studio</p>
                    </div>
                    <div>
                        <p className="text-xs tracking-[0.2em] text-white/30 uppercase">Studio</p>
                        <p>Lisbon · Remote</p>
                    </div>
                    <div className="text-white/40">© {new Date().getFullYear()} All rights reserved.</div>
                </div>
            </div>
        </footer>
    );
}
