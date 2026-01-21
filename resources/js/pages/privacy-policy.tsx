import { Head } from '@inertiajs/react';

import heroBackgroundImage from '../../images/first_section.png';
import redArrow from '../../images/svg/red-arrow.svg';
import Layout from '../components/layout/Layout';
import OurServicesSection from '../components/services/OurServicesSection';

export default function PrivacyPolicy() {
    const heroBackground = (
        <div
            className="h-full min-h-[260px] w-full bg-cover bg-center bg-no-repeat opacity-95"
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(5,5,5,0.95), rgba(5,5,5,0.88)), url(${heroBackgroundImage})`,
            }}
        />
    );

    return (
        <Layout boxed={false} backgroundColorClass="bg-[#f5f5f5f5]" background={heroBackground}>
            <Head title="Privacy Policy" />

            <div className="space-y-0 bg-[#f5f5f5]">
                <OurServicesSection
                    title="Privacy Policy"
                    showDescription={false}
                    showButton={false}
                    titleClassName="text-[clamp(2rem,3.4vw,3.1rem)] lg:text-[clamp(2.4rem,3.6vw,3.6rem)]"
                />
                <section className="bg-[#f2f0ee] py-16 font-sans">
                    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-10">
                        <div className="space-y-6 text-sm leading-relaxed text-slate-700 sm:text-base lg:text-[20px]">
                            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-[30px]">Last updated: December 2025</h2>
                            <p>
                                Luque Tires respects your privacy and is committed to protecting the personal information you share with us through
                                our website.
                            </p>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">1. Information We Collect</h2>
                                <p>When you visit our website or contact us, we may collect the following information:</p>
                                <ul className="space-y-2">
                                    {['Name', 'Email address', 'Phone number', 'Message content submitted through our contact form'].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <img src={redArrow} alt="" aria-hidden className="mt-1 h-4 w-4" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p>We only collect information that you voluntarily provide to us.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">2. How We Use Your Information</h2>
                                <p>The information we collect is used to:</p>
                                <ul className="space-y-2">
                                    {[
                                        'Respond to inquiries or service requests',
                                        'Contact you regarding your message or requested service',
                                        'Improve our customer service and website experience',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <img src={redArrow} alt="" aria-hidden className="mt-1 h-4 w-4" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p>We do not sell, rent, or trade your personal information.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">3. Cookies &amp; Website Analytics</h2>
                                <p>
                                    Our website may use cookies or similar technologies to improve functionality and analyze traffic. These cookies do
                                    not collect personally identifiable information.
                                </p>
                                <p>You can choose to disable cookies through your browser settings.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">4. Third-Party Services</h2>
                                <p>We may use third-party services such as:</p>
                                <ul className="space-y-2">
                                    {['Google Maps (for location display)', 'Google Reviews (for customer review display)'].map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <img src={redArrow} alt="" aria-hidden className="mt-1 h-4 w-4" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p>
                                    These services may collect data according to their own privacy policies. Luque Tires is not responsible for
                                    third-party privacy practices.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">5. Data Security</h2>
                                <p>
                                    We take reasonable measures to protect your personal information from unauthorized access, disclosure, or misuse.
                                    However, no method of online transmission is 100% secure.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">6. Your Rights</h2>
                                <p>You may request to:</p>
                                <ul className="space-y-2">
                                    {['Access the personal information we have about you', 'Correct or delete your personal information'].map(
                                        (item) => (
                                            <li key={item} className="flex items-start gap-2">
                                                <img src={redArrow} alt="" aria-hidden className="mt-1 h-4 w-4" />
                                                <span>{item}</span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                                <p>To make a request, please contact us using the information below.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">7. Changes to This Policy</h2>
                                <p>
                                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
                                    revision date.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-slate-900 lg:text-[30px]">8. Contact Us</h2>
                                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                                <div className="space-y-1">
                                    <p>Luque Tires</p>
                                    <p>332 Fair St, Centralia, WA 98531</p>
                                    <p>(360) 736-8313</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
