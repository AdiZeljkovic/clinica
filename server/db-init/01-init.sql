--
-- PostgreSQL database dump
--

\restrict uDtJ6FAyhimWPFq0UuaahJ5mYX0d5UfpdmqqHB4Ofna5jeeYz6N6CH12KoOebYv

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    excerpt text,
    content text,
    image_url text,
    slug character varying(255),
    is_published integer DEFAULT 0,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    subject character varying(255),
    message text NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT contact_messages_status_check CHECK (((status)::text = ANY ((ARRAY['new'::character varying, 'read'::character varying, 'replied'::character varying, 'archived'::character varying])::text[])))
);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: hero_slides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_slides (
    id integer NOT NULL,
    tagline character varying(255),
    name1 character varying(255) NOT NULL,
    name2 character varying(255),
    name2b character varying(255),
    sub text,
    image_url text,
    accent_color character varying(20) DEFAULT '#d4600a'::character varying,
    pictograms text,
    product_id character varying(100),
    is_active integer DEFAULT 1,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    image_desktop text,
    image_mobile text
);


--
-- Name: hero_slides_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hero_slides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hero_slides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hero_slides_id_seq OWNED BY public.hero_slides.id;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    is_active integer DEFAULT 1,
    source character varying(20) DEFAULT 'footer'::character varying,
    subscribed_at timestamp without time zone DEFAULT now(),
    unsubscribed_at timestamp without time zone,
    CONSTRAINT newsletter_subscribers_source_check CHECK (((source)::text = ANY ((ARRAY['header'::character varying, 'footer'::character varying, 'popup'::character varying])::text[])))
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: product_benefits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_benefits (
    id integer NOT NULL,
    product_id character varying(100) NOT NULL,
    benefit character varying(255) NOT NULL,
    sort_order integer DEFAULT 0
);


--
-- Name: product_benefits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_benefits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_benefits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_benefits_id_seq OWNED BY public.product_benefits.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id character varying(100) NOT NULL,
    image_url text NOT NULL,
    alt_text character varying(255),
    sort_order integer DEFAULT 0
);


