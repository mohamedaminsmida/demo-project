import { Fragment } from 'react';

import { Link } from '@inertiajs/react';

const navLinks = [{ label: 'Home', href: '/', isActive: true }];

export default function Navbar() {
    return (
        <nav className="border-b border-slate-200 bg-[#f7f7f4]">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex flex-1 justify-center gap-6 text-sm font-medium text-slate-500">
                    {navLinks.map((link, index) => (
                        <Fragment key={link.label}>
                            <Link
                                href={link.href}
                                className={
                                    'px-3 py-1 transition ' + (link.isActive ? 'font-semibold text-rose-600' : 'text-slate-600 hover:text-slate-900')
                                }
                            >
                                {link.label}
                            </Link>
                            {index !== navLinks.length - 1 && <span className="text-slate-300">|</span>}
                        </Fragment>
                    ))}
                </div>
            </div>
        </nav>
    );
}
