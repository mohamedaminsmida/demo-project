import React from 'react';

import CarIcon from '../../../images/svg/car.svg';
import DateIcon from '../../../images/svg/date.svg';
import PersonIcon from '../../../images/svg/person.svg';
import SendIcon from '../../../images/svg/send.svg';
import ServicesListIcon from '../../../images/svg/services_list.svg';
import ToolIcon from '../../../images/svg/tool.svg';

export interface BookingWizardProps {
    currentStep: number;
    onStepChange: (step: number) => void;
    onComplete: () => void;
    canProceed?: () => boolean;
    children: React.ReactNode[];
}

const STEP_ICON_CLASS = 'h-5 w-5';

const STEPS: { id: number; title: string; icon: string }[] = [
    {
        id: 1,
        title: 'Service',
        icon: ServicesListIcon,
    },
    {
        id: 2,
        title: 'Appointment',
        icon: DateIcon,
    },
    {
        id: 3,
        title: 'Vehicle Info',
        icon: CarIcon,
    },
    {
        id: 4,
        title: 'Service Details',
        icon: ToolIcon,
    },
    {
        id: 5,
        title: 'Customer Info',
        icon: PersonIcon,
    },
    {
        id: 6,
        title: 'Submit',
        icon: SendIcon,
    },
];

export default function BookingWizard({ currentStep, onStepChange, onComplete, canProceed, children }: BookingWizardProps) {
    const childArray = React.Children.toArray(children);

    const handleNext = () => {
        // Check if validation passes before proceeding
        if (canProceed && !canProceed()) {
            return;
        }

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
        <div className="space-y-8 pt-6">
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
                                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold transition-colors disabled:opacity-100 ${
                                        currentStep >= step.id ? 'bg-green-700 text-white' : 'bg-[#B22222] text-white'
                                    } ${step.id <= currentStep ? 'cursor-pointer hover:bg-green-800' : 'cursor-default'}`}
                                >
                                    <span className="flex items-center justify-center">
                                        <img src={step.icon} alt={`${step.title} icon`} className={STEP_ICON_CLASS} />
                                    </span>
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
                        disabled={canProceed ? !canProceed() : false}
                        className="inline-flex cursor-pointer items-center rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-green-700"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onComplete}
                        disabled={canProceed ? !canProceed() : false}
                        className="inline-flex cursor-pointer items-center rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-green-700"
                    >
                        Confirm Booking
                    </button>
                )}
            </div>
        </div>
    );
}
