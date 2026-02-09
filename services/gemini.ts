
import { GoogleGenAI } from "@google/genai";
import { STORE_NAME, CONTACT_NUMBER, VODAFONE_CASH, INSTAPAY_NUMBER, FACEBOOK_URL } from "../constants";

export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const SYSTEM_INSTRUCTION = `
أنت "مساعد إيفرست" الذكي. مهمتك هي الرد على استفسارات عملاء متجر Everest Store لبيع الروبكس في مصر.

معلومات الفريق:
- عبدالله عماد (Abdalla Emad): مؤسس وقائد فريق إيفرست.
- حمزة الهواري (Hamza Elhawy): المبرمج المسؤول عن تطوير الموقع والأنظمة التقنية.
- إياد شريطي (Iyed Chraiti): عضو فريق من تونس.

معلومات البيع:
- السعر: 100 روبكس = 50 جنيه مصري.
- الدفع: فودافون كاش (${VODAFONE_CASH}) أو انستا باي - InstaPay (${INSTAPAY_NUMBER}).
- التواصل: واتساب فقط (${CONTACT_NUMBER})، ممنوع الاتصال.
- طريقة الشحن: Gamepass (آمنة) أو Gift. الروبكس يظهر Pending لمدة 5-7 أيام حسب قوانين روبلوكس.

الضرائب:
- أقل من 500 روبكس: +5ج.
- 500 إلى 999 روبكس: +10ج.
- كل 500 إضافية: +5ج.

قواعد الرد:
- كن مختصراً، مهذباً، وتحدث بلهجة مصرية بسيطة واحترافية.
- لا تبالغ في وصف الأشخاص، فقط اذكر أدوارهم الوظيفية عند السؤال.
- إذا سئلت عن السعر، اذكر الحسبة بوضوح.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Use .text property directly as per @google/genai guidelines
    return response.text || "عذراً، لم أستطع فهم ذلك. هل يمكنك إعادة الصياغة؟";

  } catch (error) {
    console.error("Gemini Error:", error);
    return "نعتذر، هناك مشكلة مؤقتة في الاتصال بالذكاء الاصطناعي. اطلب المساعدة من صفحة الفيسبوك مباشرة.";
  }
}
