import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

const toThaiNumber = (number: number) => {
  const thaiNumbers = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
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

const scoreLabels = [
  { label: "๕", value: "5" },
  { label: "๔", value: "4" },
  { label: "๓", value: "3" },
  { label: "๒", value: "2" },
  { label: "๑", value: "1" },
];

const quantityLabels = [
  { label: "1 ครั้ง", value: "0" },
  { label: "มากกว่า 1 ครั้ง", value: "1" },
];

const activityLabels = [
  { label: "ไม่มีการฝึก", value: "0" },
  { label: "1-2 กิจกรรม", value: "1" },
  { label: ">2 กิจกรรม", value: ">2" },
];

const workLabels = [
  { label: "ไม่มีชิ้นงาน", value: "0" },
  { label: "1 ชิ้นงาน", value: "1" },
  { label: ">1 ชิ้นงาน", value: ">1" },
];

// Check if checkbox is selected but score is not provided
const checkboxScoreValidation = [
  { select: "p1_1_select", score: "p1_1_score" },
  { select: "p1_2_select", score: "p1_2_score" },
  { select: "p2_1_select", score: "p2_1_score" },
  { select: "p2_2_select", score: "p2_2_score" },
  { select: "p2_3_select", score: "p2_3_score" },
  { select: "p2_4_select", score: "p2_4_score" },
  { select: "p2_5_select", score: "p2_5_score" },
  { select: "p2_6_select", score: "p2_6_score" },
  { select: "p2_7_select", score: "p2_7_score" },
  { select: "p3_1_select", score: "p3_1_score" },
  { select: "p3_2_select", score: "p3_2_score" },
  { select: "p3_3_select", score: "p3_3_score" },
  { select: "p3_4_select", score: "p3_4_score" },
  { select: "p3_5_select", score: "p3_5_score" },
  { select: "p3_6_select", score: "p3_6_score" },
  { select: "p4_1_select", score: "p4_1_score" },
  { select: "p4_2_select", score: "p4_2_score" },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    percentageProduction:
      parentForm.getValues("result.percentageProduction") || "",
    percentageOther: parentForm.getValues("result.percentageOther") || "",
    otherDepartment: parentForm.getValues("result.otherDepartment") || "",

    // จุดมุ่งหมายที่ 1
    p1_quantity: parentForm.getValues("result.p1_quantity") || "",
    p1_quantity_other: parentForm.getValues("result.p1_quantity_other") || "",
    p1_1_score: parentForm.getValues("result.p1_1_score") || "",
    p1_1_select: parentForm.getValues("result.p1_1_select") || false,

    // จุดมุ่งหมายที่ 2
    p2_1_quantity: parentForm.getValues("result.p2_1_quantity") || "",
    p2_1_quantity_other: parentForm.getValues("result.p2_1_quantity_other") || "",
    p2_1_score: parentForm.getValues("result.p2_1_score") || "",
    p2_1_select: parentForm.getValues("result.p2_1_select") || false,

    p2_2_quantity: parentForm.getValues("result.p2_2_quantity") || "",
    p2_2_quantity_other: parentForm.getValues("result.p2_2_quantity_other") || "",
    p2_2_score: parentForm.getValues("result.p2_2_score") || "",
    p2_2_select: parentForm.getValues("result.p2_2_select") || false,

    p2_3_quantity: parentForm.getValues("result.p2_3_quantity") || "",
    p2_3_quantity_other: parentForm.getValues("result.p2_3_quantity_other") || "",
    p2_3_score: parentForm.getValues("result.p2_3_score") || "",
    p2_3_select: parentForm.getValues("result.p2_3_select") || false,

    // จุดมุ่งหมายที่ 3
    p3_quantity: parentForm.getValues("result.p3_quantity") || "",
    p3_quantity_other: parentForm.getValues("result.p3_quantity_other") || "",
    p3_1_score: parentForm.getValues("result.p3_1_score") || "",
    p3_1_select: parentForm.getValues("result.p3_1_select") || false,

    // จุดมุ่งหมายที่ 4
    p4_quantity: parentForm.getValues("result.p4_quantity") || "",
    p4_quantity_other: parentForm.getValues("result.p4_quantity_other") || "",
    p4_1_score: parentForm.getValues("result.p4_1_score") || "",
    p4_1_select: parentForm.getValues("result.p4_1_select") || false,

    // จุดมุ่งหมายที่ 5 (อื่นๆ)
    p5_detail: parentForm.getValues("result.p5_detail") || "",
    p5_activity: parentForm.getValues("result.p5_activity") || "",
    p5_quantity: parentForm.getValues("result.p5_quantity") || "",
    p5_quantity_other: parentForm.getValues("result.p5_quantity_other") || "",
    p5_score: parentForm.getValues("result.p5_score") || "",
    p5_select: parentForm.getValues("result.p5_select") || false,

    // คะแนนรวม
    total_score: parentForm.getValues("result.total_score") || "",

    // ข้อเสนอแนะ
    suggestion: parentForm.getValues("result.suggestion") || "",
  });

  useEffect(() => {
    console.log("handleCheckValid():", handleCheckValid());

    setFormValidated(handleCheckValid());
  }, [isSubmit, isClick]);

  const setDataValue = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
    parentForm.setValue(`result.${key}`, value);
  };

  const setCheckboxValue = (key: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      [key]: checked,
    }));
    parentForm.setValue(`result.${key}`, checked);

    const findScoreLabel = checkboxScoreValidation.find((item) => {
      return item.select === key;
    });
    if (findScoreLabel) {
      const scoreKey = findScoreLabel.score;
      setDataValue(scoreKey, "");
    }
  };

  const ScoreForm = ({
    value,
    label,
    list,
    rows = false,
    isRequired = false,
  }: any) => {
    return (
      <RadioGroup
        onValueChange={(value) => setDataValue(label, value)}
        value={value}
        className={
          rows
            ? "flex flex-col gap-2 justify-center align-center w-full"
            : "flex flex-row items-center gap-2 justify-center w-full"
        }
      >
        {list.map((radio: any) => (
          <div
            className={
              rows
                ? "flex flex-row gap-2 items-center"
                : "flex flex-col gap-2 items-center"
            }
            key={radio.value}
          >
            <RadioGroupItem
              value={radio.value}
              className={
                isSubmit && isRequired && !value
                  ? "border-2 border-red-600"
                  : ""
              }
            />
            <label
              className={
                "text-sm" +
                (isSubmit && isRequired && !value ? " text-red-600" : "")
              }
            >
              {radio.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const handleCheckValid = () => {
    const keyList = [
      "otherDepartment",
      "p1_note",
      "p2_note",
      "p3_note",
      "p4_note",
      "p5_title",
      "p5_note",
      "suggestion",
    ];

    // Check required fields (exclude checkbox fields and score fields)
    const hasEmptyField = Object.keys(data).some((key) => {
      if (
        !keyList.includes(key) &&
        !key.includes("_select") &&
        !key.includes("_score")
      ) {
        const value = data[key as keyof typeof data];
        if (!value) {
          console.log(`Field ${key} is empty`);
          return true;
        }
      }
      return false;
    });

    const hasInvalidCheckboxScore = checkboxScoreValidation.some(
      ({ select, score }) => {
        const isSelected = data[select as keyof typeof data];
        const scoreValue = data[score as keyof typeof data];

        if (isSelected && !scoreValue) {
          console.log(`${select} is checked but ${score} is empty`);
          return true;
        }
        return false;
      }
    );

    if (hasEmptyField || hasInvalidCheckboxScore) {
      console.log("Form validation failed");
      return false;
    } else {
      console.log("All fields are valid");
      return true;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12 ">
      <div className="sm:col-span-12 ">
        <div className="">
          <p className="text-sm mb-2">
กรณีแหล่งฝึกงานได้มอบหมายกิจกรรมให้นักศึกษาทำในช่วงฝึกงาน ขอความกรุณาอาจารย์ประจำ
แหล่งฝึกช่วยระบุกิจกรรมที่มอบหมาย และประเมินผลการปฏิบัติงานของนักศึกษาตามกิจกรรมนั้นๆ ซึ่ง
รูปแบบการประเมินขึ้นอยู่กับกิจกรรมที่ได้มอบหมายให้นักศึกษาทำ       </p> </div>
      </div>
      <div className="sm:col-span-12 ">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th
                className="p-2 border text-left text-sm"
                style={{ width: "10%" }}
              >
                ระดับคะแนนจากคะแนนเต็ม
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
                90% ขึ้นไป
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดีมาก
              </td>
              <td className="p-2 border font-medium align-top text-sm">
            นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถครบถ้วนตาม
วัตถุประสงค์การฝึกปฏิบัติงานฯเป็นที่น่าพอใจ เกิดความบกพร่องน้อย
สามารถปฏิบัติงานได้ด้วยตนเอง อาจได้รับคำแนะนำเป็นครั้งคราว
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                80% ขึ้นไป แต่ไม่ถึง 90%
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดี
              </td>
              <td className="p-2 border font-medium align-top text-sm">
            นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถตามวัตถุประสงค์การฝึก
ปฏิบัติงานฯ มีความบกพร่องในระดับยอมรับได้ สามารถปฏิบัติงานได้
ด้วยตนเอง แต่ต้องได้รับคำแนะนำเป็นครั้งคราว
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                65% แต่ไม่ถึง 80%
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปานกลาง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถตามเกณฑ์วัตถุประสงค์
การฝึก
ปฏิบัติงานฯ มีความบกพร่องในระดับยอมรับได้ ยังคงสามารถ
ปฏิบัติงานได้ แต่ต้องได้รับคำแนะนำเป็นส่วนใหญ่
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                50% แต่ไม่ถึง 65%
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปรับปรุง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่าขาดทักษะ/ความสามารถในระดับไม่น่าเชื่อถือ
เกิดความบกพร่องอยู่เสมอ การปฏิบัติงานอยู่ภายใต้การดูแลจาก
อาจารย์ประจำแหล่งฝึกอย่างใกล้ชิด
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ต่ำกว่า 50%
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ไม่ผ่าน
              </td>
              <td className="p-2 border font-medium align-top text-sm">
              นักศึกษาแสดงให้เห็นว่าขาดทักษะ/ความสามารถ ไม่ผ่านตาม
วัตถุประสงค์การฝึกปฏิบัติงานฯ ไม่สามารถปฏิบัติงานได้ เกิดความ
ผิดพลาดซ้ำ และไม่ปรับปรุงตามคำแนะนำของอาจารย์แหล่งฝึก
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบประเมินงานมอบหมาย</p>
      </div>

      <div className="sm:col-span-12">
      
      </div>
      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
              <th className="p-2 border text-center text-sm">วันที่</th>
              <th
                className="p-2 border text-center text-sm"
                style={{ width: "50%" }}
              >
                กิจกรรมที่มอบหมายให้นักศึกษา
              </th>
              <th
                className="p-2 border text-center text-sm"
                style={{ width: "15%" }}
              >
                คะแนนเต็ม
              </th>
              <th
                className="p-2 border text-center text-sm"
                style={{ width: "15%" }}
              >
                คะแนนที่ได้
              </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, i) => (
                <tr key={i + 1}>
                  <td className="p-2 border text-center">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full text-sm"
                      placeholder="วันที่"
                      value={data[`p4_date_${i + 1}`] || ""}
                      onChange={(e) => setDataValue(`p4_date_${i + 1}`, e.target.value)}
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full text-sm"
                      placeholder="กิจกรรม"
                      value={data[`p4_activity_${i + 1}`] || ""}
                      onChange={(e) => setDataValue(`p4_activity_${i + 1}`, e.target.value)}
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full text-sm"
                      placeholder="คะแนนเต็ม"
                      value={data[`p4_fullscore_${i + 1}`] || ""}
                      onChange={(e) => setDataValue(`p4_fullscore_${i + 1}`, e.target.value)}
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full text-sm"
                      placeholder="คะแนนที่ได้"
                      value={data[`p4_score_${i + 1}`] || ""}
                      onChange={(e) => setDataValue(`p4_score_${i + 1}`, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
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
