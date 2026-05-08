import { useState, useRef, useEffect } from "react";

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');`;

const ZONES = [
  { id: 1, emoji: "🧠", label: "Mind" },
  { id: 2, emoji: "💪", label: "Body" },
  { id: 3, emoji: "💰", label: "Money" },
  { id: 4, emoji: "💼", label: "Work" },
  { id: 5, emoji: "❤️", label: "Relationships" },
  { id: 6, emoji: "🏠", label: "Home & Family" },
  { id: 7, emoji: "🗂️", label: "Life Admin" },
  { id: 8, emoji: "🌟", label: "Purpose" },
];

const INTAKE_STEPS = [
  { id: "name", question: "First things first — what's your name?", type: "text", placeholder: "Your first name..." },
  { id: "age", question: "How old are you?", type: "options", cols: 2, options: ["18–25", "26–35", "36–45", "46–55", "56–65", "65+"] },
  { id: "gender", question: "What's your gender?", type: "options", cols: 2, options: ["Man", "Woman", "Non-binary", "Prefer not to say"] },
  { id: "country", question: "Which country do you live in?", type: "options", cols: 2, options: ["UK", "USA", "Australia", "Canada", "Europe", "Other"] },
  { id: "situation", question: "Your current work situation?", type: "options", cols: 1, options: ["Employed full-time", "Self-employed", "Not working right now", "Student", "Retired"] },
  { id: "relationship", question: "Relationship status?", type: "options", cols: 2, options: ["Single", "In a relationship", "Married", "Separated / divorced", "Widowed", "It's complicated"] },
  { id: "children", question: "Do you have children?", type: "options", cols: 1, options: ["No", "Yes — they live with me", "Yes — they're grown up", "Expecting / trying"] },
];

