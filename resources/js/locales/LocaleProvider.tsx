import { createContext, useContext, useMemo, useState, type PropsWithChildren, type ReactElement } from 'react';

import { locales, type LocaleCode, type LocaleContent } from '.';

type LocaleContextValue = {
    currentCode: LocaleCode;
    content: LocaleContent;
    setLocale: (code: LocaleCode) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: PropsWithChildren): ReactElement {
    const [currentCode, setCurrentCode] = useState<LocaleCode>('EN');
    const content = useMemo(() => locales[currentCode], [currentCode]);
    const value = useMemo<LocaleContextValue>(() => ({ currentCode, content, setLocale: setCurrentCode }), [currentCode, content]);

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
    const context = useContext(LocaleContext);

    if (!context) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }

    return context;
}
