import { Head } from '@inertiajs/react';

import Layout from '../components/layout/Layout';

export default function ServiceAppointment() {
    return (
        <Layout
            hero={
                <div className="mx-auto flex max-w-3xl flex-col gap-3 text-center">
                    <p className="text-xs font-semibold tracking-[0.4em] text-slate-400 uppercase">Premium care</p>
                    <h1 className="text-4xl font-semibold text-slate-900">Service appointment</h1>
                    <p className="text-base text-slate-500">
                        Schedule a tailored maintenance session for your vehicle. Choose a preferred date and we will confirm the details right away.
                    </p>
                </div>
            }
        >
            <Head title="Service appointment" />
            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-semibold text-slate-900">Request details</h2>
                    <p className="text-sm text-slate-500">All appointments are confirmed within one business day.</p>
                </section>
                <form className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-1 text-sm text-slate-600">
                            <span>Full name</span>
                            <input
                                type="text"
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                placeholder="Adrian Marques"
                            />
                        </label>
                        <label className="space-y-1 text-sm text-slate-600">
                            <span>Email</span>
                            <input
                                type="email"
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                placeholder="hello@luqueatelier.com"
                            />
                        </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-1 text-sm text-slate-600">
                            <span>Preferred date</span>
                            <input
                                type="date"
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                            />
                        </label>
                        <label className="space-y-1 text-sm text-slate-600">
                            <span>Vehicle</span>
                            <input
                                type="text"
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                placeholder="2024 Zagato Vento"
                            />
                        </label>
                    </div>
                    <label className="space-y-1 text-sm text-slate-600">
                        <span>Additional notes</span>
                        <textarea
                            rows={4}
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                            placeholder="Tell us about concerns, upgrades, or requests"
                        />
                    </label>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-rose-600 px-6 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase shadow-sm transition hover:bg-rose-700"
                    >
                        Submit request
                    </button>
                </form>
            </div>
        </Layout>
    );
}
