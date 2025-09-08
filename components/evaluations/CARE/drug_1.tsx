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
    label: "p1",
    title: "1. มีคุณธรรม จริยธรรม",
  },
  {
    label: "p2",
    title:
      "2. ปฏิบัติตามจรรยาบรรณวิชาชีพ กฎหมาย และระเบียบข้อบังคับต่าง ๆ ที่เกี่ยวข้องกับวิชาชีพเภสัชกรรม",
  },
  {
    label: "p3",
    title: "3. มีเจตคติที่ดีต่อการให้บริการเภสัชกรรม",
  },
  {
    label: "p4",
    title: "4. ไม่มีพฤติกรรมที่เสี่ยงต่อการเปิดเผยความลับของผู้ป่วย",
  },
  {
    label: "p5",
    title: "5. ตรงต่อเวลาและมีวินัย",
  },
  {
    label: "p6",
    title: "6. แต่งกายเหมาะสมแสดงถึงความเป็นวิชาชีพเภสัชกรรม",
  },
  {
    label: "p7",
    title: "7. มีสัมมาคารวะ และประพฤติตนเหมาะสมกับกาลเทศะ",
  },
  {
    label: "p8",
    title: "8. มีน้ําใจไม่เพิกเฉยต่อการช่วยเหลือผู้อื่นตามสมควร",
  },
  {
    label: "p9",
    title: "9. บุคลิกภาพเหมาะสม",
  },
  {
    label: "p10",
    title: "10. ตั้งใจและกระตือรือร้นในการฝึกปฏิบัติงาน",
  },
  {
    label: "p11",
    title: "11. รับผิดชอบต่องานที่ได้รับมอบหมาย",
  },
  {
    label: "p12",
    title: "12. การปรับตัวเข้ากับแหล่งฝึก",
  },
  {
    label: "p13",
    title: "13. การทํางานร่วมกับผู้อื่น",
  },
  {
    label: "p14",
    title: "14. การปรับปรุงตนเองต่อข้อเสนอแนะ",
  },
  {
    label: "p15",
    title:
      "15. โดยรวมนิสิต/นักศึกษา มีทัศคติที่ดีต่อการประกอบวิชาชีพเภสัชกรรมชุมชน",
  },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    p1: parentForm.getValues("result.p1") || "",
    p2: parentForm.getValues("result.p2") || "",
    p3: parentForm.getValues("result.p3") || "",
    p4: parentForm.getValues("result.p4") || "",
    p5: parentForm.getValues("result.p5") || "",
    p6: parentForm.getValues("result.p6") || "",
    p7: parentForm.getValues("result.p7") || "",
    p8: parentForm.getValues("result.p8") || "",
    p9: parentForm.getValues("result.p9") || "",
    p10: parentForm.getValues("result.p10") || "",
    p11: parentForm.getValues("result.p11") || "",
    p12: parentForm.getValues("result.p12") || "",
    p13: parentForm.getValues("result.p13") || "",
    p14: parentForm.getValues("result.p14") || "",
    p15: parentForm.getValues("result.p15") || "",

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
        <div className="">
          <p className="text-sm">
            ให้อาจารย์แหล่งฝึกประเมินผลโดยสังเกตจากพฤติกรรม
            ผลการปฏิบัติงานและ/หรือจากการอภิปราย สอบถาม การสื่อสารทั้งโดยวาจา
            หรือลายลักษณ์อักษร และให้ประเมิน 2 ครั้ง คือในสัปดาห์ที่ 3 และ 6 ของ
            การฝึกปฏิบัติงาน ควรมีการแจ้งผลการประเมินในสัปดาห์ที่ 3
            ให้นิสิต/นักศึกษาทราบ เพื่อให้เกิดการพัฒนา
            <u className="font-medium italic">
              โดยคะแนนที่ใช้ในการประเมินผลการฝึกปฏิบัติงานจะคิดจากคะแนนในสัปดาห์ที่
              6
            </u>
          </p>
        </div>
      </div>
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
              </tr>
            </thead>

            {criteriaData.map((item: any, key) => {
              return (
                <tbody key={key}>
                  <tr>
                    <td className="p-2 border align-top text-sm">
                      {item.topTitle && (
                        <div className="font-bold mb-2">{item.topTitle}</div>
                      )}
                      <>{item.title}</>
                    </td>
                    <td className="p-2 border align-top text-sm">
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
                    <td className="p-2 border align-top text-sm">
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
                    <td className="p-2 border align-top text-sm">
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
                    <td className="p-2 border align-top text-sm">
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
                    <td className="p-2 border align-top text-sm">
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
                  </tr>
                </tbody>
              );
            })}
            <tbody>
              <tr>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  รวมคะแนน (คะแนนที่ได้ x 10) / 75
                </td>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={5}
                >
                  {toThaiNumber(
                    Number(
                      (
                        (criteriaData.reduce((total, item) => {
                          const value = data[item.label as keyof typeof data];
                          return total + (value ? parseInt(value, 10) : 0);
                        }, 0) *
                          10) /
                        75
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
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
