import strivehawkLogo from '../../../images/Strivehawk.png';
import { useLocale } from '../../locales/LocaleProvider';

export default function Footer() {
    const { content: localeContent } = useLocale();
    const currentYear = new Date().getFullYear();
    const { footer } = localeContent;
    return (
        <footer className="border-t border-slate-200 bg-white text-slate-700">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-10">
                <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-700 sm:flex-row lg:text-sm">
                    <p>{footer.privacy.line.replace('{year}', String(currentYear))}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-700 lg:text-sm">
                        <span>{footer.poweredBy}</span>
                        <a href="https://strivehawk.us/" target="_blank" rel="noreferrer">
                            <img src={strivehawkLogo} alt="Strivehawk" className="h-7 w-auto" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
