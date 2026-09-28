import { DetectionRepository } from './detectionRepository';
import { DetectionResult, HistoryFilterOptions } from '../types/detection';

const LOCAL_STORAGE_KEY = 'agroai_local_detections';

const INITIAL_SEED_DETECTIONS: DetectionResult[] = [
  {
    id: 'ag-88294',
    crop: 'Tomato',
    cropBn: 'টমেটো',
    disease: 'Early Blight',
    diseaseBn: 'আর্লি ব্লাইট',
    scientificName: 'Alternaria solani (ছত্রাকজনিত রোগ)',
    confidence: 94.5,
    riskLevel: 'high',
    isHealthy: false,
    symptoms: [
      'Target-like concentric ring spots on lower foliage',
      'Yellow chlorotic halos surrounding brown necrotic lesions'
    ],
    symptomsBn: [
      'পাতার নিচের অংশে গাঢ় বাদামী রঙের সমকেন্দ্রিক বৃত্তাকার বলয় দাগ',
      'ক্ষতচিহ্নের চারপাশে হলুদ আভা (Chlorotic Halo)'
    ],
    immediateActions: [
      'Remove and burn heavily infected lower leaves immediately',
      'Apply approved Mancozeb 75% WP spray'
    ],
    immediateActionsBn: [
      'আক্রান্ত পাতা দ্রুত কেটে জমি থেকে দূরে ফেলে ধ্বংস করুন',
      'অনুমোদিত ম্যানকোজেব ৭৫% ডব্লিউপি স্প্রে করুন'
    ],
    prevention: ['Mulch soil surface', 'Crop rotation with non-solanaceous crops'],
    preventionBn: ['মাটিতে খড় বিছিয়ে মলচিং করুন', 'অন্য ফসলের সাথে ফসল পর্যায় মেনে চলুন'],
    treatmentGuidance: ['Mancozeb 75% WP: Mix 2g per Liter water'],
    treatmentGuidanceBn: ['ম্যানকোজেব ৭৫% ডব্লিউপি: প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে স্প্রে করুন'],
    disclaimer: 'AI শনাক্তকরণ সহায়ক তথ্য।',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdbOr9jFe5atpP45_LG5-I8riqLngqcoL8iZCWngnXw7h5cJQgkOI71BFcUVb8xaNi9cwIhFueIygUYgwZhD1cnttQjn4ox_gLPiZN_nUwedtfKBQ3B-yGk8Ohky0dNJO5SSewfUwJ3obUSYKNwFooZLrNsTNmxuJTFDgkGqE7ibIgQ5kmjcHMhJAhvDj2Jxa5iMTadgww3ZhOIIXd0XHS9RyaMvmot_ILla3QvpAWHEFsP4MmZ_15',
    demo: true,
    modelVersion: 'AgriNet-BD v3.4 (Demo Mode)',
    location: 'ঈশ্বরদী, পাবনা',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ag-88295',
    crop: 'Rice',
    cropBn: 'ধান',
    disease: 'Brown Spot',
    diseaseBn: 'ধানের বাদামী দাগ রোগ',
    scientificName: 'Bipolaris oryzae',
    confidence: 88.0,
    riskLevel: 'medium',
    isHealthy: false,
    symptoms: ['Small circular brown oval spots on rice leaves', 'Yellow rings around brown spots'],
    symptomsBn: ['ধানের পাতায় ছোট গোল ডিম্বাকৃতির বাদামী দাগ', 'দাগের চারপাশে হালকা হলুদ আভা'],
    immediateActions: ['Apply Potash fertilizer', 'Spray Mancozeb or Propiconazole'],
    immediateActionsBn: ['পটাশ সারের সুষম প্রয়োগ নিশ্চিত করুন', 'প্রোপিকোনাজল বা ম্যানকোজেব স্প্রে করুন'],
    prevention: ['Use disease free certified seed', 'Maintain soil fertility'],
    preventionBn: ['প্রমাণিত ও রোগমুক্ত বীজ রোপণ করুন', 'মাটির উর্বরতা বৃদ্ধি করুন'],
    treatmentGuidance: ['Propiconazole 25 EC: 1ml per Liter water'],
    treatmentGuidanceBn: ['প্রোপিকোনাজল ২৫ ইসি: প্রতি লিটার পানিতে ১ মিলি মিশিয়ে স্প্রে করুন'],
    disclaimer: 'AI শনাক্তকরণ সহায়ক তথ্য।',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfBEv4WeH05BbVhURc0PpaB5CS3M9jnzJ8VQqG-vz4NWeM-f4HXm_JMHFSGNj6VrPr9UdbQVxcQCKB5wfSOu8pMQA3V1u3vIjOAKmN3MSHnIfBfOqThUSuTzFUB5vasDCUKUtJKhOdRkIrhv46N2Yg74ZjJfpqh2CVIaLL72mI9lsVWdxRM5vBq8nC10p89PfjlF6A94pmPRHoASBJuM6FE-gWjKFAZ97OiL_qqvdiBLn_jrUy4iFb',
    demo: true,
    modelVersion: 'AgriNet-BD v3.4 (Demo Mode)',
    location: 'দিনাজপুর সদর',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ag-88296',
    crop: 'Potato',
    cropBn: 'আলু',
    disease: 'Diagnosis Inconclusive',
    diseaseBn: 'নিশ্চিতভাবে রোগ শনাক্ত করা যায়নি',
    scientificName: 'Uncertain / Low AI Confidence',
    confidence: 42.0,
    riskLevel: 'unknown',
    isHealthy: false,
    symptoms: ['Blurry image', 'Lighting issue'],
    symptomsBn: ['ছবি অস্পষ্ট', 'আলোর সামঞ্জস্য নেই'],
    immediateActions: ['Retake photo in clear daylight'],
    immediateActionsBn: ['পর্যাপ্ত আলোতে পুনরায় স্পষ্ট ছবি তুলুন'],
    prevention: ['Clean camera lens'],
    preventionBn: ['ক্যামেরার লেন্স পরিষ্কার রাখুন'],
    treatmentGuidance: ['Re-scan before applying treatment'],
    treatmentGuidanceBn: ['ওষুধ প্রয়োগের পূর্বে পুনরায় স্ক্যান করুন'],
    disclaimer: 'AI আত্মবিশ্বাসের মাত্রা কম (৪২%)।',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVRDQyQYPMgApb8QGHj_Hi-V96M2TE_x5wPP1TzFSJBCWjOeWlRP4QYM8OGuxooW2x5-dJzPlHlt0WROcui3zCYYGOvdIvAk5qSotV7DLHYC6jr3Vl3aGEGR9SHCzTqGthAYfK0TfTQ42qGvgYfIWvJwXCSZDYYKOSdpuGdhXGDuze2r-tEfSJYcI1R250DgUC-PyqJheL0EC800rjPH0FA0US7Jgyme4jNmQCF4NTjB0nH5ve09Ym',
    demo: true,
    modelVersion: 'AgriNet-BD v3.4 (Demo Mode)',
    location: 'মুন্সীগঞ্জ সদর',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export class LocalDetectionRepository implements DetectionRepository {
  private getStore(): DetectionResult[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_DETECTIONS));
      return INITIAL_SEED_DETECTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SEED_DETECTIONS;
    }
  }

  private saveStore(items: DetectionResult[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }

  async saveDetection(_userId: string, detection: DetectionResult): Promise<string> {
    const items = this.getStore();
    const id = detection.id || 'ag-' + Math.floor(10000 + Math.random() * 90000);
    const newItem: DetectionResult = {
      ...detection,
      id
    };
    items.unshift(newItem);
    this.saveStore(items);
    return id;
  }

  async getDetections(_userId: string, options?: HistoryFilterOptions): Promise<DetectionResult[]> {
    let items = this.getStore();

    if (options?.query) {
      const q = options.query.toLowerCase();
      items = items.filter(
        (item) =>
          item.crop.toLowerCase().includes(q) ||
          (item.cropBn && item.cropBn.includes(q)) ||
          item.disease.toLowerCase().includes(q) ||
          (item.diseaseBn && item.diseaseBn.includes(q))
      );
    }

    if (options?.crop && options.crop !== 'all') {
      items = items.filter((item) => item.crop.toLowerCase() === options.crop?.toLowerCase());
    }

    if (options?.riskLevel && options.riskLevel !== 'all') {
      items = items.filter((item) => item.riskLevel === options.riskLevel);
    }

    if (options?.sortBy === 'oldest') {
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  }

  async getDetectionById(_userId: string, detectionId: string): Promise<DetectionResult | null> {
    const items = this.getStore();
    return items.find((i) => i.id === detectionId) || null;
  }

  async deleteDetection(_userId: string, detectionId: string): Promise<void> {
    const items = this.getStore();
    const filtered = items.filter((i) => i.id !== detectionId);
    this.saveStore(filtered);
  }
}
