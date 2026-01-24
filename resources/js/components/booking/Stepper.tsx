import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

export type StepperRenderIndicatorArgs = {
    step: number;
    currentStep: number;
    onStepClick: (step: number) => void;
};

export type StepperProps = {
    children: React.ReactNode;
    initialStep?: number;
    currentStep?: number;
    onStepChange?: (step: number) => void;
    onFinalStepCompleted?: () => void;
    backButtonText?: string;
    nextButtonText?: string;
    disableStepIndicators?: boolean;
    canProceed?: () => boolean;
    renderStepIndicator?: (args: StepperRenderIndicatorArgs) => React.ReactNode;
    indicatorContainerClassName?: string;
    indicatorRowClassName?: string;
    connectorClassName?: string;
    className?: string;
};

export default function Stepper({
    children,
    initialStep = 1,
    currentStep: controlledStep,
    onStepChange,
    onFinalStepCompleted,
    backButtonText = 'Back',
    nextButtonText = 'Continue',
    disableStepIndicators = false,
    canProceed,
    renderStepIndicator,
    indicatorContainerClassName,
    indicatorRowClassName,
    connectorClassName,
    className,
}: StepperProps) {
    const stepsArray = React.Children.toArray(children);
    const totalSteps = stepsArray.length;

    const [uncontrolledStep, setUncontrolledStep] = React.useState(initialStep);
    const currentStep = controlledStep ?? uncontrolledStep;

    const [direction, setDirection] = React.useState(0);

    const isCompleted = currentStep > totalSteps;
    const isLastStep = currentStep === totalSteps;

    const updateStep = React.useCallback(
        (newStep: number) => {
            if (controlledStep == null) {
                setUncontrolledStep(newStep);
            }

            if (newStep > totalSteps) {
                onFinalStepCompleted?.();
            } else {
                onStepChange?.(newStep);
            }
        },
        [controlledStep, onFinalStepCompleted, onStepChange, totalSteps],
    );

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            updateStep(currentStep - 1);
        }
    };

    const handleNext = () => {
        if (canProceed && !canProceed()) {
            return;
        }

        if (!isLastStep) {
            setDirection(1);
            updateStep(currentStep + 1);
        } else {
            onFinalStepCompleted?.();
        }
    };

    const onClickStep = (clicked: number) => {
        if (clicked === currentStep) return;
        if (disableStepIndicators) return;

        setDirection(clicked > currentStep ? 1 : -1);
        updateStep(clicked);
    };

    const mobileStepWindow = React.useMemo(() => {
        if (totalSteps <= 3) {
            return { start: 1, end: totalSteps };
        }

        const start = Math.min(Math.max(currentStep - 1, 1), totalSteps - 2);
        return { start, end: start + 2 };
    }, [currentStep, totalSteps]);

    return (
        <div className={className}>
            <div className="space-y-8">
                <div className="w-full">
                    <div className={indicatorContainerClassName}>
                        <div className={indicatorRowClassName ?? 'flex w-full items-center gap-2'}>
                            {stepsArray.map((_, index) => {
                                const stepNumber = index + 1;
                                const isNotLastStep = index < totalSteps - 1;
                                const isVisibleOnMobile = stepNumber >= mobileStepWindow.start && stepNumber <= mobileStepWindow.end;
                                const nextStepNumber = stepNumber + 1;
                                const isNextVisibleOnMobile = nextStepNumber >= mobileStepWindow.start && nextStepNumber <= mobileStepWindow.end;

                                const indicatorVisibilityClass = isVisibleOnMobile ? 'contents' : 'hidden sm:contents';
                                const connectorVisibilityClass =
                                    isNotLastStep && isVisibleOnMobile && isNextVisibleOnMobile ? 'contents' : 'hidden sm:contents';

                                return (
                                    <React.Fragment key={stepNumber}>
                                        <div className={indicatorVisibilityClass}>
                                            {renderStepIndicator ? (
                                                renderStepIndicator({
                                                    step: stepNumber,
                                                    currentStep,
                                                    onStepClick: onClickStep,
                                                })
                                            ) : (
                                                <DefaultStepIndicator
                                                    step={stepNumber}
                                                    currentStep={currentStep}
                                                    onClickStep={onClickStep}
                                                    disableStepIndicators={disableStepIndicators}
                                                />
                                            )}
                                        </div>

                                        {isNotLastStep && (
                                            <div className={connectorVisibilityClass}>
                                                <DefaultStepConnector isComplete={currentStep > stepNumber} className={connectorClassName} />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <StepContentWrapper isCompleted={isCompleted} currentStep={currentStep} direction={direction}>
                    {stepsArray[currentStep - 1]}
                </StepContentWrapper>

                {!isCompleted && (
                    <div className="flex flex-col-reverse justify-between gap-3 pt-6 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {backButtonText}
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={canProceed ? !canProceed() : false}
                            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-green-700 sm:w-auto"
                        >
                            {isLastStep ? 'Confirm Booking' : nextButtonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export function Step({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}

function StepContentWrapper({
    isCompleted,
    currentStep,
    direction,
    children,
}: {
    isCompleted: boolean;
    currentStep: number;
    direction: number;
    children: React.ReactNode;
}) {
    const [parentHeight, setParentHeight] = React.useState(0);

    return (
        <motion.div
            style={{ position: 'relative', overflow: 'hidden' }}
            animate={{ height: isCompleted ? 0 : parentHeight }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
        >
            <AnimatePresence initial={false} mode="sync" custom={direction}>
                {!isCompleted && (
                    <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
                        {children}
                    </SlideTransition>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function SlideTransition({
    children,
    direction,
    onHeightReady,
}: {
    children: React.ReactNode;
    direction: number;
    onHeightReady: (height: number) => void;
}) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const lastHeightRef = React.useRef<number>(-1);
    const rafIdRef = React.useRef<number | null>(null);

    React.useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const measure = () => {
            const nextHeight = el.offsetHeight;
            if (nextHeight !== lastHeightRef.current) {
                lastHeightRef.current = nextHeight;
                onHeightReady(nextHeight);
            }
        };

        const scheduleMeasure = () => {
            if (rafIdRef.current != null) return;
            rafIdRef.current = window.requestAnimationFrame(() => {
                rafIdRef.current = null;
                measure();
            });
        };

        measure();

        // Handle dynamic height changes within the same step (e.g. async content like available hours).
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => {
                scheduleMeasure();
            });
            ro.observe(el);
            return () => {
                ro.disconnect();
                if (rafIdRef.current != null) {
                    window.cancelAnimationFrame(rafIdRef.current);
                    rafIdRef.current = null;
                }
            };
        }

        // Fallback: at least re-measure on the next frame.
        const raf = window.requestAnimationFrame(measure);
        return () => window.cancelAnimationFrame(raf);
    }, [onHeightReady]);

    return (
        <motion.div
            ref={containerRef}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
        >
            {children}
        </motion.div>
    );
}

const stepVariants = {
    enter: (dir: number) => ({
        x: dir >= 0 ? '-100%' : '100%',
        opacity: 0,
    }),
    center: {
        x: '0%',
        opacity: 1,
    },
    exit: (dir: number) => ({
        x: dir >= 0 ? '50%' : '-50%',
        opacity: 0,
    }),
};

function DefaultStepIndicator({
    step,
    currentStep,
    onClickStep,
    disableStepIndicators,
    className,
}: {
    step: number;
    currentStep: number;
    onClickStep: (step: number) => void;
    disableStepIndicators: boolean;
    className?: string;
}) {
    const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

    const handleClick = () => {
        if (step !== currentStep && !disableStepIndicators) onClickStep(step);
    };

    const outerClass = status === 'complete' || status === 'active' ? 'bg-green-700 text-white' : 'bg-[#B22222] text-white';

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disableStepIndicators}
            className={`${className ?? ''} flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold transition-colors ${outerClass} ${
                disableStepIndicators ? 'cursor-default opacity-60' : 'cursor-pointer hover:bg-green-800'
            }`}
        >
            {status === 'complete' ? (
                <CheckIcon className="h-5 w-5" />
            ) : status === 'active' ? (
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
            ) : (
                <span>{step}</span>
            )}
        </button>
    );
}

function DefaultStepConnector({ isComplete, className }: { isComplete: boolean; className?: string }) {
    return <div className={`mt-5 h-0.5 flex-1 ${isComplete ? 'bg-green-700' : 'bg-[#B22222]'} ${className ?? ''}`} />;
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
            />
        </svg>
    );
}
