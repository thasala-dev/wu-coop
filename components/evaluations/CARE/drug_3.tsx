import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

const toThaiNumber = (number: number) => {
  const thaiNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return number
    .toString()
    .split("")
    .map((char) => {
      if (char === ".") {
        return ".";
      }
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : thaiNumbers[digit];
    })
    .join("");
};

const criteriaData = [
  {
    label: "p1_1",
    topTitle: "1. การนําเสนอข้อมูลผู้ป่วยถูกต้องและครบถ้วน",
    title: `1.1 ประกอบด้วย CC, HPI, PMH, FH, SH, ALL, MH, PE, ข้อมูลการประเมินระบบร่างกายเบื้องต้นของนิสิต/นักศึกษา (Review of System)`,
  },
  {
    label: "p1_2",
    title:
      "1.2 ไม่เปิดเผยความลับของผู้ป่วย เช่น ระบุชื่อ หรือ นําเสนอข้อมูลเวชระเบียน",
  },
  {
    label: "p2_1",
    topTitle: "2. การประเมินและแก้ไขอย่างเป็นระบบ",
    title: "2.1 ระบุปัญหาเรื่องโรคและยาของผู้ป่วย และการประเมินแยกโรค",
  },
  {
    label: "p2_2",
    title:
      "2.2 ระบุข้อมูลของผู้ป่วยที่สัมพันธ์กับปัญหา (subjective & objective data)",
  },
  {
    label: "p2_3",
    title:
      "2.3 การประเมินสาเหตุ ปัจจัยเสี่ยง และรูปแบบการรักษา (ในรูปแบบ IESAC หรือรูปแบบอื่นๆตามการพิจารณาความเหมาะสมของแหล่งฝึกฯ)",
  },
  {
    label: "p2_4",
    title:
      "2.4 แผนการแก้ไขปัญหา- เป้าหมายการรักษา แผนการรักษาด้วยยาในปัจจุบันและอนาคต- ติดตามผู้ป่วยด้านประสิทธิภาพและความปลอดภัย- ให้คําปรึกษาแก่ผู้รับบริการ/ผู้ป่วย/ญาติ/แพทย์/บุคลากรสาธารณสุขอื่นๆ",
  },
  {
    label: "p3",
    topTitle: "3. การใช้หลักฐานทางวิชาการ ",
    title:
      "นําเสนอข้อมูลที่เกี่ยวข้องกับกรณีศึกษาเพิ่มเติมเป็นข้อมูลที่ทันสมัย น่าเชื่อถือและเป็นที่ยอมรับมีจํานวนเหมาะสมเพียงพอ",
  },
  {
    label: "p4",
    topTitle: "4. การนําเสนอ ",
    title:
      "สื่อสารวัจนภาษา/อวัจนภาษามีความเหมาะสม  ลําดับระยะเวลาการนําเสนอเหมาะสม เนื้อหา/สื่อประกอบการนําเสนอถูกต้อง ชัดเจน น่าสนใจ",
  },
  {
    label: "p5",
    topTitle: "5. การตอบคําถาม",
    title:
      " ถูกต้องและมีเหตุผล โดยอ้างอิงองค์ความรู้พื้นฐาน ในกรณีที่ไม่มีข้อมูลสนับสนุนคําตอบชัดเจนเชิงประจักษ์",
  },
  {
    label: "p6",
    topTitle: "6. การบูรณาการองค์ความรู้และความเข้าใจภาพรวมของกรณีศึกษา",
    title: "",
  },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    p1_1: parentForm.getValues("result.p1_1") || "",
    p1_2: parentForm.getValues("result.p1_2") || "",
    p2_1: parentForm.getValues("result.p2_1") || "",
    p2_2: parentForm.getValues("result.p2_2") || "",
    p2_3: parentForm.getValues("result.p2_3") || "",
    p2_4: parentForm.getValues("result.p2_4") || "",
    p3: parentForm.getValues("result.p3") || "",
    p4: parentForm.getValues("result.p4") || "",
    p5: parentForm.getValues("result.p5") || "",
    p6: parentForm.getValues("result.p6") || "",
    suggestion: parentForm.getValues("result.suggestion") || "",
  });

  useEffect(() => {
    setFormValidated(handleCheckValid());
  }, [isSubmit, isClick]);

  const setDataValue = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
    parentForm.setValue(`result.${key}`, value);
  };

  const handleCheckValid = () => {
    const keyList = ["suggestion"];
    return !Object.keys(data).some((key) => {
      if (!keyList.includes(key)) {
        const value = data[key as keyof typeof data];
        if (!value) {
          return true;
        }
      }
      return false;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12 ">
      <div className="sm:col-span-12 ">
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <p className="text-sm mb-2">
            <strong>คำชี้แจง</strong>
          </p>
          <p className="text-xs sm:text-sm mb-4">
            ให้ท่านทําเครื่องหมายกากบาท (✗)
            ทับตัวเลขคะแนนของแบบประเมินที่ตรงกับทักษะและ
            ความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 ">
        <div>ระดับขั้นการประเมิน</div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th
                className="p-2 border text-left text-sm"
                style={{ width: "10%" }}
              >
                คะแนน
              </th>
              <th
                className="p-2 border text-left text-sm"
                style={{ width: "10%" }}
              >
                ระดับ
              </th>
              <th
                className="p-2 border text-left text-sm"
                style={{ width: "80%" }}
              >
                นิยาม
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                5
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดีมาก
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษามีพฤติกรรมเหมาะสม มีความพร้อม เสียสละ กระตือรือร้น
                รวมถึงมีทัศนคติที่ดี ต่อการฝึกปฏิบัติงาน
                สามารถอภิปรายและให้ข้อเสนอแนะที่เป็นประโยชน์อย่างเหมาะสม
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                4
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดี
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษามีพฤติกรรมเหมาะสม มีความพร้อม เสียสละ
                รวมถึงทัศนคติที่ดีต่อการฝึก ปฏิบัติงาน
                สามารถปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับคําแนะนําเพียงเล็กน้อย
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                3
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปานกลาง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษามีพฤติกรรมอยู่ในเกณฑ์พอใช้
                สามารถปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับ คําแนะนําเป็นส่วนใหญ่
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                2
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปรับปรุง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษามีพฤติกรรมไม่เหมาะสมบางประการ เกิดความผิดพลาดซ้ํา
                สามารถปฏิบัติงาน ได้ แต่ต้องได้รับการติดตามอย่างใกล้ชิด
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                1
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ไม่ผ่าน
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษามีพฤติกรรมไม่เหมาะสม เกิดความผิดพลาดซ้ํา
                และไม่ปรับปรุงตัวตามคําแนะนํา ของอาจารย์แหล่งฝึก
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบฟอร์มการประเมิน</p>
      </div>

      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border text-center text-sm">
                  หัวข้อการประเมิน
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  5
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  4
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  3
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  2
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  1
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  N/A
                </th>
              </tr>
            </thead>

            {criteriaData.map((item: any, key) => {
              return (
                <tbody key={key}>
                  <tr>
                    <td className="p-2 border align-bottom text-sm">
                      {item.topTitle && (
                        <div className="font-bold mb-2">{item.topTitle}</div>
                      )}
                      <div className="ml-4">{item.title}</div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="5"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="4"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="3"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="2"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="1"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="N/A"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="sm:col-span-12">
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <h3 className="font-semibold mb-3 text-sm">สรุปคะแนน</h3>
          <div className="space-y-2">
            {(() => {
              // Helper function to calculate section score
              const calculateSectionScore = (
                sectionScores: string[],
                weight: number
              ) => {
                const validScores = sectionScores.filter(
                  (score) => score && score !== "N/A"
                );
                const count = validScores.length;
                if (count === 0) return 0;

                const sum = validScores.reduce(
                  (total, score) => total + parseInt(score),
                  0
                );
                return (sum * weight) / (5 * count);
              };

              // Section 1: p1_1, p1_2
              const section1Scores = [data.p1_1, data.p1_2];
              const section1Score = calculateSectionScore(section1Scores, 7.5);

              // Section 2: p2_1, p2_2, p2_3, p2_4
              const section2Scores = [data.p2_1, data.p2_2, data.p2_3, data.p2_4];
              const section2Score = calculateSectionScore(section2Scores, 50);

              // Section 3: p3
              const section3Scores = [data.p3];
              const section3Score = calculateSectionScore(section3Scores, 7.5);

              // Section 4: p4
              const section4Scores = [data.p4];
              const section4Score = calculateSectionScore(section4Scores, 7.5);

              // Section 5: p5
              const section5Scores = [data.p5];
              const section5Score = calculateSectionScore(section5Scores, 17.5);

              // Section 6: p6
              const section6Scores = [data.p6];
              const section6Score = calculateSectionScore(section6Scores, 10);

              // Total score - count all non-N/A items
              const allScores = [
                data.p1_1,
                data.p1_2,
                data.p2_1,
                data.p2_2,
                data.p2_3,
                data.p2_4,
                data.p3,
                data.p4,
                data.p5,
                data.p6,
              ];

              const totalRawScore = allScores.reduce((sum, score) => {
                if (score && score !== "N/A") {
                  return sum + parseInt(score);
                }
                return sum;
              }, 0);

              const totalCount = allScores.filter(
                (score) => score && score !== "N/A"
              ).length;

              const finalScore = totalCount > 0 ? (totalRawScore * 15) / (5 * totalCount) : 0;

              return (
                <>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="flex justify-between items-center">
                      <span>ส่วนที่ 1:</span>
                      <span className="font-semibold">
                        {toThaiNumber(parseFloat(section1Score.toFixed(2)))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ส่วนที่ 2:</span>
                      <span className="font-semibold">
                        {toThaiNumber(parseFloat(section2Score.toFixed(2)))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ส่วนที่ 3:</span>
                      <span className="font-semibold">
                        {toThaiNumber(parseFloat(section3Score.toFixed(2)))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ส่วนที่ 4:</span>
                      <span className="font-semibold">
                        {toThaiNumber(parseFloat(section4Score.toFixed(2)))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ส่วนที่ 5:</span>
                      <span className="font-semibold">
                        {toThaiNumber(parseFloat(section5Score.toFixed(2)))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ส่วนที่ 6:</span>
                      <span className="font-semibold">
                        {toThaiNumber(parseFloat(section6Score.toFixed(2)))}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">รวมคะแนน (คะแนนที่ได้ × 15) / 100:</span>
                      <span className="font-bold text-lg text-blue-600">
                        {toThaiNumber(parseFloat(finalScore.toFixed(2)))}
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="pt-4 pb-4">
          <h3 className="font-semibold mb-3 text-sm">ข้อเสนอแนะ</h3>
          <Textarea
            placeholder="ข้อเสนอแนะ"
            className="min-h-24 border focus-visible:ring-0 resize-none text-sm"
            onChange={(e) => {
              setDataValue("suggestion", e.target.value);
            }}
            value={data.suggestion}
          />
        </div>
      </div>
    </div>
  );
}
