import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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
    topTitle: "สืบค้น ประเมิน และจัดเตรียมข้อมูลโรคและการรักษา",
    label: "s1_1",
    point: 1,
    title: "1.1 เลือกแหล่งข้อมูลที่เหมาะสมสำหรับการสืบค้นได้",
  },
  {
    label: "s1_2",
    point: 2,
    title:
      "1.2 จัดเตรียมข้อมูลต่อไปนี้ โดยใช้เทคนิคการสืบค้น และประเมินข้อมูลที่ถูกต้อง",
    checklist: [
      "โรค สาเหตุ การรักษาทั้งโดยการใช้ยาและไม่ใช้ยา",
      "ยาที่ใช้ในการรักษาและการเลือกใช้ยา",
      "รายละเอียดข้อมูลที่ครบถ้วนของยาที่ต้องการนำเสนอ",
    ],
  },
  {
    topTitle:
      "ประยุกต์ใช้ความรู้ทางเภสัชศาสตร์ และการบริหารตลาดในการทำการตลาดเภสัชภัณฑ์",
    label: "s2_1",
    point: 2,
    title:
      "2.1 วิเคราะห์และอธิบายกลยุทธ์การทำการตลาดเภสัชภัณฑ์ของแหล่งฝึกได้ในเบื้องต้น",
  },
  {
    label: "s2_2",
    point: 2,
    title:
      "2.2 เสนอแนวทางการทำตลาดเภสัชภัณฑ์ของแหล่งฝึกได้ในเบื้องต้น โดยแนวทางดังกล่าวเป็นแนวทางที่สอดคล้องกับกฎหมาย ข้อบังคับ จรรยาบรรณ และเกณฑ์จริยธรรมที่เกี่ยวข้อง ",
  },
  {
    label: "s2_3",
    point: 2,
    title:
      "2.3 เสนอโครงการวิจัยทางการตลาด หรือสามารถดำเนินการวิจัยทางการตลาดที่ไม่ซับซ้อนได้",
  },
  {
    topTitle:
      "นำเสนอและอภิปรายข้อมูลเกี่ยวกับโรคอย่างเป็นวิชาชีพแก่บุคลากรทางการแพทย์",
    label: "s3_1",
    point: 2,
    title:
      "3.1 นำเสนอข้อมูลเภสัชภัณฑ์อย่างครบถ้วนและตอบคำถามที่เกี่ยวกับข้อมูลเภสัชภัณฑ์ รวมถึงแสดงความเห็นในการเลือกใช้ยาเพื่อการรักษาอย่างถูกต้องตามหลักวิชาการทางเภสัชศาสตร์ มีหลักฐานอ้างอิงที่ชัดเจนและมีความเป็นกลาง โดยหลีกเลี่ยงการนำเสนอข้อมูลเพื่อการจดจำ (remind)",
  },
  {
    label: "s3_2",
    point: 2,
    title:
      "3.2 ร่วมอภิปรายกับบุคลากรทางการแพทย์เรื่องโรค และการรักษาทั้งโดยใช้ยาและไม่ใช้ยาได้",
  },
  {
    label: "s3_3",
    point: 2,
    title:
      "3.3 แสดงออกซึ่งกริยา มารยาท การแต่งกาย การสื่อสาร และปฏิสัมพันธ์อื่นๆ กับบุคลากรทางการแพทย์อย่างเหมาะสมกับการเป็นผู้ประกอบวิชาชีพ ",
  },
  {
    label: "s4_1",
    point: 2,
    topTitle:
      "4. อภิปรายกรณีศึกษากลยุทธ์ทางการตลาดเภสัชภัณฑ์ หรือสถานการณ์ทางการตลาดยาในปัจจุบันในมุมมองทางจริยธรรม โดยพิจารณาจากกฎหมาย ข้อบังคับจรรยาบรรณ หรือเกณฑ์จริยธรรมที่เกี่ยวข้องได้ ",
  },
  {
    label: "s5_1",
    point: 2,
    topTitle:
      "5. อธิบายวิธีการติดตามความปลอดภัยและปัญหาการใช้ยา รวมถึงสามารถรายงานและส่งต่อปัญหาอันเนื่องมาจากการใช้ยาได้   ",
  },
  {
    label: "s6_1",
    point: 2,
    topTitle:
      "6. อธิบายความสัมพันธ์และความเชื่อมโยงงานระหว่างงานด้านการตลาด การขายกับงานอื่นๆตามโครงสร้างองค์กรของแหล่งฝึก ",
  },
] as Array<{
  topTitle?: string;
  label: string;
  point: number;
  title: string;
  checklist?: string[];
}>;

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    s1_1: parentForm.getValues("result.s1_1") || "",
    s1_2: parentForm.getValues("result.s1_2") || "",
    s2_1: parentForm.getValues("result.s2_1") || "",
    s2_2: parentForm.getValues("result.s2_2") || "",
    s2_3: parentForm.getValues("result.s2_3") || "",
    s3_1: parentForm.getValues("result.s3_1") || "",
    s3_2: parentForm.getValues("result.s3_2") || "",
    s3_3: parentForm.getValues("result.s3_3") || "",
    s4_1: parentForm.getValues("result.s4_1") || "",
    s5_1: parentForm.getValues("result.s5_1") || "",
    s6_1: parentForm.getValues("result.s6_1") || "",
    other: parentForm.getValues("result.other") || "",
  });

  // State สำหรับ checklist
  const [checklistData, setChecklistData] = useState<{
    [key: string]: boolean[];
  }>(() => {
    const initialChecklistData: { [key: string]: boolean[] } = {};
    criteriaData.forEach((item) => {
      if (item.checklist) {
        const savedData = parentForm.getValues(
          `result.${item.label}_checklist`
        );
        initialChecklistData[item.label] =
          savedData || new Array(item.checklist.length).fill(false);
      }
    });
    return initialChecklistData;
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

  const setChecklistValue = (
    itemLabel: string,
    checkIndex: number,
    checked: boolean
  ) => {
    setChecklistData((prev) => {
      const newData = { ...prev };
      if (!newData[itemLabel]) {
        newData[itemLabel] = new Array(
          criteriaData.find((item) => item.label === itemLabel)?.checklist
            ?.length || 0
        ).fill(false);
      }
      newData[itemLabel][checkIndex] = checked;
      parentForm.setValue(`result.${itemLabel}_checklist`, newData[itemLabel]);
      return newData;
    });
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
  // คำนวณคะแนนรวม เฉพาะข้อที่ไม่ได้เลือก 0
  const calculateTotalScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    criteriaData.forEach((item) => {
      const scoreStr = data[item.label as keyof typeof data] || "0";
      const score = parseInt(scoreStr);
      if (scoreStr !== "0") {
        totalScore += score;
        maxScore += 5;
      }
    });
    return { totalScore, maxScore };
  };

  // คำนวณ rowSpan สำหรับ topTitle
  const getRowSpanForTopTitle = (currentIndex: number): number | undefined => {
    const currentItem = criteriaData[currentIndex];
    if (!currentItem.topTitle) return undefined;

    // หาว่า topTitle นี้ปรากฏครั้งแรกที่ index ไหน
    const firstOccurrenceIndex = criteriaData.findIndex(
      (item, index) =>
        index <= currentIndex && item.topTitle === currentItem.topTitle
    );

    // ถ้าไม่ใช่ครั้งแรกที่ปรากฏ ไม่ต้องแสดง topTitle
    if (firstOccurrenceIndex !== currentIndex) return undefined;

    // นับจำนวนแถวที่มี topTitle เดียวกัน
    let count = 1;
    for (let i = currentIndex + 1; i < criteriaData.length; i++) {
      if (
        criteriaData[i].topTitle === currentItem.topTitle ||
        (!criteriaData[i].topTitle && i === currentIndex + count)
      ) {
        count++;
      } else {
        break;
      }
    }

    return count;
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
              <tr>
                <th
                  className="p-2 border text-center text-sm"
                  rowSpan={2}
                  colSpan={2}
                >
                  วัตถุประสงค์เชิงพฤติกรรม
                </th>
                <th className="p-2 border text-center text-sm" rowSpan={2}>
                  ไม่มีการฝึก
                </th>
                <th className="p-2 border text-center text-sm" colSpan={5}>
                  คะแนน
                </th>
              </tr>
              <tr className="bg-slate-100">
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
            <tbody>
              {criteriaData.map((item, index) => {
                const rowSpan = getRowSpanForTopTitle(index);
                const isTopTitleOnly = item.topTitle && !item.title;

                return (
                  <tr key={index} className="bg-white">
                    {rowSpan && (
                      <td
                        className="p-2 border text-sm font-semibold align-top"
                        rowSpan={rowSpan}
                        colSpan={isTopTitleOnly ? 2 : 1}
                      >
                        {item.topTitle}
                      </td>
                    )}
                    {!isTopTitleOnly && (
                      <td className="p-2 border text-sm">
                        <div>{item.title}</div>
                        {item.checklist && (
                          <div className="mt-2 space-y-2">
                            {item.checklist.map((checkItem, checkIndex) => (
                              <div
                                key={checkIndex}
                                className="flex items-start space-x-2"
                              >
                                <Checkbox
                                  id={`${item.label}_${checkIndex}`}
                                  checked={
                                    checklistData[item.label]?.[checkIndex] ||
                                    false
                                  }
                                  onCheckedChange={(checked) =>
                                    setChecklistValue(
                                      item.label,
                                      checkIndex,
                                      checked as boolean
                                    )
                                  }
                                  className="mt-1"
                                />
                                <label
                                  htmlFor={`${item.label}_${checkIndex}`}
                                  className="text-xs text-gray-700 leading-normal cursor-pointer"
                                >
                                  {checkItem}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    )}
                    <td className="p-2 border text-center">
                      <RadioGroup
                        value={data[item.label as keyof typeof data]}
                        onValueChange={(value) =>
                          setDataValue(item.label, value)
                        }
                      >
                        <RadioGroupItem value="0" />
                      </RadioGroup>
                    </td>
                    {[5, 4, 3, 2, 1].map((score) => (
                      <td key={score} className="p-2 border text-center">
                        <RadioGroup
                          value={data[item.label as keyof typeof data]}
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                        >
                          <RadioGroupItem value={score.toString()} />
                        </RadioGroup>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tbody>
              <tr className="bg-slate-50">
                <td className="p-2 border font-bold text-sm" colSpan={2}>
                  คะแนนรวม
                </td>
                <td
                  colSpan={6}
                  className="p-2 border text-center text-sm font-semibold"
                >
                  {toThaiNumber(totalScore)} / {toThaiNumber(maxScore)} คะแนน
                </td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-2 border font-bold text-sm" colSpan={2}>
                  เปอร์เซ็นต์ของคะแนนความรู้และทักษะที่ได้
                </td>
                <td
                  colSpan={6}
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
