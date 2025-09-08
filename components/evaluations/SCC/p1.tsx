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
    topTitle: "พฤติกรรมต่อแหล่งฝึก",
    label: "p1_1",
    point: 6,
    title: `1. การตรงต่อเวลา การมีวินัย และปฏิบัติตนตามแหล่งฝึก`,
  },
  {
    label: "p1_2",
    point: 2,
    title: "2. การแต่งกายเหมาะสม แสดงถึงความเป็นวิชาชีพเภสัชกรรม",
  },
  {
    label: "p1_3",
    point: 2,
    title: "3. การปรับตัวเข้ากับแหล่งฝึก และการปรับปรุงตนเองต่อข้อเสนอแนะ",
  },
  {
    topTitle: "พฤติกรรมต่อผู้อื่น",
    label: "p2_1",
    point: 6,
    title: `4. การมีมนุษยสัมพันธ์ที่ดีสามารถติดต่อกับผู้อื่นได้อย่างเหมาะสมมีมารยาทในการปฏิบัติงานที่ดี`,
  },
  {
    label: "p2_2",
    point: 2,
    title: "5. ความมีน้ำใจ ไม่เพิกเฉยต่อการช่วยเหลือผู้อื่น",
  },
  {
    topTitle: "พฤติกรรมต่อตนเอง",
    label: "p3_1",
    point: 6,
    title: `6. การเตรียมความพร้อมก่อนฝึกปฏิบัติงาน`,
  },
  {
    label: "p3_4",
    point: 2,
    title: "7. ความตั้งใจ กระตือรือร้น และความรับผิดชอบต่องานที่ได้รับมอบหมาย",
  },
  {
    label: "p3_2",
    point: 2,
    title: "8. ความซื่อสัตย์สุจริต และการรักษาไว้ซึ่งจรรยาบรรณแห่งวิชาชีพ",
  },
  {
    label: "p3_3",
    point: 2,
    title: "9. ความคิดริเริ่มสร้างสรรค์",
  },

  {
    topTitle: "ทักษะการสื่อสาร",
    label: "p4_1",
    point: 6,
    title: `10.การแสดงความคิดเห็น และทักษะการสื่อสาร`,
  },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    p1_1: parentForm.getValues("result.p1_1") || "",
    p1_2: parentForm.getValues("result.p1_2") || "",
    p1_3: parentForm.getValues("result.p1_3") || "",
    p2_1: parentForm.getValues("result.p2_1") || "",
    p2_2: parentForm.getValues("result.p2_2") || "",
    p3_1: parentForm.getValues("result.p3_1") || "",
    p3_2: parentForm.getValues("result.p3_2") || "",
    p3_3: parentForm.getValues("result.p3_3") || "",
    p3_4: parentForm.getValues("result.p3_4") || "",
    p4_1: parentForm.getValues("result.p4_1") || "",
    other: parentForm.getValues("result.other") || "",
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
    const keyList = ["other"];
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

  // คำนวณคะแนนรวม
  const calculateTotalScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    criteriaData.forEach((item) => {
      const score = parseInt(data[item.label as keyof typeof data] || "0");
      totalScore += score;
      maxScore += 5; // คะแนนเต็มแต่ละข้อคือ 5
    });

    return { totalScore, maxScore };
  };

  const { totalScore, maxScore } = calculateTotalScore();
  const maxScoreDoubled = maxScore * 2; // คะแนนเต็มทั้งหมด x 2
  const percentage =
    maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12 ">
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
                  style={{ width: "8%" }}
                >
                  <div>5</div>
                  <div>(ดีมาก)</div>
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>4</div>
                  <div>(ดี)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>3</div>
                  <div>(ปานกลาง)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>2</div>
                  <div>(พอใช้)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>1</div>
                  <div>(ปรับปรุง)</div>
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
                  </tr>
                </tbody>
              );
            })}
            <tbody>
              <tr className="bg-slate-50">
                <td className="p-2 border font-bold text-sm">คะแนนรวม</td>
                <td
                  colSpan={5}
                  className="p-2 border text-center text-sm font-semibold"
                >
                  {toThaiNumber(totalScore)} / {toThaiNumber(maxScore)} คะแนน
                </td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-2 border font-bold text-sm">
                  เปอร์เซ็นต์ของคะแนนพฤติกรรม
                </td>
                <td
                  colSpan={5}
                  className="p-2 border text-center text-sm font-semibold"
                >
                  {toThaiNumber(parseFloat(percentage.toString()))}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="sm:col-span-12">
        <div className="pt-4 pb-4">
          <h3 className="font-semibold mb-3 text-sm">ผลการประเมินอื่นๆ</h3>
          <Textarea
            placeholder="ผลการประเมินอื่นๆ"
            className="min-h-24 border focus-visible:ring-0 resize-none text-sm"
            onChange={(e) => {
              setDataValue("other", e.target.value);
            }}
            value={data.other}
          />
        </div>
      </div>
    </div>
  );
}