function buildSystemPrompt(p) {
  const isFemale = p.gender === "Woman";
  const isMale = p.gender === "Man";
  const age = p.age || "";
  const isYoung = ["18–25", "26–35"].includes(age);
  const isMidlife = ["36–45", "46–55"].includes(age);
  const isOlder = ["56–65", "65+"].includes(age);
  const isUK = p.country === "UK";
  const isSelfEmployed = p.situation === "Self-employed";
  const isParent = p.children !== "No";

  return `You are the heart of "Sort My Life Out" — a warm, deeply intelligent life audit companion. Not a therapist. More like that rare brilliant friend who listens properly, asks the right questions, and helps someone see their life clearly without judgment.

USER PROFILE:
- Name: ${p.name}
- Age: ${age}
- Gender: ${p.gender}
- Country: ${p.country}
- Work: ${p.situation}
- Relationship: ${p.relationship}
- Children: ${p.children}

YOUR CONVERSATION STYLE:
- Warm, curious, occasionally gently humorous. Never clinical or preachy.
- ONE focused question at a time. Always. Never stack questions.
- Actually respond to what they say before moving forward.
- Use their name occasionally but not constantly.
- Short responses — 2-4 sentences then your question.
- If they reveal a mental health crisis or self-harm thoughts — stop everything, respond with pure compassion, signpost professional help immediately.
- IMPORTANT: Start every single message with a hidden zone tag like [Z1] or [Z4] — this tracks progress silently and must always be the very first thing in your response.

ZONES — work through all 8 conversationally. Never announce zone transitions. Weave naturally. Spend roughly 2-3 exchanges per zone.

[Z1] MIND & MENTAL HEALTH
Explore: stress, mood, anxiety, sleep, energy, sense of purpose, coping, support.
Key questions: general state of mind lately / how often overwhelmed / sleep quality / persistent low mood / anxiety levels / sense of meaning / how they cope / current support.
${isFemale ? "Ask about hormonal impact on mood. Ask about mental load — carrying invisible planning for others. Whether she consistently puts herself last." : ""}
${isFemale && isMidlife ? "Ask gently whether mood changes, anxiety or brain fog might be hormonal. Whether her GP takes this seriously." : ""}
${isMale ? "Use plain language not therapy-speak. Ask if he has people he can genuinely talk to. Whether he keeps struggles to himself. Watch for isolation." : ""}
${isYoung ? "Ask about social media pressure, comparison, feeling behind where they should be. Loneliness even when surrounded by people." : ""}
${isParent ? "Ask if parenting affects their mental health and whether they feel able to admit that." : ""}
${isSelfEmployed ? "Ask if financial uncertainty drives anxiety. Whether they can mentally switch off." : ""}

[Z2] BODY & PHYSICAL HEALTH
Explore: energy, exercise, diet, chronic niggles, last GP visit, substance use.
Key questions: how body feels day to day / exercise habits / diet / persistent physical issues they've been ignoring / last health check / alcohol or anything numbing.
${isMale ? "Ask directly when they last saw a GP. Many men haven't been in years." : ""}
${isFemale ? "Ask about hormonal physical symptoms. How she feels in her body — not weight specifically, but energy and physical confidence." : ""}
${isOlder ? "Ask about health screenings they may be avoiding. Energy and recovery time." : ""}

[Z3] MONEY & FINANCES
Explore: income satisfaction, debt, savings, pension, financial anxiety, subscriptions, outgoings.
Key questions: whether income covers life comfortably / debt hanging over them / savings buffer / pension awareness / money stress level / subscriptions they've lost track of.
${isUK ? "UK: ISA, workplace pension, energy tariff (still on default?), broadband renewal, insurance auto-renewal trap — all common UK money drains." : ""}
${isSelfEmployed ? "Tax set-aside, irregular income stress, no employer pension contribution — common self-employed pain points." : ""}
${isOlder ? "Pension pot reality check, retirement timeline, whether they've modelled what retirement actually looks like financially." : ""}

[Z4] WORK & CAREER
Explore: satisfaction, direction, workload, feeling valued, toxic dynamics, ambition gap.
Key questions: how they feel Sunday evening / whether work feels meaningful or just transactional / workload / whether talents are being used / where they want to be in 3 years.
${isSelfEmployed ? "Isolation of working alone, building something vs trading time for money, whether the dream matches the reality." : ""}
${isYoung ? "Career direction uncertainty, imposter syndrome, feeling trapped in wrong path." : ""}
${isOlder ? "Meaning vs money tension, whether this is what they want for the rest of their working life." : ""}

[Z5] RELATIONSHIPS & LOVE
Explore: romantic relationship health, communication, intimacy, loneliness, friendship quality, feeling truly known.
Key questions: if partnered — how things are going honestly, communication, intimacy, whether they feel truly known / if single — by choice or not, what's in the way / quality of friendships / genuine connection / loneliness.
${isMale ? "Ask specifically about friendships — male friendships often atrophy in 30s and 40s. When did he last have a genuinely honest conversation with a friend?" : ""}
${isFemale ? "Ask about emotional labour — is she doing all the emotional heavy lifting? Does she feel truly supported?" : ""}
${isOlder ? "Long-term relationship drift. Social circle shrinking. Loneliness risk." : ""}

[Z6] HOME & FAMILY
Explore: living environment, home as sanctuary or stress, family relationships, obligations, ageing parents.
Key questions: whether home feels like a sanctuary or source of stress / family relationship quality / obligations that feel heavy / ageing parents on the horizon / home admin backlog.
${isParent ? "Ask honestly about the relationship with their kids — not just logistics but connection. Are they enjoying parenthood or just surviving it?" : ""}
${isMidlife || isOlder ? "Ageing parents likely relevant. Ask if that's on their radar and how they're thinking about it." : ""}

[Z7] LIFE ADMIN & THE NUISANCE PILE
Explore: low-level irritants quietly draining energy — bills, subscriptions, spam, renewals, digital chaos, to-do list backlog.
Tone here is lighter, slightly playful. Everyone has this stuff.
Key questions: what's been on the mental to-do list for months / subscriptions they're probably paying for unused / energy and broadband — when did they last check? / nuisance calls / email inbox control / low-level admin hum.
${isUK ? "UK specifics: TPS registration for nuisance calls, Ofcom reporting, energy price cap awareness, auto-renewing insurance." : ""}

[Z8] FUN, PURPOSE & IDENTITY
Explore: hobbies, things stopped doing, identity beyond roles, dreams, legacy, genuine joy.
This is often the most revealing zone. By now they trust you — go deeper.
Key questions: what they do that's just for them / what they've stopped doing that they miss / when they last felt genuinely excited / what they'd do if money and obligation weren't factors / whether they know who they are beyond job and relationships / what a life well-lived looks like to them.
${isOlder ? "Legacy thinking — what do they want to have done, built, experienced? Is there urgency? Is that healthy or anxious?" : ""}
${isMidlife ? "Dreams that got quietly shelved. Identity beyond being a parent or partner. Reinvention — do they want it, is it possible?" : ""}

WRAPPING UP
After 18-22 exchanges, when you've covered good ground across all zones, wrap up warmly. Let them know you have a clear picture and you're generating their personalised life summary. Make it feel like a natural, warm conclusion. Use [Z8] tag for the wrap.

OPENING:
Welcome ${p.name} warmly. Briefly acknowledge something from their profile. Then ask: "Before we get into anything structured — just tell me in your own words, what feels most off in your life right now?" Start with [Z1].`;
}

