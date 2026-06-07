import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../CSS/BlogPost.css';
import useScrollReveal from '../hooks/useScrollReveal';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const postData = {
   'kaveri': {
    title: "Kaveri: Choked by Bureaucracy and Bad Physics",
    date: 'June 10, 2026',
    author: 'Diwakar Nagar',
    image: '/images/kaveri.webp',
    category: 'Engineering Corner',
    thought: "Coming together is a beginning; keeping together is progress; working together is success.",
    content: [
      "The GTRE GTX-35 V-S Kaveri engine is India’s most ambitious, agonizing, and raw aerospace endeavor. Initiated in 1989 by the Gas Turbine Research Establishment under the Defence Research Development Organisation, it was originally designed to be a low-bypass, twin-spool turbofan engine capable of delivering 80 kN of afterburning thrust to power the indigenous Light Combat Aircraft Tejas. Instead of a triumphant roar, however, the Kaveri became a cautionary tale of how brute national will can be humbled by the unforgiving laws of thermodynamics, metallurgy, and global politics. Today, it exists not as the heart of India's frontline fighter fleet, but as a compromised, yet vital, technological stepping stone.",
      "Understanding the importance of the Kaveri engine requires looking past its failures to the brutal landscape of global defense. Aero-engine technology is the ultimate geopolitical gatekeeper. Only a tiny handful of nations like the US, Russia, France, and the UK possess full lifecycle capabilities to design, manufacture, and maintain military turbofans. Jet engines are a strategic choke point; without an indigenous powerplant, an entire fighter jet program can be grounded by foreign sanctions or political shifts. India’s strategic autonomy is directly tied to this capability. Beyond military survival, masterfully manipulating the high-temperature materials required for these engines cascades into commercial aviation, heavy industrial gas turbines, and advanced metallurgy sectors, driving a nation’s technological leadership.",
      "The obstacles that broke the Kaveri's original timeline were deep, systemic, and unforgiving. When the project began, GTRE lacked access to advanced computational fluid dynamics resources and robust wind-tunnel data. The learning curve was vertical. The engine suffered from massive mechanical failures in its compressors, thermal management issues in the combustor, and an inability to freeze a stable design. Worse, India underestimated the physical limits of materials. To hit the required thrust-to-weight ratio for a modern fighter, an engine must withstand internal temperatures that far exceed the melting point of the metal itself, requiring single-crystal turbine blades and advanced thermal barrier coatings. India had to develop these superalloys from scratch, completely isolated.",
      "This isolation brings us to the points where India failed, both technically and managerially. Following the 1998 Pokhran nuclear tests, international embargoes immediately cut off India’s access to critical foreign technologies, superalloys, and components, blinding the project during its critical infancy. However, internal failures were equally damaging. The original Kaveri K1 engine ballooned to a weight of 1,424 kg, wildly missing the strict 1,100 kg weight limit required to maintain the LCA Tejas’s center of gravity. When tested at Russia’s Gromov Flight Research Institute, it only produced 70.5 kN of wet thrust, falling far short of the 85+ kN needed to make the Tejas combat-effective. Ultimately, India failed because it starved the project. The 2,100 to 2,300 crore rupees budget allocated to Kaveri was a drop in the ocean compared to the billions of dollars foreign engine houses spend developing a single engine family.",
      "Despite being officially delinked from the LCA Tejas, which now flies on imported American General Electric F404 and F414 engines, the future outcomes of the Kaveri program are surprisingly potent. The program has pivoted toward a \"dry engine\" variant lacking an afterburner, optimized to produce a reliable 52 kN of thrust. This dry Kaveri is now slated to power Project Ghatak, India’s highly classified, stealthy autonomous Unmanned Combat Aerial Vehicle. Additionally, the decades of pain endured by GTRE have yielded high Technology Readiness Levels in full-authority digital engine controls, directionally solidified casting, and indigenous single-crystal blade manufacturing, which are foundational capabilities that are being transferred to power future marine and civil spin-offs.",
      "For India to transform the scars of the Kaveri into future aerospace success, its roadmap must pivot from isolated institutional bureaucracy to an agile, well-funded ecosystem. First, funding must scale by orders of magnitude; jet engines cannot be built on shoestring budgets. Second, India must break the strict state monopoly held by DRDO and Hindustan Aeronautics Limited by heavily incentivizing private sector R&D and manufacturing. Finally, India must leverage its current geopolitical alignment to forge deep co-development joint ventures, such as ongoing negotiations for technology transfers with global engine houses, using these partnerships not as a crutch, but as a catalyst to master the final, elusive secrets of hot-section metallurgy."     ]
  },
  'brahmos': {
    title: "Speed, Precision, and Global Reach: The BrahMos Supersonic Edge",
    date: 'June 03, 2026',
    author: 'Diwakar Nagar',
    category: 'Strategic Weapons',
    image: '/images/brahmos.webp',
    thought: "The ultimate weapon is one that is never fired.",
    content: [
      "The BrahMos missile stands as one of the most formidable triumphs in modern military engineering, born out of a strategic joint venture established in 1998 between India’s Defence Research and Development Organisation (DRDO) and Russia’s NPO Mashinostroyeniya. The weapon's name itself is a portmanteau of two iconic rivers, the Brahmaputra of India and the Moskva of Russia, symbolizing the deep technological partnership between the two nations. Developed to provide an unstoppable precision-strike capability, the BrahMos was designed to replace aging subsonic systems and offer an unmatchable tactical edge. Over the years, it has evolved into a premier symbol of defense indigenization, shifting India from a traditional defense importer to a significant global exporter.",
      "Technically, the BrahMos is a two-stage, ramjet-powered supersonic cruise missile that operates on a strict \"Fire and Forget\" principle, requiring no further guidance after launch. The first stage utilizes a solid-propellant booster engine that provides rapid initial acceleration to bring the missile to supersonic speeds before separating. The second stage engages a liquid-fueled ramjet engine, taking over during the cruise phase to sustain a blistering velocity of Mach 2.8 to Mach 3 (nearly one kilometer per second). Flying three times faster than standard subsonic cruise missiles, the BrahMos impacts targets with nine times the kinetic energy, making it virtually un-interceptable by existing air-defense networks. It is highly versatile, capable of performing multi-point maneuvers, cruising at altitudes up to 15 kilometers, or executing radical sea-skimming maneuvers as low as 5 meters to evade enemy radar.",
      "What truly sets the BrahMos apart is its universal configuration, allowing it to be deployed across a diverse multi-carrier architecture spanning land, sea, and air. In naval warfare, it is deployed from frontline Indian Navy warships and conventional attack submarines, capable of vertical or inclined launches against both ships and coastal installations. For land forces, it is operated from Mobile Autonomous Launchers (MAL), allowing heavy truck-mounted regiments to swiftly deploy and strike deep behind enemy lines. The air-launched variant, customized to be lighter at 2,500 kilograms, is seamlessly integrated onto the Indian Air Force's frontline Sukhoi Su-30MKI strike fighters, enabling devastating stand-off strikes from hundreds of kilometers away without crossing hostile borders.",
      "The strategic footprint of the BrahMos is rapidly expanding into the global arena, establishing India as a key Indo-Pacific security provider. The Philippines became the pioneering international customer by procuring shore-based anti-ship variants in a landmark 375 million dollar deal, and India has extended offers for the Extended Range (ER) variant to further bolster Manila's maritime deterrence. Furthermore, India has signed a major 629 million dollar contract to supply BrahMos missiles to Vietnam, intended to re-equip their Su-30MK2 fighter fleet and coastal defense assets, while export negotiations with Indonesia are in their final stages. Looking forward, the future scope of the platform focuses on radical technological evolution: the compact BrahMos-NG (Next Generation), which is lighter, stealthier, and designed for smaller platforms like the HAL Tejas fighter, and the futuristic BrahMos-II, a highly sophisticated hypersonic cruise missile engineered to exceed speeds of Mach 7."
     ]
  },
  'su30-mki': {
    title: "The Titanium Spine: How the Sukhoi Su-30MKI Anchors Air Dominance",
    date: 'May 24, 2026',
    author: 'Diwakar Nagar',
    category: 'Defence Aviation',
    image: '/images/Su30mki.webp',
    thought: "People sleep peaceably in their beds at night only because rough men stand ready to do violence on their behalf.",
    content: [
      "The Sukhoi Su-30MKI stands as one of the most versatile and lethal multirole air superiority fighters in modern military aviation. Originating from a landmark partnership initiated between India and Russia in the late 1990s, the aircraft was specifically tailored to meet the demanding requirements of the Indian Air Force (IAF). While the initial design and aerodynamic architecture came from Russia’s Sukhoi Aviation Corporation, the \"MKI\" variant (Modernizirovannyi Kommercheskiy Indiskiy, meaning \"Modernized Commercial Indian\") transitioned into a massive local manufacturing triumph. The state-run defense giant Hindustan Aeronautics Limited (HAL) undertook licensed production at its Nashik facility, progressively increasing the jet's indigenous components to over 62%. Entering active service in 2002, this collaborative masterpiece has served as the absolute backbone of India’s air defense strategy for over two decades.",
      "In terms of pure operational capability, the Su-30MKI is a twin-engine, heavy-class fighter revered for its extreme \"super-maneuverability\". Powered by two Saturn AL-31FP afterburning turbofan engines equipped with thrust-vectoring nozzles, the aircraft can redirect its engine exhaust dynamically. This allows pilots to execute jaw-dropping aerial maneuvers, such as the famous Pugachev's Cobra, which completely disregard conventional physics and break the aircraft's momentum to force pursuing enemies to overshoot. Coupled with canard foreplanes for added aerodynamic stability and a two-seat cockpit layout that splits the workload between a pilot and a Weapons Systems Officer (WSO), the jet excels in establishing air dominance and conducting long-range maritime and ground strike missions across all weather conditions.",
      "The sheer destructive potential of the Su-30MKI is evident in its massive and highly adaptable weapons payload capacity. The aircraft features 12 external hardpoints capable of carrying up to 8,000 kg (approximately 17,600 lbs) of diverse military hardware. For close-in and beyond-visual-range (BVR) dogfights, it deploys lethal air-to-air missiles like the Russian R-77 and R-73, alongside India’s indigenously developed Astra missile. Its ground and maritime strike capabilities are uniquely terrifying; the Su-30MKI remains the only fighter platform in the world modified to air-launch the devastating BrahMos-A, a 2.5-ton supersonic cruise missile. This arsenal is further rounded out by Kh-59 television-guided missiles, anti-radiation missiles designed to destroy enemy radars, laser-guided precision bombs, and a built-in 30mm GSh-30-1 autocannon for close-range engagements.",
      "While India is the exclusive operator of the highly customized MKI variant—maintaining a formidable fleet of roughly 260 aircraft, the core Su-30 platform boasts global proliferation. The underlying design DNA has spawned specialized variants utilized by several countries around the world. Malaysia flies the Su-30MKM, an advanced cousin heavily influenced by the Indian MKI framework. Other nations utilizing different configurations of the twin-engine Sukhoi family include China (Su-30MKK/MK2), Vietnam, Algeria, Venezuela, Angola, and Belarus, alongside Russia's own aerospace forces. The international footprint of this airframe underscores its reliability and competitive edge over western counterparts like older generation F-15s and F-16s.",
      "To maintain its edge against emerging fifth-generation stealth threats, the platform is undergoing a monumental modernization initiative known as the \"Super Sukhoi\" upgrade project. Led by HAL and India's Defence Research and Development Organisation (DRDO), this multi-billion dollar program is transforming the aircraft into a advanced \"4.7-generation\" fighter. The centerpiece of this future advancement is the integration of the indigenous Virupaksha radar, a highly advanced Active Electronically Scanned Array (AESA) system utilizing Gallium Nitride technology to track stealth aircraft over immense distances. Combined with brand-new artificial intelligence-driven avionics, redesigned digital glass cockpits, enhanced electronic warfare suites, and structural reinforcements to extend the airframe's service life past 2050, the Sukhoi Su-30MKI is effectively guaranteeing its lethal relevance for decades to come."
    ]
  },
  'typhoon': {
    title: "The Whispering Death: Mighty Eurofighter Typhoon",
    date: 'May 17, 2026',
    author: 'Diwakar Nagar',
    category: 'Defence Aviation',
    image: '/images/typhoon.webp',
    thought: "Aviation is proof that given the will, we have the capacity to achieve the impossible.",
    content: [
      "In an era where military planners prioritize low-observable stealth above all else, sculpting smooth, radar-baffling contours to hide weapons within dark internal bays, there exists a competing philosophy. This school of thought relies on unadulterated kinematic dominance, deliberate aerodynamic instability, and a sensor suite so deeply fused it borders on omniscience. The Eurofighter Typhoon does not attempt to hide like a ghost on the radar screen. It operates like a thunderstorm with an afterburner, a twin-engine, swing-role titan that doesn’t bother avoiding a fight because it knows it can out-climb, out-turn, and out-gun virtually anything else in the sky.",
      "The genesis of this apex predator stretches back to the friction of the Cold War, when Western European nations realized they desperately needed a high-performance interceptor to counter emerging Soviet Sukhois and MiGs. In 1983, the Future European Fighter Aircraft program united the UK, West Germany, France, Italy, and Spain, though France soon exited to independently pursue the carrier-capable Dassault Rafale. The remaining four nations formed the industrial consortium Eurofighter Jagdflugzeug GmbH, combining the engineering prowess of defense giants BAE Systems, Airbus Defence and Space, and Leonardo. Splitting manufacturing dynamically across international lines, with the UK building the front fuselage, Germany handling the center, and Italy and Spain crafting the wings, the partner nations weathered post-Cold War budget cuts to launch the prototype in 1994, officially inducting the jet into service in 2003.",
      "The Typhoon looks menacing because the unforgiving physics of high-altitude dogfighting demand it. Its iconic silhouette features a sprawling delta wing paired with active, close-coupled foreplane canards designed with intentionally relaxed stability. By deliberately engineering an airframe that inherently wants to tumble out of the sky, designers unlocked staggering instantaneous turn rates and unprecedented supersonic maneuverability, all kept in check by a quadruplex digital fly-by-wire system that grants the pilot \"carefree handling.\" Beneath its skin, twin Eurojet EJ200 turbofans unleash over 40,000 pounds of thrust, pushing the jet to Mach 2 and allowing it to \"supercruise\" at Mach 1.5 without using fuel-guzzling afterburners. This brute strength is guided by a cutting-edge Captor-E Active Electronically Scanned Array (AESA) radar working alongside the PIRATE Infrared Search and Track sensor, allowing the Typhoon to silently stalk multiple targets via their thermal signatures.",
      "When the time comes to project force, the Typhoon proudly exhibits its teeth across 13 external hardpoints, carrying a massive maximum payload of 9,000 kilograms (19,800 pounds). For air-to-air engagements, its primary hammer is the MBDA Meteor, a revolutionary beyond-visual-range missile propelled by a ramjet motor that boasts the largest \"no-escape zone\" in the world, supplemented by infrared-guided ASRAAM and IRIS-T missiles coupled to a Striker II Helmet-Mounted Display. When operating in ground-attack or suppression roles, it transforms into a heavy-duty weapons truck, raining down destruction via Storm Shadow or Taurus stealth cruise missiles for bunker-busting, alongside heavy volleys of Brimstone precision-guided missiles designed to wipe out moving enemy armor with pinpoint accuracy.",
      "This lethal capability has made the Typhoon a massive commercial and strategic success, serving as the frontline backbone for a rapidly expanding global footprint. Beyond its four core European creators, the United Kingdom, Germany, Italy, and Spain, the fighter has earned a trusted home within the air wings of Austria, Saudi Arabia, Oman, Kuwait, and Qatar. The airframe's operational record is thoroughly combat-proven, having logged thousands of demanding real-world combat hours over Libya, Iraq, and Syria under operations like the UK's Operation Shader, while also serving as NATO's primary deterrent during intense Baltic Air Policing missions. Having officially shattered the historic milestone of one million flying hours across the global fleet, its structural reliability and high availability rates remain completely undisputed.",
      "Rather than facing retirement, the Eurofighter is currently entering a dramatic industrial resurgence. To meet a volatile geopolitical landscape and bridge the gap to sixth-generation programs like GCAP and FCAS, production is doubling while the consortium aggressively rolls out its Mid-Life Upgrade (MLU) and Long Term Evolution (LTE) frameworks. This comprehensive modernization introduces a completely overhauled avionics architecture, artificial intelligence-assisted data fusion, and an advanced electronic warfare suite, ensuring the Typhoon will remain a digitally connected, network-centric node capable of dominating highly contested battlespaces well into the 2060s."
    ]
  },
  'f-35': {
    title: "Phantom of the Skies: The Dominance of the F-35 Lightning II",
    date: 'May 10, 2026',
    author: 'Diwakar Nagar',
    category: 'Defence Aviation',
    image: '/images/f-35.webp',
    thought: "The true measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy.",
    content: [
      "The Lockheed Martin F-35 Lightning II is the definitive fifth-generation multirole fighter, designed to dominate the 21st-century battlefield through a combination of stealth, advanced sensors, and unprecedented data fusion. Born from the Joint Strike Fighter (JSF) program in the late 1990s, the aircraft was conceived as a versatile platform to replace several aging legacy jets like the F-16 and A-10. Since its first flight in 2006, it has evolved into a global security cornerstone. As of 2026, the F-35 is operated by a vast network of allies, including the United States, United Kingdom, Israel, Italy, Japan, Australia, Norway, and the Netherlands, with nations like Germany, Switzerland, and Singapore having integrated or ordered the jet to fortify their national defense.",
      "Technologically, the F-35 is a \"flying supercomputer.\" Its history is marked by a shift from traditional dogfighting toward \"informationized\" warfare, where its AN/APG-81 AESA radar and Distributed Aperture System (DAS) allow the pilot to see 360 degrees around the aircraft, even through the cockpit floor. Its primary strength lies in its low-observable (stealth) profile, which allows it to penetrate sophisticated enemy air defenses undetected. However, this journey was not without \"growing pains\", the program famously faced years of delays and cost overruns before maturing into the combat-proven platform it is today, having seen active service in conflicts across the Middle East and beyond.",
      "One of the jet's most versatile features is its payload capability. In its \"Stealth Mode\", it carries weapons internally to maintain a clean radar signature, typically holding two air-to-air missiles (like the AIM-120 AMRAAM) and two 2,000-pound guided bombs (such as the GBU-31 JDAM). For missions where stealth is less critical, it can enter \"Beast Mode\", utilizing external pylons to carry up to 18,000 lbs (8,160 kg) of total ordnance. Its arsenal is diverse, ranging from air-to-ground missiles and laser-guided bombs to specialized payloads like the B61-12 nuclear bomb, making it a vital deterrent in strategic defense.",
      "The future of the Lightning II is defined by the Block 4 upgrade and Technology Refresh 3 (TR-3). These modifications act as a massive \"brain transplant\" for the aircraft, increasing its onboard processing power by 25 times and its memory capacity significantly. These upgrades will enable the F-35 to act as a \"quarterback of the sky\", controlling teams of autonomous drones known as Collaborative Combat Aircraft (CCAs). Future mods also include improved electronic warfare suites and the ability to integrate next-generation long-range precision weapons, ensuring the jet stays ahead of evolving cyber and kinetic threats.",
      "In the global arena, the F-35 faces competition from other high-tech platforms, though few match its integrated sensor ecosystem. Its primary rivals include the Russian Sukhoi Su-57 and the Chinese Chengdu J-20, both of which claim stealth capabilities. In the export market, it also competes with European 4.5-generation jets like the Eurofighter Typhoon and the Dassault Rafale. However, the F-35’s unique advantage remains its interoperability; because so many allied nations fly the same jet, they can share data in real-time on the battlefield, creating a unified and nearly impenetrable digital wall that no other single fighter can currently replicate."
    ]
  },
  'missile': {
    title: "Missile Decoding 101: From BVRAAMs to ICBMs",
    date: 'May 2, 2026',
    author: 'Diwakar Nagar',
    category: 'Strategic Weapons',
    image: '/images/missile.webp',
    thought: "The object of war is not to die for your country but to make the other bastard die for his.",
    content: [
      "Do you ever find yourself scrolling through defense news and getting completely tripped up by acronyms like BVRAAM, ASM, or SAM? It feels like reading a secret code where every letter represents a different way something flies through the air. At its core, a missile is essentially a guided self-propelled weapon system, but the \"alphabet soup\" of categories actually tells us exactly where the missile starts its journey and where it’s intended to end it.",
      "The most common starting point for many is the Air-to-Air Missile (AAM). These are launched from one aircraft to take down another. You’ll often hear about BVRAAMs (Beyond Visual Range Air-to-Air Missiles), which are the long-distance runners of the sky, using radar to hit targets miles away before the pilot even sees them. A classic example is the American AIM-120 AMRAAM. On the flip side, there are short-range \"dogfighting\" missiles like the British AIM-132 ASRAAM, designed for high-speed maneuvers in close-quarter combat.",
      "When the target is on the ground or at sea, we move into the world of Air-to-Surface Missiles (ASM) and Anti-Ship Missiles (AShM). These are dropped from planes to strike stationary bunkers, moving tanks, or warships. The French Exocet is a legendary anti-ship missile known for its \"sea-skimming\" flight path, while the American AGM-114 Hellfire is the go-to for precision strikes against ground armor. These systems rely on laser guidance or infrared cameras to ensure they hit the bullseye without causing unnecessary collateral damage.",
      "Then there are the guardians of the ground: Surface-to-Air Missiles (SAM). These are launched from trucks or ships to intercept incoming planes or other missiles. You might have heard of the S-400 Triumf from Russia or the Patriot system from the U.S.; these act like a high-tech shield, scanning the skies constantly. Alongside these are Surface-to-Surface Missiles (SSM), which include the massive Intercontinental Ballistic Missiles (ICBMs) like the Minuteman III. These are designed to travel vast distances, sometimes across continents, following a high-arcing trajectory.",
      "Finally, we classify missiles by how they fly: Cruise vs. Ballistic. Cruise missiles, like the BrahMos or Tomahawk, fly at low altitudes and stay within the atmosphere, behaving almost like a pilotless airplane. Ballistic missiles, however, are like powerful rockets that get launched into the upper atmosphere or space before gravity pulls them back down at incredible speeds. Whether it’s a tactical strike or a strategic deterrent, understanding these labels helps clear the fog of war and makes that \"alphabet soup\" much easier to digest.",
      "A special mention must go to the BrahMos, a standout in the Cruise Missile category. Unlike subsonic cruise missiles like the U.S. Tomahawk, the BrahMos is a supersonic powerhouse, currently the fastest of its kind in the world. Developed as a joint venture between India and Russia, it travels at Mach 2.8 to 3.0, making it nearly impossible for existing air defense systems to intercept. Whether launched from a ship, a submarine, or a fighter jet, its combination of extreme speed and \"fire-and-forget\" precision sets a new global benchmark for tactical strikes."
    ]
  },
  'ic-814': {
    title: "The Kandahar Crisis: A Turning Point in Aviation Security",
    date: 'April 24, 2026',
    author: 'Diwakar Nagar',
    category: 'Aviation Security',
    image: '/images/ic-814.webp',
    thought: "If, however, you do not fight this righteous war, then you will fail in your duty, lose your reputation, and incur sin.",
    content: [
      "On December 24, 1999, Indian Airlines Flight IC 814, an Airbus A300, departed from Tribhuvan International Airport in Kathmandu, Nepal, bound for Indira Gandhi International Airport in Delhi. Shortly after entering Indian airspace, the aircraft was seized by five masked hijackers. The flight plan was forcibly altered several times as the aircraft was diverted to Amritsar, then Lahore, and Dubai, before finally landing in Kandahar, Afghanistan, a territory then controlled by the Taliban. The hijackers’ primary objective was the release of three high-profile militants held in Indian prisons: Masood Azhar, Ahmed Omar Saeed Sheikh, and Mushtaq Ahmed Zargar.",
      "The hijacking occurred due to a combination of security lapses at the point of origin and the tactical timing of the captors. Once the plane reached Kandahar, India faced a complex geopolitical dilemma. The options were severely limited: a military rescue operation was deemed nearly impossible due to the hostile terrain and the lack of diplomatic recognition of the Taliban regime. Communication was strained, and the hijackers used the safety of the 176 passengers and 15 crew members as leverage. The standoff stretched into a grueling week of psychological warfare, with the hostages held in cramped, deteriorating conditions.",
      "The crisis finally reached its conclusion on December 31, 1999. After seven days of intense negotiations and the tragic killing of one passenger, Rupin Katyal, the Indian government, then led by the National Democratic Alliance under Prime Minister Atal Bihari Vajpayee, agreed to a prisoner exchange. The three militants were flown to Kandahar, and the remaining victims were finally released to return home. While the immediate threat to the passengers was over, the consequences of this decision were profound. The released individuals went on to lead militant groups that orchestrated major future attacks, including the 2001 Parliament attack and the 2008 Mumbai attacks.",
      "Domestically, the incident led to a massive overhaul of India’s security apparatus. India learned that \"reactive\" security was insufficient, leading to the creation of the Anti Hijacking Act and the deployment of Sky Marshals on commercial flights. It also underscored the necessity of the \"Amritsar Lesson\", the failure to immobilize the plane while it was on Indian soil, which led to stricter Standard Operating Procedures (SOPs) for Crisis Management Groups. If a similar hijacking were to occur in today’s hyper-connected world, the impact would be instantaneous. Modern satellite tracking and real-time social media would put immense public pressure on governments to act within minutes.",
      "Today, India's stance has shifted toward a policy of \"no negotiation\" with terrorists, backed by specialized units like the National Security Guard (NSG) trained specifically for aircraft intervention. The Kandahar incident remains a somber case study in the challenges of balancing human life against national security. It serves as a reminder that aviation security is a continuous evolution of technology, intelligence, and political will, aimed at ensuring that the tragedy of December 1999 is never repeated.",
    ],
  },
  'f-15': {
    title: "The Eagle’s Dominion: The Unrivaled Legacy of the F-15",
    date: 'April 18, 2026',
    author: 'Diwakar Nagar',
    category: 'Defence Aviation',
    image: '/images/f-15.webp',
    thought: "The supreme art of war is to subdue the enemy without fighting.",
    content: [
      "The McDonnell Douglas (now Boeing) F-15 Eagle remains the undisputed king of the skies, a reputation cemented by its legendary combat score of 104-0. Over five decades of operation, no F-15 has ever been shot down by an enemy aircraft in aerial combat. The aircraft's journey began with the F-15A (single-seat) and F-15B (two-seat trainer), which were pure air-superiority machines designed under the strict philosophy of \"not a pound for air-to-ground.\" These were followed by the F-15C and F-15D, which introduced the \"Production Eagle Package,\" including increased internal fuel and the ability to carry conformal fuel tanks, significantly extending their range and endurance for long-range patrols.",
      "At high altitudes, the Eagle can attain a blistering speed of Mach 2.5 (approximately 1,900 mph), powered by its twin-engine configuration. The platform has historically relied on two primary powerplants: the Pratt & Whitney F100 series, which powered the original A through D models, and the General Electric F110-GE-129, which has become the \"engine of choice\" for the newest heavy-duty variants. These engines provide the massive thrust-to-weight ratio required to out-accelerate almost any threat, allowing the Eagle to maintain its dominance even as newer generations of fighters emerge.",
      "The Eagle’s lethality comes from its staggering payload and diverse weaponry. The evolution from the air-superiority models to the F-15E Strike Eagle transformed the jet into a multi-role beast capable of deep-strike missions. The latest iteration, the F-15EX Eagle II, acts as a \"missile truck\" with a payload capacity of 29,500 pounds across 23 hardpoints. It can carry a massive mix of air-to-air weapons, including up to 12 AIM-120 AMRAAMs and AIM-9X Sidewinders. For strike missions, it deploys a terrifying array of precision munitions like JDAMs, Small Diameter Bombs (SDBs), and even outsized standoff weapons like the AGM-158 JASSM or hypersonic missiles.",
      "Despite its perfection in dogfights, the F-15's history is marked by somber tragedies, particularly involving Iran and friendly-fire incidents. In the 1970s, the U.S. planned to sell F-15s to the Imperial Iranian Air Force, but the 1979 Revolution ended the deal, leaving Iran to rely on the F-14 Tomcat. More recently, in early 2026, reports surfaced of F-15E Strike Eagles involved in a tragic friendly-fire engagement over Iranian airspace during regional tensions, highlighting the extreme dangers of operating in high-threat environments. Historically, the aircraft also suffered the \"Black Hawk Incident\" in 1994, where two F-15Cs mistakenly downed two U.S. Army helicopters, a dark chapter in its otherwise stellar service.",
      "To ensure it remains relevant, the Eagle has undergone radical upgrades, transitioning from the analog cockpits of the F-15A/C to the fully digital architecture of the F-15EX. This newest model features a \"digital backbone,\" fly-by-wire flight controls, and the EPAWSS (Eagle Passive Active Warning Survivability System) for advanced electronic warfare. These upgrades have secured its spot in the hangars of elite air forces worldwide. Beyond the United States Air Force, the Eagle is a strategic pillar for Israel, Japan, Saudi Arabia, South Korea, Qatar, and Singapore. With a structural life now extended to 20,000 hours, the F-15 is set to remain operational well past 2040."
    ],
  },
  'tejas_1': {
    title: "Tejas: Pride, Payloads, and Production Bottlenecks",
    date: 'April 14, 2026',
    author: 'Diwakar Nagar',
    category: 'Defence Aviation',
    image: '/images/tejas.webp',
    thought: "The trajectory of Indian aerospace points only upward ,  and the world is finally paying attention.",
    content: [
      "For decades, the Indian Air Force relied heavily on foreign workhorses to guard its skies, but the HAL Tejas, India’s indigenous Light Combat Aircraft (LCA), has fundamentally rewritten that narrative. As a 4.5-generation, delta-wing fighter, the Tejas is far more than a replacement for the aging MiG-21 fleet; it is the cornerstone of India's Atmanirbhar (self-reliant) aerospace ecosystem. By fostering a domestic network of hundreds of private suppliers and laboratories, the Tejas program retains critical defense capital within the country, ensuring that India isn't just a buyer of global defense technology, but a sovereign creator of it.",
      "The aircraft is currently evolving through three primary versions to meet the IAF's expanding needs. The Mk1 served as the proof of concept, proving that India could master a supersonic, fly-by-wire fighter. Its successor, the Mk1A, is the current production standard, featuring over 40 major improvements like the indigenous Uttam AESA Radar and an advanced Electronic Warfare suite. Looking ahead, the Mk2 is being developed as a \"Medium Weight Fighter.\" Expected to have its first flight by the end of 2026, the Mk2 will be larger, carry a much heavier payload, and use the more powerful GE F414 engine, bridging the gap between light interceptors and heavy strike fighters.",
      "Despite being the smallest and lightest supersonic fighter in its class, the Tejas punches well above its weight. It features an impressive nine hardpoints, capable of carrying a diverse and lethal payload of up to 5,300 kg. This allows it to seamlessly integrate advanced Beyond Visual Range (BVR) air-to-air missiles like the Astra and Derby, precision-guided munitions, laser-guided bombs, and anti-radiation missiles. For maritime defense, the Tejas Naval Variant (LCA Navy) made history by successfully conducting \"arrested landings\" on the INS Vikrant. While the Navy is now focusing on a twin-engine design for the future, the Naval Tejas remains a vital technology demonstrator that proved India could master the extreme physics of carrier-deck operations.",
      "When it comes to safety, the Tejas boasts an almost unheard-of track record in military aviation. For 23 years, it maintained a flawless, zero-crash history. However, as the fleet has grown and international deployments have increased, two high-profile incidents have occurred. After a crash near Jaisalmer in March 2024, a second tragedy struck at the Dubai Airshow in November 2025. During a high-G aerobatic display, a Tejas jet crashed, resulting in the tragic loss of the pilot. While such events are a somber reminder of the risks in performance aviation, investigations have largely focused on the extreme physiological stress of display maneuvers rather than any fundamental flaw in the aircraft’s combat engineering.",
      "Yet, the Tejas program continues to face severe growing pains, most notably in its supply chain. The rollout of the Mk1A has been significantly bottlenecked by slow engine deliveries. As of April 2026, GE Aerospace has delivered only a handful of the 99 engines ordered, leading HAL to invoke penalty clauses. However, a major breakthrough occurred just this month, with a new contract signed to establish an in-country engine maintenance facility in India. It is a stark reminder that while the airframe and avionics are indigenous, true self-reliance will ultimately require domestic engine manufacturing. As the IAF prepares for the Mk2, the lessons learned from the Mk1A's payloads, its safety mechanisms, and its supply chain woes are shaping a future where India's skies are defended entirely by Indian machinery."
    ],
  },
  '5th gen': {
    title: "The Fifth-Generation Dilemma: Su-57 Felon vs. F-35 Lightning II",
    date: 'April 13, 2026',
    author: 'Diwakar Nagar',
    category: 'Defence Aviation',
    image: '/images/su57-f35.webp',
    thought: "Breakthrough science doesn't require the deepest pockets, only the deepest commitment.",
    content: [
      "In the high-stakes arena of modern aerial warfare, the Sukhoi Su-57 Felon and the Lockheed Martin F-35 Lightning II represent two fundamentally different philosophies of combat. The Su-57 is a larger, twin-engine \"heavyweight \" that prioritizes kinetic dominance, measuring approximately 20.1 meters in length with a massive internal payload capacity of up to 10,000 kg, designed to carry heavy, long-range munitions. In contrast, the F-35 is a more compact, single-engine \"multi-role\" platform with a payload of 8,160 kg, engineered around a \"stealth-first\" doctrine. While the Su-57 boasts superior top speeds (Mach 2.0 vs. Mach 1.6) and hyper-maneuverability, the F-35 remains the undisputed king of radar presence, its 0.001 m² radar cross-section (RCS) is significantly smaller than the Su-57’s estimated 0.1, 1.0 m², making it nearly invisible to modern sensors compared to its Russian rival.",
      "For India, the choice between these jets is less about technical specs and more about sovereign control and strategic alignment. Russia has offered the Su-57 with the promise of \"Make in India\" licensed production and deeper tech transfer, which traditionally includes access to source codes and the ability to integrate indigenous Indian weapons. Conversely, the F-35 is governed by the strict US Foreign Military Sales (FMS) framework, which gives Washington total control over software updates and mission data, effectively creating a \"strategic lock-in.\" However, India must also weigh the current GE F404 engine delays for the Tejas, which have highlighted the vulnerability of depending on US supply chains, as of April 2026, HAL has only received a fraction of the engines ordered, forcing India to impose penalty clauses on GE.",
      "When deciding, India must consider that while Russian tech offers more autonomy and \"sturdy\" hardware, its modern stealth and electronics have lagged behind Western standards. The F-35 offers an unmatched \"intelligence-fusion\" network, but it comes with heavy US oversight. Additionally, both programs have faced significant development hurdles: the F-35 has seen several high-profile crashes across global operators like Japan and the UK, while the Su-57 program lost its first serial production aircraft in a 2019 crash in Russia's Far East. Ultimately, India’s decision hinges on whether it values kinetic independence and tech access (Russia) or networked superiority and stealth (USA), all while keeping its primary focus on the development of its own indigenous AMCA.",
      "Ultimately, India’s evaluation of these two titans serves as a strategic bridge toward its own ultimate goal, the Advanced Medium Combat Aircraft (AMCA). While the F-35 offers a glimpse into the future of sensor fusion and the Su-57 provides a blueprint for heavy-duty air superiority, neither aircraft is intended to be the permanent face of the IAF. By engaging with both the US and Russia, India is essentially conducting a massive masterclass in fifth-generation requirements, learning how to balance the stealth characteristics of the F-35 with the raw power and internal carriage capacity of the Su-57. Whether India chooses a small \"stop-gap\" fleet of either jet or doubles down on its own R&D, the objective remains the same, ensuring that by the time the AMCA takes flight, it possesses the \"stealth-first\" DNA of the West and the \"unrestricted\" sovereign control that has always defined India's relationship with the East."
    ],
  },
  'drone': {
    title: "The Drone Revolution: Precision, Attrition, and India's Path to Sovereignty",
    date: 'April 13, 2026',
    author: 'Diwakar Nagar',
    category: 'Unmanned Systems',
    image: '/images/drone.webp',
    thought: "Home-grown engineering, given patience and belief, does not merely survive, it soars.",
    content: [
      "The modern battlefield has undergone a radical transformation, shifting from high, value, manned platforms to the era of \"attritable\" mass, where drones are treated as expendable as ammunition. In the Russia, Ukraine war, drones have become the primary instrument of attrition, with FPV (First-Person View) drones and loitering munitions like the Lancet and Shahed-136 replacing traditional artillery in precision roles and providing constant, \"unblinking\" overhead surveillance. Similarly, the U.S., Iran tensions in early 2026 highlighted a different facet of drone warfare, where Iranian-made Shahed drones demonstrated the ability to overwhelm sophisticated air defenses through sheer volume, while U.S. forces utilized high-end interceptors and AI-driven counter-UAS systems to protect regional assets. This shift underscores a critical reality: in modern warfare, the side that can produce the most low, cost, autonomous drones, and the systems to jam them, holds the tactical edge.",
      "India has recognized this shift and is aggressively moving to bridge the gap through its Atmanirbhar (Self-Reliant) initiatives. As of April 2026, the Indian government has effectively banned the import of foreign drones (in CBU, SKD, or CKD forms) to force the growth of a domestic manufacturing base, supported by the PLI (Production Linked Incentive) scheme and programs aimed at rural tech integration. While Indian doctrine is currently more \"platform-centric,\" treating drones as valuable, long, endurance assets for border surveillance in regions like Ladakh, the military is rapidly evolving toward the U.S. attrition model. Future steps include the mass induction of swarm drones, capable of coordinated AI-led attacks, and the development of the AMCA-linked \"Loyal Wingman\" program, where unmanned combat drones will fly alongside manned fighters to saturate enemy airspace. The future of drone warfare lies in AI-driven autonomy, where swarms will operate in GPS, denied environments, making decisions in milliseconds and rendering traditional \"human-in-the-loop\" systems obsolete."
    ],
  },
  'engine': {
    title: "The Heart of the Machine: How a Fighter Jet Engine Generates Supersonic Thrust",
    date: 'April 13, 2026',
    author: 'Diwakar Nagar',
    category: 'Engineering Corner',
    image: '/images/engine.webp',
    thought: "The engine is the heart of a fighter, and as long as that heart is foreign, the aircraft's pulse is controlled by someone else.",
    content: [
      "A fighter jet engine, specifically a low, bypass turbofan, operates on the core principle of the Brayton cycle: intake, compression, combustion, and exhaust. The process begins when the massive fan at the front sucks in air, splitting it into two paths. A small portion of air bypasses the engine core for cooling and slight thrust, while the majority enters the high, pressure compressor. Here, rows of rapidly spinning blades squash the air into a tiny fraction of its original volume, massively increasing its temperature and pressure before it enters the heart of the machine.",
      "Once the compressed air reaches the combustion chamber, fuel is continuously sprayed into the stream and ignited. This creates a high, energy, high, temperature explosion that expands the gas rapidly. This expanding gas is then forced through a set of turbine blades. Instead of providing thrust directly, these turbines act like a windmill, extracting just enough energy from the rushing gas to spin the shaft that drives the compressor and the front fan. This self, sustaining cycle is what keeps the engine running at thousands of revolutions per minute.",
      "The real \"kick\" for a fighter jet happens in the nozzle. After the gas passes the turbines, it is accelerated out of the rear of the engine at supersonic speeds. According to Newton’s Third Law, the force of the gas shooting backward creates an equal and opposite force, thrust, pushing the jet forward. Most modern fighters also feature an \"afterburner\" section, where extra fuel is dumped directly into the hot exhaust gases. This reignites the remaining oxygen, providing a massive, albeit fuel, hungry, surge of power for take, offs or high, speed combat maneuvers.",
      "Precision and materials science are what separate a standard jet engine from a fighter, grade powerhouse. The turbine blades must operate in environments hotter than their own melting point, requiring intricate internal cooling channels and advanced ceramic coatings. Furthermore, fighter engines must be able to handle \"unstructured\" air during extreme maneuvers, ensuring the engine doesn't stall or \"hiccup\" when the pilot pulls high G, force turns. It is this balance of raw explosive power and delicate mechanical synchronization that allows a jet to transition from a low, speed cruise to Mach 2 speeds in seconds."],
  }
};

