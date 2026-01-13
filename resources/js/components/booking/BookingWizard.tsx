import React from 'react';

export interface BookingWizardProps {
    currentStep: number;
    onStepChange: (step: number) => void;
    onComplete: () => void;
    children: React.ReactNode[];
}

const STEPS = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Vehicle Info' },
    { id: 3, title: 'Service Details' },
    { id: 4, title: 'Appointment' },
    { id: 5, title: 'Customer Info' },
    { id: 6, title: 'Submit' },
];

export default function BookingWizard({ currentStep, onStepChange, onComplete, children }: BookingWizardProps) {
    const childArray = React.Children.toArray(children);

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            onStepChange(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            onStepChange(currentStep - 1);
        }
    };

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="mx-auto max-w-5xl px-4">
                <div className="flex w-full items-start justify-between">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex flex-1 flex-col items-center gap-3">
                            <div className="flex w-full items-center">
                                {index > 0 && <div className={`h-0.5 flex-1 ${currentStep >= step.id ? 'bg-green-700' : 'bg-[#B22222]'}`} />}
                                <button
                                    type="button"
                                    onClick={() => step.id <= currentStep && onStepChange(step.id)}
                                    disabled={step.id > currentStep}
                                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:opacity-100 ${
                                        currentStep >= step.id ? 'bg-green-700 text-white' : 'bg-[#B22222] text-white'
                                    } ${step.id <= currentStep ? 'cursor-pointer hover:bg-green-800' : 'cursor-default'}`}
                                >
                                    {currentStep > step.id ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </button>
                                {index < STEPS.length - 1 && (
                                    <div className={`h-0.5 flex-1 ${currentStep > step.id ? 'bg-green-700' : 'bg-[#B22222]'}`} />
                                )}
                            </div>
                            <div className="w-full">
                                <span
                                    className={`block text-xs font-medium whitespace-nowrap ${
                                        currentStep >= step.id ? 'text-green-700' : 'text-[#B22222]'
                                    } ${index === 0 ? 'text-left' : index === STEPS.length - 1 ? 'text-right' : 'text-center'}`}
                                >
                                    {step.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div>{childArray[currentStep - 1]}</div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="inline-flex cursor-pointer items-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Back
                </button>

                {currentStep < STEPS.length ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex cursor-pointer items-center rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onComplete}
                        className="inline-flex cursor-pointer items-center rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
                    >
                        Confirm Booking
                    </button>
                )}
            </div>
        </div>
    );
}
