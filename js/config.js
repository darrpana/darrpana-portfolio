/* ==========================================================================
   Darrpana's Café — central content configuration
   --------------------------------------------------------------------------
   Every piece of copy, link, image path and data list on the site lives here.
   Edit this file to replace placeholder content; no other file needs to change.
   Image paths are relative to the site root.
   ========================================================================== */

window.CAFE_CONFIG = {
  site: {
    name: "Darrpana",
    title: "Darrpana — Product & UX Designer",
    // Used by every "Say hello" mailto link.
    email: "darrpanadotcom@gmail.com",
    emailSubject: "Hello from your café",
    // Darrpana's CV (WalkOfLife_DarrpanaN.pdf); opens in a new tab from the nav.
    resumeUrl: "assets/resume.pdf",
  },

  nav: [
    { label: "Work", href: "#work", icon: "work" }, // animated cup icon, js/components/header.js
    { label: "Explorations", href: "explorations.html", icon: "explore" },
    { label: "About", href: "about.html", icon: "about" },
    { label: "Resume", href: "resume", external: true, end: true, icon: "resume" }, // "resume" resolves to site.resumeUrl; `end` puts it on the right
  ],

  hero: {
    sign: "DARRPANA'S CAFÉ",
    headline:
      "I make digital things, draw *unnecessarily detailed* things, and ask too many questions.",
    subheading: ["Product Designer", "UX", "Visual Design"],
    greeting: "Oh, hey.",
    scrollHint: "scroll to dive in ↓",
    // Scrolling zooms into this point (the deepest black of the cup, canvas pixels) until
    // the coffee fills the screen and the headline appears.
    dive: { x: 893, y: 722, zoom: 22 },
    // The hero illustration is a sticker plus four hand-lettered labels, laid out on
    // the original artwork's canvas (assets/hero/hero-original.webp, 1802 × 1112).
    // x / y / w / h are pixels on that canvas, so a redrawn piece just needs new numbers.
    canvas: { w: 1802, h: 1112 },
    illustration: {
      src: "assets/hero/cup-sticker.webp",
      alt: "Illustration of Darrpana lounging in a giant cup of coffee with her laptop, one fist in the air",
      x: 328, y: 118, w: 1011, h: 835,
    },
    labels: [
      { src: "assets/hero/label-exploring-ideas.webp", text: "Exploring ideas", x: 337, y: 43, w: 362, h: 269 },
      { src: "assets/hero/label-chasing-coffee.webp", text: "Chasing coffee", x: 1270, y: 174, w: 317, h: 235 },
      { src: "assets/hero/label-designing-products.webp", text: "Designing products", x: 1324, y: 805, w: 364, h: 212 },
      { src: "assets/hero/label-having-fun.webp", text: "…and just having fun!", x: 142, y: 955, w: 388, h: 91 },
    ],
  },

  work: {
    heading: "On the menu",
    intro: "Selected product and UX work, from first question to shipped interface.",
    // Hovering a project card swaps the cursor for this espresso cup; its steam is animated in cursor.js
    // (source art: assets/cursor/espresso-1.svg and espresso-2.svg)
    cursorCup: "assets/cursor/espresso-cup.svg",
    // Six projects, filed as cards in a folder (js/components/work.js).
    // `name` is the short title on the card (keep it to 4–5 words), `paper` its outline colour (tints of the folder purple). Projects 01–02 are placeholders;
    // 03–06 come from darrpana.com (Convora has a full case study; the rest use the simple page).
    // Work section as a stack of cards (js/components/work-stack.js): each card flies in from
    // alternating sides and pins on top of the last. Placeholder copy for now; `image` and
    // `href` reuse the projects below.
    stack: {
      kicker: "Selected work",
      cards: [
        { label: "Product design", title: "Project name", line: "A short line about the project goes here, two lines at most.", color: "#716df2", project: 2 },
        { label: "UX research", title: "Project name", line: "A short line about the project goes here, two lines at most.", color: "#72cfb8", project: 3 },
        { label: "Brand & web", title: "Project name", line: "A short line about the project goes here, two lines at most.", color: "#d62a7e", project: 4 },
        { label: "Mobile app", title: "Project name", line: "A short line about the project goes here, two lines at most.", color: "#c6c4fb", project: 5 },
        { label: "Visual design", title: "Project name", line: "A short line about the project goes here, two lines at most.", color: "#ffffff", project: 0 },
      ],
    },
    projects: [
      {
        number: "01", // placeholder
        name: "Healthcare app",
        title: "Healthcare project (placeholder)",
        description:
          "Placeholder: a healthcare product. Replace the title, summary, thumbnail and case study with the real project.",
        disciplines: ["Product design", "Healthcare"],
        image: "assets/projects/project-01.svg",
        imageAlt: "Placeholder thumbnail for the healthcare project",
        href: "case-study.html?p=healthcare",
        paper: "#a9a6f8",
      },
      {
        number: "02", // placeholder
        name: "Project two",
        title: "Project title two (placeholder)",
        description:
          "Placeholder summary. One or two sentences on the problem, the people it was for and what changed.",
        disciplines: ["UX design", "Prototyping"],
        image: "assets/projects/project-02.svg",
        imageAlt: "Placeholder thumbnail for project two",
        href: "case-study.html?p=project-02",
        paper: "#8b88f5",
      },
      {
        number: "03",
        title: "Convora",
        description:
          "Redefining workplace collaboration with a seamless and intelligent platform.",
        disciplines: ["Product design", "SaaS"],
        image: "https://framerusercontent.com/images/e7LSUVztp6VdUQDw1RIb6mPzus.png?scale-down-to=1024",
        imageAlt: "Convora workspace screens",
        href: "case-study.html?p=convora",
        paper: "#c4c2fa",
        name: "Convora team collaboration",
        // Full case study, laid out like darrpana.com/convora (see caseStudyPage in js/pages.js).
        // Images are served from Darrpana's Framer site; swap in local copies any time.
        caseStudy: {
          title: "Redefining workplace collaboration with a seamless and intelligent platform",
          hero: { src: "https://framerusercontent.com/images/e7LSUVztp6VdUQDw1RIb6mPzus.png?scale-down-to=2048", alt: "Convora workspace overview" },
          meta: [
            { label: "Industry", value: "SaaS" },
            { label: "Designed in", value: "2024-25" },
          ],
          overview: {
            heading: "Client Overview",
            text: "Convora is a workplace collaboration platform that combines messaging, project management, and AI-driven automation. It helps businesses improve team communication, streamline workflows, and reduce reliance on multiple tools.",
          },
          task: "Redesigned Convora to enhance collaboration, streamline communication, and integrate AI-driven productivity features for seamless business adoption.",
          intro: {
            heading: "Introduction",
            text: "Convora is an advanced collaboration platform that streamlines team communication, project management, and workflow automation. Designed to enhance productivity, it integrates messaging, task tracking, and AI-driven insights to create a seamless work experience. By addressing common pain points in existing tools, Convora ensures teams can collaborate efficiently, reducing complexity and improving overall efficiency.",
          },
          // the case study itself: full-width slides, stacked edge to edge
          // `radius` rounds a slide's corners; `panel` sets it on a light panel, centred
          images: [
            { src: "https://framerusercontent.com/images/3wt5FpSI5PXQcemoerqCixXaQ.png?scale-down-to=2048", radius: "2px" },
            { src: "https://framerusercontent.com/images/mEiCJxbpicDxO2yfDphro23syVg.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/fWTRxIUk6Auz4TV7UtQQ2Tt9dRQ.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/2ZJM8Gm64DEXlp3hcErhJAy2YM.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/Ziu92eqkWgUJY3SC8jYWuJa7os.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/SL4qgzva5CW1I0UCc64ft6yNqc.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/rQ5vaM9SRvfgxTbrmimFPFXGM.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/v2OfzTrLsCduGeOx7nJKk49TW9E.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/BC73QrpxsmZs5VQA5XVKzyJa8I.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/5h30AX9ukdBSexucUSyUT2O4.png?scale-down-to=2048", radius: "2px 2px 0 0" },
            { src: "https://framerusercontent.com/images/zLOryN8N32bjoI5UliayjpjESo.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/sGgaVGV7dZGpFYydEalQFyv3ONs.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/K4PJE5BUGPSmK3tF3gjZucIoM.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/meObdSzSYUlAAR8vriJGjNPRaPw.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/GkJ3htZLlw9E5QpRkUs5T7fNEko.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/NUZDUnJ41CcClRLJGPtfpwZgDOk.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/Ga1j35j3FLeb1mQ5mJypPyuY44g.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/SP5ecHnk6TsI8WNpXCDAm8Cfw.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/onQdT7tbzx9LmC2BlTpFLxB4Cs.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/siDnJFNLt7YQl31FC08r5AGvTLM.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/ozNVMwFt5NGKuuC50q9u2lhMuU.png?scale-down-to=2048" },
            { src: "https://framerusercontent.com/images/47dnzvN5Mznv0nTUUl8EdN3F3Sg.gif" },
            { src: "https://framerusercontent.com/images/ngLV9EzN7XL7oTSXJMtdY3BWk.png?scale-down-to=2048", radius: "2px" },
            { src: "https://framerusercontent.com/images/DnIPq1fIKWc0dXHCjAL6sXsQQE.gif", radius: "2px", panel: true },
            { src: "https://framerusercontent.com/images/I4aJuijHlxhCLEQOjR0KG2x8oc.png?scale-down-to=2048", radius: "0 0 2px 2px" },
          ],
        },
      },
      {
        number: "04",
        name: "Furtens pet e-commerce",
        title: "Pet products showcase: e-commerce done right with Furtens",
        description:
          "Explore my work with Furtens: admin panel, branding, UX, packaging, and UI design for a top-notch pet products e-commerce.",
        disciplines: ["E-commerce", "Branding", "UI design"],
        image: "https://framerusercontent.com/images/e2wuSe3voruhSD4r0YzyamoNkw.png?scale-down-to=1024",
        imageAlt: "Furtens pet products e-commerce screens",
        href: "case-study.html?p=furtens",
        paper: "#9794f6",
      },
      {
        number: "05",
        name: "Model risk management",
        title: "Model risk management solution for financial institutions.",
        description:
          "Designing an intuitive interface to enhance financial management without incorporating game-like elements.",
        disciplines: ["Fintech", "Product design"],
        image: "https://framerusercontent.com/images/1wgdpb4xFFDqpBa4Sk3MIcV5w.png?scale-down-to=1024",
        imageAlt: "Model risk management dashboard screens",
        href: "case-study.html?p=model-risk",
        paper: "#b6b4f9",
      },
      {
        number: "06",
        name: "Website designs gallery",
        title: "Diverse Website Designs Gallery",
        description:
          "Discover a collection of my diverse website designs, showcasing expertise across various industries. From corporate websites to dynamic e-commerce platforms.",
        disciplines: ["Web design", "Visual design"],
        image: "https://framerusercontent.com/images/IAofs7Q1okEFcKCwWaZ73Rc00E.png?scale-down-to=1024",
        imageAlt: "Collage of website designs",
        href: "case-study.html?p=web-gallery",
        paper: "#d1d0fc",
      },
    ],
  },

  about: {
    heading: "Okay, enough about the work. Meet me.",
    paragraphs: [
      "I'm a product designer with an artist's eye and a brain that rarely stays on one subject for too long. I started with Fine Arts, wandered through communication design and UX, and ended up making digital products. Somewhere along the way, I picked up an unhealthy curiosity for just about everything. Keeps life interesting, I suppose.",
    ],
    cta: { label: "Read the whole file →", href: "about.html" },
    portrait: "assets/about/portrait.svg",
    portraitAlt: "Sticker illustration of a coffee mug stuffed with a pencil, a ruler and a paintbrush",
    annotation: "the essentials",
  },

  // The About page (about.html, js/components/about-page.js). Images from darrpana.com
  // load from Framer; `dummy` images are placeholders to replace.
  aboutPage: {
    // Scroll story (like atulkhola.com), and the page's opening: a coffee greeting, then the
    // About text one section at a time. Each section brings its own photos to the sides
    // (the previous section's photos leave). `say` is the speech bubble shown on hover.
    // [[double brackets]] highlight words. Photos: assets/about/s1-*, s2-*, s3-* (square crops).
    story: {
      steps: [
        { text: "The coffee's on, pull up a chair. Hi, I'm [[Darrpana]]!", greeting: true, items: [] },
        {
          text: "I am a [[user experience and visual designer]] working globally with startups & people to create great products and designs. I have been commercializing and adding value to over [[90 brands]], including education, restaurants, consumer goods, media, lifestyle and technology for over [[7 years]].",
          items: [
            { src: "assets/about/s1-mural.webp", alt: "Darrpana in front of a giant headphone-wearing monkey mural", say: "Yes, I painted the wall. Iconic." },
            { src: "assets/about/s1-portrait.webp", alt: "Digital portrait illustration with leaves and antlers", say: "Antlers? Ate. No crumbs." },
          ],
        },
        {
          text: "I combine thoughtful, [[pragmatic design]] with [[aesthetics]] to make communication between people and products better.\nArt has always been [[my dream]], and I'm grateful to make it a part of my everyday life.",
          items: [
            { src: "assets/about/s2-room.webp", alt: "Illustration of a girl with coffee, looking at a Shah Rukh Khan mural", say: "Coffee + SRK = my love language." },
            { src: "assets/about/s2-singer.webp", alt: "Illustration of a singer belting out a song while a friend covers their ears", say: "Singing? Loud. Talent? Debatable." },
          ],
        },
        {
          text: "A bit jocular, someone who would set their Wi-Fi password to [['What a beautiful house you have']]. I find pure joy in [[exploring new places]], am a devoted [[stand-up comedy]] enthusiast, and have a deep passion for gaming, fitness, adventure, [[Shah Rukh Khan]], and [[coffee]]. 😄",
          items: [
            { src: "assets/about/s3-srk.webp", alt: "Darrpana posing beside a blue Shah Rukh Khan mural she painted", say: "Painted SRK. Casually. 💅" },
            { src: "assets/about/s3-standup.webp", alt: "A comedian on stage at a comedy club", say: "Front row. Laughing too loud." },
            { src: "assets/about/s3-comic.webp", alt: "A comedian on a big stage with blue curtains", say: "Comedy night > every night." },
          ],
        },
      ],
  // Above the greeting: Darrpana's coffee illustration, cut into pieces
    // (assets/about/brew/). Boxes are [x, y, w, h] on a 1900 × 700
    // canvas. On landing the press pours into the front cup of a huddle of five; scrolling
    // drains the stream, the other cups lean in to clink (cheers!) then float off like steam,
    // and the press stands upright beside the cup (`settle`: how far the cup shifts so the
    // finished pair ends up centred).
    brew: {
      canvas: [1200, 700],
      // listed back to front; `fly` = [x %, y %, turn deg] where each side cup drifts off to,
      // `delay` staggers them (0–0.2)
      pieces: {
        "cup-1": { src: "assets/about/brew/cup-1.webp", box: [200, 361, 250, 249], fly: [-170, -260, -200], delay: 0.06 },
        "cup-3": { src: "assets/about/brew/cup-3.webp", box: [410, 398, 248, 202], fly: [90, -330, 160], delay: 0.12 },
        "cup-4": { src: "assets/about/brew/cup-4.webp", box: [70, 433, 264, 267], fly: [-230, -120, -140], delay: 0 },
        "cup-2": { src: "assets/about/brew/cup-2.webp", box: [290, 358, 307, 342], fly: [-60, -300, 220], delay: 0.18 },
        "cup-main": { src: "assets/about/brew/cup-main.webp", box: [509, 488, 342, 212], settle: -272 },
        "stream": { src: "assets/about/brew/stream.webp", box: [568, 264, 257, 264] },
        "press-tilt": { src: "assets/about/brew/press-tilt.webp", box: [709, 58, 429, 453] },
        "press-up": { src: "assets/about/brew/press-up.webp", box: [608, 264, 354, 436] },
      },
    },
    },
    // Between the story and the brands: two rows of giant words, straight from the About
    // text, sliding sideways in opposite directions (faster when you scroll faster).
    loves: {
      label: "Things that keep me going",
      rows: [
        ["Stand-up comedy", "Gaming", "Fitness", "Adventure"],
        ["Shah Rukh Khan", "Coffee", "Exploring new places", "Art"],
      ],
    },
    brands: {
      eyebrow: "Global collaborations",
      heading: "Brewed for 90+ brands",
      logos: [
        { name: "FML", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/75LdOyn2a6KzVolJatpxZd0.png" },
        { name: "Barclays", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/lmd9hpGqnnv4UJcuW8p1QypBs8.png" },
        { name: "Whirlpool", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/rSjEwoYsWeRGg76jMcnR79KMixE.png" },
        { name: "Murphies", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/3fxUDmNVGQ3rDTcDCPNi9nddV8Q.png" },
        { name: "Swadhakarnt", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/2s4ULyhyCz6WUMcDDwv5rcF242g.png" },
        { name: "Haier", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/RqJpBbgIVw2ytl1NRiCd3Kfu4g4.png" },
        { name: "Atlas Copco", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/fMmZIJaFog7WbTp8sq2s4p1SkJI.png" },
        { name: "Rubiscape", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/j9Y23krYs8oxGmxzimtNsjZXMg.png" },
        { name: "Prasanna", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/nGfJNATwiWqeKSClAk6rVGMIPQ.png" },
        { name: "Deltic", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/WBmu1UG7JJRxLyfrMXjyAWHQMhM.png" },
        { name: "Welspun Group", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/512/z6PEszUgAl4Q4NqqSa4rR17KhY8.png" },
        { name: "Wildcraft", src: "https://framerusercontent.com/modules/cPOn9g3BwYzwOdcnGvXJ/V8JsMvcUIaOPAQPHV1m3/assets/qckN3zVO9TuabAHXeLGNbicpsg.png" },
      ],
    },
    books: {
      heading: "Espresso & Epilogues",
      // one illustrated pile of 7 on black; colours are tints and shades of the blue-purple, and greys
      color: "#716df2", // every book: black, with a thick outline in this purple; white pages
      items: [
        { title: "About Face", author: "Alan Cooper" },
        { title: "The Design of Everyday Things", author: "Don Norman" },
        { title: "Articulating Design Decisions", author: "Tom Greever" },
        { title: "Hooked", author: "Nir Eyal" },
        { title: "Continuous Discovery Habits", author: "Teresa Torres" },
        { title: "The Mom Test", author: "Rob Fitzpatrick" },
        { title: "Don't Make Me Think", author: "Steve Krug" },
      ],
    },
    // Travel: heading, count and photos (from darrpana.com/story), shown as a paper stamp.
    travel: {
      heading: "Espresso & Passports",
      sub: "84 cities down!",
      // one stamp on handmade paper; the photo inside changes as you scroll.
      // Small handwritten notes cycle under it (swap in place names when you have them).
      paper: {
        notes: ["coffee first, then the map", "lost on purpose", "window seat, always", "one more cup, one more street",
          "postcards > souvenirs", "slow mornings, new places", "the best café is the one you stumble into", "wish you were here"],
      },
      photos: [
        "https://framerusercontent.com/images/i8FVqR87yCDJ6bomu6DqRpGBvGU.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/L0S8cARbOzBVgc0iuDVfGAOafAk.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/Pr0zPDSO5zyDPGvREXffy9glo.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/eHP2w1v8QBg5GWVvIRIgtud0u2o.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/FlbHV4f8WbSvYIXCbMbfhROmo.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/8qhHJ96Rbz2TMJY7IxYPpEeYkow.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/SAXlNi5Vx2MFAG41O3sydGzsEk.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/XCA0LGliYsIaAmzfSmD4vrvWV0.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/ulDgAEzwG5YmJhv9X5OpmalA.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/9FpWdGulPm2KIHGVz6XjIQjT24.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/P1fGi26zc6Q8i4PKNpK1JJ31GEc.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/YDyMGSIl5VmpaZdUYaAMH50PHq0.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/6s5avis63vwM0ypEQn4FMB4Nc.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/Tc7w94axWfrXXpUxL6vuz8uTDd0.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/KcV4JbHr5FqmJ2HbJmyw0YA2k.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/9Lt1cRbU4diF794A97GxlpCe5FE.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/GoWXkXfJ4DHx8iJnpujWupITBZs.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/nRzYEz3HY98aMXyozli57XlVc8.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/6F41khTOJbE7z6HDgXMXx24wBUI.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/cb7ajjCPwuoRdP6TJZ2HRis9A8.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/yWYgkwx5o4bRYxppcRExjSQGRz8.jpeg?scale-down-to=1024",
        "https://framerusercontent.com/images/uwaWx9dkuZIlYHQsYCM8pV9R7U.jpeg?scale-down-to=1024",
      ],
    },
  },

  // about-cafe.html: the About page as a walk through a line-drawn café (js/components/cafe-walk.js).
  // Scrolling moves you sideways from corner to corner. Most content is shared with aboutPage;
  // this is only the café's own signs and labels.
  cafeWalk: {
    welcome: "Welcome to Darrpana's Café",
    welcomeSub: "Come in, the coffee's on. Scroll to walk around.",
    stations: ["Entrance", "About me", "Books", "The table", "Travel & art", "Say hi"],
    // the receipt that prints from the till, lines from the About text
    receipt: ["1 × pragmatic design", "1 × aesthetics", "Better communication between people & products", "Art, every day"],
    wifi: { label: "Wi-Fi", password: "What a beautiful house you have" },
    notesTitle: "Things that keep me going",
    laptop: "On my screen: 90+ brands",
    artTitle: "On the walls: my art",
    art: ["assets/about/s1-mural.webp", "assets/about/s1-portrait.webp", "assets/about/s2-room.webp", "assets/about/s2-singer.webp"],
    treatsSign: "Leaving already? Take a treat.",
    door: "See you soon",
  },

  career: {
    heading: "How I got here",
    sticker: { src: "assets/stickers/slides.svg", w: 324, h: 244 },
    // `icon` keys map to hand-drawn symbols in js/components/timeline.js
    milestones: [
      { year: "2018", role: "Communication Design", icon: "type" },
      { year: "2019", role: "UX / Product", icon: "wireframe" },
      { year: "2020", role: "Product + Communication", icon: "overlap" },
      { year: "2021", role: "Freelance", icon: "kite" },
      { year: "2023 onward", role: "Senior Creative Designer", icon: "star" },
    ],
    // A parallel influence, drawn as a side branch between two milestones (0-based indexes).
    influence: { label: "Psychology, along the way.", from: 1, to: 4 },
  },

  explorations: {
    heading: "A little more than work",
    intro: "Side quests in pencil, pixels and paper.",
    sticker: { src: "assets/stickers/sketchbook.svg", w: 372, h: 260 },
    // AI pet projects: dummy data + dummy thumbnails for now (assets/ai/)
    ai: {
      title: "AI pet projects",
      rackTitle: "The capsule rack",
      description: "Small experiments brewed with AI, just to see what happens.",
      href: "ai.html",
      projects: [
        { slug: "ai-one", title: "AI project one", tag: "Experiment", cover: "assets/ai/ai-01.svg", summary: "Placeholder: what it is, what it does, what I learned.", images: ["assets/ai/ai-01.svg"] },
        { slug: "ai-two", title: "AI project two", tag: "Tool", cover: "assets/ai/ai-02.svg", summary: "Placeholder: what it is, what it does, what I learned.", images: ["assets/ai/ai-02.svg"] },
        { slug: "ai-three", title: "AI project three", tag: "Prototype", cover: "assets/ai/ai-03.svg", summary: "Placeholder: what it is, what it does, what I learned.", images: ["assets/ai/ai-03.svg"] },
        { slug: "ai-four", title: "AI project four", tag: "Experiment", cover: "assets/ai/ai-04.svg", summary: "Placeholder: what it is, what it does, what I learned.", images: ["assets/ai/ai-04.svg"] },
        { slug: "ai-five", title: "AI project five", tag: "Side quest", cover: "assets/ai/ai-05.svg", summary: "Placeholder: what it is, what it does, what I learned.", images: ["assets/ai/ai-05.svg"] },
      ],
    },
    illustrations: {
      title: "Illustrations",
      tableTitle: "Latte art",
      description: "Sketchbook pages, commissions and things drawn for no reason at all.",
      href: "illustrations.html",
      linkLabel: "Open the gallery →",
      previewCount: 6, // how many gallery images to show on the landing page
    },
    branding: {
      title: "Branding",
      shelfTitle: "The packaging shelf",
      description: "Identities, systems and the small details that hold them together.",
      href: "branding.html",
      projects: [
        {
          slug: "footwear-brand",
          title: "Footwear brand",
          tag: "Identity",
          placeholder: true, // name from the Framer page; cover + images are placeholders
          cover: "assets/branding/brand-one-cover.svg",
          summary: "Placeholder summary for this branding project. Replace with the real story.",
          images: ["assets/branding/brand-one-1.svg", "assets/branding/brand-one-2.svg", "assets/branding/brand-one-3.svg"],
        },
        {
          slug: "house-of-beauty",
          title: "House of Beauty",
          tag: "Identity",
          placeholder: true, // name from the Framer page; cover + images are placeholders
          cover: "assets/branding/brand-two-cover.svg",
          summary: "Placeholder summary for this branding project. Replace with the real story.",
          images: ["assets/branding/brand-two-1.svg", "assets/branding/brand-two-2.svg", "assets/branding/brand-two-3.svg"],
        },
        {
          slug: "real-estate",
          title: "Real estate",
          tag: "Brand system",
          placeholder: true, // name from the Framer page; cover + images are placeholders
          cover: "assets/branding/brand-three-cover.svg",
          summary: "Placeholder summary for this branding project. Replace with the real story.",
          images: ["assets/branding/brand-three-1.svg", "assets/branding/brand-three-2.svg", "assets/branding/brand-three-3.svg"],
        },
        {
          slug: "nine-spices",
          title: "Nine Spices",
          tag: "Packaging",
          placeholder: true, // name from the Framer page; cover + images are placeholders
          cover: "assets/branding/brand-one-cover.svg",
          summary: "Placeholder summary for this branding project. Replace with the real story.",
          images: ["assets/branding/brand-one-1.svg", "assets/branding/brand-one-2.svg", "assets/branding/brand-one-3.svg"],
        },
        {
          slug: "dessert-corner",
          title: "Dessert Corner",
          tag: "Identity",
          placeholder: true, // name from the Framer page; cover + images are placeholders
          cover: "assets/branding/brand-two-cover.svg",
          summary: "Placeholder summary for this branding project. Replace with the real story.",
          images: ["assets/branding/brand-two-1.svg", "assets/branding/brand-two-2.svg", "assets/branding/brand-two-3.svg"],
        },
        {
          slug: "believe-collective",
          title: "Believe Collective",
          tag: "Brand system",
          placeholder: true, // name from the Framer page; cover + images are placeholders
          cover: "assets/branding/brand-three-cover.svg",
          summary: "Placeholder summary for this branding project. Replace with the real story.",
          images: ["assets/branding/brand-three-1.svg", "assets/branding/brand-three-2.svg", "assets/branding/brand-three-3.svg"],
        },
      ],
    },
  },

  // Full illustration gallery (illustrations.html). Generated placeholder list —
  // replace with an explicit array of { src, alt, title } objects when real art arrives.
  gallery: [
    // Darrpana's own artworks first; the rest are placeholders until the Framer illustrations are in
    { src: "assets/about/s1-portrait.webp", title: "Portrait", alt: "Digital portrait illustration with leaves and antlers" },
    { src: "assets/about/s2-room.webp", title: "Room with a view", alt: "Illustration of a girl with coffee looking at a Shah Rukh Khan mural" },
    { src: "assets/about/s2-singer.webp", title: "The singer", alt: "Illustration of a singer belting out a song while a friend covers their ears" },
    { src: "assets/about/s1-mural.webp", title: "Café mural", alt: "Darrpana in front of a giant headphone-wearing monkey mural she painted" },
    ...Array.from({ length: 50 }, (_, i) => {
      const n = String(i + 5).padStart(2, "0");
      return { src: `assets/illustrations/illustration-${n}.svg`, alt: `Placeholder illustration ${n}`, title: `Illustration ${n}` };
    }),
  ],

  social: {
    heading: "Around the internet",
    links: [
      { name: "Instagram", handle: "@bluephired", href: "https://www.instagram.com/bluephired/", icon: "instagram", accent: "pink" },
      { name: "LinkedIn", handle: "in/darrpana", href: "https://www.linkedin.com/in/darrpana/", icon: "linkedin", accent: "purple" },
      { name: "Behance", handle: "be/darrpana", href: "https://www.behance.net/darrpana", icon: "behance", accent: "turquoise" },
    ],
  },

  closing: {
    heading: "That's a wrap.",
    line: "If you'd like to say hello, rant about a project, or just share a good coffee recommendation…",
    cta: "Say hello →",
    image: "assets/closing/closing-scene.svg",
    imageAlt: "Illustration of closing time: the laptop is shut, the lamp is off and a pair of slides lies kicked off under the table",
  },

  footer: {
    text: "© 2026 Darrpana. All rights reserved. Made with curiosity and coffee.",
    // Social links as Darrpana's treats (fresh / eaten images): hover takes a bite.
    // Shown on pages whose <body> has data-treats. `styles` lists the looks to compare:
    // "tray" (all three on one long tray) and "tissue" (each on a diamond tissue).
    treats: {
      styles: ["tray", "tissue"],
      items: [
        { treat: "croissant", social: "LinkedIn", label: "LinkedIn", fresh: "assets/treats/croissant-fresh.webp", eaten: "assets/treats/croissant-eaten.webp" },
        { treat: "cookie", social: "Instagram", label: "Insta", fresh: "assets/treats/cookie-fresh.webp", eaten: "assets/treats/cookie-eaten.webp" },
        { treat: "cupcake", social: "Behance", label: "Behance", fresh: "assets/treats/cupcake-fresh.webp", eaten: "assets/treats/cupcake-eaten.webp" },
      ],
    },
  },

  // Bottom of a full case study (as on darrpana.com): project nav band + sign-off footer.
  caseStudyEnd: {
    allProjects: { label: "All projects", image: "assets/work/site/osof6UkT7yLU6j1cGmuisLWUd0.png" },
    next: { label: "Next spot", image: "assets/work/site/YNgQxBlBg15ynrxacktZuqAYoQ.png" },
    arrow: "assets/work/site/ae26EhqZfg0LqgTSdw05UozZ4.png",
    greeting: "AHOY!",
    copyright: "Darrpana © 2026. All rights reserved. Wander creatively, but leave my work be.",
  },

  // Persistent cup: liquid level (0–1) reached at the top of each section.
  // Values interpolate smoothly while scrolling between sections.
  cupLevels: [
    { section: "top", level: 1 },
    { section: "work", level: 0.86 },
    { section: "about", level: 0.5 },
    { section: "career", level: 0.36 },
    { section: "social", level: 0.06 },
    { section: "hello", level: 0 },
  ],
};
