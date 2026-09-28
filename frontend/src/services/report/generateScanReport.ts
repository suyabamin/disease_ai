import { DetectionResult } from '../../types/detection';

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character] as string);

const safeImageUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value, window.location.origin);
    return ['https:', 'http:', 'blob:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
};

export const generateScanReport = (scan: DetectionResult, language: 'bn' | 'en'): boolean => {
  if (scan.demo || !scan.createdAt || !scan.crop || !scan.disease) return false;

  const reportWindow = window.open('', '_blank', 'width=900,height=720');
  if (!reportWindow) return false;

  const labels = language === 'bn'
    ? {
        scanDate: 'স্ক্যানের তারিখ', crop: 'শনাক্ত ফসল', disease: 'শনাক্ত রোগ', confidence: 'মডেল আত্মবিশ্বাস',
        confidenceLevel: 'আত্মবিশ্বাসের স্তর', status: 'ফলাফলের অবস্থা', uncertain: 'কম আত্মবিশ্বাস / অনিশ্চিত',
        predicted: 'পূর্বাভাস সম্পন্ন', alternatives: 'অন্যান্য শীর্ষ পূর্বাভাস', image: 'স্ক্যান করা ছবি',
        quality: 'ছবির মান', qualityStatus: 'অবস্থা', brightness: 'উজ্জ্বলতা', contrast: 'কনট্রাস্ট', blur: 'ঝাপসাভাব সূচক',
        report: 'স্ক্যান রিপোর্ট', imageUnavailable: 'এই রিপোর্টে স্ক্যানের ছবিটি সংরক্ষিত নেই।',
        print: 'PDF হিসেবে সংরক্ষণ / প্রিন্ট', note: 'এই রিপোর্টে শুধু সংরক্ষিত স্ক্যান ও মডেল আউটপুটের তথ্য রয়েছে।'
      }
    : {
        scanDate: 'Scan date', crop: 'Detected crop', disease: 'Detected disease', confidence: 'Model confidence',
        confidenceLevel: 'Confidence level', status: 'Prediction status', uncertain: 'Low confidence / uncertain',
        predicted: 'Prediction completed', alternatives: 'Other top predictions', image: 'Scanned image',
        quality: 'Image quality', qualityStatus: 'Status', brightness: 'Brightness', contrast: 'Contrast', blur: 'Blur score',
        report: 'Scan report', imageUnavailable: 'The scan image is not available in this report.',
        print: 'Save as PDF / Print', note: 'This report contains only saved scan and model output data.'
      };

  const scanDate = new Date(scan.createdAt);
  const imageUrl = safeImageUrl(scan.imageUrl);
  const topPredictions = scan.topPredictions?.length
    ? `<section><h2>${labels.alternatives}</h2><table><thead><tr><th>${labels.disease}</th><th>${labels.crop}</th><th>${labels.confidence}</th></tr></thead><tbody>${scan.topPredictions.map((prediction) => `<tr><td>${escapeHtml(prediction.display_name || prediction.disease)}</td><td>${escapeHtml(prediction.crop)}</td><td>${escapeHtml(String(prediction.confidence_percent))}%</td></tr>`).join('')}</tbody></table></section>`
    : '';
  const quality = scan.quality
    ? `<section><h2>${labels.quality}</h2><dl><dt>${labels.qualityStatus}</dt><dd>${escapeHtml(scan.quality.status)}</dd><dt>${labels.brightness}</dt><dd>${escapeHtml(String(scan.quality.brightness))}</dd><dt>${labels.contrast}</dt><dd>${escapeHtml(String(scan.quality.contrast))}</dd><dt>${labels.blur}</dt><dd>${escapeHtml(String(scan.quality.blur_score))}</dd></dl></section>`
    : '';

  reportWindow.document.write(`<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rugno V1 - ${escapeHtml(scan.crop)} ${escapeHtml(scan.disease)}</title>
<style>
:root{font-family:'Noto Sans Bengali','Noto Sans',Arial,sans-serif;color:#17251d;background:#f5f8f4;font-synthesis:none}*{box-sizing:border-box}body{margin:0;padding:36px}.sheet{max-width:800px;margin:auto;background:#fff;border:1px solid #dbe5dc;border-radius:12px;overflow:hidden}.top{padding:30px 36px;background:#174b35;color:#fff}.eyebrow{margin:0 0 8px;color:#c8e7d0;font-size:12px;text-transform:uppercase}.top h1{margin:0;font-size:28px}.top p{margin:8px 0 0;color:#e1eee5}.body{padding:28px 36px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fact{padding:14px;background:#f5f8f4;border:1px solid #e1e9e1;border-radius:8px}.fact span{display:block;color:#607267;font-size:12px}.fact strong{display:block;margin-top:5px;font-size:16px;overflow-wrap:anywhere}section{margin-top:24px}h2{font-size:16px;margin:0 0 10px;color:#174b35}img{display:block;max-width:100%;max-height:430px;object-fit:contain;border-radius:8px;background:#f2f5f2}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid #e1e9e1;font-size:13px}dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0}dt{color:#607267}dd{margin:0;text-align:right}.note{color:#607267;font-size:12px;margin-top:26px}.actions{display:flex;justify-content:flex-end;padding:0 36px 28px}.actions button{min-height:44px;padding:0 18px;border:0;border-radius:7px;background:#174b35;color:#fff;font:inherit;font-weight:700;cursor:pointer}@page{size:A4;margin:14mm}@media print{body{padding:0;background:#fff}.sheet{max-width:none;border:0;border-radius:0}.top{print-color-adjust:exact;-webkit-print-color-adjust:exact}.fact{break-inside:avoid}.actions{display:none}}@media(max-width:560px){body{padding:12px}.top,.body{padding:22px}.actions{padding:0 22px 22px}.grid{grid-template-columns:1fr}}
</style></head><body><article class="sheet"><header class="top"><p class="eyebrow">${labels.report}</p><h1>রুগ্ন-V1</h1><p>AI model: su0.1</p></header><main class="body"><div class="grid"><div class="fact"><span>${labels.scanDate}</span><strong>${escapeHtml(Number.isNaN(scanDate.getTime()) ? scan.createdAt : scanDate.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US'))}</strong></div><div class="fact"><span>${labels.status}</span><strong>${scan.uncertain ? labels.uncertain : labels.predicted}</strong></div><div class="fact"><span>${labels.crop}</span><strong>${escapeHtml(scan.cropBn || scan.crop)}</strong></div><div class="fact"><span>${labels.disease}</span><strong>${escapeHtml(scan.diseaseBn || scan.disease)}</strong></div><div class="fact"><span>${labels.confidence}</span><strong>${escapeHtml(String(scan.confidence))}%</strong></div>${scan.confidenceLevel ? `<div class="fact"><span>${labels.confidenceLevel}</span><strong>${escapeHtml(scan.confidenceLevel)}</strong></div>` : ''}</div>${imageUrl ? `<section><h2>${labels.image}</h2><img src="${escapeHtml(imageUrl)}" alt="${labels.image}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p hidden>${labels.imageUnavailable}</p></section>` : `<section><h2>${labels.image}</h2><p>${labels.imageUnavailable}</p></section>`}${topPredictions}${quality}<p class="note">${labels.note}</p></main><footer class="actions"><button onclick="window.print()">${labels.print}</button></footer></article><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));</script></body></html>`);
  reportWindow.document.close();
  return true;
};
