export default function LocationSection() {
    return (
        <section className="bg-white py-0">
            <div className="w-full overflow-hidden">
                <iframe
                    title="Luque Tires location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2323.037712073929!2d-122.9569259!3d46.6990475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54915fc7203e120d%3A0x22739607aa0f2bb4!2sLuque%20Tires!5e1!3m2!1sfr!2stn!4v1768936264718!5m2!1sfr!2stn"
                    className="h-[420px] w-full sm:h-[480px] lg:h-[520px]"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </section>
    );
}