--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id character varying(100) NOT NULL,
    category_id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    tagline character varying(255),
    short_description text,
    usage_instructions text,
    composition text,
    warnings text,
    storage_temp character varying(255),
    country_of_origin character varying(100),
    packaging character varying(100),
    price numeric(10,2) NOT NULL,
    image_url text,
    is_active integer DEFAULT 1,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: seo_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_settings (
    id integer NOT NULL,
    page_key character varying(100) NOT NULL,
    page_label character varying(255),
    meta_title character varying(255),
    meta_description text,
    og_title character varying(255),
    og_description text,
    og_image text,
    canonical_url text,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seo_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seo_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seo_settings_id_seq OWNED BY public.seo_settings.id;


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: hero_slides id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_slides ALTER COLUMN id SET DEFAULT nextval('public.hero_slides_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: product_benefits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_benefits ALTER COLUMN id SET DEFAULT nextval('public.product_benefits_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: seo_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings ALTER COLUMN id SET DEFAULT nextval('public.seo_settings_id_seq'::regclass);


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_users (id, username, email, password_hash, created_at, updated_at) FROM stdin;
1	admin	admin@bioclinica.ba	$2a$10$cvPivwUxgsWHAGyYlgLOJ.9fMBEz3FmG5xZLMvXcyOru2sml7Avoa	2026-06-02 09:10:26	2026-06-02 09:54:17
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_posts (id, title, excerpt, content, image_url, slug, is_published, published_at, created_at, updated_at) FROM stdin;
post-1	Kako kurkuma pomaže vašim zglobovima?	Saznajte sve o nevjerojatnim protuupalnim svojstvima kurkume i kako može poboljšati vašu pokretljivost.	Kurkuma, začin duboko žute boje koji se tradicionalno koristi u indijskoj kuhinji i ayurvedskoj medicini, dobiva sve više pažnje u suvremenoj znanosti zbog svojih moćnih protuupalnih svojstava.\n\nJedan od glavnih izazova kod kurkumina je njegova niska bioraspoloživost. Zbog toga se u kvalitetnim dodacima prehrani kurkumin često kombinira s ekstraktom crnog papra (piperinom), koji dokazano povećava apsorpciju kurkumina za čak 2000%.\n\nOsim što djeluje protuupalno, kurkumin je i snažan antioksidans koji neutralizira slobodne radikale, smanjujući oksidativni stres u tijelu.	https://images.unsplash.com/photo-1615486171430-84358a9e1e32?auto=format&fit=crop&q=80&w=600&h=400	kako-kurkuma-pomaze-vasim-zglobovima	1	2023-10-10 08:00:00	2026-06-02 08:51:30	2026-06-02 08:51:30
post-2	5 savjeta za prirodno mršavljenje	Otkrijte kako na zdrav i prirodan način doći do željene težine uz pomoć pravih dodataka prehrani.	Mršavljenje ne mora značiti rigorozne dijete i iscrpljujuće treninge. Ključ trajnog gubitka težine leži u postepenim promjenama životnih navika i pametnom korištenju prirodnih dodataka prehrani.\n\n1. Hidratacija je ključ\n2. Birajte cjelovite namirnice\n3. Uključite proteine u svaki obrok\n4. San je važniji nego što mislite\n5. Pametno koristite dodatke prehrani	https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600&h=400	5-savjeta-za-prirodno-mrsavljenje	1	2023-09-02 08:00:00	2026-06-02 08:51:30	2026-06-02 08:51:30
post-3	Zašto je zdravlje prostate važno	Preventiva je ključ. Pročitajte naše savjete za održavanje zdravog urološkog sustava.	Prostata je mala žlijezda koja igra bitnu ulogu u muškom reproduktivnom sustavu, no mnogi muškarci ne obraćaju pažnju na njeno zdravlje sve dok se ne pojave prvi simptomi.\n\nRedoviti pregledi od iznimne su važnosti za rano otkrivanje problema, no postoje i brojni prirodni načini za proaktivnu brigu o zdravlju prostate.	https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=600&h=400	zasto-je-zdravlje-prostate-vazno	1	2023-08-15 08:00:00	2026-06-02 08:51:30	2026-06-02 08:51:30
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, description, sort_order, created_at, updated_at) FROM stdin;
kosti-zglobovi-misici	Kosti, zglobovi i mišići	Kurkuma i drugi prirodni ekstrakti za zdravlje zglobova i mišića.	2	2026-06-02 08:51:30	2026-06-02 08:51:30
mrsavljenje	Mršavljenje	Prirodni sagorijevači masti i dodaci koji podržavaju metabolizam.	3	2026-06-02 08:51:30	2026-06-02 08:51:30
zdravlje-prostate	Zdravlje prostate	Prirodni dodaci za zdravlje urološkog sustava i prostate.	1	2026-06-02 08:51:30	2026-06-02 08:51:30
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, first_name, last_name, email, subject, message, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hero_slides; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero_slides (id, tagline, name1, name2, name2b, sub, image_url, accent_color, pictograms, product_id, is_active, sort_order, created_at, updated_at, image_desktop, image_mobile) FROM stdin;
5	PRIRODAN PUT DO VITKE LINIJE	CITRAX		FORTE	Snagom gorke narandže pomaže u gubitku kilograma i kontroli apetita.	\N	#e5252a	[{"src":"/slike/Pictograms_Weight loss .png","label":"Gubitak kilograma"},{"src":"/slike/Pictograms_Appetite control .png","label":"Kontrola apetita"},{"src":"/slike/Pictograms_Fat breakdown .png","label":"Razgradnja masti"}]	citrax-forte-30	1	0	2026-07-27 19:45:52.157074	2026-07-27 19:45:52.157074	/slike/hero/hero-desktop-citrax-forte.png	/slike/hero/hero-mobile-citrax-forte.png
6	HLADNA NJEGA ZA UMORENE MIŠIĆE	KURKUMA	CREAM	COLD	Uz efekat hlađenja i 15 biljnih ekstrakata, osvježava i opušta umorne mišiće.	\N	#0ea5e9	[{"src":"/slike/Pictograms_Cooling effect.png","label":"Efekat hlađenja"},{"src":"/slike/Pictograms_Muscle relax cold.svg","label":"Opuštanje mišića"},{"src":"/slike/Pictograms_After-sport relaxation .png","label":"Sportski oporavak"}]	kurkuma-cream-cold-225	1	1	2026-07-27 19:45:52.157074	2026-07-27 19:45:52.157074	/slike/hero/hero-desktop-kurkuma-cream-cold.png	/slike/hero/hero-mobile-kurkuma-cream-cold.png
7	TOPLINA KOJA PRUŽA OLAKŠANJE	KURKUMA	CREAM	HOT	Uz efekat topline i 11 biljnih ekstrakata, opušta napete mišiće i ukočene zglobove.	\N	#e5252a	[{"src":"/slike/Pictograms_Warming effect .png","label":"Efekt topline"},{"src":"/slike/Pictograms_Circulation.png","label":"Bolja prokrvljenost"},{"src":"/slike/Pictograms_Muscles joints.svg","label":"Mišići i zglobovi"},{"src":"/slike/Pictograms_Application zone .png","label":"Dermatološki testirano"},{"src":"/slike/Pictograms_Joint zone (rheumatic) .png","label":"Quality guarantee"}]	kurkuma-cream-hot-225	1	2	2026-07-27 19:45:52.157074	2026-07-27 19:45:52.157074	/slike/hero/hero-desktop-kurkuma-cream-hot.png	/slike/hero/hero-mobile-kurkuma-cream-hot.png
8	SLOBODA POKRETA	KURKUMA		FORTE	Kurkumin i prirodni antioksidansi za zdrave zglobove, smanjenje upala i slobodu pokreta.	\N	#e5252a	[{"src":"/slike/Pictograms_Joints_ bones _ muscles .png","label":"Zglobovi, kosti i mišići"},{"src":"/slike/Pictograms_Mobility.svg","label":"Pokretljivost"},{"src":"/slike/Pictograms_Connective tissue .png","label":"Vezivno tkivo"},{"src":"/slike/Pictograms_After-sport relaxation .png","label":"Oporavak"}]	kurkuma-forte-30	1	3	2026-07-27 19:45:52.157074	2026-07-27 19:45:52.157074	/slike/hero/hero-desktop-kurkuma-forte.png	/slike/hero/hero-mobile-kurkuma-forte.png
9	PODRŠKA ZDRAVLJU PROSTATE	URASAN		FORTE	Ekstrakt sjemena bundeve i cink podržavaju urinarni komfor i mušku vitalnost.	\N	#e5252a	[{"src":"/slike/Pictograms_Pumpkin seed.svg","label":"Sjeme bundeve"},{"src":"/slike/Pictograms_Men's health .png","label":"Muško zdravlje"},{"src":"/slike/Pictograms_Urinary function .png","label":"Urinarni sustav"},{"src":"/slike/Pictograms_Zinc.png","label":"Cink"}]	urasan-forte-30	1	4	2026-07-27 19:45:52.157074	2026-07-27 19:45:52.157074	/slike/hero/hero-desktop-urasan-forte.png	/slike/hero/hero-mobile-urasan-forte.png
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.newsletter_subscribers (id, email, is_active, source, subscribed_at, unsubscribed_at) FROM stdin;
\.


--
-- Data for Name: product_benefits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_benefits (id, product_id, benefit, sort_order) FROM stdin;
35	citrax-forte-60	Pomaže u gubitku kilograma	0
36	citrax-forte-60	Podržava kontrolu apetita	1
37	citrax-forte-60	Podstiče metabolizam	2
38	citrax-forte-60	Doprinosi razgradnji masti	3
39	kurkuma-forte-30	Doprinosi održavanju zdravlja zglobova, kostiju i mišića	0
40	kurkuma-forte-30	Doprinosi smanjenju bola, upala, otoka i ukočenosti zglobova	1
41	kurkuma-forte-30	Podržava elastičnost tetiva i ligamenata	2
42	kurkuma-forte-30	Pomaže kod reumatskih oboljenja – artritisa i osteoartritisa	3
43	kurkuma-forte-30	Pomaže kod poremećaja vezivnog tkiva	4
44	kurkuma-forte-60	Doprinosi održavanju zdravlja zglobova, kostiju i mišića	0
45	kurkuma-forte-60	Doprinosi smanjenju bola, upala, otoka i ukočenosti zglobova	1
46	kurkuma-forte-60	Podržava elastičnost tetiva i ligamenata	2
47	kurkuma-forte-60	Pomaže kod reumatskih oboljenja – artritisa i osteoartritisa	3
48	kurkuma-forte-60	Pomaže kod poremećaja vezivnog tkiva	4
49	urasan-forte-30	Podržava zdravlje prostate kod odraslih muškaraca	0
50	urasan-forte-30	Pomaže kod problema sa mokrenjem usljed uvećane prostate (BHP) ili nadražene mokraćne bešike	1
51	urasan-forte-30	Sadrži ekstrakt sjemena bundeve, čija je efikasnost potvrđena u brojnim studijama	2
52	urasan-forte-30	Sadrži cink, koji doprinosi normalnoj plodnosti, reprodukciji, nivou testosterona i funkciji imuniteta	3
53	urasan-forte-30	Sadrži vitamin E, koji doprinosi zaštiti ćelija od oksidativnog stresa	4
54	urasan-forte-60	Podržava zdravlje prostate kod odraslih muškaraca	0
55	urasan-forte-60	Pomaže kod problema sa mokrenjem usljed uvećane prostate (BHP) ili nadražene mokraćne bešike	1
56	urasan-forte-60	Sadrži ekstrakt sjemena bundeve, čija je efikasnost potvrđena u brojnim studijama	2
57	urasan-forte-60	Sadrži cink, koji doprinosi normalnoj plodnosti, reprodukciji, nivou testosterona i funkciji imuniteta	3
58	urasan-forte-60	Sadrži vitamin E, koji doprinosi zaštiti ćelija od oksidativnog stresa	4
59	kurkuma-cream-hot-225	Snažan efekat zagrijavanja i prijatne topline koja dugo traje na mjestu nanošenja	0
60	kurkuma-cream-hot-225	Pomaže kod reumatskih tegoba – artritisa i artroze	1
61	kurkuma-cream-hot-225	Doprinosi smanjenju bola, upala, otoka i ukočenosti (zglobovi, mišići, leđa, vrat)	2
63	kurkuma-cream-hot-225	Opušta umorne noge i stopala i daje osjećaj udobnosti	4
64	kurkuma-cream-hot-225	Pospješuje perifernu cirkulaciju i prokrvljenost kože	5
65	kurkuma-cream-hot-100	Snažan efekat zagrijavanja i prijatne topline koja dugo traje na mjestu nanošenja	0
66	kurkuma-cream-hot-100	Pomaže kod reumatskih tegoba – artritisa i artroze	1
67	kurkuma-cream-hot-100	Doprinosi smanjenju bola, upala, otoka i ukočenosti (zglobovi, mišići, leđa, vrat)	2
69	kurkuma-cream-hot-100	Opušta umorne noge i stopala i daje osjećaj udobnosti	4
70	kurkuma-cream-hot-100	Pospješuje perifernu cirkulaciju i prokrvljenost kože	5
71	kurkuma-cream-cold-225	Snažan efekat hlađenja na mjestu nanošenja	0
72	kurkuma-cream-cold-225	Opušta umorne, otečene noge i umanjuje osjećaj težine usljed dugotrajnog stajanja i hodanja	1
73	kurkuma-cream-cold-225	Doprinosi smanjenju bola u mišićima	2
74	kurkuma-cream-cold-225	Pomaže kod akutnih (trenutnih) upalnih stanja	3
75	kurkuma-cream-cold-225	Opušta mišiće poslije sportskih aktivnosti	4
76	kurkuma-cream-cold-225	Pospješuje prokrvljenost, njeguje i štiti kožu	5
77	kurkuma-cream-cold-100	Snažan efekat hlađenja na mjestu nanošenja	0
78	kurkuma-cream-cold-100	Opušta umorne, otečene noge i umanjuje osjećaj težine usljed dugotrajnog stajanja i hodanja	1
79	kurkuma-cream-cold-100	Doprinosi smanjenju bola u mišićima	2
80	kurkuma-cream-cold-100	Pomaže kod akutnih (trenutnih) upalnih stanja	3
81	kurkuma-cream-cold-100	Opušta mišiće poslije sportskih aktivnosti	4
82	kurkuma-cream-cold-100	Pospješuje prokrvljenost, njeguje i štiti kožu	5
62	kurkuma-cream-hot-225	Pomaže u regeneraciji zglobova i mišića	3
68	kurkuma-cream-hot-100	Pomaže u regeneraciji zglobova i mišića	3
83	citrax-forte-30	Pomaže u gubitku kilograma	0
84	citrax-forte-30	Podržava kontrolu apetita	1
85	citrax-forte-30	Podstiče metabolizam	2
86	citrax-forte-30	Doprinosi razgradnji masti	3
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, image_url, alt_text, sort_order) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, category_id, name, tagline, short_description, usage_instructions, composition, warnings, storage_temp, country_of_origin, packaging, price, image_url, is_active, sort_order, created_at, updated_at) FROM stdin;
citrax-forte-60	mrsavljenje	CITRAX FORTE	Kada želite smršati	Citrax Forte je dijetetski suplement na bazi gorke narandže, sa vitaminom C i cinkom, koji pomaže u gubitku kilograma.	2 puta po 1 kapsula prije obroka sa čašom vode.	2 kapsule \r\nSuvi ekstrakt ploda gorke narandže 250 mg \r\n(Citrus Aurantium)(6% sinefrina)\r\nVitamin C  12 mg                                                                                          Cink 4,5 mg	•Osobe koje uzimaju lijekove, prije upotrebe proizvoda treba da se posavjetuju sa ljekarom ili \r\nfarmaceutom. Ne preporučuje se trudnicama i dojiljama. Preporučena dnevna doza se ne smije prekoračiti.                                                                      •Dodaci ishrani nisu zamjena za raznovrsnu i uravnoteženu ishranu i zdrav način života. Čuvati van  domašaja djece.	Čuvati u originalnom pakovanju, zaštićeno od svjetlosti i vlage, na sobnoj temperaturi	Republika Srbija	60 kapsula	0.00	/slike/citrax-forte-60-kapsula.png	1	2	2026-06-25 20:12:56	2026-06-25 20:20:03
kurkuma-cream-cold-100	kosti-zglobovi-misici	KURKUMA CREAM COLD	Krema koja hladi — za otok, napetost i umorne noge	Kurkuma Cream Cold je krema za masažu ruku, vrata, ramena, leđa i nogu, sa snažnim efektom hlađenja, na bazi etarskog ulja kurkume i 15 biljnih ekstrakata. Pomaže kod akutnih upalnih stanja, otoka i bolova u mišićima, kao i kod opuštanja mišića poslije sportskih aktivnosti.	Nanijeti malu količinu kreme na željenu regiju. Lagano kružnim pokretima kremu utrljati u kožu do potpunog upijanja. Krema se može koristiti više puta u toku dana i po potrebi.	SASTAV KREME:\r\netarsko ulje kurkume\r\nekstrakt kurkume\r\nekstrakt hajdučke trave\r\nekstrakt ruzmarina\r\nekstrakt timijana\r\nekstrakt divljeg kestena\r\nekstrakt bokvice\r\nekstrakt gaveza\r\nekstrakt kantariona\r\nekstrakt kamilice\r\nekstrakt šipka\r\nekstrakt koprive\r\nekstrakt arnike\r\nekstrakt đumbira\r\nekstrakt hamemelisa\r\nekstrakt majčine dušice	•Držati van domašaja djece! Samo za spoljašnju upotrebu! Izbegavati kontakt proizvoda sa očima! U slučaju kontakta sa očima, temeljno isperite vodom! Ako postoji osip ili crvenilo nemojte koristiti proizvod! Ne koristite ako ste alergični na bilo koji od sastojaka!	Čuvati proizvod na temperaturi od 5- 25°C u originalnoj ambalaži. Ne izlagati prozivod visokim temperaturama i direktnoj sunčevoj svjetlosti.	Republika Srbija	100 ML	0.00	/slike/kurkuma-cream-cold-100ml.png	1	10	2026-06-25 20:12:56	2026-06-25 20:20:04
kurkuma-cream-cold-225	kosti-zglobovi-misici	KURKUMA CREAM COLD	Krema koja hladi — za otok, napetost i umorne noge	Kurkuma Cream Cold je krema za masažu ruku, vrata, ramena, leđa i nogu, sa snažnim efektom hlađenja, na bazi etarskog ulja kurkume i 15 biljnih ekstrakata. Pomaže kod akutnih upalnih stanja, otoka i bolova u mišićima, kao i kod opuštanja mišića poslije sportskih aktivnosti.	Nanijeti malu količinu kreme na željenu regiju. Lagano kružnim pokretima kremu utrljati u kožu do potpunog upijanja. Krema se može koristiti više puta u toku dana i po potrebi.	SASTAV KREME:\r\netarsko ulje kurkume\r\nekstrakt kurkume\r\nekstrakt hajdučke trave\r\nekstrakt ruzmarina\r\nekstrakt timijana\r\nekstrakt divljeg kestena\r\nekstrakt bokvice\r\nekstrakt gaveza\r\nekstrakt kantariona\r\nekstrakt kamilice\r\nekstrakt šipka\r\nekstrakt koprive\r\nekstrakt arnike\r\nekstrakt đumbira\r\nekstrakt hamemelisa\r\nekstrakt majčine dušice	•Držati van domašaja djece! Samo za spoljašnju upotrebu! Izbegavati kontakt proizvoda sa očima! U slučaju kontakta sa očima, temeljno isperite vodom! Ako postoji osip ili crvenilo nemojte koristiti proizvod! Ne koristite ako ste alergični na bilo koji od sastojaka!	Čuvati proizvod na temperaturi od 5- 25°C u originalnoj ambalaži. Ne izlagati prozivod visokim temperaturama i direktnoj sunčevoj svjetlosti.	Republika Srbija	225 ML	0.00	/slike/kurkuma-cream-cold-225ml.png	1	9	2026-06-25 20:12:56	2026-06-25 20:20:04
citrax-forte-30	mrsavljenje	CITRAX FORTE	Kada želite smršati	Citrax Forte je dijetetski suplement na bazi gorke narandže, sa vitaminom C i cinkom, koji pomaže u gubitku kilograma.	2 puta po 1 kapsula prije obroka sa čašom vode.	2 kapsule \r\nSuvi ekstrakt ploda gorke narandže  250 mg \r\n(Citrus Aurantium)(6% sinefrina)\r\nVitamin C  12 mg                                                                                            Cink 4,5 mg	•Osobe koje uzimaju lijekove, prije upotrebe proizvoda treba da se posavjetuju sa ljekarom ili \r\nfarmaceutom. Ne preporučuje se trudnicama i dojiljama. Preporučena dnevna doza se ne smije prekoračiti.                                                                      •Dodaci ishrani nisu zamjena za raznovrsnu i uravnoteženu ishranu i zdrav način života. Čuvati van  domašaja djece.	Čuvati u originalnom pakovanju, zaštićeno od svjetlosti i vlage, na sobnoj temperaturi	Republika Srbija	30 kapsula	0.00	/slike/citrax-forte-30-kapsula.png	1	1	2026-06-25 20:12:56	2026-07-27 19:52:48.641142
kurkuma-forte-30	kosti-zglobovi-misici	KURKUMA FORTE	Za zdrave kosti i pokretljive zglobove	Kurkuma forte je dijetetski suplement na bazi kurkume, sa vitaminom C, vitaminom E i cinkom, koji pomaže u očuvanju zdravlja kostiju i zglobova.	Odrasli 2 puta po 1 kapsula dnevno sa malo vode.	2 kapsule \r\nSuvi ekstrakt korena kurkume 100 mg \r\n(Curcuma Longa, rhizome, 95 % kurkumina)\r\nL-askorbinska kiselina (Vitamin C) 80 mg\r\nDL-α-tokoferol acetate (Vitamin E) TE** 12 mg \r\nCink 10 mg	•Dodaci ishrani se ne mogu koristiti kao zamjena za razvnovrsnu ishranu! Proizvod treba držati van domašaja male djece! Uravnotežena i raznovrsna ishrana i zdrav način života su važni za vaše zdravlje!                                                                                •Ne smije se prekoračiti preporučena dnevna doza! Ne preporučuje se primjena kod djece, trudnica, dojilja, kao i osobama preosjetljivim na neki od sastojaka. U slučaju preosjetljivosti, treba prekinuti upotrebu i posavjetovati se sa ljekarom. Proizvod na bazi kurkume su kontraindikovani kod opstrukcije žučnih puteva i oboljenja jetre, a moguće su i rekacije preoseltjivosti. Potreban je oprez kod uzimanja kurkume i lijekova protiv zgrušnjavanja krvi, jer može potencirati djelovanje antikoagulanasa. Prekinuti primjenu proizvoda u slučaju perzistentne dijareje. Prekomerna upotreba može izazvati laksativni efekat.	Čuvati u originalnom pakovanju, zaštićeno od svjetlosti i vlage, na sobnoj temperaturi.	Republika Srbija	30 kapsula	0.00	/slike/kurkuma-forte-30-kapsula.png	1	3	2026-06-25 20:12:56	2026-06-25 20:20:03
kurkuma-forte-60	kosti-zglobovi-misici	KURKUMA FORTE	Za zdrave kosti i pokretljive zglobove	Kurkuma forte je dijetetski suplement na bazi kurkume, sa vitaminom C, vitaminom E i cinkom, koji pomaže u očuvanju zdravlja kostiju i zglobova.	Odrasli 2 puta po 1 kapsula dnevno sa malo vode.	2 kapsule \r\nSuvi ekstrakt korena kurkume 100 mg (Curcuma Longa, rhizome, 95 % kurkumina)\r\nL-askorbinska kiselina (Vitamin C) 80 mg\r\nDL-α-tokoferol acetate (Vitamin E) TE** 12 mg \r\nCink 10 mg	•Dodaci ishrani se ne mogu koristiti kao zamjena za razvnovrsnu ishranu! Proizvod treba držati van domašaja male djece! Uravnotežena i raznovrsna ishrana i zdrav način života su važni za vaše zdravlje!                                                                               •Ne smije se prekoračiti preporučena dnevna doza! Ne preporučuje se primjena kod djece, trudnica, dojilja, kao i osobama preosjetljivim na neki od sastojaka. U slučaju preosjetljivosti, treba prekinuti upotrebu i posavjetovati se sa ljekarom. Proizvod na bazi kurkume su kontraindikovani kod opstrukcije žučnih puteva i oboljenja jetre, a moguće su i rekacije preoseltjivosti. Potreban je oprez kod uzimanja kurkume i lijekova protiv zgrušnjavanja krvi, jer može potencirati djelovanje antikoagulanasa. Prekinuti primjenu proizvoda u slučaju perzistentne dijareje. Prekomerna upotreba može izazvati laksativni efekat.	Čuvati u originalnom pakovanju, zaštićeno od svjetlosti i vlage, na sobnoj temperaturi.	Republika Srbija	60 kapsula	0.00	/slike/kurkuma-forte-60-kapsula.png	1	4	2026-06-25 20:12:56	2026-06-25 20:20:03
urasan-forte-30	zdravlje-prostate	URASAN FORTE	Za zdravlje prostate kod odraslih muškaraca	Urasan Forte je dijetetski suplement namijenjen muškarcima koji imaju probleme sa mokrenjem usljed uvećane prostate (benigna hiperplazija prostate – BHP) ili nadražene mokraćne bešike.	1-2 puta dnevno po 1 kapsula sa malo vode	1 kapsula                                                                                                    Suvi ekstrakt sjemena bundeve (Cucurbita moschata Dush) 50mg                                                                                   Vitamin E  6 mg (α-TE)\r\nCink  7,24 mg	•Dodaci ishrani nisu zamjena za raznovrsnu  ishranu i zdrav način života. Čuvati van domašaja male djece.                                                     •Proizvod nije namijenjen djeci i osobama mladjim od 18 godina, kao ni osobama preosjetjivim na bilo koji sastojak preparata. Osobe koje imaju neko dijagnostikovano oboljenje i/ili koriste lijekove, prije upotrebe preparata treba da se posavjetuju sa ljekarom ili farmaceutom. Preporučena dnevna doza se ne smije prekoračiti. .	Čuvati u originalnom pakovanju, zaštićeno od svjetlosti i vlage, na sobnoj temperaturi.	Republika Srbija	30 kapsula	0.00	/slike/urasan-forte-30-kapsula.png	1	5	2026-06-25 20:12:56	2026-06-25 20:20:03
urasan-forte-60	zdravlje-prostate	URASAN FORTE	Za zdravlje prostate kod odraslih muškaraca	Urasan Forte je dijetetski suplement namijenjen muškarcima koji imaju probleme sa mokrenjem usljed uvećane prostate (benigna hiperplazija prostate – BHP) ili nadražene mokraćne bešike.	1-2 puta dnevno po 1 kapsula sa malo vode	1 kapsula                                                                                                    Suvi ekstrakt sjemena bundeve (Cucurbita moschata Dush) 50mg                                                                                   Vitamin E  6 mg (α-TE)\r\nCink  7,24 mg	•Dodaci ishrani nisu zamjena za raznovrsnu  ishranu i zdrav način života. Čuvati van domašaja male djece.                                                     •Proizvod nije namijenjen djeci i osobama mladjim od 18 godina, kao ni osobama preosjetjivim na bilo koji sastojak preparata. Osobe koje imaju neko dijagnostikovano oboljenje i/ili koriste lijekove, prije upotrebe preparata treba da se posavjetuju sa ljekarom ili farmaceutom. Preporučena dnevna doza se ne smije prekoračiti. .	Čuvati u originalnom pakovanju, zaštićeno od svjetlosti i vlage, na sobnoj temperaturi.	Republika Srbija	60 kapsula	0.00	/slike/urasan-forte-60-kapsula.png	1	6	2026-06-25 20:12:56	2026-06-25 20:20:03
kurkuma-cream-hot-100	kosti-zglobovi-misici	KURKUMA CREAM HOT	Krema koja grije — za napete mišiće i ukočene zglobove	Kurkuma Cream Hot je krema za masažu vrata, ramena, leđa, ruku i nogu, sa snažnim efektom zagrijavanja, na bazi kurkume i 11 biljnih ekstrakata. Pomaže kod ukočenosti i napetosti mišića i zglobova, kao i kod reumatskih tegoba.	Nanijeti malu količinu kreme na željenu regiju. Lagano kružnim pokretima kremu utrljati u kožu do potpunog upijanja. Krema se lako razmazuje i brzo upija.	Sastav kreme:\r\nEtarsko ulje kurkume\r\nEkstrakt kurkume\r\nEkstrakt hajdučke trave\r\nEkstrakt gaveza\r\nEkstrakt bokvice\r\nEkstrakt divizme\r\nEkstrakt lopuha\r\nEkstrakt kamilice\r\nEkstrakt ruzmarina\r\nEkstrakt kantariona\r\nEkstrakt hamamelisa\r\nEkstrakt morskih algi\r\nEkstrakt lista aloe vera	•Držati van domašaja djece! Samo za spoljašnju upotrebu! U slučaju kontakta sa očima, temeljno isperite vodom! Uradite test osjetijivosti prije upotrebe! Upotreba proizvoda se ne preporučuje osobama koje su preosjetljive na bilo koji sastojak proizvoda! Izbegavajte kontakt proizvoda sa očima, sluzokožom ill oštećenom kožom! Osobe sa proširenim venama ne bi trebalo da koriste proizvod! Ako postoji osip ili crvenilo - nemojte koristiti proizvod.	Čuvati proizvod na temperaturi od 5- 25°C u originalnoj ambalaži. Ne izlagati prozivod visokim temperaturama i direktnoj sunčevoj svjetlosti.	Republika Srbija	100 ML	0.00	/slike/kurkuma-cream-hot-100ml.png	1	8	2026-06-25 20:12:56	2026-07-27 19:02:23.903983
kurkuma-cream-hot-225	kosti-zglobovi-misici	KURKUMA CREAM HOT	Krema koja grije — za napete mišiće i ukočene zglobove	Kurkuma Cream Hot je krema za masažu vrata, ramena, leđa, ruku i nogu, sa snažnim efektom zagrijavanja, na bazi kurkume i 11 biljnih ekstrakata. Pomaže kod ukočenosti i napetosti mišića i zglobova, kao i kod reumatskih tegoba.	Nanijeti malu količinu kreme na željenu regiju. Lagano kružnim pokretima kremu utrljati u kožu do potpunog upijanja. Krema se lako razmazuje i brzo upija.	Sastav kreme:\r\nEtarsko ulje kurkume\r\nEkstrakt kurkume\r\nEkstrakt hajdučke trave\r\nEkstrakt gaveza\r\nEkstrakt bokvice\r\nEkstrakt divizme\r\nEkstrakt lopuha\r\nEkstrakt kamilice\r\nEkstrakt ruzmarina\r\nEkstrakt kantariona\r\nEkstrakt hamamelisa\r\nEkstrakt morskih algi\r\nEkstrakt lista aloe vera	•Držati van domašaja djece! Samo za spoljašnju upotrebu! U slučaju kontakta sa očima, temeljno isperite vodom! Uradite test osjetijivosti prije upotrebe! Upotreba proizvoda se ne preporučuje osobama koje su preosjetljive na bilo koji sastojak proizvoda! Izbegavajte kontakt proizvoda sa očima, sluzokožom ill oštećenom kožom! Osobe sa proširenim venama ne bi trebalo da koriste proizvod! Ako postoji osip ili crvenilo - nemojte koristiti proizvod.	Čuvati proizvod na temperaturi od 5- 25°C u originalnoj ambalaži. Ne izlagati prozivod visokim temperaturama i direktnoj sunčevoj svjetlosti.	Republika Srbija	225 ML	0.00	/slike/kurkuma-cream-hot-225ml.png	1	7	2026-06-25 20:12:56	2026-07-27 19:02:23.903983
\.


