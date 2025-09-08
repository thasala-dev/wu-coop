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

const scoreLabels = [
  { label: "5", value: "5" },
  { label: "4", value: "4" },
  { label: "3", value: "3" },
  { label: "2", value: "2" },
  { label: "1", value: "1" },
];

const dosageLabels = [
  { label: "ไม่มีการฝึก", value: "0" },
  { label: "1 dosage form", value: "1" },
  { label: "2-3 dosage forms", value: "2-3" },
  { label: ">3 dosage forms", value: ">3" },
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
  { select: "p1_3_select", score: "p1_3_score" },
  { select: "p1_4_select", score: "p1_4_score" },
  { select: "p1_5_select", score: "p1_5_score" },
  { select: "p1_6_select", score: "p1_6_score" },
  { select: "p1_7_select", score: "p1_7_score" },
  { select: "p1_8_select", score: "p1_8_score" },
  { select: "p1_9_select", score: "p1_9_score" },
  { select: "p1_10_select", score: "p1_10_score" },
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
  { select: "p4_1_select", score: "p4_1_score" },
  { select: "p4_2_select", score: "p4_2_score" },
  { select: "p4_3_select", score: "p4_3_score" },
  { select: "p4_4_select", score: "p4_4_score" },
  { select: "p4_5_select", score: "p4_5_score" },
  { select: "p4_6_select", score: "p4_6_score" },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState<any>({
    percentageDevelopment:
      parentForm.getValues("result.percentageDevelopment") || "",
    percentageProduction:
      parentForm.getValues("result.percentageProduction") || "",
    percentageQc: parentForm.getValues("result.percentageQc") || "",
    percentageRegistration:
      parentForm.getValues("result.percentageRegistration") || "",
    percentageOther: parentForm.getValues("result.percentageOther") || "",
    otherDepartment: parentForm.getValues("result.otherDepartment") || "",

    p1_day: parentForm.getValues("result.p1_day") || "",
    p1_note: parentForm.getValues("result.p1_note") || "",

    p1_1_select: parentForm.getValues("result.p1_1_select") || false,
    p1_1_activity: parentForm.getValues("result.p1_1_activity") || "",
    p1_1_score: parentForm.getValues("result.p1_1_score") || "",
    p1_2_select: parentForm.getValues("result.p1_2_select") || false,
    p1_2_activity: parentForm.getValues("result.p1_2_activity") || "",
    p1_2_score: parentForm.getValues("result.p1_2_score") || "",
    p1_3_select: parentForm.getValues("result.p1_3_select") || false,
    p1_3_activity: parentForm.getValues("result.p1_3_activity") || "",
    p1_3_score: parentForm.getValues("result.p1_3_score") || "",
    p1_4_select: parentForm.getValues("result.p1_4_select") || false,
    p1_4_activity: parentForm.getValues("result.p1_4_activity") || "",
    p1_4_score: parentForm.getValues("result.p1_4_score") || "",
    p1_5_select: parentForm.getValues("result.p1_5_select") || false,
    p1_5_activity: parentForm.getValues("result.p1_5_activity") || "",
    p1_5_score: parentForm.getValues("result.p1_5_score") || "",
    p1_6_select: parentForm.getValues("result.p1_6_select") || false,
    p1_6_activity: parentForm.getValues("result.p1_6_activity") || "",
    p1_6_score: parentForm.getValues("result.p1_6_score") || "",
    p1_7_select: parentForm.getValues("result.p1_7_select") || false,
    p1_7_activity: parentForm.getValues("result.p1_7_activity") || "",
    p1_7_score: parentForm.getValues("result.p1_7_score") || "",
    p1_8_select: parentForm.getValues("result.p1_8_select") || false,
    p1_8_activity: parentForm.getValues("result.p1_8_activity") || "",
    p1_8_score: parentForm.getValues("result.p1_8_score") || "",
    p1_9_select: parentForm.getValues("result.p1_9_select") || false,
    p1_9_activity: parentForm.getValues("result.p1_9_activity") || "",
    p1_9_score: parentForm.getValues("result.p1_9_score") || "",
    p1_10_select: parentForm.getValues("result.p1_10_select") || false,
    p1_10_activity: parentForm.getValues("result.p1_10_activity") || "",
    p1_10_score: parentForm.getValues("result.p1_10_score") || "",

    p2_day: parentForm.getValues("result.p2_day") || "",
    p2_note: parentForm.getValues("result.p2_note") || "",

    p2_1_select: parentForm.getValues("result.p2_1_select") || false,
    p2_1_activity: parentForm.getValues("result.p2_1_activity") || "",
    p2_1_score: parentForm.getValues("result.p2_1_score") || "",
    p2_2_select: parentForm.getValues("result.p2_2_select") || false,
    p2_2_activity: parentForm.getValues("result.p2_2_activity") || "",
    p2_2_score: parentForm.getValues("result.p2_2_score") || "",
    p2_3_select: parentForm.getValues("result.p2_3_select") || false,
    p2_3_activity: parentForm.getValues("result.p2_3_activity") || "",
    p2_3_score: parentForm.getValues("result.p2_3_score") || "",
    p2_4_select: parentForm.getValues("result.p2_4_select") || false,
    p2_4_activity: parentForm.getValues("result.p2_4_activity") || "",
    p2_4_score: parentForm.getValues("result.p2_4_score") || "",
    p2_5_select: parentForm.getValues("result.p2_5_select") || false,
    p2_5_activity: parentForm.getValues("result.p2_5_activity") || "",
    p2_5_score: parentForm.getValues("result.p2_5_score") || "",
    p2_6_select: parentForm.getValues("result.p2_6_select") || false,
    p2_6_activity: parentForm.getValues("result.p2_6_activity") || "",
    p2_6_score: parentForm.getValues("result.p2_6_score") || "",
    p2_7_select: parentForm.getValues("result.p2_7_select") || false,
    p2_7_activity: parentForm.getValues("result.p2_7_activity") || "",
    p2_7_score: parentForm.getValues("result.p2_7_score") || "",

    p3_day: parentForm.getValues("result.p3_day") || "",
    p3_note: parentForm.getValues("result.p3_note") || "",

    p3_1_select: parentForm.getValues("result.p3_1_select") || false,
    p3_1_activity: parentForm.getValues("result.p3_1_activity") || "",
    p3_1_score: parentForm.getValues("result.p3_1_score") || "",
    p3_2_select: parentForm.getValues("result.p3_2_select") || false,
    p3_2_activity: parentForm.getValues("result.p3_2_activity") || "",
    p3_2_score: parentForm.getValues("result.p3_2_score") || "",
    p3_3_select: parentForm.getValues("result.p3_3_select") || false,
    p3_3_activity: parentForm.getValues("result.p3_3_activity") || "",
    p3_3_score: parentForm.getValues("result.p3_3_score") || "",
    p3_4_select: parentForm.getValues("result.p3_4_select") || false,
    p3_4_activity: parentForm.getValues("result.p3_4_activity") || "",
    p3_4_score: parentForm.getValues("result.p3_4_score") || "",
    p3_5_select: parentForm.getValues("result.p3_5_select") || false,
    p3_5_activity: parentForm.getValues("result.p3_5_activity") || "",
    p3_5_score: parentForm.getValues("result.p3_5_score") || "",

    p4_day: parentForm.getValues("result.p4_day") || "",
    p4_note: parentForm.getValues("result.p4_note") || "",

    p4_1_select: parentForm.getValues("result.p4_1_select") || false,
    p4_1_activity: parentForm.getValues("result.p4_1_activity") || "",
    p4_1_score: parentForm.getValues("result.p4_1_score") || "",
    p4_2_select: parentForm.getValues("result.p4_2_select") || false,
    p4_2_activity: parentForm.getValues("result.p4_2_activity") || "",
    p4_2_score: parentForm.getValues("result.p4_2_score") || "",
    p4_3_select: parentForm.getValues("result.p4_3_select") || false,
    p4_3_activity: parentForm.getValues("result.p4_3_activity") || "",
    p4_3_score: parentForm.getValues("result.p4_3_score") || "",
    p4_4_select: parentForm.getValues("result.p4_4_select") || false,
    p4_4_activity: parentForm.getValues("result.p4_4_activity") || "",
    p4_4_score: parentForm.getValues("result.p4_4_score") || "",
    p4_5_select: parentForm.getValues("result.p4_5_select") || false,
    p4_5_activity: parentForm.getValues("result.p4_5_activity") || "",
    p4_5_score: parentForm.getValues("result.p4_5_score") || "",
    p4_6_select: parentForm.getValues("result.p4_6_select") || false,
    p4_6_activity: parentForm.getValues("result.p4_6_activity") || "",
    p4_6_score: parentForm.getValues("result.p4_6_score") || "",

    p5_title: parentForm.getValues("result.p5_title") || "",
    p5_day: parentForm.getValues("result.p5_day") || "",
    p5_note: parentForm.getValues("result.p5_note") || "",
    p5_score: parentForm.getValues("result.p5_score") || "",

    suggestion: parentForm.getValues("result.suggestion") || "",
  });

  useEffect(() => {
    console.log("handleCheckValid():", handleCheckValid());

    setFormValidated(handleCheckValid());
  }, [isSubmit, isClick]);

  const setDataValue = (key: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    parentForm.setValue(`result.${key}`, value);
  };

  const setCheckboxValue = (key: string, checked: boolean) => {
    setData((prev: any) => ({
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
            การประเมินแบ่งออกเป็น 2 ส่วน ได้แก่
            การประเมินผลเชิงปริมาณและการประเมินผลสัมฤทธิ์ของการฝึกปฏิบัติงาน
            โดยทั้ง 2 ส่วนประกอบด้วยจุดมุ่งหมายหลัก 5 ข้อ
            นักศึกษาควรได้รับการฝึกปฏิบัติงานจนครบทั้ง 5 จุดมุ่งหมายหลัก
            แต่ละจุดมุ่งหมายหลักมีวัตถุประสงค์เชิงพฤติกรรมหลายส่วน
            ซึ่งอาจไม่จำเป็นต้องฝึกปฏิบัติงานจนครบทุกวัตถุประสงค์
            ทั้งนี้ขึ้นกับความพร้อมและบริบทของแต่ละแหล่งฝึก
          </p>
          <p className="text-sm mb-2">
            การประเมินผลเชิงปริมาณนั้น
            อาจารย์ประจำแหล่งฝึกสามารถกำหนดหัวข้อและกรอบการฝึกปฏิบัติงานได้ตามความเหมาะสม
            โดยอ้างอิงจากข้อมูลในแต่ละวัตถุประสงค์เชิงพฤติกรรม
            หากกิจกรรมใดมีการฝึกปฏิบัติ ขอให้ระบุจำนวนกิจกรรมที่เกิดขึ้น
            พร้อมทั้งบันทึกชื่อของกิจกรรมที่ได้ฝึกปฏิบัติไว้ในช่องหมายเหตุด้วย
          </p>
          <p className="text-sm mb-2">
            สำหรับการประเมินผลสัมฤทธิ์นั้น
            อาจารย์ประจำแหล่งฝึกสามารถทำได้จากการสังเกต การสอบถาม การอภิปราย
            รวมไปถึงผลของการฝึกปฏิบัติงาน โดยมีแนวทางในการให้คะแนนดังนี้
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 ">
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
                นักศึกษาแสดงให้เห็นว่ามีความรู้ ความเข้าใจ
                และทักษะครบถ้วนตามวัตถุประสงค์เชิงพฤติกรรมการฝึกปฏิบัติงาน
                เกิดความบกพร่องน้อย สามารถปฏิบัติงานได้ด้วยตนเอง
                โดยอาจได้รับคำแนะนำเป็นครั้งคราว
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
                นักศึกษาแสดงให้เห็นว่ามีความรู้ ความเข้าใจ
                และทักษะครบถ้วนตามวัตถุประสงค์เชิงพฤติกรรมการฝึกปฏิบัติงาน
                มีความบกพร่องในระดับยอมรับได้ สามารถปฏิบัติงานได้
                แต่ต้องได้รับคำแนะนำเป็นครั้งคราว
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
                นักศึกษาแสดงให้เห็นว่ามีความรู้ ความเข้าใจ
                และทักษะครบถ้วนตามวัตถุประสงค์เชิงพฤติกรรมการฝึกปฏิบัติงาน
                มีความบกพร่องในระดับยอมรับได้ สามารถปฏิบัติงานได้
                แต่ต้องได้รับคำแนะนำเป็นส่วนใหญ่
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
                นักศึกษาแสดงให้เห็นว่าขาดความรู้ ความเข้าใจ และทักษะ
                เกิดความผิดพลาดอยู่เสมอ
                ต้องฝึกปฏิบัติงานภายใต้การดูแลของอาจารย์ประจำแหล่งฝึกอย่างใกล้ชิด
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
                นักศึกษาแสดงให้เห็นว่าขาดความรู้ ความเข้าใจ และทักษะ
                ไม่สามารถปฏิบัติงานได้ตามวัตถุประสงค์เชิงพฤติกรรมที่กำหนด
                เกิดความผิดพลาดซ้ำและไม่แก้ไขตามคำแนะนำของอาจารย์ประจำแหล่งฝึก
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบฟอร์มการประเมิน</p>
      </div>

      <div className="sm:col-span-12">
        <table>
          <tbody>
            <tr>
              <td colSpan={2} className="text-sm">
                สัดส่วนงานที่ให้นักศึกษาได้ฝึกปฏิบัติจริง
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">ด้านงานวิจัยและพัฒนา</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentageDevelopment}
                  onChange={(value) =>
                    setDataValue("percentageDevelopment", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentageDevelopment &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">ด้านการผลิต</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentageProduction}
                  onChange={(value) =>
                    setDataValue("percentageProduction", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentageProduction &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">ด้านควบคุมคุณภาพ</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentageQc}
                  onChange={(value) =>
                    setDataValue("percentageQc", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentageQc &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">ด้านควบคุมคุณภาพ</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentageRegistration}
                  onChange={(value) =>
                    setDataValue("percentageRegistration", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentageRegistration &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">
                <div className="flex flex-row items-center gap-4 w-full">
                  <div>ด้านอื่นๆ (โปรดระบุ)</div>
                  <input
                    type="text"
                    value={data.otherDepartment}
                    onChange={(value) =>
                      setDataValue("otherDepartment", value.target.value)
                    }
                    className="p-1 border rounded-md text-sm w-[150px]"
                  />
                </div>
              </td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentageOther}
                  onChange={(value) =>
                    setDataValue("percentageOther", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentageOther &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">รวม</td>
              <td>
                <div className="flex flex-row items-center gap-2 w-full">
                  <span className="w-[150px] text-center">
                    {Number(data.percentageProduction) +
                      Number(data.percentageDevelopment) +
                      Number(data.percentageQc) +
                      Number(data.percentageRegistration) +
                      Number(data.percentageOther)}
                  </span>
                  <span>%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border text-center text-sm">จุดมุ่งหมาย</th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  ระยะเวลา (วัน)
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "25%" }}
                >
                  วัตถุประสงค์เชิงพฤติกรรมที่มีการฝึกปฏิบัติ
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  ปริมาณงาน
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  ระดับของการบรรลุวัตถุประสงค์
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  หมายเหตุ
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "p1_1",
                  description:
                    "อธิบายทฤษฎีและหลักการพื้นฐานที่เกี่ยวข้องกับระเบียบวิธีวิจัย (research methodology) เช่น การตั้งคำถามการวิจัย การทบทวนและประเมินวรรณกรรม รูปแบบการทำวิจัย การออกแบบการวิจัยอย่างเป็นระบบ ขั้นตอนการทำวิจัย การประมวลและวิเคราะห์ผล รวมถึงการประยุกต์ใช้สถิติต่าง ๆ ที่เกี่ยวข้องกับการวิจัย",
                },
                {
                  label: "p1_2",
                  description:
                    "ยกตัวอย่างแหล่งข้อมูล (sources) ที่จำเป็นต่อการวิจัยและพัฒนา ทั้งข้อมูลปฐมภูมิ (primary sources) ทุติยภูมิ (secondary sources) และตติยภูมิ (tertiary sources)",
                },
                {
                  label: "p1_3",
                  description:
                    "สืบค้นข้อมูลที่จำเป็นต่อการทำวิจัย จากฐานข้อมูลวารสารฐานข้อมูลสิทธิบัตรไทยและสิทธิบัตรต่างประเทศ ฐานข้อมูลสมุนไพร รวมถึงแหล่งความรู้อื่นที่เกี่ยวข้อง",
                },
                {
                  label: "p1_4",
                  description:
                    "ประเมินความน่าเชื่อถือของแหล่งข้อมูลต่าง ๆ เพื่อประโยชน์ในการทำวิจัยและพัฒนาตำรับยา รวมถึงสามารถวิเคราะห์ ประมวลผลข้อมูลที่ได้ และนำเสนอในรูปแบบที่เหมาะสม",
                },
                {
                  label: "p1_5",
                  description:
                    "ปฏิบัติตนตามจรรยาบรรณของนักวิจัย ตามแนวทางที่กำหนดโดยสภาวิจัยแห่งชาติ รวมถึงจริยธรรมจรรยาบรรณอื่นที่เกี่ยวข้อง เช่น จรรยาบรรณการใช้สัตว์ทดลอง จริยธรรมการวิจัยยาในมนุษย์ เป็นต้น",
                },
                {
                  label: "p1_6",
                  description:
                    "อธิบายความรู้พื้นฐานที่เกี่ยวข้องกับการพัฒนาผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพรูปแบบต่าง ๆ เช่น คำจำกัดความ องค์ประกอบ หลักการและกระบวนการเตรียม การคำนวณที่เกี่ยวข้องกับการตั้งตำรับ รวมถึงการประเมินผลที่เกี่ยวข้อง",
                },
                {
                  label: "p1_7",
                  description:
                    "สืบค้นและทดลองเพื่อหาข้อมูลการศึกษาก่อนการตั้งตำรับ (pre-formulation study) ของส่วนประกอบในตำรับ ทั้งคุณสมบัติทางเคมีฟิสิกส์และคุณสมบัติอื่นที่เกี่ยวข้อง",
                },
                {
                  label: "p1_8",
                  description:
                    "วิเคราะห์ปัญหาและหาแนวทางในการตั้งตำรับผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพให้อยู่ในรูปแบบที่ต้องการ โดยอาศัยข้อมูลจากทฤษฎีพื้นฐานและการศึกษาก่อนการตั้งตำรับ เพื่อให้ได้ผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพที่น่าใช้ มีประสิทธิผล มีความปลอดภัย และมีความคงสภาพ",
                },
                {
                  label: "p1_9",
                  description:
                    "อธิบายความหมาย ความสำคัญ หน้าที่ของสารช่วย (excipients) ตลอดจนสามารถเลือกชนิดและกำหนดปริมาณสารช่วยที่เหมาะสม",
                },
                {
                  label: "p1_10",
                  description:
                    "อธิบายหลักเกณฑ์และขั้นตอนการศึกษาความคงสภาพของผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ การกำหนดวันสิ้นอายุของผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพได้",
                },
              ].map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={10}>
                      1. ทักษะการวิจัย กระบวนการวิจัย การสืบค้นข้อมูล
                      และการเผยแพร่ข้อมูล
                      รวมถึงความเข้าใจและการปฏิบัติตามหลักจริยธรรม
                      จรรยาบรรณของนักวิจัยที่ดี
                      ตลอดจนสามารถประยุกต์หลักวิทยาศาสตร์ในการวิจัยและพัฒนาผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ
                    </td>
                  )}
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={10}>
                      <input
                        type="number"
                        value={data.p1_day}
                        onChange={(value) =>
                          setDataValue("p1_day", value.target.value)
                        }
                        className={
                          "p-1 border rounded-md text-sm w-full text-center " +
                          (isSubmit &&
                            !data.p1_day &&
                            " border-2 border-red-600")
                        }
                      />
                    </td>
                  )}
                  <td className="p-2 border align-top text-sm">
                    <div className="flex flex-row items-start gap-2">
                      <input
                        type="checkbox"
                        checked={data[`${item.label}_select`]}
                        onChange={(e) =>
                          setCheckboxValue(
                            `${item.label}_select`,
                            e.target.checked
                          )
                        }
                        className="mt-1"
                      />
                      <span>{item.description}</span>
                    </div>
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_activity`]}
                      label={`${item.label}_activity`}
                      list={activityLabels}
                      rows={true}
                      isRequired={true}
                    />
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_score`]}
                      label={`${item.label}_score`}
                      list={scoreLabels}
                      isRequired={data[`${item.label}_select`]}
                    />
                  </td>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={10}>
                      <Textarea
                        className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                        onChange={(e) => {
                          setDataValue("p1_note", e.target.value);
                        }}
                        rows={3 * 2}
                        value={data.p1_note}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>

            <tbody>
              {[
                {
                  label: "p2_1",
                  description:
                    "มีทักษะในการผลิตและควบคุมกระบวนการผลิตผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพรูปแบบต่าง ๆ อย่างน้อยหนึ่งรูปแบบ สามารถกำหนดลำดับขั้นตอน เลือกเครื่องมือที่ใช้ และหาสภาวะที่เหมาะสมของแต่ละกระบวนการผลิตได้",
                },
                {
                  label: "p2_2",
                  description:
                    "เรียนรู้เครื่องจักรต่าง ๆ ในกระบวนการผลิต มีทักษะในการควบคุมเครื่องจักร หรืออุปกรณ์ต่าง ๆ ที่ใช้ในการผลิต ตลอดจนสามารถแก้ไขปัญหาที่เกิดขึ้นอย่างง่ายได้",
                },
                {
                  label: "p2_3",
                  description:
                    "อธิบายขั้นตอนและเครื่องมือที่ใช้ในกระบวนการผลิตผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพแต่ละรูปแบบได้ มีความเข้าใจทฤษฎีพื้นฐานและเครื่องมือในหน่วยการผลิต รวมถึงการตรวจรับรองและการตรวจสอบความถูกต้อง (Qualification & Validation) เป็นต้น",
                },
                {
                  label: "p2_4",
                  description:
                    "อธิบายระบบภาชนะบรรจุและการปิด (container and closure system) และสามารถเลือกให้เหมาะสมกับผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพแต่ละรูปแบบและแต่ละชนิดได้",
                },
                {
                  label: "p2_5",
                  description:
                    "อธิบายหลักการทำงานของเครื่องจักรอุปกรณ์ต่าง ๆ ในแต่ละหน่วยการผลิต ตลอดจนสิ่งอำนวยความสะดวกในการผลิต การทำความสะอาด การซ่อมแซมและบำรุงรักษา รวมถึงการตรวจสอบความถูกต้องของกระบวนการ (process validation)",
                },
                {
                  label: "p2_6",
                  description:
                    "อธิบายวิธีการตรวจรับรอง (qualification) เครื่องจักรการผลิต และการสอบเทียบ (calibration) เครื่องมือวัดที่ใช้ในการผลิต",
                },
                {
                  label: "p2_7",
                  description:
                    "อธิบายกระบวนการฝึกอบรมพนักงานฝ่ายผลิต รวมทั้งหลักปฏิบัติเกี่ยวกับสุขอนามัยและความปลอดภัยในการปฏิบัติงาน",
                },
              ].map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={7}>
                      2.
                      เทคโนโลยีการผลิตผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพระดับอุตสาหกรรม
                      การบริหารปัจจัยการผลิตและสิ่งอำนวยความสะดวกต่าง ๆ
                      รวมทั้งอาคารสถานที่และสิ่งแวดล้อม
                    </td>
                  )}
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={7}>
                      <input
                        type="number"
                        value={data.p2_day}
                        onChange={(value) =>
                          setDataValue("p2_day", value.target.value)
                        }
                        className={
                          "p-1 border rounded-md text-sm w-full text-center " +
                          (isSubmit &&
                            !data.p2_day &&
                            " border-2 border-red-600")
                        }
                      />
                    </td>
                  )}
                  <td className="p-2 border align-top text-sm">
                    <div className="flex flex-row items-start gap-2">
                      <input
                        type="checkbox"
                        checked={data[`${item.label}_select`]}
                        onChange={(e) =>
                          setCheckboxValue(
                            `${item.label}_select`,
                            e.target.checked
                          )
                        }
                        className="mt-1"
                      />
                      <span>{item.description}</span>
                    </div>
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_activity`]}
                      label={`${item.label}_activity`}
                      list={activityLabels}
                      rows={true}
                      isRequired={true}
                    />
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_score`]}
                      label={`${item.label}_score`}
                      list={scoreLabels}
                      isRequired={data[`${item.label}_select`]}
                    />
                  </td>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={7}>
                      <Textarea
                        className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                        onChange={(e) => {
                          setDataValue("p2_note", e.target.value);
                        }}
                        rows={3 * 2}
                        value={data.p2_note}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>

            <tbody>
              {[
                {
                  label: "p3_1",
                  description:
                    "ระบุและสืบค้นข้อมูลที่ต้องการจากตำราสมุนไพรต่าง ๆ ที่ทางการรับรอง เช่น Thai Herbal Pharmacopoeia (THP)",
                },
                {
                  label: "p3_2",
                  description:
                    "อธิบายหลักการทางสถิติ และเลือกสถิติที่ใช้ในการควบคุมคุณภาพได้",
                },
                {
                  label: "p3_3",
                  description:
                    "อธิบายหลักการ และเลือกเครื่องมือที่ใช้ในการวิเคราะห์และการทดสอบต่าง ๆ ที่สำคัญได้",
                },
                {
                  label: "p3_4",
                  description:
                    "วิเคราะห์เชิงคุณภาพและเชิงปริมาณที่สำคัญในตำรายา ทั้งทางเคมี กายภาพ และชีวภาพได้",
                },
                {
                  label: "p3_5",
                  description:
                    "อธิบายหลักการพัฒนาวิธีวิเคราะห์ รวมถึงการตรวจสอบความถูกต้องของวิธีวิเคราะห์ และความสอดคล้องกับข้อกำหนด",
                },
              ].map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={5}>
                      3. การควบคุมคุณภาพวัตถุดิบและผลิตภัณฑ์สำเร็จรูป
                      วิธีวิเคราะห์ การตรวจสอบคุณภาพ
                      และเครื่องมือที่ใช้ในการตรวจสอบคุณภาพ
                    </td>
                  )}
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={5}>
                      <input
                        type="number"
                        value={data.p3_day}
                        onChange={(value) =>
                          setDataValue("p3_day", value.target.value)
                        }
                        className={
                          "p-1 border rounded-md text-sm w-full text-center " +
                          (isSubmit &&
                            !data.p3_day &&
                            " border-2 border-red-600")
                        }
                      />
                    </td>
                  )}
                  <td className="p-2 border align-top text-sm">
                    <div className="flex flex-row items-start gap-2">
                      <input
                        type="checkbox"
                        checked={data[`${item.label}_select`]}
                        onChange={(e) =>
                          setCheckboxValue(
                            `${item.label}_select`,
                            e.target.checked
                          )
                        }
                        className="mt-1"
                      />
                      <span>{item.description}</span>
                    </div>
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_activity`]}
                      label={`${item.label}_activity`}
                      list={activityLabels}
                      rows={true}
                      isRequired={true}
                    />
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_score`]}
                      label={`${item.label}_score`}
                      list={scoreLabels}
                      isRequired={data[`${item.label}_select`]}
                    />
                  </td>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={5}>
                      <Textarea
                        className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                        onChange={(e) => {
                          setDataValue("p3_note", e.target.value);
                        }}
                        rows={3 * 2}
                        value={data.p3_note}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>

            <tbody>
              {[
                {
                  label: "p4_1",
                  description:
                    "อธิบายสาระสำคัญของกฎ ระเบียบ หรือข้อบังคับที่เกี่ยวกับผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ เช่น พระราชบัญญัติ กฎกระทรวง ประกาศ คำสั่ง ระเบียบที่เกี่ยวข้องกับผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ",
                },
                {
                  label: "p4_2",
                  description:
                    "อธิบายหลักเกณฑ์ในการขึ้นทะเบียนผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพภายในประเทศ",
                },
                {
                  label: "p4_3",
                  description:
                    "อธิบายขั้นตอนการขึ้นทะเบียน และการแก้ไขเปลี่ยนแปลงทะเบียนผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ",
                },
                {
                  label: "p4_4",
                  description:
                    "อธิบายการจัดหมวดหมู่เอกสารตามข้อกำหนดของสำนักงานคณะกรรมการอาหารและยา รวมทั้งแบบคำขอและการยื่นแบบคำขอต่าง ๆ ได้",
                },
                {
                  label: "p4_5",
                  description:
                    "ค้นคว้าข้อมูลจากแหล่งข้อมูลต่าง ๆ เพื่อประมวลข้อมูลด้านความปลอดภัย ประสิทธิผล และคุณภาพของผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ สำหรับการขึ้นทะเบียนผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ",
                },
                {
                  label: "p4_6",
                  description:
                    "จัดเตรียมเอกสารเพื่อขอขึ้นทะเบียนผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพตามข้อกำหนดของสำนักงานคณะกรรมการอาหารและยา",
                },
              ].map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={6}>
                      4. กระบวนการขึ้นทะเบียนผลิตภัณฑ์สมุนไพรและผลิตภัณฑ์สุขภาพ
                    </td>
                  )}
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={6}>
                      <input
                        type="number"
                        value={data.p4_day}
                        onChange={(value) =>
                          setDataValue("p4_day", value.target.value)
                        }
                        className={
                          "p-1 border rounded-md text-sm w-full text-center " +
                          (isSubmit &&
                            !data.p4_day &&
                            " border-2 border-red-600")
                        }
                      />
                    </td>
                  )}
                  <td className="p-2 border align-top text-sm">
                    <div className="flex flex-row items-start gap-2">
                      <input
                        type="checkbox"
                        checked={data[`${item.label}_select`]}
                        onChange={(e) =>
                          setCheckboxValue(
                            `${item.label}_select`,
                            e.target.checked
                          )
                        }
                        className="mt-1"
                      />
                      <span>{item.description}</span>
                    </div>
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_activity`]}
                      label={`${item.label}_activity`}
                      list={activityLabels}
                      rows={true}
                      isRequired={true}
                    />
                  </td>
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_score`]}
                      label={`${item.label}_score`}
                      list={scoreLabels}
                      isRequired={data[`${item.label}_select`]}
                    />
                  </td>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={6}>
                      <Textarea
                        className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                        onChange={(e) => {
                          setDataValue("p4_note", e.target.value);
                        }}
                        rows={3 * 2}
                        value={data.p4_note}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>

            <tbody>
              <tr>
                <td className="p-2 border align-top text-sm">
                  <p>5. อื่นๆ (โปรดระบุ)</p>
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => {
                      setDataValue("p5_title", e.target.value);
                    }}
                    rows={3 * 1}
                    value={data.p5_title}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <input
                    type="number"
                    value={data.p5_day}
                    onChange={(value) =>
                      setDataValue("p5_day", value.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit && !data.p5_day && " border-2 border-red-600")
                    }
                  />
                </td>
                <td className="p-2 border align-top text-sm"></td>
                <td className="p-2 border align-top text-sm"></td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p5_score}
                    label="p5_score"
                    list={scoreLabels}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => {
                      setDataValue("p5_note", e.target.value);
                    }}
                    rows={3 * 1}
                    value={data.p5_note}
                  />
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
