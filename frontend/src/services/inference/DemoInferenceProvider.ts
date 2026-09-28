import { InferenceProvider } from './types';
import { DetectionResult } from '../../types/detection';

const DEMO_DATABASE: Record<string, Partial<DetectionResult>> = {
  tomato: {
    crop: "Tomato",
    cropBn: "টমেটো",
    disease: "Early Blight",
    diseaseBn: "আর্লি ব্লাইট",
    scientificName: "Alternaria solani (ছত্রাকজনিত রোগ)",
    confidence: 94.5,
    riskLevel: "high",
    isHealthy: false,
    symptoms: [
      "Target-like concentric ring spots on lower foliage",
      "Yellow chlorotic halos surrounding brown necrotic lesions",
      "Premature leaf drop and dark sunken spots on stems"
    ],
    symptomsBn: [
      "পাতার নিচের অংশে গাঢ় বাদামী রঙের সমকেন্দ্রিক বৃত্তাকার বলয় দাগ",
      "ক্ষতচিহ্নের চারপাশে হলুদ আভা (Chlorotic Halo)",
      "আক্রান্ত পাতা সময়ের আগেই শুকিয়ে ঝরে পড়া"
    ],
    immediateActions: [
      "Remove and burn heavily infected lower leaves immediately",
      "Avoid overhead sprinkler watering; keep foliage dry",
      "Apply approved Mancozeb 75% WP or Copper Oxychloride spray"
    ],
    immediateActionsBn: [
      "আক্রান্ত পাতা দ্রুত কেটে জমি থেকে দূরে ফেলে ধ্বংস করুন",
      "পাতায় সরাসরি পানি ছিটানো বন্ধ রাখুন; গাছের গোড়ায় পানি দিন",
      "অনুমোদিত ম্যানকোজেব ৭৫% ডব্লিউপি বা কপার অক্সিক্লোরাইড স্প্রে করুন"
    ],
    prevention: [
      "Maintain at least 2-3 years crop rotation with non-solanaceous crops",
      "Mulch soil surface to prevent fungal spores splashing from dirt",
      "Plant disease-resistant certified varieties like BARI Tomato-8"
    ],
    preventionBn: [
      "অন্য ফসলের সাথে ২-৩ বছরের ফসল পর্যায় (Crop Rotation) মেনে চলুন",
      "মাটিতে খড় বিছিয়ে মলচিং করুন যাতে বৃষ্টির পানিতে ছত্রাক পাতায় না ছড়ায়",
      "বারি টমেটো-৮ এর মত রোগ প্রতিরোধক্ষম জাত রোপণ করুন"
    ],
    treatmentGuidance: [
      "Mancozeb 75% WP: Mix 2g per Liter water and spray thoroughly",
      "Spray every 7-10 days under humid foggy weather conditions",
      "Always wear protective gloves and follow safety interval before harvest"
    ],
    treatmentGuidanceBn: [
      "ম্যানকোজেব ৭৫% ডব্লিউপি: প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে ভালোভাবে স্প্রে করুন",
      "কুয়াশাচ্ছন্ন ও স্যাঁতসেঁতে আবহাওয়ায় ৭-১০ দিন পর পর পুনরায় স্প্রে করুন",
      "স্প্রে করার সময় মুখে মাস্ক পরুন এবং ফসল তোলার ৩ দিন পূর্বে স্প্রে বন্ধ রাখুন"
    ],
    disclaimer: "AI শনাক্তকরণ সহায়ক তথ্য। নিশ্চিত পরামর্শের জন্য কৃষি বিশেষজ্ঞের পরামর্শ নিন।",
    modelVersion: "AgriNet-BD v3.4 (Demo Mode)"
  },
  rice: {
    crop: "Rice",
    cropBn: "ধান",
    disease: "Rice Blast",
    diseaseBn: "ধানের ব্লাস্ট রোগ",
    scientificName: "Magnaporthe oryzae (ছত্রাকজনিত)",
    confidence: 91.2,
    riskLevel: "high",
    isHealthy: false,
    symptoms: [
      "Spindle-shaped diamond lesions with gray-white centers",
      "Rotting at leaf neck collar joints during heading stage",
      "Panicle blast causing empty white heads (chaffy grain)"
    ],
    symptomsBn: [
      "পাতায় চোখ বা মাকু আকৃতির দাগ যার কেন্দ্রস্থল ছাইরঙা",
      "শীষ বের হওয়ার সময় গলার সংযোগস্থলে পচন দাগ",
      "শীষ শুকিয়ে সাদা হয়ে যাওয়া ও চিটা হওয়া"
    ],
    immediateActions: [
      "Maintain 2-3 inches standing water in field",
      "Apply Tricyclazole 75% WP spray during early stage",
      "Suspend top-dressing of urea nitrogen fertilizer"
    ],
    immediateActionsBn: [
      "জমি শুকানো যাবে না, ২-৩ ইঞ্চি পানি ধরে রাখুন",
      "ট্রাইসাইক্ল্যাজল ৭৫% ডব্লিউপি (যেমন: ট্রুপার/ব্লাস্টিন) স্প্রে করুন",
      "ইউরিয়া সারের অতিরিক্ত উপরিপ্রয়োগ অবিলম্বে বন্ধ রাখুন"
    ],
    prevention: [
      "Use seed treatment with Carbendazim before sowing",
      "Balanced application of Potash (MOP) fertilizer",
      "Use BRRI Dhan-89 or disease resistant varieties"
    ],
    preventionBn: [
      "বীজ শোধন করে রোপণ করুন (কার্বেন্ডাজিম দিয়ে)",
      "পটাশ (এমওপি) সারের সুষম ব্যবহার নিশ্চিত করুন",
      "ব্রি ধান-৮৯ বা অনুমোদিত সহনশীল জাত ব্যবহার করুন"
    ],
    treatmentGuidance: [
      "Tricyclazole 75 WP: 0.75g per Liter water spray at afternoon",
      "Repeat spray after 7 days if weather remains overcast"
    ],
    treatmentGuidanceBn: [
      "ট্রাইসাইক্ল্যাজল ৭৫ ডব্লিউপি: প্রতি লিটার পানিতে ০.৭৫ গ্রাম বিকেলে স্প্রে করুন",
      "মেঘলা আবহাওয়া থাকলে ৭ দিন পর ২য় বার স্প্রে করুন"
    ],
    disclaimer: "AI শনাক্তকরণ সহায়ক তথ্য। নিশ্চিত পরামর্শের জন্য কৃষি বিশেষজ্ঞের পরামর্শ নিন।",
    modelVersion: "AgriNet-BD v3.4 (Demo Mode)"
  },
  potato: {
    crop: "Potato",
    cropBn: "আলু",
    disease: "Late Blight",
    diseaseBn: "আলুর নাবি ধসা / লেট ব্লাইট",
    scientificName: "Phytophthora infestans (ছত্রাকজনিত)",
    confidence: 96.8,
    riskLevel: "high",
    isHealthy: false,
    symptoms: [
      "Water-soaked dark green patches expanding rapidly",
      "White cottony fungal growth on lower leaf surface during morning mist",
      "Tubers developing reddish-brown dry rot underneath skin"
    ],
    symptomsBn: [
      "পাতার কিনারায় ভিজা-ভেজা কালচে ছোপ দাগ যা দ্রুত ছড়ায়",
      "সকালের কুয়াশায় পাতার উল্টো পিঠে সাদা তুলোর মত ছত্রাক",
      "কন্দের চামড়ার নিচে লালচে-বাদামী পচন"
    ],
    immediateActions: [
      "Apply systemic fungicide (Cymoxanil + Mancozeb)",
      "Stop irrigation immediately to reduce humidity",
      "Cut down top foliage (haulm killing) if outbreak is severe"
    ],
    immediateActionsBn: [
      "অন্তর্বাহী ছত্রাকনাশক (সাইমোক্সানিল + ম্যানকোজেব) মেখে স্প্রে করুন",
      "জমিতে সেচ দেওয়া অবিলম্বে বন্ধ করুন",
      "প্রাদুর্ভাব মারাত্মক হলে গাছের ওপরের ডালা কেটে মাটির নিচে পুতে ফেলুন"
    ],
    prevention: [
      "Avoid planting certified seed tubers in low damp land",
      "Ridge soil up high around plant base",
      "Pre-spray protective Mancozeb before cold foggy nights"
    ],
    preventionBn: [
      "নিচু বা স্যাঁতসেঁতে জমিতে আলু চাষ পরিহার করুন",
      "গাছের গোড়ায় ভালো করে ভেলী/মাটি তুলে দিন",
      "তীব্র কুয়াশার পূর্বাভাস পেলেই প্রতিরক্ষামূলক ম্যানকোজেব স্প্রে করুন"
    ],
    treatmentGuidance: [
      "Cymoxanil + Mancozeb: 2g/Liter spray every 5-7 days",
      "Ensure bottom of leaves are thoroughly covered by spray nozzle"
    ],
    treatmentGuidanceBn: [
      "সাইমোক্সানিল + ম্যানকোজেব: প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে ৫-৭ দিন পর পর স্প্রে করুন",
      "স্প্রে যেন পাতার উল্টো পিঠে ভালোভাবে পৌঁছে তা নিশ্চিত করুন"
    ],
    disclaimer: "AI শনাক্তকরণ সহায়ক তথ্য। নিশ্চিত পরামর্শের জন্য কৃষি বিশেষজ্ঞের পরামর্শ নিন।",
    modelVersion: "AgriNet-BD v3.4 (Demo Mode)"
  }
};

