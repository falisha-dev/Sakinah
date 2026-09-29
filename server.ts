import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gen AI only when a non-placeholder API key is available
const rawApiKey = process.env.GEMINI_API_KEY;
const hasValidApiKey = Boolean(
  rawApiKey &&
  rawApiKey !== 'MY_GEMINI_API_KEY' &&
  rawApiKey.trim() !== ''
);

let ai: GoogleGenAI | null = null;
if (hasValidApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: rawApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('GoogleGenAI initialization deferred:', err);
    ai = null;
  }
}

// Rich spiritual reflections curated for each emotional climate
const CURATED_REFLECTIONS: Record<string, { reflection: string; actionableWisdom: string; comfortDua: string }> = {
  anxious: {
    reflection: "Anxiety often stems from carrying tomorrow's weight with today's strength. When your chest feels tight, remember that the future is already held in compassionate divine care. You need only breathe and take this present step in trust.",
    actionableWisdom: "Inhale slowly for four seconds, exhale for six, and whisper: 'HasbunAllahu wa ni'mal wakeel' (Allah is sufficient for us, and He is the best Disposer of affairs).",
    comfortDua: "Allahumma inni a'udhu bika mina al-hammi wal-hazan (O Allah, I seek refuge in You from grief and anxiety)."
  },
  grieving: {
    reflection: "Grief is evidence of a heart capable of profound love and attachment. The Quran honors human sadness and promises that what has been broken in the temporary will be restored with eternal tenderness.",
    actionableWisdom: "Place a gentle hand over your heart, honor the tears without shame, and whisper Ya Salaam (O Source of Peace).",
    comfortDua: "Inna lillahi wa inna ilayhi raji'un. Allahumma'jurni fi museebati wa akhlif li khayran minha (Truly to Allah we belong and to Him we return. O Allah, reward me in my affliction and grant me better in exchange)."
  },
  grateful: {
    reflection: "Gratitude is the vessel that preserves current light and invites divine expansion. When the heart notices even the simplest breath, the ordinary becomes sacred abundance.",
    actionableWisdom: "Reflect in quiet appreciation on three small blessings from this morning that cost no money.",
    comfortDua: "Rabbi awzi'nee an ashkura ni'mataka allatee an'amta 'alayya (My Lord, inspire me to always be grateful for Your blessings)."
  },
  lost: {
    reflection: "Disorientation often precedes a new depth of spiritual clarity. You do not have to map out the entire mountain path; divine guidance unfolds one sincere step at a time.",
    actionableWisdom: "Take two minutes in complete stillness. Release the demand for certainty and ask for ease in discernment.",
    comfortDua: "Ihdina as-sirat al-mustaqeem (Guide us upon the upright, illuminated path)."
  },
  weary: {
    reflection: "Your exhaustion is seen and honored. Spiritual devotion was never intended to break your back or deplete your spirit. Rest is an act of trust in the One who never sleeps.",
    actionableWisdom: "Permit your body to soften into restful posture. Let go of unfinished worldly burdens for tonight.",
    comfortDua: "Rabbi inni lima anzalta ilayya min khayrin faqeer (My Lord, truly I am in need of whatever good You bestow upon me)."
  },
  guilty: {
    reflection: "Remorse is the doorway of sincere return. The divine door of mercy never latches against a humble servant; the past does not define the capacity of your spirit to shine.",
    actionableWisdom: "Perform a mindful ablution (wudu) with cool water, washing away the mental replay of regret.",
    comfortDua: "Rabbana thalamna anfusana wa il-lam taghfir lana wa tarhamna lanakoonanna mina al-khasireen (Our Lord, we have wronged ourselves, and if You do not forgive us, we will surely be among the losers)."
  },
  lonely: {
    reflection: "Solitude can feel cold, yet it is often the quiet chamber where divine intimacy speaks loudest. You are closer to your Creator than your own pulse.",
    actionableWisdom: "Breathe in awareness of the divine presence that surrounds and knows every unspoken longing within you.",
    comfortDua: "La ilaha illa Anta subhanaka inni kuntu mina ath-thalimeen (There is no deity except You; exalted are You; indeed, I have been of the wrongdoers)."
  },
  angry: {
    reflection: "Anger is an inner flame that demands discernment. Extinguish its impulsive heat with stillness, transforming raw emotion into clear moral courage and peace.",
    actionableWisdom: "Change physical posture (if standing, sit; if sitting, lie down) and drink cool water slowly.",
    comfortDua: "A'udhu billahi mina ash-shaytanir rajeem (I seek refuge in Allah from the accursed disruption)."
  },
  hopeful: {
    reflection: "Hope is fertile soil for divine blessings. Expecting goodness from God is in itself an act of high worship that brings unseen ease into reality.",
    actionableWisdom: "Formulate a sincere, expansive prayer for yourself and someone who may be struggling today.",
    comfortDua: "Allahumma inni as'aluka khayra ma fee hatha al-yawm (O Allah, I ask You for the immense good within this day)."
  },
  happy: {
    reflection: "Joy and lightness are sweet gifts from divine mercy. When happiness warms your soul, allow it to overflow in praise, recognizing that celebrating the goodness of life is in itself an act of spiritual beauty.",
    actionableWisdom: "Smile sincerely, share your good spirit with someone you love, and whisper: 'Alhamdulillah' with a full heart.",
    comfortDua: "Allahumma a'inni 'ala thikrika wa shukrika wa husni 'ibadatik (O Allah, help me to remember You, give thanks to You, and worship You in the best manner)."
  },
  good_news: {
    reflection: "Glad tidings and breakthroughs are reassuring milestones after patient endurance. What was delayed was preparing your heart to appreciate the relief with deeper humility and gratitude.",
    actionableWisdom: "Perform a moment of gratitude (Sujud ash-Shukr) and silently recount prayers you made in the past that have now unfolded into reality.",
    comfortDua: "Rabbi awzi'nee an ashkura ni'mataka allatee an'amta 'alayya wa 'ala walidayya (My Lord, enable me to be grateful for Your favor which You have bestowed upon me)."
  },
  forgiveness: {
    reflection: "The doorway of divine forgiveness never closes against a sincere soul. Turn your regret not into self-reproach, but into a humble turning back, for the Most Merciful loves those who constantly return to Him.",
    actionableWisdom: "Whisper 'Astaghfirullah al-'Atheem wa atoobu ilayh' three times with slow, deep breaths, letting past heaviness dissolve in divine mercy.",
    comfortDua: "Allahumma Innaka 'Afuwwun Tuhibbul 'Afwa Fa'fu 'Anni (O Allah, You are Most Forgiving, and You love forgiveness, so forgive me)."
  },
};