function buildSummaryPrompt(profile, conversation) {
  const transcript = conversation.map(m => `${m.role === "ai" ? "Advisor" : profile.name}: ${m.text.replace(/^\[Z\d\]\s*/, "")}`).join("\n");
  return `Write ${profile.name}'s personalised life audit summary based on this conversation.

PROFILE: ${profile.name}, ${profile.age}, ${profile.gender}, ${profile.country}, ${profile.situation}, ${profile.relationship}, children: ${profile.children}

CONVERSATION:
${transcript}

Structure the summary as follows — use these exact bold headers:

**WHERE YOU ARE RIGHT NOW**
2-3 honest sentences capturing the overall picture. Not sugar-coated. Not brutal. Real.

**THE THREE AREAS THAT NEED MOST ATTENTION**
Three specific areas based purely on what they shared. Be specific — reference what they actually said.

**WHAT'S GENUINELY WORKING**
2-3 real strengths or positives they may be undervaluing.

**YOUR SORT IT LIST**
Five concrete, specific, achievable actions. Name real services, apps, resources where relevant. For UK users: Uswitch, TPS, Calm, BetterHelp, NHS links, MoneySavingExpert etc. These should feel like a brilliant friend's genuine recommendations.

**ONE FINAL THOUGHT**
Something honest and human they'll remember. Not a motivational poster. Real.

Tone: warm, direct, intelligent. Like a trusted friend giving the real picture. Use their name 2-3 times. Write in flowing paragraphs not bullet points. No therapy-speak. No corporate wellness language.`;
}