export class DemoInferenceProvider implements InferenceProvider {
  async analyzeCropImage(imageData: string | File, selectedCrop: string = 'tomato'): Promise<DetectionResult> {
    // Simulate real AI processing latency (1.8s)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const cropKey = selectedCrop.toLowerCase();
    
    // Check if user chose low-confidence testing or unknown
    if (cropKey === 'unknown' || cropKey === 'others') {
      return {
        crop: "Crop Leaf",
        cropBn: "অনিশ্চিত ফসল",
        disease: "Diagnosis Inconclusive",
        diseaseBn: "নিশ্চিতভাবে রোগ শনাক্ত করা যায়নি",
        confidence: 42.0,
        riskLevel: "unknown",
        isHealthy: false,
        symptoms: ["Focus blur detected", "Lighting imbalance", "Partial leaf cut off"],
        symptomsBn: ["ক্যামেরার ফোকাস অস্পষ্ট", "আলো-ছায়ার তীব্র বৈষম্য", "পাতার মূল ক্ষত ফ্রেমের বাইরে"],
        immediateActions: ["Retake photo under clear daylight", "Keep leaf centered inside target frame"],
        immediateActionsBn: ["পর্যাপ্ত আলোতে স্পষ্ট ছবি তুলুন", "পাতার আক্রান্ত অংশ ফ্রেমের মাঝে রাখুন"],
        prevention: ["Clean camera lens before taking photo"],
        preventionBn: ["ক্যামেরার লেন্স পরিষ্কার করে পুনরায় চেষ্টা করুন"],
        treatmentGuidance: ["No chemical application recommended until diagnosis is verified"],
        treatmentGuidanceBn: ["ভুল ওষুধ প্রয়োগ এড়াতে ছবি পুনঃস্ক্যান করুন বা কৃষি কর্মকর্তার পরামর্শ নিন"],
        disclaimer: "AI আত্মবিশ্বাসের মাত্রা কম (৪২%)। নিশ্চিত হওয়ার জন্য সঠিক ছবি তুলুন।",
        imageUrl: typeof imageData === 'string' ? imageData : URL.createObjectURL(imageData),
        demo: true,
        modelVersion: "AgriNet-BD v3.4 (Demo Mode)",
        createdAt: new Date().toISOString()
      };
    }

    const matched = DEMO_DATABASE[cropKey] || DEMO_DATABASE['tomato'];

    return {
      crop: matched.crop || "Tomato",
      cropBn: matched.cropBn || "টমেটো",
      disease: matched.disease || "Early Blight",
      diseaseBn: matched.diseaseBn || "আর্লি ব্লাইট",
      scientificName: matched.scientificName || "Alternaria solani",
      confidence: matched.confidence || 94.5,
      riskLevel: matched.riskLevel || "high",
      isHealthy: matched.isHealthy || false,
      symptoms: matched.symptoms || [],
      symptomsBn: matched.symptomsBn || [],
      immediateActions: matched.immediateActions || [],
      immediateActionsBn: matched.immediateActionsBn || [],
      prevention: matched.prevention || [],
      preventionBn: matched.preventionBn || [],
      treatmentGuidance: matched.treatmentGuidance || [],
      treatmentGuidanceBn: matched.treatmentGuidanceBn || [],
      disclaimer: matched.disclaimer || "AI শনাক্তকরণ সহায়ক তথ্য।",
      imageUrl: typeof imageData === 'string' ? imageData : URL.createObjectURL(imageData),
      demo: true,
      modelVersion: matched.modelVersion || "AgriNet-BD v3.4 (Demo Mode)",
      location: "ঈশ্বরদী, পাবনা (জিপিএস ভেরিফাইড)",
      createdAt: new Date().toISOString()
    };
  }
}
