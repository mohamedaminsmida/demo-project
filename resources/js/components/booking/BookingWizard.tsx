import React from 'react';

import CarIcon from '../../../images/svg/car.svg';
import DateIcon from '../../../images/svg/date.svg';
import PersonIcon from '../../../images/svg/person.svg';
import SendIcon from '../../../images/svg/send.svg';
import ServicesListIcon from '../../../images/svg/services_list.svg';
import ToolIcon from '../../../images/svg/tool.svg';
import { useLocale } from '../../locales/LocaleProvider';

import Stepper, { Step } from './Stepper';

export interface BookingWizardProps {
    currentStep: number;
    onStepChange: (step: number) => void;
    onComplete: () => void;
    canProceed?: () => boolean;
    children: React.ReactNode[];
}

const STEP_ICON_CLASS = 'h-5 w-5';

export default function BookingWizard({ currentStep, onStepChange, onComplete, canProceed, children }: BookingWizardProps) {
    const { content: t } = useLocale();
    const childArray = React.Children.toArray(children);

    const STEPS: { id: number; title: string; icon: string }[] = [
        { id: 1, title: t.booking.wizard.steps.service, icon: ServicesListIcon },
        { id: 2, title: t.booking.wizard.steps.appointment, icon: DateIcon },
        { id: 3, title: t.booking.wizard.steps.vehicleInfo, icon: CarIcon },
        { id: 4, title: t.booking.wizard.steps.serviceDetails, icon: ToolIcon },
        { id: 5, title: t.booking.wizard.steps.customerInfo, icon: PersonIcon },
        { id: 6, title: t.booking.wizard.steps.submit, icon: SendIcon },
    ];

    return (
        <div className="space-y-8 overflow-x-hidden pt-6">
            <Stepper
                currentStep={currentStep}
                onStepChange={(step) => {
                    if (step < 1 || step > STEPS.length) return;
                    onStepChange(step);
                }}
                onFinalStepCompleted={onComplete}
                backButtonText={t.booking.wizard.back}
                nextButtonText={t.booking.wizard.continue}
                canProceed={canProceed}
                indicatorContainerClassName="-mx-4 px-4 sm:mx-0 sm:px-0"
                indicatorRowClassName="flex w-full items-start gap-4 py-1 sm:items-start sm:gap-2"
                connectorClassName=""
                renderStepIndicator={({ step, currentStep: activeStep, onStepClick }) => {
                    const meta = STEPS.find((s) => s.id === step);
                    if (!meta) return null;

                    const isActive = step === activeStep;
                    const isDone = activeStep > step;
                    const isAccessible = step <= activeStep;

                    return (
                        <div className="flex snap-center flex-col items-center gap-2 sm:flex-1 sm:gap-3">
                            <button
                                type="button"
                                onClick={() => isAccessible && onStepClick(step)}
                                disabled={!isAccessible}
                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold transition-colors disabled:opacity-60 sm:h-11 sm:w-11 ${
                                    isActive || isDone ? 'bg-green-700 text-white' : 'bg-[#B22222] text-white'
                                } ${isAccessible ? 'cursor-pointer hover:bg-green-800' : 'cursor-default'}`}
                            >
                                <span className="flex items-center justify-center">
                                    <img src={meta.icon} alt={`${meta.title} icon`} className={STEP_ICON_CLASS} />
                                </span>
                            </button>

                            <span
                                className={`max-w-[5.5rem] text-center text-[11px] font-medium sm:max-w-none sm:text-xs ${
                                    isActive || isDone ? 'text-green-700' : 'text-[#B22222]'
                                }`}
                            >
                                {meta.title}
                            </span>
                        </div>
                    );
                }}
            >
                {childArray.map((child, idx) => (
                    <Step key={idx}>{child}</Step>
                ))}
            </Stepper>
        </div>
    );
}