--
-- Data for Name: seo_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.seo_settings (id, page_key, page_label, meta_title, meta_description, og_title, og_description, og_image, canonical_url, updated_at) FROM stdin;
1	home	Početna stranica	Bioclinica - Prirodni dodaci prehrani	Otkrijte Bioclinica liniju prirodnih dodataka prehrani za zdravlje zglobova, prostate i mršavljenje.	\N	\N	\N	\N	2026-06-02 08:51:30
2	about	O nama	O nama - Bioclinica	Saznajte više o Bioclinica brandu i našoj misiji prirodnog zdravlja.	\N	\N	\N	\N	2026-06-02 08:51:30
3	contact	Kontakt	Kontakt - Bioclinica	Kontaktirajte nas za sva pitanja o našim proizvodima.	\N	\N	\N	\N	2026-06-02 08:51:30
4	faq	FAQ	Često postavljana pitanja - Bioclinica	Odgovori na najčešća pitanja o Bioclinica dodacima prehrani.	\N	\N	\N	\N	2026-06-02 08:51:30
5	news	Novosti	Novosti i savjeti - Bioclinica	Čitajte naše savjete i novosti o zdravlju i prirodnim dodacima prehrani.	\N	\N	\N	\N	2026-06-02 08:51:30
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 2, false);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 3, true);


