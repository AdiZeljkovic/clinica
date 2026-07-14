import { Mail, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSeo from '../components/PageSeo';
import PageHero from '../components/PageHero';
import PageCTA from '../components/PageCTA';
import { Reveal, StaggerGroup, StaggerItem, AccordionItem } from '../components/motion';

const faqs = [
  { question: 'Jesu li vaši proizvodi 100% prirodni?', answer: 'Da, svi Bioclinica SWP proizvodi napravljeni su od pažljivo odabranih prirodnih sastojaka i ne sadrže umjetne dodatke, boje ni konzervanse koje tijelo ne može preraditi.' },
  { question: 'Gdje mogu kupiti vaše proizvode?', answer: 'Naši proizvodi dostupni su putem ovlaštenih online ljekarni i specijaliziranih trgovina. Narudžbe je moguće izvršiti putem njihovih webshopova uz brzu dostavu.' },
  { question: 'Smijem li kombinirati više različitih dodataka prehrani?', answer: 'Većina naših proizvoda može se sigurno kombinirati jer su dizajnirani da djeluju sinergijski. Ipak, preporučujemo da se prije istovremenog uzimanja više različitih preparata posavjetujete sa svojim liječnikom.' },
  { question: 'Koliko dugo trebam uzimati proizvode da vidim rezultate?', answer: 'Vrijeme do uočavanja prvih rezultata varira od osobe do osobe. Za optimalne i dugotrajne rezultate preporučuje se kontinuirano uzimanje u trajanju od najmanje 3 mjeseca.' },
  { question: 'Jesu li proizvodi sigurni za trudnice i dojilje?', answer: 'Zbog osjetljivosti ovog razdoblja, trudnicama i dojiljama uvijek savjetujemo konzultaciju s nadležnim ginekologom ili ljekarnikom prije uvođenja bilo kakvih novih dodataka prehrani.' },
  { question: 'Koje je optimalno vrijeme za konzumaciju kapsula?', answer: 'Generalna preporuka je uzimanje kapsula uz obrok, uz čašu vode, jer se tako maksimizira apsorpcija aktivnih nutrijenata i smanjuje mogućnost iritacije želuca.' },
  { question: 'Kako je najbolje čuvati proizvode?', answer: 'Sve proizvode iz Bioclinica linije najbolje je čuvati u originalnom pakiranju na suhom i tamnom mjestu, pri temperaturi do 25°C, strogo izvan dohvata male djece.' },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageSeo pageKey="faq" fallbackTitle="FAQ - Bioclinica" />
      <Header />

      <main className="flex-grow">

        <PageHero
          label="Podrška kupcima"
          title={<>Često postavljana<br /><span style={{ opacity: 0.5 }}>pitanja.</span></>}
          subtitle="Pronađite odgovore na najčešća pitanja o našim proizvodima, sastavu i savjetima za korištenje."
          crumbs={[
            { label: 'Početna', to: '/' },
            { label: 'FAQ' },
          ]}
        />

        {/* ── FAQ + KONTAKT ── */}
        <section className="py-14 sm:py-24 bg-white">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-14 xl:px-20">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

              {/* Lijeva kolona */}
              <div className="lg:col-span-4 lg:sticky lg:top-32">
                <Reveal>
                  <h2 className="font-black text-[#111] tracking-[-0.03em] mb-4"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem' }}>
                    Imate specifičan upit?
                  </h2>
                  <p className="text-gray-400 text-[15px] leading-relaxed mb-8 font-normal">
                    Ako na ovom popisu niste pronašli odgovor koji tražite, naš stručni tim vam je na raspolaganju.
                  </p>

                  <div className="flex flex-col gap-4 rounded-[1.25rem] p-6 border border-gray-100 bg-white"
                    style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.05)' }}>
                    {[
                      { Icon: Mail, label: 'Email', value: 'info@bioclinica.ba', href: 'mailto:info@bioclinica.ba' },
                      { Icon: Phone, label: 'Telefon', value: '+387 33 123 456', href: 'tel:+38733123456' },
                    ].map(({ Icon, label, value, href }, i) => (
                      <div key={label}>
                        {i > 0 && <div className="h-px bg-gray-100 mb-4" />}
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(229,37,42,0.08)' }}>
                            <Icon size={17} className="text-[#e5252a]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                            <a href={href} className="text-[14px] font-bold text-[#111] hover:text-[#e5252a] transition-colors">{value}</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* Accordioni */}
              <StaggerGroup stagger={0.05} className="lg:col-span-8 flex flex-col gap-3">
                {faqs.map((faq, i) => (
                  <StaggerItem key={i} y={20}>
                    <AccordionItem question={faq.question} defaultOpen={i === 0}>
                      {faq.answer}
                    </AccordionItem>
                  </StaggerItem>
                ))}
              </StaggerGroup>

            </div>
          </div>
        </section>

        <PageCTA
          title={<>Trebate dodatni<br />savjet?</>}
          subtitle="Naš stručni tim je tu za vas. Slobodno nam se obratite s bilo kojim pitanjem."
          buttonLabel="Kontaktirajte nas"
          buttonTo="/contact"
        />

      </main>

      <Footer />
    </div>
  );
}
