import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

const toThaiNumber = (number: number) => {
  const thaiNumbers = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  return number
    .toString()
    .split("")
    .map((char) => {
      if (char === ".") return ".";
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : thaiNumbers[digit];
    })
    .join("");
};

const criteriaData = [
  {
    head: 1,
    label: "h1",
    title: "ทักษะการตอบคำถาม",
  },
  {
    head: 2,
    label: "h1_1",
    title: "๑. ทักษะในการสืบค้นภูมิหลังของคำถาม",
  },
  {
    number: "๕",
    point: 5,
    label: "q1_1",
    title: "๑.๑ ความสมบูรณ์ของข้อมูลทั่วไปของผู้สอบถาม",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q1_2",
    title: "๑.๒ ความครบถ้วนของข้อมูลภูมิหลัง",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q1_3",
    title: "๑.๓ ความถูกต้องครบถ้วนของการกรอกและจำแนกข้อมูล",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q1_4",
    title: "๑.๔ การวิเคราะห์และสรุปประเด็นคำถาม ตามความต้องการที่แท้จริงของผู้ถาม (ultimate questions)",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    head: 2,
    label: "h1_2",
    title: "๒. การสืบค้นข้อมูลและเอกสารอ้างอิง",
  },
  {
    number: "๕",
    point: 5,
    label: "q2_1",
    title: "๒.๑ ค้นคว้าอย่างเป็นระบบ",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q2_1_1",
    title: "๒.๑.๑ ระบุแหล่งข้อมูลจากคำถามที่ได้รับโดยพิจารณาความครอบคลุมแหล่งข้อมูลที่เหมาะสมต่อประเภทคำถาม",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q2_1_2",
    title: "๒.๑.๒ กำหนดคำสำคัญในการสืบค้น",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q2_2",
    title: "๒.๒ คัดเลือกเอกสารอ้างอิงเพื่อตอบคำถามได้อย่างถูกต้องและเหมาะสม",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    head: 2,
    label: "h1_3",
    title: "๓. ทักษะในการประเมินข้อมูลที่ได้",
  },
  {
    number: "๕",
    point: 5,
    label: "q3_1",
    title: "๓.๑ วิพากษ์ความน่าเชื่อถือ ข้อดีข้อด้อยหรือ ข้อจำกัดของข้อมูลที่ได้",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    head: 2,
    label: "h1_4",
    title: "๔. ทักษะในการสังเคราะห์ข้อมูลที่ได้เป็นคำตอบ",
  },
  {
    number: "๕",
    point: 5,
    label: "q4_1",
    title: "๔.๑ รวบรวม/สรุปสาระสำคัญของข้อมูลที่ได้อย่างถูกต้อง กระชับ ครอบคลุม",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q4_2",
    title: "๔.๒ สังเคราะห์ข้อมูล โดยอ้างอิงองค์ความรู้พื้นฐาน ในกรณีที่ไม่มีข้อมูลสนับสนุนคำตอบชัดเจนเชิงประจักษ์",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q4_3",
    title: "๔.๓ นำข้อสรุปที่ได้ไปเสนอแนะผู้ถามเพื่อแก้ไขปัญหาของผู้ป่วยได้อย่างเฉพาะเจาะจงและทันเวลา",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    head: 2,
    label: "h1_5",
    title: "๕. ทักษะในการสื่อสารข้อมูล",
  },
  {
    number: "๕",
    point: 5,
    label: "q_comm_1",
    title: "๕.๑ ใช้ภาษาที่ชัดเจน และเหมาะสมกับผู้ถาม กระชับและตรงประเด็น",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q_comm_2",
    title: "๕.๒ เขียนเอกสารอ้างอิงได้ถูกต้อง",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    head: 2,
    label: "h1_6",
    title: "๖. การติดตามผลการตอบคำถามอย่างเหมาะสม",
  },

  {
    head: 2,
    label: "h2_1",
    title: "การประเมินการใช้ยา (DUE/DUR)",
  },
  {
    number: "๕",
    point: 5,
    label: "q_due_1",
    title: "๑. รวบรวมข้อมูลพื้นฐานของผู้ป่วย",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q_due_2",
    title: "๒. ประเมินการใช้ยาตามเกณฑ์ที่กำหนด",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q_due_3",
    title: "๓. เสนอแนวทางการแก้ไขปัญหาที่เกี่ยวกับการใช้ยาที่พบแก่บุคลากรสาธารณสุข",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q_due_4",
    title: "๔. ติดตามและประเมินผลการใช้ยา",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    head: 2,
    label: "h2_2",
    title: "การประเมิน ป้องกัน/แก้ไข และรายงานอาการไม่พึงประสงค์",
  },
  {
    number: "๕",
    point: 5,
    label: "q_adr_1",
    title: "๑. รวบรวมข้อมูลพื้นฐานของผู้ป่วย",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q_adr_2",
    title: "๒. ประเมินอาการไม่พึงประสงค์ตาม algorithm ได้ถูกต้อง",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q_adr_3",
    title: "๓. เสนอแนวทางการแก้ไขและป้องกันอย่างเหมาะสมแก่ผู้ป่วยและบุคลากรสาธารณสุขที่เกี่ยวข้อง",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
  {
    number: "๕",
    point: 5,
    label: "q_adr_4",
    title: "๔. เขียนรายงานอาการไม่พึงประสงค์จากการใช้ยาและผลิตภัณฑ์สุขภาพ (APR) ได้อย่างเหมาะสม",
    superd: "ดีมาก",
    good: "ดี",
    pass: "ปานกลาง",
    fail: "ไม่ผ่าน",
  },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const initialData: any = {
    strength: parentForm.getValues("result.strength") || "",
    improvement: parentForm.getValues("result.improvement") || "",
  };

  criteriaData.forEach((item) => {
    if (!item.head) {
      initialData[item.label] = parentForm.getValues(`result.${item.label}`) || "";
    }
  });

  const [data, setData] = useState(initialData);

  useEffect(() => {
    setFormValidated(handleCheckValid());
  }, [isSubmit, isClick]);

  const setDataValue = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    parentForm.setValue(`result.${key}`, value);
  };

  const handleCheckValid = () => {
    return !Object.keys(data).some((key) => {
      const value = data[key];
      if (!value) return true;
      return false;
    });
  };

  const calculateTotalScore = () => {
    let total = 0;
    let evaluatedCount = 0;
    criteriaData.forEach((item) => {
      if (!item.head) {
        const score = parseFloat(data[item.label]);
        if (!isNaN(score)) {
          total += score;
          evaluatedCount++;
        }
      }
    });
    const maxScore = evaluatedCount * 5; // Each item max is 5 points
    const finalScore = maxScore > 0 ? (total * 40) / maxScore : 0;
    return { total, maxScore, finalScore };
  };

  const getScoreOptions = (level: string) => {
    switch (level) {
      case "superd":
        return [{ label: "๕", value: "5" }];
      case "good":
        return [
          { label: "๔", value: "4" },
          { label: "๓", value: "3" },
        ];
      case "pass":
        return [{ label: "๒", value: "2" }];
      case "fail":
        return [
          { label: "๑", value: "1" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12">
      <div className="sm:col-span-12">
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <p className="text-sm mb-2">
            <strong>คำชี้แจง</strong>
          </p>
          <p className="text-xs sm:text-sm">
            ให้ท่านทำเครื่องหมายกากบาท (x) ในช่องระดับคะแนนของแบบประเมินที่ตรงกับทักษะและความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ)
          </p>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm mb-3">
            <strong>ระดับขั้นการประเมิน</strong>
          </p>
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 w-20">คะแนน</th>
                <th className="text-left p-2 w-24">ระดับ</th>
                <th className="text-left p-2">นิยาม</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 align-top">๕</td>
                <td className="p-2 align-top">ดีมาก</td>
                <td className="p-2">
                  นิสิต/นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถครบถ้วนตามวัตถุประสงค์การฝึกปฏิบัติงานเป็นที่น่าพอใจ เกิดความมั่นพอใจน้อย สามารถปฏิบัติงานได้ด้วยตนเอง อาจได้รับคำแนะนำเป็นจริงครั้งคราว
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 align-top">๔</td>
                <td className="p-2 align-top">ดี</td>
                <td className="p-2">
                  นิสิต/นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถตามวัตถุประสงค์การฝึกปฏิบัติงาน มีความมั่นพอใจระดับยอมรับได้ สามารถปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับคำแนะนำเป็นจริงครั้งคราว
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 align-top">๓</td>
                <td className="p-2 align-top">ปานกลาง</td>
                <td className="p-2">
                  นิสิต/นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถตามเกณฑ์วัตถุประสงค์การฝึกปฏิบัติงาน มีความมั่นพอใจระดับยอมรับได้ ยังคงสามารถปฏิบัติงานได้ แต่ต้องได้รับคำแนะนำเป็นส่วนใหญ่
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 align-top">๒</td>
                <td className="p-2 align-top">ปรับปรุง</td>
                <td className="p-2">
                  นิสิต/นักศึกษาแสดงให้เห็นว่ามาตกท้าย/ความสามารถในระดับไม่น่าเชื่อถือ เกิดความมั่นพอใจอยู่เสมอ การปฏิบัติงานต้องอยู่ภายใต้การดูแลจากอาจารย์ประจำแหล่งฝึกอย่างใกล้ชิด
                </td>
              </tr>
              <tr>
                <td className="p-2 align-top">๑</td>
                <td className="p-2 align-top">ไม่ผ่าน</td>
                <td className="p-2">
                  นิสิต/นักศึกษาแสดงให้เห็นว่ามาตกท้าย/ความสามารถไม่ผ่านตามวัตถุประสงค์การฝึกปฏิบัติงาน ไม่สามารถปฏิบัติงานได้ เกิดความผิดพลาดซ้ำซ้า และไม่ปรับปรุงตามคำแนะนำของอาจารย์แหล่งฝึก
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบฟอร์มการประเมิน</p>
      </div>

      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border text-center text-sm" rowSpan={2}>
                  หัวข้อการประเมิน
                </th>
                <th className="p-2 border text-center text-sm" colSpan={6}>
                  ขั้นการประเมิน
                </th>
              </tr>
              <tr className="bg-slate-100">
                <th className="p-2 border text-center text-xs">๕</th>
                <th className="p-2 border text-center text-xs">๔</th>
                <th className="p-2 border text-center text-xs">๓</th>
                <th className="p-2 border text-center text-xs">๒</th>
                <th className="p-2 border text-center text-xs">๑</th>
                <th className="p-2 border text-center text-xs">N/A</th>
              </tr>
            </thead>

            {criteriaData.map((item: any, key) => {
              if (item.head === 1) {
                return (
                  <tbody key={key}>
                    <tr className="bg-slate-100">
                      <td colSpan={7} className="p-2 border font-semibold text-sm">
                        {item.title}
                      </td>
                    </tr>
                  </tbody>
                );
              }

              if (item.head === 2) {
                return (
                  <tbody key={key}>
                    <tr className="bg-slate-50">
                      <td colSpan={7} className="p-2 border font-medium text-sm">
                        {item.title}
                      </td>
                    </tr>
                  </tbody>
                );
              }

              return (
                <tbody key={key}>
                  <tr>
                    <td className="p-2 border text-sm align-top">{item.title}</td>
                    {["superd", "good", "pass", "fail"].map((level) => {
                      const options = getScoreOptions(level);
                      return options.map((option) => (
                        <td key={option.value} className="p-2 border text-center align-top">
                          <RadioGroup
                            onValueChange={(value) => setDataValue(item.label, value)}
                            value={data[item.label]}
                          >
                            <div className="flex justify-center">
                              <RadioGroupItem
                                value={option.value}
                                className={
                                  isSubmit && !data[item.label]
                                    ? "border-2 border-red-600"
                                    : ""
                                }
                              />
                            </div>
                          </RadioGroup>
                        </td>
                      ));
                    })}
                    <td className="p-2 border text-center align-top">
                      <RadioGroup
                        onValueChange={(value) => setDataValue(item.label, value)}
                        value={data[item.label]}
                      >
                        <div className="flex justify-center">
                          <RadioGroupItem value="N/A" />
                        </div>
                      </RadioGroup>
                    </td>

                  </tr>
                </tbody>
              );
            })}

            <tbody>
              <tr>
                <td colSpan={7} className="p-2 border text-center text-sm font-semibold">
                  {(() => {
                    const { total, maxScore, finalScore } = calculateTotalScore();
                    const finalScoreRounded = Math.round(finalScore * 100) / 100;
                    return (
                      <>
                        รวมคะแนน ({toThaiNumber(total)} × ๔๐) / {toThaiNumber(maxScore)} = {toThaiNumber(finalScoreRounded)} คะแนน
                      </>
                    );
                  })()}
                </td>
              </tr>
              <tr>
                <td colSpan={7} className="p-2 border text-center text-sm">
                  <strong>
                    หมายเหตุ ในกรณีที่ไม่สามารถประเมินได้ ให้ใส่เครื่องหมายคะแนนการประเมินตามส่วน
                  </strong>
                </td>
              </tr>
              <tr>
                <td colSpan={7} className="p-2 border text-sm">
                  หากให้ท่านประเมินระดับการศึกษา (เกรด) ตามความสามารถของนิสิต/นักศึกษาโดยภาพรวม คิดว่าควรอยู่ในระดับ
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> A (≥ ร้อยละ 80)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> B+ (ร้อยละ 75-79)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> B (ร้อยละ 70-74)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" /> C+ (ร้อยละ 65-69)
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="pt-4 pb-4">
          <h3 className="font-semibold mb-3 text-sm">ข้อเสนอแนะ/ความคิดเห็นพิเศษเพิ่มเติม</h3>
          <div className="border rounded-md">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 border text-center text-sm" width="100px">
                    จุดแข็ง
                  </td>
                  <td className="p-2 border">
                    <Textarea
                      placeholder="จุดแข็งของนิสิต/นักศึกษา"
                      className={
                        "min-h-24 border-0 focus-visible:ring-0 resize-none text-sm" +
                        (isSubmit && !data.strength ? " border-2 border-red-600" : "")
                      }
                      onChange={(e) => setDataValue("strength", e.target.value)}
                      value={data.strength}
                    />
                    {isSubmit && !data.strength && (
                      <p className="text-xs text-red-600 mt-1 text-center">
                        กรุณากรอกจุดแข็ง
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border text-center text-sm">จุดที่ควรปรับปรุง</td>
                  <td className="p-2 border">
                    <Textarea
                      placeholder="จุดที่ควรปรับปรุงของนิสิต/นักศึกษา"
                      className={
                        "min-h-24 border-0 focus-visible:ring-0 resize-none text-sm" +
                        (isSubmit && !data.improvement ? " border-2 border-red-600" : "")
                      }
                      onChange={(e) => setDataValue("improvement", e.target.value)}
                      value={data.improvement}
                    />
                    {isSubmit && !data.improvement && (
                      <p className="text-xs text-red-600 mt-1 text-center">
                        กรุณากรอกจุดที่ควรปรับปรุง
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
