import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../CSS/BlogPost.css';
import useScrollReveal from '../hooks/useScrollReveal';

const postData = {
  'missile': {
    title: "Missile Decoding 101: From BVRAAMs to ICBMs",
    date: 'May 2, 2026',
    author: 'Diwakar Nagar',
    category: 'Strategic Weapons',
    image: '/images/missile.jpg',
    thought: "The object of war is not to die for your country but to make the other bastard die for his.",
    content: [
      "Do you ever find yourself scrolling through defense news and getting completely tripped up by acronyms like BVRAAM, ASM, or SAM? It feels like reading a secret code where every letter represents a different way something flies through the air. At its core, a missile is essentially a guided self-propelled weapon system, but the \"alphabet soup\" of categories actually tells us exactly where the missile starts its journey and where it’s intended to end it.",
      "The most common starting point for many is the Air-to-Air Missile (AAM). These are launched from one aircraft to take down another. You’ll often hear about BVRAAMs (Beyond Visual Range Air-to-Air Missiles), which are the long-distance runners of the sky, using radar to hit targets miles away before the pilot even sees them. A classic example is the American AIM-120 AMRAAM. On the flip side, there are short-range \"dogfighting\" missiles like the British AIM-132 ASRAAM, designed for high-speed maneuvers in close-quarter combat.",
      "When the target is on the ground or at sea, we move into the world of Air-to-Surface Missiles (ASM) and Anti-Ship Missiles (AShM). These are dropped from planes to strike stationary bunkers, moving tanks, or warships. The French Exocet is a legendary anti-ship missile known for its \"sea-skimming\" flight path, while the American AGM-114 Hellfire is the go-to for precision strikes against ground armor. These systems rely on laser guidance or infrared cameras to ensure they hit the bullseye without causing unnecessary collateral damage.",
      "Then there are the guardians of the ground: Surface-to-Air Missiles (SAM). These are launched from trucks or ships to intercept incoming planes or other missiles. You might have heard of the S-400 Triumf from Russia or the Patriot system from the U.S.; these act like a high-tech shield, scanning the skies constantly. Alongside these are Surface-to-Surface Missiles (SSM), which include the massive Intercontinental Ballistic Missiles (ICBMs) like the Minuteman III. These are designed to travel vast distances, sometimes across continents, following a high-arcing trajectory.",
      "Finally, we classify missiles by how they fly: Cruise vs. Ballistic. Cruise missiles, like the BrahMos or Tomahawk, fly at low altitudes and stay within the atmosphere, behaving almost like a pilotless airplane. Ballistic missiles, however, are like powerful rockets that get launched into the upper atmosphere or space before gravity pulls them back down at incredible speeds. Whether it’s a tactical strike or a strategic deterrent, understanding these labels helps clear the fog of war and makes that \"alphabet soup\" much easier to digest.",
      "A special mention must go to the BrahMos, a standout in the Cruise Missile category. Unlike subsonic cruise missiles like the U.S. Tomahawk, the BrahMos is a supersonic powerhouse—currently the fastest of its kind in the world. Developed as a joint venture between India and Russia, it travels at Mach 2.8 to 3.0, making it nearly impossible for existing air defense systems to intercept. Whether launched from a ship, a submarine, or a fighter jet, its combination of extreme speed and \"fire-and-forget\" precision sets a new global benchmark for tactical strikes."
    ]
  },
  'ic-814': {
    title: "The Kandahar Crisis: A Turning Point in Aviation Security",
    date: 'April 24, 2026',
    author: 'Diwakar Nagar',
    category: 'Aviation Security',
    image: '/images/ic-814.jpg',
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
    image: '/images/f-15.jpg',
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
    image: '/images/tejas.jpg',
    thought: "The trajectory of Indian aerospace points only upward — and the world is finally paying attention.",
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
    image: '/images/su57-f35.jpg',
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
    image: '/images/drone.jpg',
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
    image: '/images/engine.png',
    thought: "The engine is the heart of a fighter, and as long as that heart is foreign, the aircraft's pulse is controlled by someone else.",
    content: [
      "A fighter jet engine, specifically a low, bypass turbofan, operates on the core principle of the Brayton cycle: intake, compression, combustion, and exhaust. The process begins when the massive fan at the front sucks in air, splitting it into two paths. A small portion of air bypasses the engine core for cooling and slight thrust, while the majority enters the high, pressure compressor. Here, rows of rapidly spinning blades squash the air into a tiny fraction of its original volume, massively increasing its temperature and pressure before it enters the heart of the machine.",
      "Once the compressed air reaches the combustion chamber, fuel is continuously sprayed into the stream and ignited. This creates a high, energy, high, temperature explosion that expands the gas rapidly. This expanding gas is then forced through a set of turbine blades. Instead of providing thrust directly, these turbines act like a windmill, extracting just enough energy from the rushing gas to spin the shaft that drives the compressor and the front fan. This self, sustaining cycle is what keeps the engine running at thousands of revolutions per minute.",
      "The real \"kick\" for a fighter jet happens in the nozzle. After the gas passes the turbines, it is accelerated out of the rear of the engine at supersonic speeds. According to Newton’s Third Law, the force of the gas shooting backward creates an equal and opposite force, thrust, pushing the jet forward. Most modern fighters also feature an \"afterburner\" section, where extra fuel is dumped directly into the hot exhaust gases. This reignites the remaining oxygen, providing a massive, albeit fuel, hungry, surge of power for take, offs or high, speed combat maneuvers.",
      "Precision and materials science are what separate a standard jet engine from a fighter, grade powerhouse. The turbine blades must operate in environments hotter than their own melting point, requiring intricate internal cooling channels and advanced ceramic coatings. Furthermore, fighter engines must be able to handle \"unstructured\" air during extreme maneuvers, ensuring the engine doesn't stall or \"hiccup\" when the pilot pulls high G, force turns. It is this balance of raw explosive power and delicate mechanical synchronization that allows a jet to transition from a low, speed cruise to Mach 2 speeds in seconds."],
  }
};

export default function BlogPost() {
  useScrollReveal();
  const { id } = useParams();
  const navigate = useNavigate();

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

            <div className="bp-paper-rule thin"></div>
            <div className="bp-paper-rule thick"></div>

            <div className="bp-footer-row">
              <Link to="/" className="bp-back-link" id="bp-return-home">← Return to AeroXplore</Link>
              <span className="bp-author-sig">— {post.author}</span>
            </div>
          </div>
        </div>
      </main>
      <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.75rem', color: '#888', background: '#0a0a0a' }}>
        I'm here to help spark ideas and provide a great starting point, but for anything mission-critical, it’s always a good move to double-check with official documentation or expert sources just to be safe!      </div>
    </div>
  );
}
