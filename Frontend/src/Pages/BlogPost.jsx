import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../CSS/BlogPost.css';
import useScrollReveal from '../hooks/useScrollReveal';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const postData = {
  'boeing': {
    title: "The Birth of Boeing: From Timber to Titans",
    date: 'July 30, 2026',
    author: 'Diwakar Nagar',
    image: '/images/boeing.webp',
    category: 'Aviation History',
    thought: "Aim for the sky, but move slowly, enjoying every step along the way. It is all those little steps that make the journey complete.",
    content: [
      "The story of Boeing began not in a high-tech laboratory, but among the vast evergreen timberlands of the Pacific Northwest. In 1916, William E. Boeing, a wealthy timber magnate fascinated by early aviation, teamed up with U.S. Navy engineer George Conrad Westervelt to construct a two-seater wooden floatplane known as the B&W Model 1. Operating out of a converted boatworks facility along Seattle’s Duwamish River, Boeing incorporated Pacific Aero Products Co. on July 15, 1916, before renaming it Boeing Airplane Company the following year. What started as a modest timber-and-canvas workshop soon established airmail routes and built early military trainers, laying the groundwork for an industrial empire that would permanently reshape global transport and aerospace engineering.",
      "Throughout the mid-20th century, Boeing drove pivotal advancements in structural design, aerodynamic efficiency, and industrial manufacturing. The 1930s saw the debut of the Boeing Model 247, widely regarded as the first modern airliner due to its all-metal construction, retractable landing gear, and streamlined wing design. World War II transformed Boeing into an industrial titan, as its manufacturing lines produced thousands of iconic military aircraft, most notably the B-17 Flying Fortress and B-29 Superfortress, at unprecedented speeds. The post-war decades brought continual structural evolution, capped by the landmark 1997 merger with McDonnell Douglas, consolidating Boeing’s position as a premier aerospace giant.",
      "Boeing’s commercial achievements have consistently defined major eras in aviation. In 1958, the introduction of the Boeing 707 inaugurated the Jet Age, dramatically cutting travel times and democratizing international travel. This was followed by the twin-engine 737, which became the most widely produced commercial jetliner in history, and the revolutionary 747 \"Queen of the Skies,\" the world’s first twin-aisle jumbo jet. In the 21st century, Boeing pushed technological boundaries further with the 787 Dreamliner, introducing lightweight carbon-composite structures that significantly reduced fuel consumption, alongside the ongoing development of the advanced, folding-wing 777X family.",
      "Today, Boeing’s global presence is reflected in an immense active fleet and industrial footprint. More than 14,000 Boeing commercial aircraft are in service worldwide, connecting major cities, emerging hubs, and remote regional airports. In addition to passenger airliners, Boeing dominates global air freight, with its dedicated freighters and converted freighters handling over 90 percent of the world’s air cargo capacity. Operating out of massive manufacturing complexes such as the Renton and Everett facilities in Washington State, as well as production sites in South Carolina, Boeing remains one of the largest manufacturing exporters in North America.",
      "A cornerstone of Boeing’s century-long success is its broad and diverse global customer base. Commercial giants including United Airlines, American Airlines, Delta Air Lines, Emirates, Lufthansa, and Ryanair rely heavily on Boeing narrow-body and wide-body platforms to power their core operational networks. In cargo and logistics, industry leaders such as FedEx Express and UPS Airlines depend on Boeing freighters to maintain global supply chains. Beyond commercial carriers, Boeing maintains close relationships with international governments, leasing companies, and regional operators across mature and emerging markets.",
      "Parallel to its civil operations, Boeing plays a vital role in national defense, space exploration, and global security. Through its Defense, Space & Security division, Boeing designs and manufactures crucial military hardware, including combat jets like the F/A-18 Super Hornet and F-15EX Eagle II, the KC-46 Pegasus refueler, and rotary platforms like the CH-47 Chinook and AH-64 Apache. A premier hallmark of its strategic defense footprint is the C-17 Globemaster III, a heavy military airlifter brought into the portfolio via the McDonnell Douglas merger. Capable of landing on short, unpaved runways while hauling main battle tanks, troops, or emergency humanitarian relief, the C-17 remains the primary long-range strategic transport workhorse for the U.S. Air Force, the Indian Air Force, the Royal Air Force, and allied nations worldwide. In space, Boeing’s legacy spans from constructing the Saturn V rockets for Apollo to manufacturing components for the ISS and NASA's deep-space initiatives.",
      "Looking toward the future, Boeing is focusing heavily on modernization, sustainable aviation, and autonomous technology. Commercial market forecasts project demand for nearly 44,000 new aircraft deliveries over the next two decades as the global commercial fleet expands toward 50,000 airplanes. To support this growth sustainably, Boeing is investing in advanced aerodynamic concepts, 100% sustainable aviation fuel (SAF) compatibility, digital twin engineering, and autonomous flight systems. As the aerospace landscape evolves, Boeing continues to align its century-old heritage with modern safety, quality, and environmental priorities to navigate the next horizon of flight.",
    ]
  },
  'mh-370': {
    title: "The Last Flight of MH370: The Mystery That Still Haunts Aviation",
    date: 'July 29, 2026',
    author: 'Diwakar Nagar',
    image: '/images/mh-370.webp',
    category: 'Aviation Security',
    thought: "The ocean demands respect, but the sky requires absolute discipline. At 30,000 feet, there is zero room for ego, only precision, routine, and focus.",
    content: [
      "At 35,000 feet, swallowed by the pitch-black sky over the South China Sea, a modern engineering marvel simply dissolved into thin air. On the night of March 8, 2014, Malaysia Airlines Flight 370 was embarking on a routine red-eye flight from Kuala Lumpur to Beijing, carrying 227 passengers and 12 crew members aboard a Boeing 777-200ER, a flagship aircraft renowned for its safety. At 1:19 AM, air traffic control instructed the cockpit to switch over to Vietnamese frequency. Captain Zaharie Ahmad Shah signed off with a cool, routine reply: \"Good night, Malaysian three seven zero.\" Seconds later, the skies swallowed the aircraft whole, marking the beginning of the most terrifying enigma in aviation history.",
      "Within moments of that final radio transmission, MH370 plunged into absolute, eerie radio silence. Its transponder was manually shut off, severing communications and stripping the jet from civilian radar screens. Primary military radar later captured a chilling maneuver: the airliner executed a sharp, deliberate left turn, tracing back across the Malay Peninsula while strategically hugging flight boundary lines to evade detection. Skirting the Andaman Sea, the phantom aircraft turned sharply southward toward the boundless, freezing expanses of the southern Indian Ocean, flying entirely in the dark.",
      "For weeks, world authorities were completely blind until British satellite company Inmarsat detected a series of subtle hourly automated \"handshakes\" between the plane and a satellite overhead. By calculating the microsecond delays of these satellite pings, engineers pieced together a terrifying flight path: the Boeing 777 had kept flying for nearly six hours after vanishing from radar. Fuel calculations confirmed that around 8:19 AM, its tanks finally ran dry, sending the massive jet screaming down into one of the most desolate, abyssal ocean trenches on the planet.",
      "What ensued was the most extensive, technologically complex, and expensive search effort ever undertaken by humankind. Armada after armada swept the sea, while high-tech autonomous submersibles mapped hundreds of thousands of square kilometers of uncharted ocean floor at crushing depths below 13,000 feet. Though marine-crusted fragments, most notably a flaperon washed ashore on Réunion Island thousands of miles away, proved the jet ultimately tore apart in the water, the main wreckage, passenger remains, and black boxes vanished without a trace.",
      "In the absence of physical wreckage, the vacuum has been filled by a storm of competing theories: from a catastrophic electrical fire or explosive decompression that rendered the crew unconscious, to a meticulously calculated hijacking or deliberate pilot act. Leading experts remain sharply divided on whether the aircraft drifted silently on autopilot as a \"ghost flight\" or was manually piloted until its final plunge. Without the flight data and cockpit voice recorders, the true story of what occurred inside that cabin remains locked behind a wall of speculation.",
      "The haunting legacy of MH370 forever altered how we navigate the skies, forcing global aviation authorities to enforce mandatory, real-time satellite tracking for all long-haul commercial flights. Yet for the families of the 239 souls onboard, no technology can bridge the agonizing void of unanswered questions. That a massive, hyper-connected 21st-century airliner could vanish off the face of the Earth serves as a sobering reminder of the sheer scale and terrifying power of our planet's oceans.",
    ]
  },
  'sr-71': {
    title: "The Lockheed SR-71 Blackbird: Faster Than a Missile",
    date: 'July 28, 2026',
    author: 'Diwakar Nagar',
    image: '/images/sr-71.webp',
    category: 'Defence Aviation',
    thought: "There was never a good war, or a bad peace.",
    content: [
      "The story of the Lockheed SR-71 Blackbird began during the height of the Cold War in the late 1950s. After Soviet surface-to-air missiles shot down an American U-2 spy plane in 1960, the U.S. government realized high-altitude flying was no longer enough to avoid interception; supreme speed and stealth were required. Under the secretive leadership of legendary aerospace engineer Clarence \"Kelly\" Johnson at Lockheed’s Skunk Works division, the project took shape. Evolving from the earlier single-seat A-12 reconnaissance platform, the twin-seat SR-71 was envisioned as an uncatchable strategic reconnaissance aircraft that could peer deep into enemy territory without ever being brought down.",
      "To operate at speeds exceeding Mach 3 and altitudes above 85,000 feet, Lockheed had to reinvent aviation engineering. Air friction at such speeds generated temperatures exceeding 600°F (315°C), melting standard aircraft aluminum. Engineers turned to titanium, secretly sourced from the Soviet Union itself through bogus third-party companies. The aircraft was built with loose panels to accommodate thermal expansion during high-speed flight, causing it to famously leak special JP-7 fuel on the runway until heat sealed the gaps mid-flight. Painted in a dark, heat-radiating, radar-absorbent black skin, the Blackbird became a striking symbol of futuristic design.",
      "Entering U.S. Air Force service in 1966, the SR-71’s primary defense mechanism against hostile threats was simple yet extraordinary: raw speed. If a ground radar detected the Blackbird and launched a missile, the pilot’s defensive protocol was simply to push the throttle forward and accelerate. Cruising faster than a rifle bullet at over 2,200 mph, the aircraft easily outran every interceptor jet and missile sent to bring it down. Over its decades of operational deployment, over 4,000 surface-to-air missiles were fired at the SR-71 across various global hot zones, yet not a single Blackbird was ever struck by enemy fire.",
      "Despite its unmatched performance, changing technological and economic landscapes led to the SR-71's retirement. Operating a fleet of Blackbirds required immense financial resources, specialized ground crews, and continuous aerial refueling from dedicated KC-135Q tankers. By the late 1980s and early 1990s, advances in spy satellite imagery and unmanned reconnaissance platforms offered lower-cost intelligence gathering without human risk. The U.S. Air Force officially retired the fleet in 1990, though NASA briefly operated a few aircraft for high-speed research until the Blackbird made its absolute final flight in 1999.",
      "The aftermath of the Blackbird era left an indelible mark on aerospace engineering and popular culture. To this day, the SR-71 retains the official world record for the fastest air-breathing, crewed operational aircraft, set in 1976 at 2,193.2 mph (3,529.6 km/h). Beyond raw speed records, the Blackbird pioneered stealth technology concepts, advanced titanium manufacturing techniques, and high-altitude life-support systems that influenced generations of military aircraft. Today, surviving airframes are prized centerpieces in aviation museums worldwide, continuing to captivate engineers and aviation enthusiasts alike.",
      "While the SR-71 is long retired, its legacy directly shapes the future of military aviation through hypersonic flight research. Aerospace developers have spent years working on its spiritual successor, frequently referred to as the SR-72 or \"Son of Blackbird.\" Envisioned as an unmanned, hypersonic reconnaissance and strike aircraft powered by combined-cycle scramjet engines, the platform aims to hit speeds of Mach 6, roughly double the velocity of its famous predecessor. As global defense strategies pivot toward real-time hypersonic capability, the pioneering spirit of the SR-71 Blackbird remains the foundational blueprint for modern ultra-high-speed flight."
    ]
  },
  'Jackie': {
    title: "The Women Who Broke the Sound Barrier: Jackie",
    date: 'July 27, 2026',
    author: 'Diwakar Nagar',
    image: '/images/Jackie.webp',
    category: 'Trailblazing Personalities',
    thought: "To most people, the sky is the limit. To those who love aviation, the sky is home.",
    content: [
      "For decades during the dawn of modern aviation, flying faster than the speed of sound was considered an impenetrable wall in the sky, a physical limit known as the \"sound barrier.\" When Chuck Yeager first broke this barrier in 1947, it was hailed as a major milestone for male military pilots. However, the dangerous race to push aircraft past Mach 1 soon became a stage where trailblazing women redefined what was possible in high-altitude flight, shattering both physical limits and social barriers.",
      "To understand their achievements, it helps to understand what breaking the sound barrier actually means. Sound travels through the air in pressure waves at roughly 761 miles per hour (1,225 km/h) at sea level, a threshold aviators call Mach 1 (named after physicist Ernst Mach). As an airplane accelerates, it pushes air molecules out of the way, creating air pressure waves ahead of it. When the jet reaches Mach 1, it moves faster than those pressure waves can move away, squeezing them together into a compressed shockwave. When this concentrated wall of air hits the ground, observers hear it as a thunderous explosive crack known as a sonic boom.",
      "The first woman to conquer Mach 1 was the legendary American aviator Jacqueline \"Jackie\" Cochran. On May 18, 1953, flying a Canadair F-86 Sabre jet over Rogers Dry Lake in California, Cochran pushed her aircraft into a dive, exceeding Mach 1 and unleashing a loud sonic boom across the desert floor. A former wartime director of the Women Airforce Service Pilots (WASP), Cochran did not stop at Mach 1; over her career, she went on to set more speed, altitude, and distance records than any other pilot in aviation history, male or female.",
      "Across the Atlantic, a fierce and friendly rivalry emerged with Jacqueline Auriol, a daring French test pilot. After surviving a severe plane crash that required years of facial reconstructive surgeries, Auriol returned to the cockpit and became the first European woman to break the sound barrier in 1953. Throughout the 1950s and early 1960s, Cochran and Auriol repeatedly traded the title of the \"World's Fastest Woman,\" taking turns flying advanced military jets like the Mirage III to push top speeds past Mach 2, which is twice the speed of sound.",
      "The daring feats of Cochran, Auriol, and their contemporaries proved that piloting experimental supersonic aircraft was a matter of skill, nerve, and precision rather than gender. Their efforts tore down longstanding skepticism within the aerospace community, paving the way for future generations of female military fighter pilots, commercial captains, and astronauts. Today, every time an aircraft pierces the sky at supersonic speeds, it echoes the groundbreaking legacy of the women who dared to lead the way."
      ]
  },
  'sept11': {
    title: "The Cost of Silences: Anatomy of 9/11",
    date: 'July 07, 2026',
    author: 'Diwakar Nagar',
    image: '/images/9-11.webp',
    category: 'Aviation Security',
    thought: "History repeats itself, first as tragedy, second as farce.",
    content: [
      "Today's topic isn't fully dedicated to airplanes, but somewhat, or rather, how those massive marvels of engineering were weaponized because of a catastrophic breakdown in human communication, policy, and decision-making. The seeds of the 9/11 tragedy were sown long before the planes took off, rooted in a fatal policy decision by the US government to allow strict intelligence \"walls\" between its agencies. The CIA tracked known al-Qaeda operatives Nawaf al-Hazmi and Khalid al-Mihdhar as they entered the US, but due to bureaucratic friction and a culture of hoarding secrets, they never officially shared this data with the FBI. This single decision allowed the terrorists to live openly in California, open bank accounts, and enroll in flight schools completely undetected.",
      "As the plot neared execution, the vulnerability deepened due to how the highest levels of US leadership handled incoming warnings, culminating in a deceptively simple, brief statement presented to President George W. Bush on August 6, 2001. The President’s Daily Brief contained a short section bluntly titled, \"Bin Ladin Determined To Strike in US.\" This concise statement explicitly warned that al-Qaeda wanted to bring the fight to American soil and mentioned patterns consistent with preparations for hijackings. However, the administration made the critical decision to treat this as vague, historical analysis rather than an actionable, immediate emergency, failing to raise domestic threat levels or mobilize airport security units during a vital window of time.",
      "Consider how much better the outcome would have been if timely action had been taken based on these explicit red flags. Had the CIA simply notified the FBI when the hijackers first arrived, simple visa tracking or basic local surveillance would have disrupted the cell before flight training ever began. Furthermore, if the Federal Aviation Administration (FAA) had acted on the August security warnings by mandating reinforced cockpit doors and stricter passenger screenings, the nineteen hijackers would have been flagged and neutralized at the boarding gates. A unified, proactive response would have easily connected the dots, turning a multi-year, complex plot into a completely dismantled domestic security operation.",
      "Instead, without that timely intervention, the nineteen hijackers executed their plan on the morning of September 11, 2001, by dividing into four coordinated teams to exploit the relaxed security standards of the era. Armed only with small box cutters and pocketknives, which were legally allowed on flights at the time if the blades were under four inches, they boarded transcontinental flights bound for California. They intentionally selected early morning flights like American Airlines Flights 11 and 77, and United Airlines Flights 175 and 93, because they carried relatively light passenger loads but were fully topped off with thousands of gallons of highly flammable jet fuel, effectively transforming them into guided missiles.",
      "The resulting physical and human devastation reshaped the landscape of global security in a matter of hours. The first two hijacked planes struck the Twin Towers of the World Trade Center in New York City, causing catastrophic structural collapses, while a third plane smashed into the Pentagon just outside Washington, D.C., tearing through the heart of the nation's military headquarters. The fourth plane, United Flight 93, crashed into an empty field in Shanksville, Pennsylvania, after the passengers learned of the other attacks via air-phones and bravely fought back to prevent the plane from hitting the US Capitol. In total, 2,977 innocent people lost their lives that morning, plunging global stock markets into chaos and shattering the illusion of geographical safety.",
      "In the immediate aftermath of the tragedy, the everyday experience of global travel and personal privacy was permanently altered. Governments around the world dismantled their relaxed airport security measures overnight, giving rise to strict agencies like the Transportation Security Administration (TSA). Passengers faced mandatory shoe removals, full-body scanners, and strict bans on liquids, while commercial planes were retrofitted with heavily reinforced, bulletproof cockpit doors. Domestically, the US passed sweeping legislation like the Patriot Act, granting intelligence agencies unprecedented authority to monitor phone calls and emails, fundamentally shifting the balance between citizen privacy and state security.",
      "Finally, the geopolitical landscape was pushed into a tumultuous, multi-decade era defined by the \"Global War on Terror.\" In direct response to the attacks, the United States and its international allies launched massive military invasions, first into Afghanistan to dismantle al-Qaeda, and later into Iraq in 2003. These conflicts spanned over twenty years, cost trillions of dollars, shifted global alliances, and resulted in the loss of hundreds of thousands of lives. The tragedy serves as a stark historical case study proving that the safety of millions often hinges not on the sheer strength of a nation’s military might, but on the willingness of its leaders to act decisively on uncomfortable intelligence warnings."
    ]
  },
  'skat': {
    title: "Suryakiran: Red and White Wonders of the Indian Skies",
    date: 'June 29, 2026',
    author: 'Diwakar Nagar',
    image: '/images/skat.webp',
    category: 'Military History & Legacies',
    thought: "Touch the Sky with Glory!",
    content: [
      "The Suryakiran Aerobatic Team (SKAT), affectionately known as the \"Ambassadors of the Indian Air Force,\" stands as a supreme symbol of precision, discipline, and aerial mastery. Formed on May 27, 1996, at Air Force Station Bidar in Karnataka, the team has been thrilling massive crowds for three decades. Tracing its lineage back to the \"Thunderbolts\" formation team of 1982, SKAT was created to showcase the peak of pilot professionalism and inspire the next generation of Indian youth. Over its illustrious history, the squadron has overcome operational pauses and tragic setbacks, consistently emerging stronger to paint the skies with national pride as one of the elite Nine-Aircraft aerobatic formations in the world and the only one of its kind in Asia.",
      "The technological backbone of the team has evolved alongside the modernization of the Indian Air Force. For its first fifteen years, SKAT flew the indigenous HAL HJT-16 Kiran Mk.II jet trainer, whose distinct agility defined their early era. Following a brief hiatus due to fighter pilot training requirements, the team made a triumphant return by transitioning to the significantly faster and more capable BAE Hawk Mk-132 advanced jet trainer. Dressed in their iconic red-and-white high-visibility livery, the squadron operates an official procurement fleet of twenty dedicated Hawk aircraft, which were specifically ordered and modified with smoke-generator canisters exclusively for the team's needs.",
      "When it comes to performance, SKAT's signature nine-aircraft display is a masterclass in synchronicity. While the Ministry of Defence contract allocates twenty airframes to the squadron's registry for training and long-term maintenance, exactly nine jets fly in the sky during an active public show. The remaining aircraft serve as vital on-site operational spares on the tarmac, ready to act as immediate \"hot-spares\" if a primary jet encounters a last-minute technical snag. Managing this rotation seamlessly is a tight-knit roster of 13 to 14 elite pilots, including display flyers, a team leader, commentators, and safety officers.",
      "Their routine is a breathless exhibition of loops, barrel rolls, head-on mirror passes, and synchronised splits where wingtips fly mere meters apart at speeds exceeding 700 km/h, frequently using their custom smoke pods to streak the sky with the vibrant colors of the Indian tricolour. Beyond the jaw-dropping spectacles, what truly sets the Suryakiran team apart is the rigorous human and technical machinery operating behind the scenes. Selection into the 52nd Squadron is incredibly prestigious; only the absolute elite among IAF fighter pilots are chosen, serving a demanding three-year tour where split-second decision-making is a survival skill rather than a performance metric. Furthermore, the flawless management of their aircraft pool relies entirely on an unsung army of technical engineers and maintenance personnel who ensure that every single jet functions with absolute mechanical perfection under high-G environments.",
      "Looking ahead to the next evolution of India's premier display team, it is exciting to imagine what follows the current Hawk trainers once they reach the end of their operational lifecycle. While sub-sonic advanced trainers offer excellent nimbleness, the future of SKAT could lie in transitioning to a heavy, frontline multirole fighter like the Sukhoi Su-30MKI. Integrating a heavy fighter platform into the squadron would mirror the operational philosophy of Russia's elite \"Russian Knights\" (Russkiye Vityazi), who dazzle global audiences using heavy Su-30SMs. Upgrading to the Su-30MKI would amplify the raw power, thundering acoustics, and thrust-vectoring maneuverability of the show, serving as a spectacular testament to India's technological muscle. Yet, whatever aircraft eventually takes their place, the fundamental soul of the team remains unchanged, because when a flawless formation cuts through the clouds, it is a definitive reminder that the magic of Suryakiran has always been about the pilot, not the plane."
    ]
  },
  'il-76': {
    title: "The Ilyushin Il-76: Earth's Ultimate Strategic Workhorse",
    date: 'June 23, 2026',
    author: 'Diwakar Nagar',
    image: '/images/il-76.webp',
    category: 'Defence Aviation',
    thought: "The sky is not the limit, it is home.",
    content: [
      "Developed by Russia's Ilyushin design bureau during the Cold War and first flying in 1971, the Il-76, NATO codename \"Candid\", was engineered to conquer the Soviet Union's most brutal operational environments. Built to operate from frozen Siberian tundra and unpaved desert strips, this four-engine strategic airlifter quickly became a massive global export success. Today, its distinct high-wing profile and glass-bottomed navigator nose serve in the military pipelines of more than thirty nations. Chief among these is China's People's Liberation Army Air Force, which utilizes a massive fleet for heavy freight and early warning platforms, alongside the air arms of Algeria, Belarus, Azerbaijan, and Egypt, making it a definitive lifeline for global tactical transport.",
      "What truly makes the Il-76 an engineering marvel is its massive load-bearing architecture and total ground self-sufficiency. Capable of hauling 48 tons in classic variants and up to 60 tons in modernized versions, its pressurized cargo hold is built around a heavy-duty titanium floor. The aircraft functions as a self-contained, flying industrial zone, equipped with a hydraulic rear ramp and an internal system of four motorized overhead cranes that can hoist 3,000 kilograms each. This sophisticated layout allows the Il-76 to roll on and roll off main battle tanks, heavy armored vehicles, and oversized industrial machinery in remote regions without relying on any external ground support equipment.",
      "Unlike passive transport airframes that require constant fighter escorts, the Il-76 boasts a highly defensive nature, traditionally sporting an operational tail turret armed with twin 23mm autocannons alongside electronic countermeasures and flare dispensers to survive high-risk combat drops. This rugged survivability made it legendary in the Indian Air Force, where it was inducted in 1985 as the \"Gajraj\", King Elephant. Flying with the No. 44 Squadron \"Mighty Jets\", the IAF's Il-76s famously airlifted paratroopers during 1988's Operation Cactus to swiftly thwart a coup in the Maldives, and India still utilizes specialized derivatives like the Il-78 for mid-air refueling and the A-50EI AWACS for airborne radar. Beyond militaries, its ruggedness is prized by commercial heavyweights like Volga-Dnepr Airlines, Silk Way Airlines, and the United Nations Humanitarian Air Service to deliver urgent global relief to the world's most remote corners.",
      "Decades after its maiden flight, the future of this aviation workhorse remains incredibly bright through deep, structural modernization. Russia has revitalized the platform with the next-generation Il-76MD-90A variant, built on a completely digital assembly line. These updated aircraft feature ultra-efficient Aviadvigatel PS-90A-76 turbofans, a modern glass cockpit, advanced structural carbon-fiber components, and a vastly extended flight range. By seamlessly adapting to 21st-century aviation standards while retaining its legendary structural toughness, the Il-76 ensures it will continue to dominate the world's most challenging skies for decades to come."
    ]
  },
  'kaveri': {
    title: "Kaveri: Choked by Bureaucracy and Bad Physics",
    date: 'June 07, 2026',
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
      "For India to transform the scars of the Kaveri into future aerospace success, its roadmap must pivot from isolated institutional bureaucracy to an agile, well-funded ecosystem. First, funding must scale by orders of magnitude; jet engines cannot be built on shoestring budgets. Second, India must break the strict state monopoly held by DRDO and Hindustan Aeronautics Limited by heavily incentivizing private sector R&D and manufacturing. Finally, India must leverage its current geopolitical alignment to forge deep co-development joint ventures, such as ongoing negotiations for technology transfers with global engine houses, using these partnerships not as a crutch, but as a catalyst to master the final, elusive secrets of hot-section metallurgy."]
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
      "While India is the exclusive operator of the highly customized MKI variant, maintaining a formidable fleet of roughly 260 aircraft, the core Su-30 platform boasts global proliferation. The underlying design DNA has spawned specialized variants utilized by several countries around the world. Malaysia flies the Su-30MKM, an advanced cousin heavily influenced by the Indian MKI framework. Other nations utilizing different configurations of the twin-engine Sukhoi family include China (Su-30MKK/MK2), Vietnam, Algeria, Venezuela, Angola, and Belarus, alongside Russia's own aerospace forces. The international footprint of this airframe underscores its reliability and competitive edge over western counterparts like older generation F-15s and F-16s.",
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
  const farewell = `That brings us to the end of today's article. I truly hope you found it insightful and enjoyed the read. If you loved this piece, I'd be so grateful if you would consider subscribing to our newsletter ,  you can find the subscription option right at the bottom of the page. And if this article was worth your time, please do hit that like button below. It means the world to us. Until next time, keep exploring the skies!`;
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
  const utteranceRef = useRef(null);
  const charIndexRef = useRef(0);   // where we paused
  const fullScriptRef = useRef(''); // full narration text

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

  useEffect(() => {
    setAudioState('idle');
    charIndexRef.current = 0;
    window.speechSynthesis.cancel();
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

  // Pick the best female Indian-English voice
  const pickVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // Strict priority order ,  most Indian-sounding first
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
        <button
          id="ar-mic-btn"
          className={`ar-fab ${audioState === 'playing' ? 'ar-fab--playing' : ''} ${audioState === 'paused' ? 'ar-fab--paused' : ''}`}
          onClick={handleAudioToggle}
          aria-label={audioState === 'playing' ? 'Pause audio' : audioState === 'paused' ? 'Resume audio' : 'Play audio version'}
          title={audioState === 'playing' ? 'Pause' : audioState === 'paused' ? 'Resume' : 'Listen to article'}
        >
          {audioState === 'playing' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : audioState === 'paused' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="9" y1="22" x2="15" y2="22" />
            </svg>
          )}
        </button>
        <span className="ar-fab-label">Audio mode</span>
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
