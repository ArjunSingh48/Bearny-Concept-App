import breakfast from "@/assets/group-breakfast.jpg";
import balcony from "@/assets/group-balcony.jpg";
import lakeside from "@/assets/group-walk.jpg";
import soup from "@/assets/group-soup.jpg";
import cafe from "@/assets/community-cafe.jpg";

export type Intent =
  "routine" | "motivation" | "social" | "food" | "rehab" | "unknown" | "medical" | "emergency";
export type Answer = {
  id: string;
  title: string;
  keywords: string;
  text: string;
  followups: string[];
};
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  name?: string;
  time?: string;
  image?: string;
  intent?: string;
};
export type Thread = {
  id: string;
  title: string;
  category: string;
  author: string;
  body: string;
  time: string;
  replies: { id: string; author: string; text: string; time: string }[];
  saved: boolean;
  reported: boolean;
  hidden: boolean;
  resonated?: boolean;
};
export const categories = ["Everyday Life", "Food & Wellbeing", "Motivation & Support"] as const;
export const answers: Answer[] = [
  {
    id: "routine",
    title: "Finding an everyday rhythm",
    keywords: "routine,morning,day,habit,Routine,Morgen,Tag,Gewohnheit,matin,journée,habitude,mattina,giornata,abitudine",
    text: "Start with one small anchor in your day: opening the curtains, making a cup of tea, or checking in with a friend. You don’t need a perfect routine. Choose something that feels manageable, and let the rest of the day grow around it. What would feel like a gentle starting point for you?",
    followups: ["Give me a small routine idea", "How can I stay motivated?"],
  },
  {
    id: "motivation",
    title: "On the less motivated days",
    keywords: "motivation,motivated,discouraged,small win,Motivation,motiviert,entmutigt,kleiner Erfolg,découragé,petite victoire,motivazione,scoraggiato,piccola vittoria",
    text: "Some days ask more of us than others. A small step still counts, and rest is not a failure. Try choosing just one achievable thing for today, rather than measuring yourself against yesterday. Sharing a small win with someone can help, too.",
    followups: ["Help me connect with someone", "Give me a small routine idea"],
  },
  {
    id: "social",
    title: "A little connection",
    keywords: "lonely,alone,friends,connect,isolation,social,einsam,allein,Freunde,verbinden,Isolation,sozial,seul,amis,connecter,isolement,solo,amici,connettersi,isolamento,sociale",
    text: "Feeling disconnected can be hard. You could send a simple message to someone you trust: “I’d like a little company. Are you free for a chat?” If that feels like too much, reading a community discussion is a gentle first step. You’re welcome to join in at your own pace.",
    followups: ["How can I stay motivated?", "What can I say to a friend?"],
  },
  {
    id: "food",
    title: "Keeping meals simple",
    keywords: "food,meal,eat,cook,wellbeing,Essen,Mahlzeit,kochen,Wohlbefinden,nourriture,repas,manger,cuisiner,bien-être,cibo,pasto,mangiare,cucinare,benessere",
    text: "For an everyday meal, simple is enough. A soup with bread, a bowl with vegetables and beans, or yoghurt with fruit can make preparation feel less demanding. You could keep a short list of meals you enjoy. For dietary needs related to your health, check with your care team.",
    followups: ["Give me a small routine idea", "How can I stay motivated?"],
  },
  {
    id: "rehab",
    title: "Understanding rehabilitation",
    keywords: "rehab,rehabilitation,recovery,Reha,Genesung,réadaptation,rétablissement,riabilitazione,recupero",
    text: "Rehabilitation is a broad process of supporting people to participate in everyday life. It may involve different professionals and personal goals. Your own care team can explain what it means for you. You might ask them: “What are we working towards, and who can I contact with questions?”",
    followups: ["Help me connect with someone", "Give me a small routine idea"],
  },
  {
    id: "unknown",
    title: "When a question is outside this space",
    keywords: "",
    text: "I don’t have a prepared response for that topic. I can offer everyday encouragement around routines, motivation, connection, or simple meals. What would be useful today?",
    followups: ["Give me a small routine idea", "Help me connect with someone"],
  },
];
export const safety = {
  medical:
    "I can’t assess symptoms, recommend treatment, or advise on medication. Please contact your care team or a qualified healthcare professional for guidance about your own health. If the situation feels urgent, seek urgent medical help.",
  emergency:
    "If you or someone else may be in immediate danger, call emergency services now. In Switzerland, call 144 for an ambulance or 112 for general emergencies. Do not wait for a chat response. If you can, ask someone nearby to stay with you.",
};
export function classify(text: string, library: Answer[] = answers): Intent | string {
  const t = text.toLowerCase();
  if (
    /chest pain|can.?t breathe|cannot breathe|difficulty breathing|suicid|kill myself|overdose|emergency|stroke|immediate danger|severe bleeding|unconscious|brustschmerz|keine luft|kann nicht atmen|notfall|suizid|selbstmord|mich umbringen|mich das leben nehmen|überdosis|schlaganfall|bewusstlos|starke blutung|unmittelbare gefahr|douleur thoracique|ne peux pas respirer|n.arrive pas à respirer|urgence|me suicider|me tuer|surdose|avc\b|inconscient|saignement (important|grave)|danger immédiat|dolore al petto|non riesco a respirare|emergenza|suicidarmi|uccidermi|ictus|incosciente|emorragia grave|pericolo immediato/.test(
      t,
    )
  )
    return "emergency";
  if (
    /medicat|dosage|dose|symptom|diagnos|treatment|pain|doctor|prescri|insulin|blood pressure|should i take|my wound|my health|medikament|dosis|symptom|diagnose|behandlung|schmerzen|arzt|rezept|insulin|blutdruck|médicament|posologie|symptôme|diagnostic|traitement|douleur|médecin|ordonnance|insuline|tension artérielle|farmaco|dosaggio|sintomo|diagnosi|trattamento|dolore|medico|ricetta|insulina|pressione sanguigna/.test(
      t,
    )
  )
    return "medical";
  for (const a of library.filter((a) => a.id !== "unknown"))
    if (a.keywords.split(",").some((k) => k.trim() && t.includes(k.trim().toLowerCase())))
      return a.id;
  return "unknown";
}
export function respond(text: string, library: Answer[]) {
  const intent = classify(text, library);
  if (intent === "medical" || intent === "emergency")
    return { intent, text: safety[intent], followups: [] };
  const answer = library.find((a) => a.id === intent) ?? answers.find((a) => a.id === "unknown");
  return {
    intent,
    text: answer?.text ?? "Please ask about everyday wellbeing.",
    followups: answer?.followups ?? [],
  };
}
export const threads: Thread[] = [
  {
    id: "small-routines",
    title: "The little things that make a morning feel like mine",
    category: categories[0],
    author: "Mira",
    body: "I used to rush through my mornings. Lately, opening the window and having my coffee without my phone has helped me feel a little more like myself. What small things make your day feel good?",
    time: "2 hours ago",
    saved: false,
    reported: false,
    hidden: false,
    replies: [
      {
        id: "r1",
        author: "Daniel",
        text: "For me, it’s putting the radio on while I make breakfast. Familiar voices make the flat feel less quiet.",
        time: "1 hour ago",
      },
      {
        id: "r2",
        author: "Sofia",
        text: "I put out my favourite mug the night before. It’s such a tiny thing, but it feels like a kind gesture to my future self.",
        time: "45 minutes ago",
      },
      {
        id: "r3",
        author: "Alex",
        text: "I like this. I’m going to try sitting by the window for a few minutes tomorrow.",
        time: "20 minutes ago",
      },
      ...communityExchange("routine", [
        ["Mira", "18 minutes ago", "Alex, let us know how it feels if you try it. There’s no right length of time — sometimes I only stay there while the kettle boils."],
        ["Alex", "16 minutes ago", "That helps. I tend to turn even nice little things into something I have to do perfectly."],
        ["Sofia", "14 minutes ago", "I know that feeling. My mug idea works because it’s a kindness, not a rule. If I forget, I just choose a mug in the morning."],
        ["Daniel", "12 minutes ago", "I’ve started leaving my phone in the hall for breakfast. Some mornings I do, some I don’t. Both are still mornings."],
        ["Mira", "8 minutes ago", "‘Both are still mornings’ is a good reminder. I wanted a bit of familiarity, not another checklist."],
        ["Alex", "4 minutes ago", "Tomorrow’s plan: a warm drink by the window, and no scorekeeping. Thanks everyone."],
      ]),
    ],
  },
  {
    id: "simple-meals",
    title: "Your favourite “not much energy” meal?",
    category: categories[1],
    author: "Daniel",
    body: "Some evenings I don’t feel like cooking anything elaborate. My current favourite is tomato soup with a piece of good bread. What are your easy, comforting favourites?",
    time: "4 hours ago",
    saved: false,
    reported: false,
    hidden: false,
    replies: [
      {
        id: "r4",
        author: "Mira",
        text: "A baked potato with whatever is in the fridge! Very little washing up is a bonus.",
        time: "3 hours ago",
      },
      {
        id: "r5",
        author: "Sofia",
        text: "I make extra soup and freeze a portion. It’s lovely having something ready on a quiet evening.",
        time: "2 hours ago",
      },
      ...communityExchange("meal", [
        ["Alex", "90 minutes ago", "My favourite is toast with whatever I already enjoy. I keep a few familiar options on a note so I don’t have to start deciding from scratch."],
        ["Daniel", "80 minutes ago", "That’s a good idea. The deciding can feel harder than actually making the meal."],
        ["Mira", "70 minutes ago", "Yes! I have three fallback meals, not a whole meal plan. A short list is easier for me."],
        ["Sofia", "55 minutes ago", "And shop-bought soup is perfectly welcome in my kitchen too. Some days I want something ready to heat."],
        ["Alex", "40 minutes ago", "I’m glad nobody here is judging how much effort went into lunch. A familiar meal in a favourite bowl is enough for me."],
        ["Daniel", "25 minutes ago", "Thanks for all these ideas. Soup, a baked potato, or toast — that’s my little list sorted. For my personal dietary needs I stick with my care team’s guidance."],
      ]),
    ],
  },
  {
    id: "small-win",
    title: "A small win I wanted to share",
    category: categories[2],
    author: "Sofia",
    body: "I finally called an old friend this week. We only spoke for ten minutes, but I’m really glad I did. No big achievement, just a little moment that mattered. What was your small win?",
    time: "Yesterday",
    saved: false,
    reported: false,
    hidden: false,
    replies: [
      {
        id: "r6",
        author: "Alex",
        text: "That absolutely counts. I replied to a message I’d been putting off. It felt good afterwards.",
        time: "Yesterday",
      },
      {
        id: "r7",
        author: "Mira",
        text: "Thanks for sharing this, Sofia. A little connection goes a long way.",
        time: "Yesterday",
      },
      ...communityExchange("win", [
        ["Daniel", "Yesterday", "I asked a neighbour if she wanted a coffee instead of waiting to feel more confident. We’ve arranged something for next week."],
        ["Sofia", "Yesterday", "That’s lovely, Daniel. I think starting the invitation was the hardest part for me too."],
        ["Alex", "Yesterday", "Mine wasn’t very exciting: I opened a letter I’d been avoiding. But it’s no longer sitting there worrying me."],
        ["Mira", "Yesterday", "That absolutely belongs here. Sometimes the thing nobody else notices takes quite a bit of courage."],
        ["Daniel", "Yesterday", "And for anyone reading who hasn’t got a win to share, you’re still welcome. This isn’t a competition."],
        ["Sofia", "Yesterday", "Thank you for saying that. I’d like this to be a place for ordinary and difficult days as well as the good ones."],
      ]),
    ],
  },
  {
    id: "quiet-days",
    title: "Does anyone else find weekends a little quiet?",
    category: categories[2],
    author: "Alex",
    body: "During the week I have a bit of structure. Weekends can feel long. I’m thinking of planning a coffee with a neighbour, but I’m not quite sure how to ask. Anyone relate?",
    time: "Yesterday",
    saved: false,
    reported: true,
    hidden: false,
    replies: [
      {
        id: "r8",
        author: "Daniel",
        text: "I relate. I started with “I’m making coffee on Saturday, would you like to join?” Keeping it casual helped.",
        time: "Yesterday",
      },
      ...communityExchange("weekend", [
        ["Mira", "Yesterday", "I relate too. One small plan helps me more than trying to fill the whole weekend. Sometimes it’s a favourite radio programme."],
        ["Sofia", "Yesterday", "Would a short phone chat feel easier than meeting up? I sometimes ask a friend for ten minutes rather than a big catch-up."],
        ["Alex", "Yesterday", "Ten minutes sounds manageable. I worry about having enough interesting things to say."],
        ["Daniel", "Yesterday", "You don’t have to arrive with stories. I enjoy hearing the ordinary stuff — what someone’s making for lunch, or how their day is going."],
        ["Mira", "Yesterday", "And it’s okay to say you’d like company without wanting to discuss personal details. You get to decide what you share."],
        ["Alex", "Yesterday", "That takes some pressure off. I’ve sent a simple coffee invitation. Even sending it feels like a little step."],
      ]),
    ],
  },
];
export const groups = [
  {
    id: "daily-circle",
    name: "The everyday circle",
    description:
      "Small routines, familiar faces, and a friendly hello. A relaxed place to share how your day is going.",
    topic: "Everyday life",
    members: ["Mira", "Daniel", "Sofia", "Alex"],
    note: "Usually chatting in the mornings",
    messages: [
      {
        id: "g1",
        role: "assistant" as const,
        name: "Mira",
        text: "Good morning everyone. The sun finally made an appearance in Zürich ☀️",
        time: "09:12",
      },
      {
        id: "g2",
        role: "assistant" as const,
        name: "Daniel",
        text: "Morning, Mira! Having a coffee by the window. A pretty good start.",
        time: "09:14",
        image: breakfast,
      },
      {
        id: "g3",
        role: "assistant" as const,
        name: "Sofia",
        text: "I’m making a small plan for today. One thing at a time.",
        time: "09:18",
      },
      {
        id: "daily-photo-1",
        role: "assistant" as const,
        name: "Sofia",
        text: "Also opened the balcony door — the herbs survived the week. Small victory.",
        time: "09:19",
        image: balcony,
      },
      {
        id: "g4",
        role: "assistant" as const,
        name: "Alex",
        text: "That sounds like a good approach. My one thing is calling a friend this afternoon.",
        time: "09:21",
      },
      ...groupExchange("daily", [
        ["Mira", "09:23", "Alex, would it help to send a message first? I find an unexpected call a bit daunting sometimes."],
        ["Alex", "09:25", "Yes! I could say, ‘Have you got ten minutes for a catch-up later?’ That feels much easier."],
        ["Daniel", "09:27", "Ten minutes is a lovely start. You don’t have to have a whole afternoon free to stay in touch."],
        ["Sofia", "09:30", "And if today doesn’t work out, it’s still a kind invitation. I’m trying not to treat every plan like a test."],
        ["Alex", "09:34", "Message sent. Going to leave my phone alone while I make breakfast now 🙂"],
        ["Mira", "09:38", "My little plan is getting the pile of letters off the kitchen table. Not all of them — just opening one."],
        ["Daniel", "09:40", "The one-letter approach! I did that last week and discovered the top envelope was just a supermarket leaflet."],
        ["Sofia", "09:42", "That made me smile. The mysterious pile is often more intimidating than what’s actually in it."],
        ["Mira", "09:46", "Exactly that. One opened, recycling sorted, and the rest can wait."],
        ["Sofia", "09:52", "A quieter morning here. I don’t really want to chat much, but it’s nice reading your messages."],
        ["Daniel", "09:54", "You’re welcome to just read. No need to keep the conversation going for us."],
        ["Alex", "09:56", "Same here some days. A hello counts, and so does being here quietly."],
        ["Sofia", "10:02", "Thank you. I appreciate a space where I don’t have to sound cheerful all the time."],
        ["Mira", "10:06", "Definitely. We can have ordinary days here too, not just small-win days."],
        ["Daniel", "10:14", "Does anyone have a gentle way of making weekends feel less empty? I miss the little bits of structure from the week."],
        ["Alex", "10:18", "I put one thing in the calendar that isn’t a chore. Last Saturday it was coffee with my neighbour."],
        ["Mira", "10:21", "Mine is listening to the same radio programme on Sunday. Familiar voices make it feel like a proper morning."],
        ["Sofia", "10:24", "I sometimes arrange a phone catch-up instead of going out. Less organising, still some company."],
        ["Daniel", "10:29", "I like the radio idea. And I might ask my sister about a Sunday call. Thank you."],
        ["Daniel", "10:33", "Took the long way home along the water earlier. Very good for the head.", lakeside],
        ["Alex", "10:41", "Update: my friend replied! We’re going to talk at four. Apparently she’d been meaning to message me too."],
        ["Mira", "10:43", "Oh, that’s lovely. Two people waiting for the other to say hello."],
        ["Sofia", "10:45", "That happens more than we think, doesn’t it? Glad you reached out."],
        ["Alex", "10:49", "It does. I nearly talked myself out of it. Thanks for helping me make it smaller."],
        ["Mira", "11:03", "Quick question: when someone asks how you are, do you ever struggle to give an honest answer without explaining everything?"],
        ["Sofia", "11:07", "Yes. I sometimes say, ‘It’s a mixed day, but I’d love to hear about yours.’ That feels honest enough for me."],
        ["Daniel", "11:10", "I say, ‘I’m not up for talking about the details today.’ People don’t always get it immediately, but it helps me set a boundary."],
        ["Alex", "11:13", "You shouldn’t have to share anything you’d rather keep private. Company doesn’t have to come with a full explanation."],
        ["Mira", "11:17", "I’m borrowing ‘a mixed day’. Thank you — that’s exactly what I was trying to say."],
        ["Daniel", "11:32", "My sister is free on Sunday. We’ve agreed on a short call with a cup of tea. Weekend anchor sorted ☕"],
        ["Sofia", "11:36", "That sounds really nice. I’ve put a favourite film on my list for tonight. Something familiar rather than something new."],
        ["Alex", "11:39", "A familiar film is a good choice. Mine would be one I know well enough to quote badly."],
        ["Mira", "11:44", "One letter opened, one call planned, one film chosen. A very ordinary and rather lovely morning here."],
      ]),
    ],
  },
  {
    id: "table-talk",
    name: "Around the table",
    description:
      "Easy meals and everyday comforts. Swap ideas, share a favourite dish, or simply enjoy the conversation.",
    topic: "Food & wellbeing",
    members: ["Sofia", "Mira", "Daniel", "Alex"],
    note: "A little more active in the evenings",
    messages: [
      {
        id: "g5",
        role: "assistant" as const,
        name: "Sofia",
        text: "Anyone have a simple lunch idea? Something with very little washing up would be perfect.",
        time: "11:32",
      },
      {
        id: "g6",
        role: "assistant" as const,
        name: "Daniel",
        text: "Soup and bread is my go-to. Made a big pot yesterday!",
        time: "11:35",
        image: soup,
      },
      {
        id: "g7",
        role: "assistant" as const,
        name: "Mira",
        text: "I’m having leftovers by the window. Sometimes simple is the best.",
        time: "11:38",
      },
      {
        id: "g8",
        role: "assistant" as const,
        name: "Alex",
        text: "Love these ideas. This group makes figuring out lunch a little easier.",
        time: "11:41",
      },
      ...groupExchange("table", [
        ["Sofia", "11:44", "Soup wins today. I’ve got a portion in the freezer, so that’s lunch decided. Thank you!"],
        ["Daniel", "11:47", "Future-you left present-you a very good lunch. I love when that happens."],
        ["Mira", "11:50", "I label mine now. Before that, opening the freezer was a bit of a soup lottery."],
        ["Alex", "11:53", "I once mistook apple compote for soup. Labels are definitely worthwhile 😂"],
        ["Sofia", "11:57", "That’s quite a surprise lunch. I’m writing ‘tomato soup’ on the next tub immediately."],
        ["Sofia", "11:58", "This is the café where I meet my friend on Thursdays. Nothing fancy, always good.", cafe],
        ["Mira", "12:04", "What do you all keep around for days when even choosing a meal feels like a lot? Ordinary favourites, nothing fancy."],
        ["Daniel", "12:08", "Bread and something I enjoy putting on it. Having a familiar option saves me standing in front of the fridge forever."],
        ["Alex", "12:11", "A short list on the fridge: soup, toast, leftovers. Three choices are easier for me than twenty."],
        ["Sofia", "12:14", "Pasta with a sauce I already like. I used to feel everything needed to be made from scratch. Not anymore."],
        ["Mira", "12:18", "Three choices is a good idea. I’m making a little list with things I actually enjoy, rather than things I think I ought to make."],
        ["Daniel", "12:25", "Yes to that. This is definitely not a competition for the most impressive lunch."],
        ["Alex", "12:31", "Lunch today is yesterday’s leftovers in my favourite bowl. Presentation: very limited. Happiness: pretty good."],
        ["Sofia", "12:35", "Favourite bowls do make a difference. Mine has a little chip and I still always reach for it."],
        ["Mira", "12:38", "I have a mug like that. It’s been with me through three flats."],
        ["Daniel", "12:43", "My grandmother’s soup pot is my version. It’s enormous, which explains all those freezer portions."],
        ["Alex", "12:49", "That sounds like a pot with a lot of stories."],
        ["Sofia", "13:02", "Lunch done. I ate at the table instead of beside my laptop, and it felt like a real pause."],
        ["Mira", "13:05", "Nice. I’m trying to make a little space at the table too. At the moment the other half belongs to unopened post."],
        ["Daniel", "13:09", "Half a table still counts! Mine has a newspaper, a plant and an unexplained cable on it."],
        ["Alex", "13:12", "Every home has that one cable nobody can identify."],
        ["Mira", "13:18", "Glad it’s not just me. The post can share the table for now."],
        ["Daniel", "13:30", "Thinking ahead: I’d like to invite a friend for supper, but I don’t want to turn it into a big hosting project."],
        ["Sofia", "13:34", "Could you say, ‘I’m having soup and bread on Friday — want to join me?’ Then the simple plan is clear from the start."],
        ["Alex", "13:38", "I’d happily accept that invitation. The company is the good part, not a three-course meal."],
        ["Mira", "13:41", "And they might be glad you made it casual. I always feel more relaxed when someone says no fuss."],
        ["Daniel", "13:47", "I’m sending exactly that. Soup, bread, no fuss. I can manage that."],
        ["Sofia", "14:02", "I like that this group is about enjoying everyday food, not judging each other’s plates."],
        ["Alex", "14:06", "Same. Everyone’s preferences and needs are different. I’m just here for the easy ideas and the company."],
        ["Mira", "14:10", "Yes — personal dietary questions are for our own care teams. Here, I’m happy discussing favourite mugs and soup labels."],
        ["Daniel", "14:21", "Friday supper is on! My friend offered to bring the bread. Apparently she was hoping for a quiet evening too."],
        ["Sofia", "14:25", "That sounds like a lovely plan. And one less thing on your shopping list."],
        ["Alex", "14:29", "Soup and bread bringing people together. A good result for an ordinary lunch chat ☕"],
      ]),
    ],
  },
];

function groupExchange(prefix: string, entries: [string, string, string, string?][]): ChatMessage[] {
  return entries.map(([name, time, text, image], index) => ({
    id: `${prefix}-exchange-${index + 1}`,
    role: "assistant",
    name,
    time,
    text,
    ...(image ? { image } : {}),
  }));
}

// Original fictional exchanges inspired by public peer-support themes, not member transcripts:
// https://www.selbsthilfeschweiz.ch/shch/de/selbsthilfeangebote/suche.html
// https://www.brca-schweiz.ch/
// https://epi-suisse.ch/de/angebote/selbsthilfe/selbsthilfegruppen/
// https://www.enableme.ch/de/angebote/austausch/peer-programm-zweite-hilfe
function communityExchange(prefix: string, entries: [string, string, string][]): Thread["replies"] {
  return entries.map(([author, time, text], index) => ({
    id: `${prefix}-reply-${index + 1}`,
    author,
    time,
    text,
  }));
}
