<div align="center">

# حِفْظ · Hifz

**Personal Quran memorization companion with live recitation tracking**

*رفيقك في حفظ القرآن الكريم   يتابع تلاوتك كلمةً بكلمة*

![Platform](https://img.shields.io/badge/platform-mobile%20web%20%7C%20PWA-0d3530)
![On-device](https://img.shields.io/badge/AI-on--device-d4af37)
![Offline](https://img.shields.io/badge/works-offline-0d3530)

[**Open the app →**](https://abdelbar1.github.io/al7fada/page.html)

</div>



## ✨ Features

- 🎙️ **Live recitation tracking:** recite from memory and the app follows you word by word.
- 🙈 **Hide & reveal:** every word starts hidden and appears only when you recite it correctly.
- ❌ **Mistake marking:** skipped or wrong words are shown in red with a wavy underline (plus a short vibration on Android).
- 👁️ **Peek:** reveal just the next word when you get stuck, or tap any hidden word.
- ↩️ **Repeat:** tap a word you already recited to go back and repeat from there; tap an ayah number to restart from that ayah.
- 📖 **All 114 surahs:** searchable by Arabic name, English name or number, with a choice of starting ayah.
- 🌙 **Two themes:** night (deep green & gold) and day (cream paper).
- 🔒 **Private & offline:** speech recognition runs entirely on the phone; audio never leaves the device.

## 🧠 How it works

```
Microphone ─► rolling 6 s audio buffer ─► Whisper (Quran fine-tuned, in-browser)
                                                 │
                                                 ▼
             expected text ◄── fuzzy local alignment ◄── normalized words
                  │
                  ▼
     reveal ✓ correct · mark ✗ missed · move pointer forward
```

1. The app listens continuously and keeps the last **6 seconds** of audio.
2. When it detects your voice, it transcribes the buffer with a **Quran-tuned Whisper model** running in the browser (WebAssembly via Transformers.js).
3. The transcription is **normalized** (vowel marks removed, alef/yaa/taa-marbuta forms unified).
4. It is aligned against a **small window around your current position** (6 words back, 15 ahead) using a fuzzy match that accepts small spelling differences.
5. Matched words are revealed, skipped words are marked, and the pointer moves forward.

### Speech models

The app tries these in order and uses the first that loads:

| # | Model | Notes |
|---|-------|-------|
| 1 | `emadjumaah/mishkat-whisper-tiny-ar-quran-onnx` | Fastest. Encoder in fp32, decoder int8 |
| 2 | `eventhorizon0/tarteel-ai-onnx-whisper-base-ar-quran` (q8) | More accurate, slower |
| 3 | `eventhorizon0/tarteel-ai-onnx-whisper-base-ar-quran` (fp32) | Fallback |
| 4 | `Xenova/whisper-tiny` | General Arabic, last resort (lower accuracy on recitation) |

> The encoder is always loaded in fp32 because the browser runtime cannot run quantized convolution layers (`ConvInteger`).

## 🚀 Setup (from your phone, no laptop needed)

1. Put `page.html` and `sw.js` at the top level of this repository.
2. Go to **Settings → Pages → Deploy from a branch**, then choose `main` / root and save.
3. Open `https://abdelbar1.github.io/al7fada/page.html` in **Chrome** (Android) or **Safari** (iPhone).
4. Allow microphone access and wait for the first download (Quran text + model, roughly 30-60 MB).
5. Reopen the page once while online, then use **Add to Home Screen**.

After that it works **fully offline**.

## 📱 Usage

| Control | Action |
|---|---|
| Surah name (top) | Choose a surah and starting ayah |
| 🎙️ Gold button | Start / stop listening |
| لمحة (Peek) | Reveal the next hidden word |
| إظهار (Show) | Show all text faintly (read-along mode) |
| المسموع (Heard) | Show or hide what the model heard |
| إعادة (Reset) | Restart the current passage |
| 🌙 | Switch between night and day themes |

The colors mean: 🟡 pulsing box = next word · white = correct · 🔴 red = missed/wrong · 🟠 amber = peeked.

## 🎛️ Tuning

All settings are near the top of the script in `page.html`:

| Setting | Default | Effect |
|---|---|---|
| `VOICE_RMS` | `0.01` | How loud counts as speaking. Lower it if quiet recitation is ignored |
| `WINDOW_SEC` | `6` | Seconds of audio sent to the model each time |
| `same()` → `/ 4` | `/ 4` | Word matching. `/ 3` is more forgiving, `/ 5` is stricter |
| `track()` → `pointer - 6`, `pointer + 15` | | How far back and ahead the app searches |
| `#text { font: 30px … }` | `30px` | Quran text size |

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `ConvInteger` error | An old version is cached. Check that the loading screen shows **الإصدار 3**, then open the page with `?v=3` added to the address |
| Microphone doesn't start | It only works over **HTTPS**. Use the `github.io` address, not a local file |
| Changes don't appear | Wait 2-10 minutes for GitHub Pages, or clear the saved site data for github.io |
| Correct words marked red | Recite a little slower and closer to the mic, or loosen `same()` to `/ 3` |
| Tracking feels slow | Keep the **Quran tiny** model; base is more accurate but slower |

## ⚠️ Limitations

- Tracking lags about **1-2 seconds** behind your recitation (chunked transcription, not true streaming).
- **Tashkeel and tajweed mistakes are not detected**; only missing or wrong words are.
- Accuracy depends on the phone's speed, the microphone and background noise.
- Tuned for **Hafs** recitation.

## 🗺️ Ideas

- [ ] True streaming recognition (e.g. a streaming Zipformer model via sherpa-onnx)
- [ ] Native Android build for faster on-device inference
- [ ] Madani mushaf page layout (QPC fonts)

## 🙏 Credits

- **Speech model:** [Tarteel AI](https://huggingface.co/tarteel-ai) Quran-fine-tuned Whisper, with ONNX conversions by *emadjumaah* and *eventhorizon0*
- **Runtime:** [Transformers.js](https://github.com/huggingface/transformers.js) / ONNX Runtime Web
- **Quran text:** [Tanzil](https://tanzil.net) (Simple), served by [AlQuran Cloud](https://alquran.cloud)
- **Fonts:** Amiri Quran, Reem Kufi (Google Fonts)

## 📄 Disclaimer

A personal, non-commercial project for my own memorization practice. It is **not affiliated with or endorsed by Tarteel**. Model and text licenses belong to their respective owners; see each source for terms. Always check your memorization with a qualified teacher.

<div align="center">

*﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾   القمر ١٧*

</div>