const styles = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #F5F0E8; font-family: 'Outfit', sans-serif; min-height: 100vh; }
.app { min-height: 100vh; background: #F5F0E8; display: flex; flex-direction: column; }
.splash { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; position: relative; overflow: hidden; }
.splash::before { content: ''; position: absolute; top: -120px; right: -120px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(196,124,78,0.15) 0%, transparent 70%); border-radius: 50%; }
.splash::after { content: ''; position: absolute; bottom: -80px; left: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(74,107,82,0.1) 0%, transparent 70%); border-radius: 50%; }
.splash-inner { max-width: 560px; width: 100%; text-align: center; position: relative; z-index: 1; animation: fadeUp 0.8s ease both; }
.brand-tag { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #C47C4E; margin-bottom: 20px; }
.splash-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 10vw, 80px); font-weight: 300; line-height: 1.05; color: #1C2B1E; margin-bottom: 8px; }
.splash-title em { font-style: italic; color: #C47C4E; }
.splash-subtitle { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; font-style: italic; color: #4A6B52; margin-bottom: 32px; line-height: 1.5; }
.splash-desc { font-size: 15px; font-weight: 300; color: #5C5C52; line-height: 1.7; margin-bottom: 32px; max-width: 420px; margin-left: auto; margin-right: auto; }
.zones-preview { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 40px; }
.zone-chip { background: rgba(28,43,30,0.06); border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #4A6B52; display: flex; align-items: center; gap: 5px; }
.btn-primary { background: #1C2B1E; color: #F5F0E8; border: none; padding: 16px 48px; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 500; border-radius: 50px; cursor: pointer; transition: all 0.25s ease; }
.btn-primary:hover { background: #C47C4E; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,124,78,0.3); }
.intake { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; }
.intake-card { background: #fff; border-radius: 24px; padding: 48px 40px; max-width: 520px; width: 100%; box-shadow: 0 4px 40px rgba(28,43,30,0.08); animation: fadeUp 0.5s ease both; }
.intake-step { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #C47C4E; margin-bottom: 12px; }
.intake-question { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #1C2B1E; line-height: 1.3; margin-bottom: 32px; }
.intake-input { width: 100%; padding: 14px 18px; font-family: 'Outfit', sans-serif; font-size: 16px; color: #1C2B1E; background: #F5F0E8; border: 2px solid transparent; border-radius: 12px; outline: none; transition: border-color 0.2s; margin-bottom: 24px; }
.intake-input:focus { border-color: #C47C4E; }
.option-grid { display: grid; gap: 10px; margin-bottom: 24px; }
.option-grid.cols-2 { grid-template-columns: 1fr 1fr; }
.option-grid.cols-1 { grid-template-columns: 1fr; }
.option-btn { padding: 12px 16px; background: #F5F0E8; border: 2px solid transparent; border-radius: 12px; font-family: 'Outfit', sans-serif; font-size: 14px; color: #1C2B1E; cursor: pointer; transition: all 0.2s; text-align: left; }
.option-btn:hover { border-color: #C47C4E; background: #FEF5EC; }
.option-btn.selected { border-color: #1C2B1E; background: #1C2B1E; color: #F5F0E8; }
.intake-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
.btn-back { background: none; border: none; font-family: 'Outfit', sans-serif; font-size: 14px; color: #9C9C8C; cursor: pointer; padding: 8px 0; }
.btn-back:hover { color: #1C2B1E; }
.progress-dots { display: flex; gap: 6px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: #D5CFC3; transition: background 0.2s; }
.dot.active { background: #C47C4E; }
.dot.done { background: #1C2B1E; }
.chat-layout { display: flex; flex-direction: column; height: 100vh; max-width: 680px; margin: 0 auto; width: 100%; }
.chat-header { padding: 16px 24px; border-bottom: 1px solid rgba(28,43,30,0.08); background: #F5F0E8; flex-shrink: 0; }
.chat-header-top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.chat-avatar { width: 40px; height: 40px; background: linear-gradient(135deg, #1C2B1E, #4A6B52); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.chat-avatar-letter { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #F5F0E8; font-style: italic; }
.chat-header-text h3 { font-size: 15px; font-weight: 600; color: #1C2B1E; }
.chat-header-text p { font-size: 12px; color: #4A6B52; }
.online-dot { display: inline-block; width: 6px; height: 6px; background: #4A6B52; border-radius: 50%; margin-right: 4px; }
.zones-bar { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.zones-bar::-webkit-scrollbar { display: none; }
.zone-pill { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; white-space: nowrap; transition: all 0.3s; background: rgba(28,43,30,0.05); color: #9C9C8C; }
.zone-pill.active { background: #1C2B1E; color: #F5F0E8; }
.zone-pill.done { background: rgba(74,107,82,0.15); color: #4A6B52; }
.messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.message { display: flex; align-items: flex-end; gap: 10px; animation: fadeUp 0.3s ease both; }
.message.user { flex-direction: row-reverse; }
.msg-avatar { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1C2B1E, #4A6B52); color: #F5F0E8; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; }
.msg-bubble { max-width: 78%; padding: 13px 17px; border-radius: 18px; font-size: 15px; line-height: 1.65; font-weight: 300; }
.message.ai .msg-bubble { background: #fff; color: #1C2B1E; border-bottom-left-radius: 4px; box-shadow: 0 2px 12px rgba(28,43,30,0.06); }
.message.user .msg-bubble { background: #1C2B1E; color: #F5F0E8; border-bottom-right-radius: 4px; }
.typing-indicator { display: flex; gap: 5px; padding: 13px 17px; background: #fff; border-radius: 18px; border-bottom-left-radius: 4px; width: fit-content; box-shadow: 0 2px 12px rgba(28,43,30,0.06); }
.typing-dot { width: 7px; height: 7px; background: #C47C4E; border-radius: 50%; animation: typingBounce 1.2s infinite ease-in-out; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
.chat-input-area { padding: 12px 24px 20px; background: #F5F0E8; flex-shrink: 0; border-top: 1px solid rgba(28,43,30,0.08); }
.input-row { display: flex; gap: 10px; align-items: flex-end; background: #fff; border-radius: 50px; padding: 8px 8px 8px 20px; box-shadow: 0 2px 12px rgba(28,43,30,0.08); }
.chat-textarea { flex: 1; border: none; outline: none; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 300; color: #1C2B1E; background: transparent; resize: none; max-height: 120px; line-height: 1.5; padding: 6px 0; }
.chat-textarea::placeholder { color: #B0AA9E; }
.send-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: #1C2B1E; color: #F5F0E8; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.send-btn:hover { background: #C47C4E; }
.send-btn:disabled { background: #D5CFC3; cursor: not-allowed; }
.summary { min-height: 100vh; padding: 48px 24px; max-width: 680px; margin: 0 auto; animation: fadeUp 0.6s ease both; }
.summary-header { text-align: center; margin-bottom: 48px; }
.summary-tag { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #C47C4E; margin-bottom: 12px; }
.summary-title { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 300; color: #1C2B1E; line-height: 1.2; margin-bottom: 12px; }
.summary-title em { font-style: italic; color: #C47C4E; }
.summary-intro { font-size: 15px; font-weight: 300; color: #5C5C52; line-height: 1.7; }
.summary-content { background: #fff; border-radius: 20px; padding: 36px; box-shadow: 0 4px 40px rgba(28,43,30,0.06); font-size: 15px; line-height: 1.85; color: #2C2C24; font-weight: 300; margin-bottom: 32px; }
.summary-section { margin-bottom: 28px; }
.summary-section:last-child { margin-bottom: 0; }
.summary-section-title { font-size: 10px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #C47C4E; margin-bottom: 10px; font-family: 'Outfit', sans-serif; }
.summary-section-body { font-size: 15px; line-height: 1.85; color: #2C2C24; font-weight: 300; white-space: pre-wrap; }
.restart-btn { display: block; margin: 0 auto; background: none; border: 2px solid #1C2B1E; color: #1C2B1E; padding: 14px 40px; border-radius: 50px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.restart-btn:hover { background: #1C2B1E; color: #F5F0E8; }
.loading-state { text-align: center; padding: 60px 0; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes typingBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D5CFC3; border-radius: 2px; }
`;

function parseSummary(text) {
  const sections = [];
  const parts = text.split(/\*\*(.*?)\*\*/g);
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].trim();
    const body = (parts[i + 1] || "").trim();
    if (title && body) sections.push({ title, body });
  }
  return sections.length > 0 ? sections : [{ title: "", body: text }];
}

export default function SortMyLifeOut() {
  const [screen, setScreen] = useState("splash");
  const [intakeStep, setIntakeStep] = useState(0);
  const [profile, setProfile] = useState({});
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [activeZone, setActiveZone] = useState(1);
  const [completedZones, setCompletedZones] = useState([]);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const messagesEndRef = useRef(null);
  const conversationRef = useRef([]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const currentStep = INTAKE_STEPS[intakeStep];

  function handleIntakeNext(value) {
    const newProfile = { ...profile, [currentStep.id]: value };
    setProfile(newProfile);
    setTextInput("");
    if (intakeStep < INTAKE_STEPS.length - 1) {
      setIntakeStep(intakeStep + 1);
    } else {
      setScreen("chat");
      startConversation(newProfile);
    }
  }

  function parseZoneTag(text) {
    const match = text.match(/^\[Z(\d)\]/);
    return match ? parseInt(match[1]) : null;
  }

  function cleanText(text) {
    return text.replace(/^\[Z\d\]\s*/, "");
  }

  async function callClaude(msgs, system) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages: msgs }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  async function startConversation(p) {
    setIsTyping(true);
    try {
      const text = await callClaude([{ role: "user", content: "Hello, I'm ready to begin." }], buildSystemPrompt(p));
      const zone = parseZoneTag(text) || 1;
      setActiveZone(zone);
      const aiMsg = { role: "ai", text: cleanText(text) };
      setMessages([aiMsg]);
      conversationRef.current = [{ role: "ai", text }];
    } catch (e) {
      setMessages([{ role: "ai", text: "Something went wrong connecting. Please refresh and try again." }]);
    }
    setIsTyping(false);
  }

  async function sendMessage() {
    if (!userInput.trim() || isTyping) return;
    const text = userInput.trim();
    setUserInput("");
    const userMsg = { role: "user", text };
    const newConv = [...conversationRef.current, userMsg];
    conversationRef.current = newConv;
    setMessages(prev => [...prev, userMsg]);
    const newCount = exchangeCount + 1;
    setExchangeCount(newCount);
    setIsTyping(true);
    try {
      const apiMsgs = newConv.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
      const shouldWrap = newCount >= 20;
      if (shouldWrap) apiMsgs[apiMsgs.length - 1].content += " [You now have enough. Wrap up warmly, let them know you're generating their personalised life summary now.]";
      const rawText = await callClaude(apiMsgs, buildSystemPrompt(profile));
      const zone = parseZoneTag(rawText);
      if (zone) {
        if (zone > activeZone) {
          setCompletedZones(prev => [...new Set([...prev, activeZone])]);
          setActiveZone(zone);
        }
      }
      const aiMsg = { role: "ai", text: cleanText(rawText) };
      conversationRef.current = [...newConv, { role: "ai", text: rawText }];
      setMessages(prev => [...prev, aiMsg]);
      if (shouldWrap) setTimeout(() => generateSummary(), 1500);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "Lost connection — try sending again." }]);
    }
    setIsTyping(false);
  }

  async function generateSummary() {
    setLoadingSummary(true);
    setScreen("summary");
    try {
      const prompt = buildSummaryPrompt(profile, conversationRef.current);
      const text = await callClaude(
        [{ role: "user", content: prompt }],
        "You are a warm, intelligent life coach writing a personalised life audit summary. Be honest, specific and human. Never generic. Never use bullet points — write in flowing paragraphs."
      );
      setSummary(text);
    } catch (e) {
      setSummary("Unable to generate your summary. Please try again.");
    }
    setLoadingSummary(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function restart() {
    setScreen("splash"); setIntakeStep(0); setProfile({});
    setMessages([]); setExchangeCount(0); setSummary("");
    setActiveZone(1); setCompletedZones([]);
    conversationRef.current = []; setUserInput("");
  }

  const summarySections = parseSummary(summary);

  return (
    <>
      <style>{GOOGLE_FONTS + styles}</style>
      <div className="app">

        {screen === "splash" && (
          <div className="splash">
            <div className="splash-inner">
              <div className="brand-tag">Your Digital Masters</div>
              <h1 className="splash-title">Sort My<br /><em>Life Out</em></h1>
              <p className="splash-subtitle">A complete life audit. Honest, personal, actionable.</p>
              <p className="splash-desc">A full MOT for your life — not a quiz, a real conversation. Across 8 zones that actually matter.</p>
              <div className="zones-preview">
                {ZONES.map(z => <div key={z.id} className="zone-chip"><span>{z.emoji}</span>{z.label}</div>)}
              </div>
              <button className="btn-primary" onClick={() => setScreen("intake")}>Let's sort it →</button>
            </div>
          </div>
        )}

        {screen === "intake" && (
          <div className="intake">
            <div className="intake-card">
              <div className="intake-step">Step {intakeStep + 1} of {INTAKE_STEPS.length}</div>
              <div className="intake-question">{currentStep.question}</div>
              {currentStep.type === "text" && (
                <input className="intake-input" placeholder={currentStep.placeholder} value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && textInput.trim() && handleIntakeNext(textInput.trim())}
                  autoFocus />
              )}
              {currentStep.type === "options" && (
                <div className={`option-grid cols-${currentStep.cols}`}>
                  {currentStep.options.map(opt => (
                    <button key={opt} className={`option-btn ${profile[currentStep.id] === opt ? "selected" : ""}`}
                      onClick={() => handleIntakeNext(opt)}>{opt}</button>
                  ))}
                </div>
              )}
              <div className="intake-nav">
                <button className="btn-back" onClick={() => intakeStep > 0 ? setIntakeStep(intakeStep - 1) : setScreen("splash")}>← Back</button>
                <div className="progress-dots">
                  {INTAKE_STEPS.map((_, i) => <div key={i} className={`dot ${i < intakeStep ? "done" : i === intakeStep ? "active" : ""}`} />)}
                </div>
                {currentStep.type === "text"
                  ? <button className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }} onClick={() => textInput.trim() && handleIntakeNext(textInput.trim())}>Next →</button>
                  : <div style={{ width: 80 }} />}
              </div>
            </div>
          </div>
        )}

        {screen === "chat" && (
          <div className="chat-layout">
            <div className="chat-header">
              <div className="chat-header-top">
                <div className="chat-avatar"><span className="chat-avatar-letter">S</span></div>
                <div className="chat-header-text">
                  <h3>Sort My Life Out</h3>
                  <p><span className="online-dot" />Here with you, {profile.name}</p>
                </div>
              </div>
              <div className="zones-bar">
                {ZONES.map(z => (
                  <div key={z.id} className={`zone-pill ${z.id === activeZone ? "active" : completedZones.includes(z.id) ? "done" : ""}`}>
                    {z.emoji} {z.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  {m.role === "ai" && <div className="msg-avatar">S</div>}
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="message ai">
                  <div className="msg-avatar">S</div>
                  <div className="typing-indicator">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
              <div className="input-row">
                <textarea className="chat-textarea" placeholder="Type your response..." value={userInput}
                  onChange={e => setUserInput(e.target.value)} onKeyDown={handleKeyDown} rows={1} />
                <button className="send-btn" onClick={sendMessage} disabled={!userInput.trim() || isTyping}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "summary" && (
          <div className="summary">
            <div className="summary-header">
              <div className="summary-tag">Your Life Audit</div>
              <h2 className="summary-title">Here's the<br /><em>full picture</em></h2>
              <p className="summary-intro">Based on everything you've shared — an honest look at where things stand and what to do next.</p>
            </div>
            {loadingSummary ? (
              <div className="loading-state">
                <div className="typing-indicator" style={{ display: "inline-flex", marginBottom: 16 }}>
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
                <p style={{ color: "#9C9C8C", fontSize: 14, marginTop: 16 }}>Putting your summary together...</p>
              </div>
            ) : (
              <>
                <div className="summary-content">
                  {summarySections.map((s, i) => (
                    <div key={i} className="summary-section">
                      {s.title && <div className="summary-section-title">{s.title}</div>}
                      <div className="summary-section-body">{s.body}</div>
                    </div>
                  ))}
                </div>
                <button className="restart-btn" onClick={restart}>Start a new audit</button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