function getCuratedReflection(emotion: string = '') {
  const normalized = emotion.toLowerCase();
  for (const [key, value] of Object.entries(CURATED_REFLECTIONS)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  return CURATED_REFLECTIONS.anxious;
}

// Emotion reflection endpoint using Gemini with bulletproof fallback
app.post('/api/reflect', async (req: Request, res: Response) => {
  const { emotion, userNotes, currentVerse } = req.body;
  const defaultFallback = getCuratedReflection(emotion);

  if (!ai || !hasValidApiKey) {
    // Return curated spiritual guidance immediately with 200 OK
    return res.json({
      reflection: defaultFallback.reflection,
      actionableWisdom: defaultFallback.actionableWisdom,
      comfortDua: defaultFallback.comfortDua,
    });
  }

  try {
    const prompt = `You are a contemplative Islamic spiritual counselor and scholar of the Quran, renowned for profound empathy, minimalist wisdom, and soothing clarity.
A person is feeling: "${emotion || 'unspecified emotional state'}".
Their personal reflection/context: "${userNotes || 'None provided'}".
Associated Quranic verse in view: ${currentVerse ? `Surah ${currentVerse.surahName} (${currentVerse.surahNumber}:${currentVerse.ayahNumber}): "${currentVerse.translation}"` : 'None specified'}.

Please craft a serene, restorative reflection formatted as JSON with exactly these three string fields:
1. "reflection": 2-3 thoughtful, deeply comforting sentences relating their specific emotional nuance to divine mercy, spiritual stillness, and perspective. Avoid clichés or moralizing lectures. Speak directly to the soul with gentleness.
2. "actionableWisdom": 1 practical, grounded contemplative practice (e.g. mindful breathing with a specific dhikr, a 2-minute reframing exercise, or a release ritual).
3. "comfortDua": A short, authentic Quranic or Prophetic supplication (in English translation with Arabic transliteration) tailored to this emotion.

Do not include markdown or backticks in the response. Return valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        reflection: text.replace(/^```json/, '').replace(/```$/, '').trim() || defaultFallback.reflection,
        actionableWisdom: defaultFallback.actionableWisdom,
        comfortDua: defaultFallback.comfortDua,
      };
    }

    return res.json({
      reflection: data.reflection || defaultFallback.reflection,
      actionableWisdom: data.actionableWisdom || defaultFallback.actionableWisdom,
      comfortDua: data.comfortDua || defaultFallback.comfortDua,
    });
  } catch (error: any) {
    console.warn('Gemini reflection call encountered an error, serving curated guidance:', error?.message || error);
    // Always return a graceful, inspiring response with HTTP 200
    return res.json({
      reflection: defaultFallback.reflection,
      actionableWisdom: defaultFallback.actionableWisdom,
      comfortDua: defaultFallback.comfortDua,
    });
  }
});

// Production / Dev handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