--
-- Name: hero_slides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hero_slides_id_seq', 9, true);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.newsletter_subscribers_id_seq', 1, true);


--
-- Name: product_benefits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_benefits_id_seq', 86, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 1, false);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seo_settings_id_seq', 6, false);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: hero_slides hero_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: product_benefits product_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_benefits
    ADD CONSTRAINT product_benefits_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: seo_settings seo_settings_page_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_page_key_key UNIQUE (page_key);


--
-- Name: seo_settings seo_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_pkey PRIMARY KEY (id);


--
-- Name: idx_product_benefits_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_benefits_product ON public.product_benefits USING btree (product_id);


--
-- Name: idx_product_images_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_product ON public.product_images USING btree (product_id);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: admin_users trg_admin_users_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_admin_users_updated BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: blog_posts trg_blog_posts_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: categories trg_categories_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: contact_messages trg_contact_messages_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_contact_messages_updated BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: hero_slides trg_hero_slides_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_hero_slides_updated BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: products trg_products_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: seo_settings trg_seo_settings_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_seo_settings_updated BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: product_benefits product_benefits_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_benefits
    ADD CONSTRAINT product_benefits_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict uDtJ6FAyhimWPFq0UuaahJ5mYX0d5UfpdmqqHB4Ofna5jeeYz6N6CH12KoOebYv

