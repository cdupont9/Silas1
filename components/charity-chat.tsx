'use client'

import { useState, useRef, useEffect } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  time: string
  reaction?: string
}

interface CharityChatProps {
  openCaseStudy?: (project: string) => void
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const REACTIONS = ['❤️', '👍', '👎', '😂', '❗', '❓', '😢', '😍']

// Helper to pick random response
const pick = (options: string[]) => options[Math.floor(Math.random() * options.length)]

// Helper to capitalize first letter of response
const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

// Check if message deserves auto heart reaction from Charity
export const shouldAutoHeart = (msg: string): boolean => {
  const normalized = msg.toLowerCase().trim()
  return !!(
    // Compliments about Charity
    normalized.match(/(love your|great question|amazing|you're awesome|you're incredible|inspiring|so cool|really cool|that's amazing|impressed|congrats|congratulations|proud of you)/) ||
    normalized.match(/(your work is|your portfolio|your projects).*(amazing|awesome|great|incredible|beautiful)/) ||
    normalized.match(/^(you're the best|keep it up)[\s!.]*$/i) ||
    // Appearance compliments
    normalized.match(/(beautiful|pretty|gorgeous|stunning|queen|you look good|looking good|so pretty|so beautiful)/) ||
    // Apologies
    normalized.match(/^(sorry|i'?m sorry|my bad|my apologies|apologies)[\s!.]*$/i) ||
    normalized.match(/(sorry to hear|sorry about|sorry for|that's tough|condolences)/) ||
    // Gratitude
    normalized.match(/(thank you|thanks so much|appreciate it|grateful)/) ||
    // General nice things
    normalized.match(/(you're so nice|you're sweet|love this|this is great|so helpful|you're helpful)/)
  )
}

export const getCharityResponse = (userMessage: string): string => {
  // Normalize: lowercase, trim, remove extra letters (hiiiii -> hi, youuuu -> you)
  const msg = userMessage.toLowerCase().trim()
  const normalized = msg.replace(/(.)\1{2,}/g, '$1$1') // reduce repeated chars to max 2

  // ============================================
  // EMOJI REACTIONS
  // ============================================

  // Positive emoji reactions
  if (normalized.match(/^[\s]*[❤️💕💗💖💜🥰😍🤗👏🙌💯🔥✨⭐️💫🌟👍🤩😊😁]+[\s]*$/)) {
    return pick(["Thank you!", "Appreciate that!", ":)"])
  }

  // Sad/crying emoji reactions
  if (normalized.match(/^[\s]*[😢😭😿💔🥺😞😔]+[\s]*$/)) {
    return pick(["Hope you're okay!", "Is everything alright?", "Hope things get better"])
  }

  // Laughing emoji reactions
  if (normalized.match(/^[\s]*[😂🤣😆😹]+[\s]*$/)) {
    return pick(["Glad that made you laugh!", "That's funny!", ":)"])
  }

  // Thinking/confused emoji
  if (normalized.match(/^[\s]*[🤔🧐😕❓]+[\s]*$/)) {
    return "Feel free to ask me anything! I'm happy to clarify"
  }

  // ============================================
  // VAGUE SINGLE-WORD INPUTS
  // ============================================

  // Work (vague)
  if (normalized.match(/^work[\s!?.]*$/i)) {
    return "What would you like to know about my work? I'm a UX Designer at Google"
  }

  // School (vague)
  if (normalized.match(/^school[\s!?.]*$/i)) {
    return "What do you mean by school? Are you asking about my education?"
  }

  // Family (vague)
  if (normalized.match(/^family[\s!?.]*$/i)) {
    return "Are you asking about my family? I have my mom and our dog Hunter"
  }

  // Life (vague)
  if (normalized.match(/^life[\s!?.]*$/i)) {
    return "What do you mean by life? Feel free to ask me something more specific"
  }

  // Love (vague)
  if (normalized.match(/^love[\s!?.]*$/i)) {
    return "What do you mean by love?"
  }

  // ============================================
  // CONVERSATIONAL RESPONSES
  // ============================================

  // Simple yes/no follow-ups
  if (normalized.match(/^(yes|yep|yeah|yea|ya|yup|yuh|mhm|uh huh)[\s!?.]*$/i)) {
    return pick(["Great!", "Nice!", "Okay!"])
  }

  // No response
  if (normalized.match(/^(no|nope|nah|naw|not really|nevermind|never mind)[\s!?.]*$/i)) {
    return pick(["Okay!", "No problem!", "That's fine!"])
  }

  if (normalized.match(/^(no|nope|nah|naw)[\s!?.]*$/i)) {
    return pick(["No worries!", "All good", "That's okay!"])
  }

  // Confirmation follow-ups
  if (normalized.match(/^at google\??$/i)) {
    return pick(["Yep!", "Yes!", "That's right"])
  }

  if (normalized.match(/^(really|for real|fr|deadass|no cap|serious|seriously)\??$/i)) {
    return pick(["Yep!", "For real", "100%"])
  }

  // Greetings
  if (normalized.match(/^(hi+|hey+|hello+|sup|yo+|howdy|wassup|wasup|whaddup|what's good|whats good|ayy+|ayo+|hiya)[\s!.?]*$/i)) {
    return pick(["Hey!", "Hi there!", "Hello!", "Hi!"])
  }

  // How are you
  if (normalized.match(/^(how are you+|how's it going|how you doing|how u doing|how you doin|what's up|whats up|wassup|wyd|what you doing|whatchu doing|how's everything|hows everything|how are ya|how ya doing|how u)[\s!?.]*$/i)) {
    return pick(["Doing well! How about you?", "I'm great, thanks for asking!", "Doing good, thanks! And you?"])
  }

  // What's good / what's poppin
  if (normalized.match(/^(what'?s good|whats good|what'?s poppin|whats poppin|what'?s crackin|whats crackin)[\s!?.]*$/i)) {
    return pick(["Not much! How are you?", "Doing well, thanks! And you?", "All good here, how about you?"])
  }

  // ============================================
  // BASIC INFO
  // ============================================

  // Name
  if (normalized.match(/^(what'?s your name|whats your name|your name|who are you|who dis|who this|who is this)\??$/i) || normalized === 'name') {
    return pick(["I'm Charity!", "Charity", "My name's Charity"])
  }

  // Full name
  if (normalized.match(/full name/)) {
    return "Charity Dupont"
  }

  // Age - vague single word
  if (normalized.match(/^age[\s!?.]*$/i)) {
    return "Are you asking how old I am? I'm 30"
  }

  // Age - specific questions
  if (normalized.match(/(how old|your age|what's your age|whats your age)/)) {
    return pick(["I'm 30!", "30", "I'm 30 years old"])
  }

  // Birthday
  if (normalized.match(/(birthday|birth|born.*when|when.*born|bday)/)) {
    return "May 25th!"
  }

  // ============================================
  // WORK & CAREER
  // ============================================

  // What do you do
  if (normalized.match(/^(what do you do|what you do|whatchu do|wyd for work|what do u do)\??$/i)) {
    return pick(["I'm a UX Designer!", "UX Designer", "I design stuff! I'm a UX Designer"])
  }

  // Where do you work
  if (normalized.match(/^(where do you work|where you work|where u work|where do u work)\??$/i) || normalized.match(/^where.*you.*work/i)) {
    return pick(["I work at Google!", "Google", "At Google!"])
  }

  // About/Tell me about yourself
  if (normalized.match(/(tell me about yourself|about you|introduce yourself|who is charity|who you|tell me bout you)/)) {
    return "I'm a UX Designer focused on AI-assisted experiences where clarity and trust really matter - I design systems that help people navigate complex workflows with confidence"
  }

  // Current role details
  if (normalized.match(/(your role|your job|work.*on|day to day|daily)/)) {
    return "I design AI-assisted experiences - thinking through how AI shows up, when it steps in, and how it communicates intuitively"
  }

  // Why UX
  if (normalized.match(/(why ux|why design|love about design|enjoy about design)/)) {
    return "I love designing products that help people think more clearly, especially as AI becomes more embedded in everyday tools"
  }

  // How did you get into UX
  if (normalized.match(/(how did you|how'd you|how you get into|get into|your story|your journey|start.*ux|background|path)/)) {
    return "In 2020 during COVID my mom volunteered me to build a website - I had no clue what I was doing but figured it out! I was teaching 4th grade at the time but that sparked my interest. Did a bootcamp at Columbia and here I am"
  }

  // Teaching
  if (normalized.match(/(previous|before ux|teacher|teaching|used to do|taught)/)) {
    return pick(["I was a 4th grade teacher before getting into UX!", "yep I used to teach 4th grade"])
  }

  // Education - exclude "case study" and "study" alone to avoid matching case studies
  if (normalized.match(/(education|degree|university|college|studied|columbia|njcu)/) && !normalized.match(/case/)) {
    return "Psychology at NJCU and a UX/UI Bootcamp at Columbia"
  }

  // Skills/tools
  if (normalized.match(/(skill|tool|software|figma|design tool|what tools)/)) {
    return "Figma mostly - but my real strength is systems thinking, structuring complex workflows into clear flows"
  }

  // Strengths
  if (normalized.match(/(strength|strong suit|good at|best at|superpower)/)) {
    return "Structuring ambiguity and advocating for users, especially those who feel overlooked"
  }

  // Weaknesses
  if (normalized.match(/(weakness|struggle|challenge|difficult|hard for you)/)) {
    return "I can be a perfectionist sometimes - I have to remind myself that done is better than perfect"
  }

  // Process
  if (normalized.match(/(how do you work|process|approach|method|iterate|design process)/)) {
    return "Very iterative - I refine until things feel precise and trustworthy"
  }

  // Feedback
  if (normalized.match(/(feedback|criticism|critique|handle feedback)/)) {
    return "I listen, take notes, and like to process before responding"
  }

  // Collaboration - exclude "teammate" which is a case study
  if (normalized.match(/(collaborat|work with others|coworker|teamwork)/)) {
    return "I enjoy collaborating with others and working cross-functionally"
  }

  // Culture
  if (normalized.match(/(culture|environment|company|thrive|work environment)/)) {
    return "I thrive with structure and thoughtful decision-making"
  }

  // Remote/relocation
  if (normalized.match(/(relocat|remote|hybrid|office|work from home|wfh)/)) {
    return "Open to relocation and remote - currently hybrid, 2 to 3 days in office"
  }

  // Goals
  if (normalized.match(/(goal|aspir|dream job|where do you see|future|5 years|ten years)/)) {
    return "I want to keep designing AI experiences that genuinely help people - maybe lead a design team one day"
  }

  // ============================================
  // UX & DESIGN PROCESS
  // ============================================

  // Prioritizing design
  if (normalized.match(/prioriti|what (do you |to )design first|where do you start|how do you decide what|what comes first/i)) {
    return "I focus on what defines the structure of the experience first. I try to identify the core user flow and build outward from that. If everything feels equally important, I start with the part that helps define structure for the rest of the system."
  }

  // Ambiguity
  if (normalized.match(/ambiguity|uncertain|unclear|vague|don't have all the info|early design|not fully defined/i)) {
    return "I'm comfortable with ambiguity, but I try to create structure quickly. I usually break problems down and start prototyping to make uncertainty more visible. If something is unclear, I focus on what the user is trying to do, what the system is trying to solve, and what constraints exist."
  }

  // When is it good enough?
  if (normalized.match(/good enough|when to ship|ready to go|when is a design done|when do you stop/i)) {
    return "When it clearly solves the user problem and the core flow is understandable. It does not need to be perfect, but it needs to be functional and clear."
  }

  // Balancing user vs business
  if (normalized.match(/balance|user vs business|business needs|stakeholder|user needs vs/i)) {
    return "I try to understand both sides and find alignment. I focus on what still allows a good user experience while meeting business constraints."
  }

  // Disagreement with PM/Engineer
  if (normalized.match(/disagree.*(pm|engineer|dev)|conflict.*(pm|engineer)|pm.*(disagree|conflict)|engineer.*(disagree|conflict)/i)) {
    return "I approach it through communication and understanding the reasoning behind their perspective. I focus on alignment around the goal rather than defending a specific solution."
  }

  // What is good UX?
  if (normalized.match(/what is (good )?ux|definition of ux|ux meaning|define ux/i)) {
    return "Good UX is when the user does not feel confusion. The system feels intuitive, and the user is able to accomplish their goal without friction."
  }

  // ============================================
  // AI UX SPECIFIC
  // ============================================

  // AI UX vs Traditional / How is AI different
  if (normalized.match(/ai ux vs|traditional ux|difference.*(ai|designing)|how is (ai|designing for ai) different|ai.*(different|unique)/i)) {
    return "Designing for AI is different because the output is not always consistent or predictable. In traditional UX, you can design a fixed flow, but with AI you have to account for variability, uncertainty, and edge cases. It feels more like designing a conversation between user and system rather than a static flow."
  }

  // Probabilistic systems
  if (normalized.match(/probabilistic|variability|predictability|multiple outcomes|variable output/i)) {
    return "You have to design for variability. That means thinking about multiple outcomes instead of a single fixed flow."
  }

  // Incorrect AI output / hallucination
  if (normalized.match(/incorrect|ai.*(mistake|wrong)|hallucination|wrong output|ai error|when ai is wrong/i)) {
    return "You need clear feedback loops and ways for users to correct or refine outputs instead of assuming the AI is always correct."
  }

  // AI explanation/Transparency / when should AI explain
  if (normalized.match(/explain itself|transparency|why did the ai|explainable|when should ai explain|show.*(context|reasoning)/i)) {
    return "When the output affects user decision-making or when trust is important. Show enough context so users understand why something happened without overwhelming them. Otherwise, too much explanation can create friction."
  }

  // Designing trust in AI
  if (normalized.match(/trust.*(ai|design)|design.*(trust|reliable)|believe the ai|how do you build trust/i)) {
    return "Trust comes from clarity, transparency, and consistency in how the system behaves. Users need to understand what the AI is doing and why it is producing certain outputs, even if it is not perfect. It's less about making the AI seem perfect, and more about making it understandable."
  }

  // Prevent over-reliance
  if (normalized.match(/over-reliance|blindly following|lazy user|too dependent|rely too much/i)) {
    return "Make sure users are still making decisions, not just accepting outputs. Keep users in control."
  }

  // Human-in-the-loop
  if (normalized.match(/human.*(loop|involvement)|hitl|user.*(decision|control)/i)) {
    return "It means the user is always part of the decision process, not just receiving outputs passively."
  }

  // Failure cases / edge cases
  if (normalized.match(/failure case|edge case|something goes wrong|design for failure|when things break/i)) {
    return "You have to design for uncertainty, errors, and unexpected outputs so users always know what to do next."
  }

  // AI that helps decisions
  if (normalized.match(/ai.*(help|assist).*(decision|choose)|decision.*(support|making)/i)) {
    return "I would design it so the user still understands options and reasoning, not just outputs."
  }

  // Onboarding adaptive AI
  if (normalized.match(/onboard.*(ai|adaptive)|adaptive.*(onboard|learn)|ai.*(learn|adapt)/i)) {
    return "Start simple, then gradually introduce complexity as the system learns more about the user."
  }

  // Showing uncertainty / confidence
  if (normalized.match(/show.*(uncertainty|confidence)|uncertain.*(ui|display)|confidence level/i)) {
    return "Use UI signals that communicate confidence or variability instead of presenting everything as absolute."
  }

  // Feedback loops
  if (normalized.match(/feedback loop|correct.*(ai|output)|refine.*(output|result)|guide the ai/i)) {
    return "Give users ways to correct, refine, or guide the AI output over time."
  }

  // ============================================
  // WORKFLOW & TOOLS
  // ============================================

  // Starting from zero / new project
  if (normalized.match(/blank slate|start.*(zero|scratch|nothing)|new project|from the beginning|where do you begin/i)) {
    return "I start by understanding the problem, then quickly move into low-fidelity prototyping."
  }

  // Research to Prototype / workflow
  if (normalized.match(/wireframe|prototype|workflow|research to design|your process/i)) {
    return "I tend to compress this. I move from understanding directly into prototyping, then refine through iteration."
  }

  // Tools
  if (normalized.match(/what tool|which tool|tools do you use|software|figma|sketch/i)) {
    return "I use tools that help me move quickly from idea to prototype, especially AI-assisted tools and coding-based prototyping environments."
  }

  // Testing / validation
  if (normalized.match(/test|user testing|validate|how do you test|usability/i)) {
    return "I test by sharing early versions and observing confusion points or friction in understanding."
  }

  // Feedback incorporation
  if (normalized.match(/incorporate feedback|handle feedback|feedback.*(early|often)|respond to feedback/i)) {
    return "I try to incorporate feedback early and often, instead of waiting until the end. I listen first, reflect, and then respond. I try to fully understand feedback before reacting."
  }

  // Design failure / mistake
  if (normalized.match(/design.*(fail|mistake)|fail.*(design|project)|mistake.*(made|learn)|regret/i)) {
    return "I don't think I've had a full failure, but I've had moments where I realized I focused too much on polish early instead of structure. What I learned is that getting feedback earlier is more effective because it prevents going too far in the wrong direction."
  }

  // Shipped something not proud of
  if (normalized.match(/shipped.*(not proud|regret)|not proud.*(ship|launch)|wish.*(done better|different)/i)) {
    return "I've shipped work where I later felt I could have improved clarity or structure, but I treated it as part of the learning process."
  }

  // Most complex UX problem
  if (normalized.match(/complex.*(ux|problem|challenge)|hardest.*(design|ux)|difficult.*(project|problem)/i)) {
    return "Complexity usually comes from working with systems that have multiple possible outcomes, especially in AI-driven interfaces."
  }

  // ============================================
  // CAREER & BEHAVIORAL
  // ============================================

  // Walk through career / tell me about yourself
  if (normalized.match(/walk me through|your story|career path|tell me about yourself|how did you get (here|into|started)|your background|your journey/i)) {
    return "During COVID, I was asked to work on a website for one of my mom's clients. That was my initial entry into web design. Over time, I continued learning and completed a UX/UI bootcamp at Columbia University while working full-time and teaching fourth grade. Through one of my professors, I was connected to an opportunity at Google, where I currently work."
  }

  // End-to-end project
  if (normalized.match(/end.to.end|project.*(start to finish|worked on)|walk me through a project/i)) {
    return "Most of my work has involved taking ideas and turning them into structured prototypes, especially using AI tools and live coding to bring designs closer to real implementation. My approach is to start with understanding the problem, move into prototyping quickly, and refine through iteration rather than trying to make things perfect upfront."
  }

  // Why leaving / looking for new role
  if (normalized.match(/why.*(leave|leaving|looking)|reason.*(leave|new)|looking for.*(new|change)/i)) {
    return "If I choose to leave a position, the primary reason would be to grow and expand my skill set. I aim to work in environments where I am challenged and pushed beyond my current knowledge and comfort level."
  }

  // Strengths / what do you do well
  if (normalized.match(/strength|do.*(well|best)|good at|excel/i)) {
    return "I perform strongly in areas involving AI work, prototyping, live coding, and translating concepts into functional design prototypes."
  }

  // Weaknesses / not good at
  if (normalized.match(/weakness|not good at|struggle|improve|working on/i)) {
    return "I avoid defining myself in terms of being 'not good' at specific things, as I maintain a growth-oriented mindset. I do recognize that I am still growing in areas like perfectionism and letting go of early drafts. I've been learning that iteration is more important than polish in early stages."
  }

  // Perfectionism / struggle
  if (normalized.match(/perfectionism|perfection|struggle.*(professional|most)|hardest.*(professional|challenge)/i)) {
    return "I have struggled most with perfectionism. I tend to prefer highly polished work and have not always been comfortable sharing early drafts. Over time, I have learned that early-stage work is an essential part of the design process. I have become more comfortable sharing work earlier and iterating based on feedback."
  }

  // Why you? / hire you
  if (normalized.match(/why (you|should.*hire)|hire you|what.*(makes you|bring)|why.*candidate/i)) {
    return "Because I focus on clarity, iteration, and translating ideas into functional systems quickly while staying open to feedback."
  }

  // Why UX / why AI UX
  if (normalized.match(/why ux|why ai|passion.*(ux|design)|interested in (ux|ai|design)/i)) {
    return "I started through web design during COVID, but over time I became more interested in how people interact with systems, not just how things look. AI UX specifically is interesting because it introduces complexity and uncertainty, and I like working in spaces where you have to think through how systems behave, not just how they look."
  }

  // Best environment / work style
  if (normalized.match(/work best|ideal environment|workspace|type of environment|work style/i)) {
    return "I work best in environments where there is clarity on goals, but also space to explore solutions. I like structure in terms of expectations, but flexibility in how I get to the solution."
  }

  // Motivation
  if (normalized.match(/motivat|what drives you|stability|what keeps you going/i)) {
    return "Stability is my primary motivator. A stable foundation allows for clarity, focus, and sustained growth. From that position, I am better able to perform effectively and develop professionally."
  }

  // What are you looking for
  if (normalized.match(/looking for|want in.*(role|job)|ideal.*(role|position|opportunity)/i)) {
    return "Opportunities to grow, work on challenging systems, and continue developing my skills in UX and AI."
  }

  // What excites you
  if (normalized.match(/excite|passionate about|energize|enjoy most/i)) {
    return "Work that involves problem solving, system thinking, and building interactive experiences that are meaningful for users."
  }

  // Work that makes you disengage
  if (normalized.match(/disengage|unmotivat|boring|lose interest|not engaged/i)) {
    return "Work becomes more difficult to engage with when the purpose or expectations are unclear. When that occurs, I focus on re-establishing clarity by understanding the objective and asking questions as needed."
  }

  // Missed deadline / made a mistake
  if (normalized.match(/missed.*(deadline|meeting)|made a mistake|error.*(made|commit)|mess up/i)) {
    return "I missed a meeting once due to misreading the scheduled time. Once I realized the error, I joined immediately and apologized to the team. I followed up with my manager to provide updates. The situation reinforced the importance of verifying details carefully."
  }

  // Reliable under pressure / chaos
  if (normalized.match(/reliable|chaos|pressure|last minute|tight deadline|fast.paced|stressful/i)) {
    return "I remain reliable in fast-paced or high-pressure situations. I focus on prioritization, organization, and ensuring that deliverables are completed even when timelines are compressed."
  }

  // Self-manage / need direction
  if (normalized.match(/self.manage|direction|independent|autonomous|manage yourself|supervision/i)) {
    return "I am able to self-manage while ensuring clarity on expectations. I take detailed notes during meetings, confirm understanding when needed, and structure my work based on defined priorities. When uncertainty arises, I ask clarifying questions rather than making assumptions."
  }

  // Defensive with feedback
  if (normalized.match(/defensive|feedback|criticism|critique|handle (negative )?feedback/i)) {
    return "I do not get defensive with feedback. Feedback is an important part of growth, particularly in collaborative environments. I listen, reflect, and then incorporate feedback thoughtfully into my work."
  }

  // Consistency
  if (normalized.match(/consistent|fade|sustain|maintain.*(effort|performance)|long.term/i)) {
    return "I maintain consistency throughout the duration of projects. I focus on sustaining performance from beginning to end and rely on structure and planning to ensure continuity in my work."
  }

  // Would you leave quickly
  if (normalized.match(/leave quickly|jump ship|short.term|loyal|stay.*(long|committed)/i)) {
    return "I do not leave roles quickly for new opportunities. I prioritize long-term growth, contribution, and depth within a role. I prefer to build meaningful experience and develop within a position over time."
  }

  // Normal week / daily routine
  if (normalized.match(/normal week|typical day|daily routine|week look like|day.to.day/i)) {
    return "A typical week begins with setting up my workspace, reviewing my calendar, and checking emails and messages. My time is then structured around meetings, focused work sessions, and ongoing task management throughout the day."
  }

  // Stressed / overwhelmed
  if (normalized.match(/stress|overwhelm|anxious|handle pressure|cope/i)) {
    return "When experiencing stress or overwhelm, I step away briefly to reset. This may include taking a short walk, getting water or coffee, and then returning to the task with a clearer perspective."
  }

  // People you don't get along with
  if (normalized.match(/don't get along|difficult.*(people|coworker)|conflict.*(team|people)|hard to work with/i)) {
    return "I have not encountered situations where I am unable to work effectively with someone professionally. I separate personal feelings from work and focus on collaboration, communication, and the shared goal. Professional relationships are about maintaining respect, clear communication, and doing the work effectively as a team."
  }

  // What makes you unique
  if (normalized.match(/unique|stand out|different|special about you/i)) {
    return "I focus on making things make sense, not just look good - I design systems that help people think clearly"
  }

  // ============================================
  // CASE STUDIES & PROJECTS
  // ============================================

  // Case study / case studies - list all with buttons
  if (normalized.match(/casestud|case stud|projects?|portfolio/i)) {
    return "Yes, please see my case studies here:\nBUTTON:teammate:Teammate\nBUTTON:meetly:Meetly\nBUTTON:silas:Silas"
  }

  // Teammate
  if (normalized.match(/teammates?/i)) {
    return "Teammate is a case study I completed during my Columbia University Bootcamp. It's a dating app for sports fans that connects like-minded individuals based on their team preferences and allows them to purchase tickets together.\nBUTTON:teammate:View Case Study"
  }

  // Meetly
  if (normalized.match(/meetly/i)) {
    return "Meetly is a case study I completed during my Columbia University Bootcamp. It's a scheduling and meeting management platform I designed to help professionals coordinate their time more efficiently.\nBUTTON:meetly:View Case Study"
  }

  // Silas
  if (normalized.match(/silas/i)) {
    return "Silas is my favorite project and most recent - it's an AI companion designed to provide emotional support and meaningful conversation. I completed it end-to-end.\nBUTTON:silas:View Case Study"
  }

  // How did you build Silas / vibe coded
  if (normalized.match(/(how.*build|how.*make|how.*create|vibe.*cod).*(silas)/i) || normalized.match(/(silas).*(how.*build|how.*make|how.*create|vibe.*cod)/i)) {
    return "I vibe coded Silas using Google AI Studio"
  }

  // What tools for Silas
  if (normalized.match(/(what tool|which tool|tools.*used).*(silas)/i) || normalized.match(/(silas).*(what tool|which tool|tools.*used)/i)) {
    return "I used Google AI Studio to build Silas"
  }

  // Latest/most recent project
  if (normalized.match(/most recent|latest project/i)) {
    return "My most recent project is Silas, an AI companion.\nBUTTON:silas:View Case Study"
  }

  // Favorite case study
  if (normalized.match(/(favorite|fav|best|proudest).*(case study|project|work)/i)) {
    return "My favorite is Silas because I completed it end-to-end. It's an AI companion designed to provide emotional support.\nBUTTON:silas:View Case Study"
  }

  // ============================================
  // LOCATION & ORIGIN
  // ============================================

  // Where do you live
  if (normalized.match(/^where.*(live|based|located|stay|at)\??$/i) || normalized === 'location') {
    return pick(["New Jersey!", "I'm in New Jersey", "NJ"])
  }

  // Where are you from
  if (normalized.match(/(where.*from|originally|grew up|where you from|hometown)/)) {
    return "Born in Chicago but I live in New Jersey now"
  }

  // Chicago specific
  if (normalized.match(/chicago/)) {
    return "Yep I was born there! Moved to New Jersey when I was 10"
  }

  // New Jersey
  if (normalized.match(/jersey|nj/)) {
    return "Yep that's where I'm at now!"
  }

  // ============================================
  // FAMILY & RELATIONSHIPS
  // ============================================

  // Family
  if (normalized.match(/^family\??$/i) || normalized.match(/tell me about your family/)) {
    return "My mom and our dog Hunter"
  }

  // Mom
  if (normalized.match(/(mom|mother|mama|ma\b)/)) {
    return "My mom and I are very close - she's the one who encouraged me to pursue UX"
  }

  // Dad
  if (normalized.match(/(dad|father|pops)/)) {
    return "My dad passed when I was 13"
  }

  // Sorry about dad
  if (normalized.match(/(sorry to hear|sorry about|condolence|that's tough|that's hard)/)) {
    return "Thank you, I appreciate that"
  }

  // Siblings
  if (normalized.match(/(sibling|brother|sister|bro\b|sis\b|only child)/)) {
    return "No siblings, just me!"
  }

  // Pet - vague single word
  if (normalized.match(/^pets?[\s!?.]*$/i)) {
    return "Are you asking if I have a pet? I have a Dalmatian named Hunter!"
  }

  // Pet / Dog - specific
  if (normalized.match(/(dog|dalmatian|hunter|puppy|pup|do you have a pet)/)) {
    return "I have a Dalmatian named Hunter! he's 2 with liver spots - brown instead of black"
  }

  // Married
  if (normalized.match(/(married|husband|wife)/)) {
    return pick(["nope!", "no I'm not married"])
  }

  // Single
  if (normalized.match(/^(are you single|you single|r u single)\??$/i)) {
    return "I am single!"
  }

  // Dating/relationship - redirect warmly
  if (normalized.match(/(dating|relationship|boyfriend|girlfriend|seeing anyone|love life|boo\b|bae\b|talking to someone)/)) {
    return "That's a bit personal - happy to share more about my work or background though!"
  }

  // Kids
  if (normalized.match(/(kid|children|babies|do you have kid|want kids)/)) {
    return pick(["no I don't have any kids", "nope no kids!", "no kids"])
  }

  // ============================================
  // FOOD & DRINKS
  // ============================================

  // Food - vague single word
  if (normalized.match(/^food[\s!?.]*$/i)) {
    return "What do you mean by food? Are you asking about my favorite food?"
  }

  // Do you like food (general)
  if (normalized.match(/^do you like food\??$/i) || normalized.match(/^you like food\??$/i)) {
    return "Yes I love food!"
  }

  // What kind of food / favorite food
  if (normalized.match(/(what kind of food|favorite food|fav food|type of food|food do you like)/)) {
    return "Lamb chops with fig jam! That's my go-to"
  }

  // Lamb chops follow-up
  if (normalized.match(/lamb|fig jam/)) {
    return "Yes it's so good! The sweetness of the fig jam with the lamb is perfect"
  }

  // Favorite meal
  if (normalized.match(/(favorite meal|best meal|go-to meal)/)) {
    return "Lamb chops with fig jam for dinner, and apple pie with vanilla bean ice cream for dessert"
  }

  // Breakfast
  if (normalized.match(/breakfast/)) {
    return "I'm a simple breakfast person - eggs and toast or a good smoothie"
  }

  // Lunch
  if (normalized.match(/lunch/)) {
    return "Usually something quick - a salad or sandwich"
  }

  // Dinner
  if (normalized.match(/dinner/)) {
    return "Lamb chops with fig jam is my favorite dinner!"
  }

  // Dessert
  if (normalized.match(/(dessert|sweet tooth|sweets)/)) {
    return "Apple pie with vanilla bean ice cream"
  }

  // White chocolate - must check before general chocolate
  if (normalized.match(/white chocolate/)) {
    return "Yes I like white chocolate chip cookies without any nuts"
  }

  // Cookies
  if (normalized.match(/cookie/)) {
    return "White chocolate chip cookies without the macadamia nuts - Pepperidge Farm makes my favorite"
  }

  // Chocolate (general)
  if (normalized.match(/(chocolate|do you like chocolate)/)) {
    return "I like chocolate but not too much of it"
  }

  // What do you mean / follow-up clarification
  if (normalized.match(/(what do you mean|what you mean|wdym|huh\??$|explain)/)) {
    return "Sorry if that was confusing - feel free to ask me something else!"
  }

  // Ice cream
  if (normalized.match(/ice cream/)) {
    return "Vanilla bean is my go-to, especially with apple pie"
  }

  // Pizza
  if (normalized.match(/pizza/)) {
    return "Who doesn't love pizza? I like a good margherita"
  }

  // Coffee or tea
  if (normalized.match(/(coffee|tea|caffeine|drink in the morning)/)) {
    return "Coffee for sure - I need it to start my day"
  }

  // Alcohol / drinks
  if (normalized.match(/(alcohol|drink|wine|beer|cocktail)/)) {
    return "I'm not a big drinker but I'll have wine occasionally"
  }

  // Cooking
  if (normalized.match(/(cook|cooking|chef|make food)/)) {
    return "I can cook! nothing fancy but I can hold my own in the kitchen"
  }

  // Restaurant
  if (normalized.match(/(restaurant|eat out|dining out|favorite restaurant)/)) {
    return "I love trying new places - anywhere with a nice atmosphere and good food"
  }

  // ============================================
  // ENTERTAINMENT & HOBBIES
  // ============================================

  // Hobbies - vague single word
  if (normalized.match(/^hobby[\s!?.]*$/i)) {
    return "What do you mean by hobby? Are you asking what I like to do in my free time?"
  }

  // Hobbies
  if (normalized.match(/^hobbies\??$/i) || normalized.match(/^interests\??$/i) || normalized.match(/what are your hobbies/)) {
    return "Spending time with Hunter, quality time with my mom, and watching good shows"
  }

  // Free time / fun
  if (normalized.match(/(free time|for fun|fun\??$|weekend|what you do for fun|whatchu do for fun)/)) {
    return "I love spending time with my dog Hunter, quality time with my mom, and watching good shows"
  }

  // TV - vague single word
  if (normalized.match(/^tv[\s!?.]*$/i)) {
    return "What do you mean by TV? Are you asking what shows I watch?"
  }

  // Show - vague single word  
  if (normalized.match(/^shows?[\s!?.]*$/i)) {
    return "Are you asking what shows I watch? Emily in Paris is my favorite!"
  }

  // TV/Shows - specific questions
  if (normalized.match(/(watch|netflix|favorite show|fav show|binge|streaming|what do you watch)/)) {
    return "Emily in Paris is my favorite!"
  }

  // Emily in Paris follow-up
  if (normalized.match(/emily|paris/)) {
    return "Yes I love it! The fashion, the drama, everything"
  }

  // Movie - vague single word
  if (normalized.match(/^movies?[\s!?.]*$/i)) {
    return "What do you mean by movie? Are you asking about my favorite movie or genre?"
  }

  // Favorite movie
  if (normalized.match(/(favorite movie|fav movie|best movie)/)) {
    return "I don't have a favorite movie right now, but my favorite genre is sci-fi"
  }

  // Movies (general)
  if (normalized.match(/movie/)) {
    return "I actually prefer shows over movies, but when I do watch movies I like sci-fi"
  }

  // Sci-fi follow-up
  if (normalized.match(/(sci-fi|scifi|science fiction)/)) {
    return "yes I love sci-fi! there's something about exploring the unknown"
  }

  // Music - vague single word
  if (normalized.match(/^music[\s!?.]*$/i)) {
    return "what do you mean by music?"
  }

  // Music - specific questions
  if (normalized.match(/(what kind of music|what music|favorite music|fav music|listen to|what you listen|type of music)/)) {
    return "jazz while working - Miles Davis, Kenny G - and I enjoy early 2000s music as well"
  }

  // Music while working
  if (normalized.match(/(music.*work|work.*music|listen.*while)/)) {
    return "jazz! Miles Davis and Kenny G help me focus"
  }

  // Song/artist/playlist
  if (normalized.match(/(song|artist|playlist|spotify)/)) {
    return "I love jazz - Miles Davis, Kenny G - and early 2000s R&B"
  }

  // Jazz follow-up
  if (normalized.match(/jazz|miles davis|kenny g/)) {
    return "yes! it's perfect for focusing while I work"
  }

  // 2000s music
  if (normalized.match(/(2000|early 2000|throwback|nostalgic|old school)/)) {
    return "yes! I love that era , all of it"
  }

  // Book - vague single word
  if (normalized.match(/^books?[\s!?.]*$/i)) {
    return "what do you mean by book? are you asking about my favorite book?"
  }

  // Favorite book
  if (normalized.match(/(favorite book|fav book|best book)/)) {
    return "Pride and Prejudice by Jane Austen"
  }

  // Jane Austen / Pride and Prejudice follow-up
  if (normalized.match(/(jane austen|pride and prejudice|austen)/)) {
    return "yes it's a classic! I love the wit and the character development"
  }

  // Reading / books (general) - not single word "book"
  if (normalized.match(/(do you read|like to read|reading|any books|good books)/)) {
    return "I enjoy reading when I have time - Pride and Prejudice is my favorite"
  }

  // Horses
  if (normalized.match(/(horse|horses|horseback|riding)/)) {
    return "yes I like horses!"
  }

  // Exercise / fitness
  if (normalized.match(/(exercise|workout|gym|fitness|run|yoga)/)) {
    return "I try to stay active - walks with Hunter mostly"
  }

  // Sports
  if (normalized.match(/(sport|team|football|basketball|baseball|soccer)/)) {
    return "I do like Tennis.  I designed Teammate which is a dating app for sports fans! You can view the case study here."
  }

  // Travel - vague single word
  if (normalized.match(/^travel[\s!?.]*$/i)) {
    return "are you asking if I like to travel? I do! always looking for my next trip"
  }

  // Travel - specific
  if (normalized.match(/(do you travel|vacation|trip|visit|been to|want to go|like to travel)/)) {
    return pick(["I love traveling! always looking for my next trip", "I have been to France (Paris and Marseille), Gibraltar, Italy (Livorno and Pisa) Irealnd and South Africa!", "Big fan of traveling! There is so much to see !", "I would love to travel to Greece"])
  }

  // Favorite place
  if (normalized.match(/(favorite place|favorite city|best place|where would you)/)) {
    return "I haven't been everywhere but I'd love to go back to visit Paris one day - maybe because of Emily in Paris"
  }

  // Gaming
  if (normalized.match(/(game|gaming|video game|play games)/)) {
    return "I like Sim City"
  }

  // Social media
  if (normalized.match(/(social media|instagram|twitter|tiktok|facebook)/)) {
    return "I'm on socials but I try not to spend too much time on them"
  }

  // ============================================
  // PERSONALITY & PREFERENCES
  // ============================================

  // Personality
  if (normalized.match(/(personality|describe yourself|kind of person|type of person|what are you like)/)) {
    return "definitely an observer and listener - I like to evaluate before responding"
  }

  // Introvert/extrovert
  if (normalized.match(/(introvert|extrovert|ambivert|social)/)) {
    return "I'd say I'm more of an introvert but I can turn it on when I need to"
  }

  // Morning/night person
  if (normalized.match(/(morning person|night owl|early bird|night person)/)) {
    return "I'm more of a morning person - I like getting things done early"
  }

  // Color - vague single word
  if (normalized.match(/^colou?rs?[\s!?.]*$/i)) {
    return "are you asking about my favorite color? it's pink!"
  }

  // Favorite color - specific
  if (normalized.match(/(favorite colou?r|fav colou?r|what colou?r do you like)/)) {
    return "I love pink!"
  }

  // Favorite season
  if (normalized.match(/(favorite season|fav season|spring|summer|fall|winter|autumn)/)) {
    return "fall - I love the cozy vibes and the fashion"
  }

  // Pet peeves
  if (normalized.match(/(pet peeve|annoy|bother|hate when)/)) {
    return "when things aren't organized or clear - this is why I got into UX"
  }

  // Fears
  if (normalized.match(/(fear|afraid|scared|phobia)/)) {
    return "heights for sure but ironically I love roller coasters"
  }

  // Fun fact
  if (normalized.match(/(fun fact|interesting fact|something interesting|cool fact|tell me something)/)) {
    return "I used to make movies in Windows Movie Maker as a kid - maybe that was my first taste of creating digital experiences"
  }

  // Guilty pleasure
  if (normalized.match(/(guilty pleasure|guilty)/)) {
    return "rewatching Emily in Paris for the hundredth time"
  }

  // Superpower
  if (normalized.match(/(superpower|if you could have|one power)/)) {
    return "teleportation so I could travel anywhere instantly"
  }

  // ============================================
  // CONTACT & CLOSING
  // ============================================

  // Phone call request
  if (normalized.match(/(call you|phone call|can i call|give me your number|your number|talk on the phone)/)) {
    return "if you'd like to contact me personally, you can email me at hello@charitydupont.com"
  }

  // Contact
  if (normalized.match(/(contact|email|reach|connect|linkedin|work together|hit you up|hmu)/)) {
    return "feel free to reach out! you can email me at hello@charitydupont.com"
  }

  // Navigate
  if (normalized.match(/(macbook|navigate|explore|around|click|folder|desktop|what can i|where should)/)) {
    return "check out the case study folders in the dock, or explore Photos, Notes, and other apps!"
  }

  // Thank you
  if (normalized.match(/(thank|thanks|appreciate|preciate|thx|ty\b)/)) {
    return pick(["of course!", "you're welcome!", "anytime!", "no problem!"])
  }

  // Bye
  if (normalized.match(/(bye|goodbye|see you|take care|later|peace|deuces|gotta go|ima head out|imma head out)/)) {
    return pick(["take care!", "bye!", "see ya!", "later!"])
  }

  // Nice to meet you
  if (normalized.match(/(nice to meet|pleasure|good to meet)/)) {
    return pick(["nice to meet you too!", "likewise!", "same here!"])
  }

  // Cool / awesome / nice responses
  if (normalized.match(/^(cool|awesome|nice|great|wow|amazing|interesting|dope|fire|lit|sick|tight|bet)[\s!.]*$/i)) {
    return pick(["thanks!", "appreciate it!", "thank you!"])
  }

  // Ok / okay / got it
  if (normalized.match(/^(ok|okay|k|kk|got it|i see|makes sense|word|copy|heard)[\s!.]*$/i)) {
    return pick(["let me know if you have any other questions!", "sounds good!", "great!"])
  }

  // That's cool/dope etc
  if (normalized.match(/^that'?s (cool|dope|fire|lit|sick|awesome|amazing)[\s!.]*$/i)) {
    return pick(["thanks!", "appreciate that!", "thank you! let me know if you wanna know more about anything"])
  }

  // Appearance compliments - beautiful, pretty, queen
  if (normalized.match(/(beautiful|pretty|gorgeous|stunning|queen|you look good|looking good)/)) {
    return pick(["thank you!", "you are so kind", "thanks so much!", "thanks!", ":)"])
  }

  // General compliments
  if (normalized.match(/(love your|great question|amazing|you're awesome|you're incredible|inspiring|so cool|really cool|that's amazing|impressed)/)) {
    return pick(["thank you so much!", "that means a lot, thank you!", "that's so kind, thanks!"])
  }

  // Sorry / apologies - show empathy
  if (normalized.match(/^(sorry|i'?m sorry|my bad|my apologies|apologies)[\s!.]*$/i) || normalized.match(/(sorry to hear|sorry about that|sorry for)/)) {
    return pick(["that's okay!", "it's okay", "no worries at all", "it's all good"])
  }

  // Highly offensive/vulgar words - respond with professional reaction gif only, no text
  if (normalized.match(/(b[i!1]tch|b\*+|wh[o0]re|h[o0]e\b|h[o0]\b|sl[u!]t|c[u!]nt|f[u!]ck|stfu|a[s$][s$]hole|d[i!]ck|p[u!][s$][s$]y)/i)) {
    return pick(["GIF:shocked", "GIF:disappointed", "GIF:notimpressed", "GIF:sideye", "GIF:confused"])
  }

  // "Why" follow-up after insults or criticism
  if (normalized.match(/^why[\s!?.]*$/i)) {
    return "I don't think that was a great message. Is there something I can help you with?"
  }

  // Mean or rude comments - respond gracefully
  if (normalized.match(/(stupid|dumb|ugly|hate you|suck|worst|terrible|awful|trash|garbage|idiot|loser|boring|lame|shut up|go away|leave me alone|you're bad|you suck|don't like you|annoying)/)) {
    return pick([
      "I don't appreciate that comment, but I really hope you have a great day",
      "that's not very nice, but I hope your day gets better",
      "I'll choose to take the high road here - wishing you well!"
    ])
  }

  // Inappropriate/personal questions - redirect warmly
  if (normalized.match(/(sexy|hot\b|attractive|date me|go out|number|phone|address|where do you live exactly|salary|how much|money|income|politics|religion|vote)/)) {
    return "I'd love to share more about my work and case studies instead!"
  }

  // Help
  if (normalized.match(/^help\??$/i) || normalized.match(/what can i ask/)) {
    return "ask me about my work, background, or case studies - or just say hi!"
  }

  // Lol / haha responses
  if (normalized.match(/^(lol|lmao|haha|hehe|rofl|dead|dying)[\s!.]*$/i)) {
    return pick(["that's funny!", "glad I could make you laugh!"])
  }

  // I like that / love that
  if (normalized.match(/^i (like|love) that[\s!.]*$/i)) {
    return pick(["thanks!", "glad you like it!", "appreciate it!"])
  }

  // Default - warm and diplomatic
  return pick([
    "hmm I'm not sure about that one - but feel free to ask me about my work, background, or projects!",
    "ooh that's a new one! feel free to ask me about my case studies or background",
    "not sure I have an answer for that, but I'd love to chat about my work or experience!"
  ])
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function CharityChat({ openCaseStudy, messages, setMessages }: CharityChatProps) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const messageText = input.trim()
    const autoHeart = shouldAutoHeart(messageText)
    const messageId = `user-${Date.now()}`

    const userMessage: ChatMessage = {
      id: messageId,
      role: 'user',
      text: messageText,
      time: getCurrentTime(),
      reaction: undefined, // Will be added after delay
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Add heart reaction after 3 second delay if deserved
    if (autoHeart) {
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, reaction: '❤️' } : msg
        ))
      }, 3000)
    }

    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))

    const response = getCharityResponse(userMessage.text)

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: response,
      time: getCurrentTime(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleDoubleClick = (messageId: string, role: string) => {
    // Only allow reactions on assistant messages (not user's own messages)
    if (role === 'assistant') {
      setShowReactions(showReactions === messageId ? null : messageId)
    }
  }

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, reaction: msg.reaction === reaction ? undefined : reaction }
        : msg
    ))
    setShowReactions(null)
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      {/* Chat Header */}
      <div className="h-12 bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] border-b border-black/5 flex items-center justify-center px-4 shrink-0">
        <span className="text-[13px] font-medium text-black/80">Charity</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col relative">
            <div
              className={`max-w-[75%] ${message.role === 'assistant' ? 'self-start' : 'self-end'} relative`}
              onDoubleClick={() => handleDoubleClick(message.id, message.role)}
            >
              <div className={`rounded-2xl px-4 py-2 cursor-pointer ${message.role === 'assistant' ? 'bg-[#e9e9eb] text-black' : 'bg-blue-500 text-white'}`}>
                {message.text.startsWith('GIF:') ? (
                  <img
                    src={
                      message.text === 'GIF:shocked'
                        ? "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif"
                        : message.text === 'GIF:disappointed'
                          ? "https://media.giphy.com/media/3o7TKwmnDgQb5jemjK/giphy.gif"
                          : message.text === 'GIF:sideye'
                            ? "https://media.giphy.com/media/AAsj7jdrHjtp6/giphy.gif"
                            : message.text === 'GIF:confused'
                              ? "https://media.giphy.com/media/WRQBXSCnEFJIuxktnw/giphy.gif"
                              : "https://media.giphy.com/media/QU4ewgcmdcsObx9CG7/giphy.gif"
                    }
                    alt="Reaction"
                    className="w-32 h-auto rounded-lg"
                  />
                ) : (
                  <div className="text-[13px] leading-relaxed">
                    {message.text.includes('BUTTON:') ? (
                      (() => {
                        const lines = message.text.split('\n')
                        return (
                          <div>
                            {lines.map((line, idx) => {
                              if (line.startsWith('BUTTON:')) {
                                const parts = line.split(':')
                                const projectId = parts[1]
                                const buttonText = parts[2]
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => openCaseStudy && openCaseStudy(projectId)}
                                    className="block mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                  >
                                    {buttonText}
                                  </button>
                                )
                              }
                              return <p key={idx} className="whitespace-pre-wrap">{line}</p>
                            })}
                          </div>
                        )
                      })()
                    ) : message.text.startsWith('LINK:') ? (
                      (() => {
                        const parts = message.text.split(':')
                        const projectId = parts[1]
                        const displayText = parts.slice(2).join(':')
                        const linkMatch = displayText.match(/(.*)(click here|check it out here|here if you'd like|view the case study here|You can view the case study here)(.*)/i)
                        if (linkMatch && openCaseStudy) {
                          return (
                            <>
                              {linkMatch[1]}
                              <button
                                onClick={() => openCaseStudy(projectId)}
                                className="text-blue-600 underline hover:text-blue-800"
                              >
                                {linkMatch[2]}
                              </button>
                              {linkMatch[3]}
                            </>
                          )
                        }
                        return displayText
                      })()
                    ) : <p className="whitespace-pre-wrap">{message.text}</p>}
                  </div>
                )}
              </div>

              {/* Reaction display - iOS style */}
              {/* User messages (blue): reaction on LEFT with dot trailing to the left */}
              {/* Assistant messages (gray): reaction on RIGHT with dot trailing to the right */}
              {message.reaction && (
                <div className={`absolute -top-3 ${message.role === 'user' ? '-left-3' : '-right-3'} z-50`}>
                  <div className="relative">
                    {/* Main reaction bubble - white with gray border */}
                    <div className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-[14px]">{message.reaction}</span>
                    </div>
                    {/* Single trailing dot */}
                    <div className={`absolute bottom-0 ${message.role === 'user' ? '-left-1.5' : '-right-1.5'} w-2 h-2 bg-white border border-gray-200 rounded-full shadow-sm`} />
                  </div>
                </div>
              )}

              {/* Reaction picker */}
              {showReactions === message.id && (
                <div className={`absolute bottom-full mb-2 ${message.role === 'assistant' ? 'left-0' : 'right-0'} bg-white rounded-full shadow-lg border border-black/10 px-2 py-1.5 flex gap-1 z-50`}>
                  {REACTIONS.map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => addReaction(message.id, reaction)}
                      className="hover:scale-125 transition-transform text-lg px-0.5"
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-[10px] text-black/40 mt-1 ${message.role === 'assistant' ? 'text-left' : 'text-right'} block ${message.reaction ? 'mt-3' : 'mt-1'}`}>
                {message.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col">
            <div className="max-w-[75%] self-start">
              <div className="rounded-2xl px-4 py-3 bg-[#e9e9eb]">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1s_ease-in-out_infinite]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-black/5 shrink-0">
        <div className="bg-[#f5f5f7] rounded-full px-4 py-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Message"
            className="flex-1 bg-transparent text-[13px] outline-none placeholder-black/40 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