// ── Audio Reader helpers ──────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
}

function buildScript(post) {
  const greeting = getGreeting();
  const intro = `${greeting}! Welcome to Aero Explore. Let's explore something truly fascinating together.`;
  const heading = `Today's article is titled: ${post.title}.`;
  const body = post.content.join(' ');
  const farewell = `That brings us to the end of today's article. I truly hope you found it insightful and enjoyed the read. If you loved this piece, I'd be so grateful if you would consider subscribing to our newsletter — you can find the subscription option right at the bottom of the page. And if this article was worth your time, please do hit that like button below. It means the world to us. Until next time, keep exploring the skies!`;
  return `${intro} ${heading} ${body} ${farewell}`;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function BlogPost() {
  useScrollReveal();
  const { id } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ likes: 0, dislikes: 0 });
  const [voted, setVoted] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  // ── Audio Reader State ──────────────────────────────────────────────────────
  const [audioState, setAudioState] = useState('idle'); // idle | playing | paused
  const [showToast, setShowToast] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);
  const utteranceRef = useRef(null);
  const charIndexRef = useRef(0);   // where we paused
  const fullScriptRef = useRef(''); // full narration text
  const toastRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    setVoted(false);
    setUserChoice(null);

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/blog-stats/${id}`);
        const data = await res.json();
        if (data.success) {
          setStats({ likes: data.likes, dislikes: data.dislikes });
        }
      } catch (err) {
        console.error('Failed to fetch blog stats:', err);
      }
    };
    fetchStats();
  }, [id]);

  // Show toast on first enter (per article)
  useEffect(() => {
    setToastDismissed(false);
    setAudioState('idle');
    charIndexRef.current = 0;
    window.speechSynthesis.cancel();
    const timer = setTimeout(() => setShowToast(true), 800);
    return () => clearTimeout(timer);
  }, [id]);

  // Stop speech when component unmounts / page closes
  useEffect(() => {
    const stopOnUnload = () => window.speechSynthesis.cancel();
    window.addEventListener('beforeunload', stopOnUnload);
    return () => {
      window.speechSynthesis.cancel();
      window.removeEventListener('beforeunload', stopOnUnload);
    };
  }, []);

  // Click-outside to dismiss toast
  useEffect(() => {
    if (!showToast) return;
    const handler = (e) => {
      if (toastRef.current && !toastRef.current.contains(e.target)) {
        setShowToast(false);
        setToastDismissed(true);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showToast]);

  // Pick the best female Indian-English voice
  const pickVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // Strict priority order — most Indian-sounding first
    const matchers = [
      v => /en.?IN/i.test(v.lang) && /female|woman|girl|priya|neerja|kalpana|heera|lekha/i.test(v.name),
      v => /en.?IN/i.test(v.lang),
      v => /female|woman|girl/i.test(v.name) && /en/i.test(v.lang),
      v => /en/i.test(v.lang),
    ];
    for (const m of matchers) {
      const hit = voices.find(m);
      if (hit) return hit;
    }
    return voices[0] ?? null;
  }, []);

  const speakFrom = useCallback((post, fromChar = 0) => {
    window.speechSynthesis.cancel();
    const script = fullScriptRef.current || buildScript(post);
    fullScriptRef.current = script;
    const slice = script.slice(fromChar);

    const doSpeak = () => {
      const utter = new SpeechSynthesisUtterance(slice);
      utter.rate = 1.28;
      utter.pitch = 1.1;
      utter.volume = 1;
      const voice = pickVoice();
      if (voice) utter.voice = voice;

      utter.onboundary = (e) => {
        if (e.name === 'word') charIndexRef.current = fromChar + e.charIndex;
      };
      utter.onend = () => {
        charIndexRef.current = 0;
        fullScriptRef.current = '';
        setAudioState('idle');
      };
      utter.onerror = (e) => {
        console.error('SpeechSynthesis error:', e.error);
        setAudioState('idle');
      };
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    // Chrome bug: speak() called right after cancel() is silently dropped.
    // A small delay lets the engine flush before queuing the new utterance.
    const startSpeech = () => setTimeout(doSpeak, 120);

    if (window.speechSynthesis.getVoices().length) {
      startSpeech();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', startSpeech, { once: true });
    }

    setAudioState('playing');
  }, [pickVoice]);

  const handleAudioToggle = useCallback(() => {
    const post = postData[id];
    if (!post) return;
    if (audioState === 'idle') {
      charIndexRef.current = 0;
      fullScriptRef.current = '';
      speakFrom(post, 0);
    } else if (audioState === 'playing') {
      window.speechSynthesis.pause();
      setAudioState('paused');
    } else if (audioState === 'paused') {
      window.speechSynthesis.resume();
      setAudioState('playing');
    }
    setShowToast(false);
    setToastDismissed(true);
  }, [audioState, id, speakFrom]);

  const handleVote = async (choice) => {
    if (voted) return;
    setVoted(true);
    setUserChoice(choice);

    setStats(prev => ({
      ...prev,
      [choice === 'like' ? 'likes' : 'dislikes']: prev[choice === 'like' ? 'likes' : 'dislikes'] + 1,
    }));

    try {
      const res = await fetch(`${API_BASE}/blog-stats/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: id, action: choice }),
      });
      const data = await res.json();
      if (data.success) {
        setStats({ likes: data.likes, dislikes: data.dislikes });
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const post = postData[id];

  if (!post) {
    return (
      <div className="bp-root">
        <div className="bp-not-found">
          <h2>Article Not Found</h2>
          <p>The dispatch you're looking for doesn't exist.</p>
          <Link to="/" className="bp-back-link">← Return to AeroXplore</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bp-root">

      {/* ── Audio FAB ── */}
      <div className="ar-fab-wrap">

        {/* Mic / Play / Pause FAB — always on top */}
        <button
          id="ar-mic-btn"
          className={`ar-fab ${audioState === 'playing' ? 'ar-fab--playing' : ''} ${audioState === 'paused' ? 'ar-fab--paused' : ''}`}
          onClick={handleAudioToggle}
          aria-label={audioState === 'playing' ? 'Pause audio' : audioState === 'paused' ? 'Resume audio' : 'Play audio version'}
          title={audioState === 'playing' ? 'Pause' : audioState === 'paused' ? 'Resume' : 'Listen to article'}
        >
          {audioState === 'playing' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : audioState === 'paused' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="9" y1="22" x2="15" y2="22"/>
            </svg>
          )}
        </button>

        {/* Toast card — below the FAB */}
        {showToast && (
          <div className="ar-toast" ref={toastRef}>
            <button
              className="ar-toast-close"
              onClick={() => { setShowToast(false); setToastDismissed(true); }}
              aria-label="Dismiss"
            >✕</button>
            <div className="ar-toast-icon">🎙️</div>
            <p className="ar-toast-title">Audio Version Available!</p>
            <p className="ar-toast-body">Listen to this article narrated just for you. Tap play to begin.</p>
            <button
              className="ar-toast-cta"
              onClick={handleAudioToggle}
            >▶ Play Audio</button>
          </div>
        )}

      </div>

      <main className="bp-main">
        <div className="bp-inner">
          <Link to="/" className="bp-top-back-link">
            ← Return to Home Page
          </Link>
          <div className="bp-paper" data-reveal="fade-up">
            <div className="bp-paper-rule thick"></div>
            <div className="bp-paper-rule thin"></div>

            <div className="bp-meta-top">
              <span className="bp-category">{post.category}</span>
              <span className="bp-date">{post.date}</span>
            </div>

            <h1 className="bp-title">{post.title}</h1>

            <div className="bp-byline">
              <span>By <strong>{post.author}</strong></span>
              <span className="bp-byline-sep">·</span>
              <span className="bp-read-time">{post.content.length * 2} min read</span>
            </div>

            <div className="bp-paper-rule thin"></div>

            <div className="bp-hero-img-wrap" data-reveal="zoom-in" style={{ '--reveal-delay': '0.1s' }}>
              <img src={post.image} alt={post.title} className="bp-hero-img" />
            </div>

            <div className="bp-paper-rule thin"></div>

            <div className="bp-content">
              {post.content.map((para, i) => (
                <p
                  key={i}
                  className="bp-para"
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${i * 0.1}s` }}
                >{para}</p>
              ))}
            </div>

            {post.thought && (
              <p
                className="bp-closing-thought"
                data-reveal="fade-up"
                style={{ '--reveal-delay': `${post.content.length * 0.1}s` }}
              >
                {post.thought}
              </p>
            )}

            <div className="bp-vote-container" data-reveal="fade-up" style={{ '--reveal-delay': `${(post.content.length + 1) * 0.1}s` }}>
              <h3 className="bp-vote-title">Your scroll brought you here… worth it?</h3>
              <div className="bp-vote-buttons">
                <button
                  type="button"
                  className={`bp-vote-btn ${userChoice === 'like' ? 'voted-active' : ''} ${voted && userChoice !== 'like' ? 'disabled' : ''}`}
                  onClick={() => handleVote('like')}
                  disabled={voted}
                  aria-label="Thumbs Up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={userChoice === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bp-vote-icon">
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`bp-vote-btn ${userChoice === 'dislike' ? 'voted-active' : ''} ${voted && userChoice !== 'dislike' ? 'disabled' : ''}`}
                  onClick={() => handleVote('dislike')}
                  disabled={voted}
                  aria-label="Thumbs Down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={userChoice === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bp-vote-icon">
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bp-paper-rule thin"></div>
            <div className="bp-paper-rule thick"></div>

            <div className="bp-footer-row">
              <Link to="/" className="bp-back-link" id="bp-return-home">← Return to AeroXplore</Link>
              <span className="bp-author-sig">,  {post.author}</span>
            </div>
          </div>
        </div>
      </main>
      <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.75rem', color: '#888', background: '#0a0a0a' }}>
        I'm here to help spark ideas and provide a great starting point, but for anything mission-critical, it’s always a good move to double-check with official documentation or expert sources just to be safe!      </div>
    </div>
  );
}
