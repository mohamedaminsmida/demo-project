import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PageLoaderBar() {
    const [isActive, setIsActive] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let progressTimer: number | undefined;

        const start = () => {
            setIsActive(true);
            setProgress(5);

            if (progressTimer) {
                window.clearInterval(progressTimer);
            }

            progressTimer = window.setInterval(() => {
                setProgress((value) => Math.min(value + 10, 92));
            }, 200);
        };

        const update = () => {
            setProgress((value) => Math.min(value + 5, 96));
        };

        const finish = () => {
            if (progressTimer) {
                window.clearInterval(progressTimer);
                progressTimer = undefined;
            }

            setProgress(100);

            window.setTimeout(() => {
                setIsActive(false);
                setProgress(0);
            }, 350);
        };

        const removeStartListener = router.on('start', start);
        const removeProgressListener = router.on('progress', update);
        const removeFinishListener = router.on('finish', finish);
        const removeErrorListener = router.on('error', finish);

        return () => {
            removeStartListener();
            removeProgressListener();
            removeFinishListener();
            removeErrorListener();

            if (progressTimer) {
                window.clearInterval(progressTimer);
            }
        };
    }, []);

    return (
        <div
            className={`pointer-events-none fixed top-0 left-0 z-50 h-1 bg-green-500 transition-all duration-200 ease-out ${
                isActive ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ width: `${progress}%` }}
        />
    );
}
