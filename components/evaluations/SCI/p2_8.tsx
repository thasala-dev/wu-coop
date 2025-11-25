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

  { select: "p2_1_select", score: "p2_1_score" },
  { select: "p2_2_select", score: "p2_2_score" },
  { select: "p2_3_select", score: "p2_3_score" },
  { select: "p2_4_select", score: "p2_4_score" },
  { select: "p2_5_select", score: "p2_5_score" },

  { select: "p3_1_select", score: "p3_1_score" },
  { select: "p3_2_select", score: "p3_2_score" },
  { select: "p3_3_select", score: "p3_3_score" },
  { select: "p3_4_select", score: "p3_4_score" },
  { select: "p3_5_select", score: "p3_5_score" },
  { select: "p3_6_select", score: "p3_6_score" },
  { select: "p3_7_select", score: "p3_7_score" },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState<any>({
    percentageQc: parentForm.getValues("result.percentageQc") || "",
    percentageQa: parentForm.getValues("result.percentageQa") || "",
    percentageOther: parentForm.getValues("result.percentageOther") || "",
    otherDepartment: parentForm.getValues("result.otherDepartment") || "",

    p1_day: parentForm.getValues("result.p1_day") || "",
    p1_activity: parentForm.getValues("result.p1_activity") || "",
    p1_work: parentForm.getValues("result.p1_work") || "",
    p1_note: parentForm.getValues("result.p1_note") || "",

    p1_1_select: parentForm.getValues("result.p1_1_select") || false,
    p1_1_score: parentForm.getValues("result.p1_1_score") || "",
    p1_2_select: parentForm.getValues("result.p1_2_select") || false,
    p1_2_score: parentForm.getValues("result.p1_2_score") || "",
    p1_3_select: parentForm.getValues("result.p1_3_select") || false,
    p1_3_score: parentForm.getValues("result.p1_3_score") || "",
    p1_4_select: parentForm.getValues("result.p1_4_select") || false,
    p1_4_score: parentForm.getValues("result.p1_4_score") || "",

    p2_day: parentForm.getValues("result.p2_day") || "",
    p2_activity: parentForm.getValues("result.p2_activity") || "",
    p2_work: parentForm.getValues("result.p2_work") || "",
    p2_note: parentForm.getValues("result.p2_note") || "",

    p2_1_select: parentForm.getValues("result.p2_1_select") || false,
    p2_1_score: parentForm.getValues("result.p2_1_score") || "",
    p2_2_select: parentForm.getValues("result.p2_2_select") || false,
    p2_2_score: parentForm.getValues("result.p2_2_score") || "",
    p2_3_select: parentForm.getValues("result.p2_3_select") || false,
    p2_3_score: parentForm.getValues("result.p2_3_score") || "",
    p2_4_select: parentForm.getValues("result.p2_4_select") || false,
    p2_4_score: parentForm.getValues("result.p2_4_score") || "",
    p2_5_select: parentForm.getValues("result.p2_5_select") || false,
    p2_5_score: parentForm.getValues("result.p2_5_score") || "",

    p3_day: parentForm.getValues("result.p3_day") || "",
    p3_activity: parentForm.getValues("result.p3_activity") || "",
    p3_work: parentForm.getValues("result.p3_work") || "",
    p3_note: parentForm.getValues("result.p3_note") || "",

    p3_1_select: parentForm.getValues("result.p3_1_select") || false,
    p3_1_score: parentForm.getValues("result.p3_1_score") || "",
    p3_2_select: parentForm.getValues("result.p3_2_select") || false,
    p3_2_score: parentForm.getValues("result.p3_2_score") || "",
    p3_3_select: parentForm.getValues("result.p3_3_select") || false,
    p3_3_score: parentForm.getValues("result.p3_3_score") || "",
    p3_4_select: parentForm.getValues("result.p3_4_select") || false,
    p3_4_score: parentForm.getValues("result.p3_4_score") || "",
    p3_5_select: parentForm.getValues("result.p3_5_select") || false,
    p3_5_score: parentForm.getValues("result.p3_5_score") || "",
    p3_6_select: parentForm.getValues("result.p3_6_select") || false,
    p3_6_score: parentForm.getValues("result.p3_6_score") || "",
    p3_7_select: parentForm.getValues("result.p3_7_select") || false,
    p3_7_score: parentForm.getValues("result.p3_7_score") || "",

    p4_title: parentForm.getValues("result.p4_title") || "",
    p4_day: parentForm.getValues("result.p4_day") || "",
    p4_note: parentForm.getValues("result.p4_note") || "",
    p4_score: parentForm.getValues("result.p4_score") || "",

    suggestion: parentForm.getValues("result.suggestion") || "",
  });

  useEffect(() => {
    console.log("handleCheckValid():", data);

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
      "p4_title",
      "p4_note",
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
            โดยทั้ง 2 ส่วนประกอบด้วยจุดมุ่งหมายหลัก 3 ข้อ
            นักศึกษาควรได้รับการฝึกปฏิบัติงานจนครบทั้ง 3 จุดมุ่งหมายหลัก
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
              <td className="pl-4 text-sm">ด้านประกันคุณภาพ</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentageQa}
                  onChange={(value) =>
                    setDataValue("percentageQa", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentageQa &&
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
                    {Number(data.percentageQc) +
                      Number(data.percentageQa) +
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
                    "อธิบายหลักการการบริหารคุณภาพ (Quality Management) ต่าง ๆ เพื่อใช้ในการประกันและควบคุมคุณภาพของการผลิตยาและผลิตภัณฑ์สุขภาพ เช่น การบริหารคุณภาพโดยรวม (TQM) ระบบปฏิบัติการแก้ไข/ปฏิบัติการป้องกัน (Corrective Action/Preventive Action System: CAPA) ระบบการบริหารการเปลี่ยนแปลง (Change Management System) และการบริหารความเสี่ยงด้านคุณภาพ (Quality Risk Management)",
                },
                {
                  label: "p1_2",
                  description:
                    "อธิบายหลักการของระบบคุณภาพรูปแบบต่าง ๆ ที่เกี่ยวข้อง ซึ่งมีการนำมาใช้เพื่อบรรลุเป้าประสงค์ในการประกันและควบคุมคุณภาพการผลิตยาและผลิตภัณฑ์สุขภาพ เช่น หลักเกณฑ์และวิธีการที่ดีในการผลิต (GMP) หลักปฏิบัติที่ดีทางห้องปฏิบัติการ (GLP) หลักปฏิบัติที่ดีในการจัดส่ง (GDP) หลักปฏิบัติที่ดีในการจัดเก็บ (GSP) มาตรฐานไอเอสโอ (ISO) ต่าง ๆ ตามมาตรฐานปัจจุบัน",
                },
                {
                  label: "p1_3",
                  description:
                    "อธิบายหลักการและระบุปัจจัยในขั้นตอนการผลิตที่มีผลต่อคุณภาพผลิตภัณฑ์ ได้แก่ การจัดซื้อจัดหา วัตถุดิบและวัสดุบรรจุ เทคนิคของกระบวนการที่สำคัญและพารามิเตอร์สำคัญที่ต้องควบคุมในการผลิต ปัจจัยที่มีผลต่อความสม่ำเสมอของตัวยาสำคัญ ความคงสภาพทางเคมี กายภาพ และชีวภาพ การควบคุมและตรวจติดตามสภาวะแวดล้อมในการผลิต หลักการของเทคโนโลยีวิเคราะห์ในกระบวนการผลิต (Process Analytical Technology) และกระบวนการปล่อยผ่านรุ่นผลิต (Batch release process) เป็นต้น",
                },
                {
                  label: "p1_4",
                  description:
                    "อธิบายการติดตามหลังการผลิตเพื่อการพัฒนาผลิตภัณฑ์ ได้แก่ การทบทวนคุณภาพผลิตภัณฑ์ (Product Quality Review) และการตรวจสอบตนเอง (Self Inspection)",
                },
              ].map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={4}>
                      1. ความรู้และความเข้าใจเรื่องระบบคุณภาพ
                      รวมถึงหลักเกณฑ์และวิธีการที่ดีต่าง ๆ
                      และมาตรฐานสากลที่เกี่ยวข้องกับการประกันและควบคุมคุณภาพในการผลิตยาและผลิตภัณฑ์สุขภาพ
                    </td>
                  )}
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={4}>
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
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={4}>
                      <div className="flex flex-col gap-6">
                        <ScoreForm
                          value={data.p1_activity}
                          label={`p1_activity`}
                          list={activityLabels}
                          rows={true}
                          isRequired={true}
                        />

                        <ScoreForm
                          value={data.p1_work}
                          label={`p1_work`}
                          list={workLabels}
                          rows={true}
                          isRequired={true}
                        />
                      </div>
                    </td>
                  )}
                  <td className="p-2 border align-top text-sm">
                    <ScoreForm
                      value={data[`${item.label}_score`]}
                      label={`${item.label}_score`}
                      list={scoreLabels}
                      isRequired={data[`${item.label}_select`]}
                    />
                  </td>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={4}>
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
              <tr>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={4}
                >
                  คะแนนเฉลี่ยของจุดมุ่งหมายที่ 1
                </td>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  {(() => {
                    const scores = [
                      data.p1_1_select && data.p1_1_score
                        ? Number(data.p1_1_score)
                        : null,
                      data.p1_2_select && data.p1_2_score
                        ? Number(data.p1_2_score)
                        : null,
                      data.p1_3_select && data.p1_3_score
                        ? Number(data.p1_3_score)
                        : null,
                      data.p1_4_select && data.p1_4_score
                        ? Number(data.p1_4_score)
                        : null,
                    ].filter((s) => s !== null);

                    if (scores.length === 0) return "-";

                    const avg = (
                      scores.reduce((sum, s) => sum + (s || 0), 0) /
                      scores.length
                    ).toFixed(2);
                    return toThaiNumber(Number(avg));
                  })()}
                </td>
                <td className="p-2 border align-center text-sm"></td>
              </tr>
            </tbody>

            <tbody>
              {[
                {
                  label: "p2_1",
                  description:
                    "อธิบายความหมายของการตรวจรับรอง V-Model ของการตรวจรับรอง และความหมายของขั้นตอนต่าง ๆ ของการตรวจรับรอง ได้แก่ การตรวจรับรองการออกแบบ (Design Qualification: DQ) การตรวจรับรองการติดตั้ง (Installation Qualification: IQ) การตรวจรับรองการทำงาน (Operational Qualification: OQ) และการตรวจรับรองสมรรถนะ (Performance Qualification: PQ)",
                },
                {
                  label: "p2_2",
                  description:
                    "อธิบายความหมายของการตรวจสอบความถูกต้อง รวมถึงอธิบายแนวทางและหัวข้อที่สำคัญในการจัดทำ Validation Master Plan",
                },
                {
                  label: "p2_3",
                  description:
                    "อธิบายวิธีต่าง ๆ ในการตรวจสอบความถูกต้อง ได้แก่ การตรวจสอบความถูกต้องก่อนการผลิตจำหน่าย (Prospective Validation) และการตรวจสอบความถูกต้องพร้อมการผลิตจำหน่าย (Concurrent Validation)",
                },
                {
                  label: "p2_4",
                  description:
                    "อธิบายการตรวจสอบความถูกต้องซ้ำ (Revalidation) และการควบคุมการเปลี่ยนแปลง (Change Control)",
                },
                {
                  label: "p2_5",
                  description:
                    "อธิบายถึงกิจกรรมสำคัญ ความหมาย และแนวทางในการตรวจสอบความถูกต้อง ได้แก่ การตรวจสอบความถูกต้องของกระบวนการผลิต (Process Validation) การตรวจสอบความถูกต้องของวิธีวิเคราะห์ (Analytical Method Validation) การตรวจสอบความถูกต้องของการทำความสะอาด (Cleaning Validation) และการสอบเทียบ (Calibration)",
                },
              ].map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={5}>
                      2. ความรู้และแนวทางในการตรวจรับรอง (Qualification)
                      การตรวจสอบความถูกต้อง (Validation) และการสอบเทียบ
                      (Calibration)
                    </td>
                  )}
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={5}>
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
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={5}>
                      <div className="flex flex-col gap-6">
                        <ScoreForm
                          value={data.p2_activity}
                          label={`p2_activity`}
                          list={activityLabels}
                          rows={true}
                          isRequired={true}
                        />

                        <ScoreForm
                          value={data.p2_work}
                          label={`p2_work`}
                          list={workLabels}
                          rows={true}
                          isRequired={true}
                        />
                      </div>
                    </td>
                  )}
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
              <tr>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={4}
                >
                  คะแนนเฉลี่ยของจุดมุ่งหมายที่ 2
                </td>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  {(() => {
                    const scores = [
                      data.p2_1_select && data.p2_1_score
                        ? Number(data.p2_1_score)
                        : null,
                      data.p2_2_select && data.p2_2_score
                        ? Number(data.p2_2_score)
                        : null,
                      data.p2_3_select && data.p2_3_score
                        ? Number(data.p2_3_score)
                        : null,
                      data.p2_4_select && data.p2_4_score
                        ? Number(data.p2_4_score)
                        : null,
                      data.p2_5_select && data.p2_5_score
                        ? Number(data.p2_5_score)
                        : null,
                    ].filter((s) => s !== null);

                    if (scores.length === 0) return "-";

                    const avg = (
                      scores.reduce((sum, s) => sum + (s || 0), 0) /
                      scores.length
                    ).toFixed(2);
                    return toThaiNumber(Number(avg));
                  })()}
                </td>
                <td className="p-2 border align-center text-sm"></td>
              </tr>
            </tbody>

            <tbody>
              {[
                {
                  label: "p3_1",
                  description:
                    "ระบุและสืบค้นข้อมูลที่ต้องการจากตำรายาต่าง ๆ ที่ทางการรับรอง เช่น USP, BP, TP, Ph. Int. รวมถึงการสืบค้นข้อมูลจากตำรายาอื่น ๆ ที่เกี่ยวข้องทางเภสัชกรรม",
                },
                {
                  label: "p3_2",
                  description:
                    "อธิบายความหมาย ความสำคัญ และวัตถุประสงค์ของข้อกำหนดวัตถุดิบ วัสดุการบรรจุ และผลิตภัณฑ์สำเร็จรูป รวมถึงระบุข้อมูลที่จำเป็นเกี่ยวกับข้อกำหนดวัตถุดิบ วัสดุการบรรจุ และผลิตภัณฑ์สำเร็จรูป พร้อมทั้งวัตถุประสงค์ของข้อมูลแต่ละอย่าง",
                },
                {
                  label: "p3_3",
                  description:
                    "อธิบายและจัดทำเอกสารข้อกำหนดวัตถุดิบ วัสดุการบรรจุ และผลิตภัณฑ์สำเร็จรูป",
                },
                {
                  label: "p3_4",
                  description:
                    "อธิบายและเลือกหลักการทางสถิติที่ใช้ในการควบคุมคุณภาพ",
                },
                {
                  label: "p3_5",
                  description:
                    "อธิบายหลักการและเลือกเครื่องมือในการวิเคราะห์และการทดสอบต่าง ๆ ที่สำคัญ",
                },
                {
                  label: "p3_6",
                  description:
                    "วิเคราะห์เชิงคุณภาพและเชิงปริมาณที่สำคัญในตำรายา ทั้งทางเคมีกายภาพและทางชีวภาพได้ตามบริบทของแหล่งฝึก",
                },
                {
                  label: "p3_7",
                  description:
                    "อธิบายหลักการพัฒนาวิธีวิเคราะห์ รวมถึงตรวจสอบความถูกต้องของวิธีวิเคราะห์ และความสอดคล้องกับข้อกําหนดในตํารายาและตามแนวทางมาตรฐาน เช่น ASEAN Harmonization และ ICH Guideline และความสอดคล้องกับข้อกำหนดในตำรายาและตามแนวทางมาตรฐาน เช่น ASEAN Harmonization และ ICH Guideline",
                },
              ].map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={7}>
                      3. ความรู้เกี่ยวกับการควบคุมคุณภาพตลอดกระบวนการผลิต
                      วิธีวิเคราะห์ การตรวจสอบคุณภาพตามเภสัชตำรับ
                      และเครื่องมือที่ใช้ในการตรวจสอบคุณภาพ
                    </td>
                  )}
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={7}>
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
                  {index === 0 && (
                    <td className="p-2 border align-top text-sm" rowSpan={7}>
                      <div className="flex flex-col gap-6">
                        <ScoreForm
                          value={data.p3_activity}
                          label={`p3_activity`}
                          list={activityLabels}
                          rows={true}
                          isRequired={true}
                        />

                        <ScoreForm
                          value={data.p3_work}
                          label={`p3_work`}
                          list={workLabels}
                          rows={true}
                          isRequired={true}
                        />
                      </div>
                    </td>
                  )}
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
              <tr>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={4}
                >
                  คะแนนเฉลี่ยของจุดมุ่งหมายที่ 3
                </td>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  {(() => {
                    const scores = [
                      data.p3_1_select && data.p3_1_score
                        ? Number(data.p3_1_score)
                        : null,
                      data.p3_2_select && data.p3_2_score
                        ? Number(data.p3_2_score)
                        : null,
                      data.p3_3_select && data.p3_3_score
                        ? Number(data.p3_3_score)
                        : null,
                      data.p3_4_select && data.p3_4_score
                        ? Number(data.p3_4_score)
                        : null,
                      data.p3_5_select && data.p3_5_score
                        ? Number(data.p3_5_score)
                        : null,
                      data.p3_6_select && data.p3_6_score
                        ? Number(data.p3_6_score)
                        : null,
                      data.p3_7_select && data.p3_7_score
                        ? Number(data.p3_7_score)
                        : null,
                    ].filter((s) => s !== null);

                    if (scores.length === 0) return "-";

                    const avg = (
                      scores.reduce((sum, s) => sum + (s || 0), 0) /
                      scores.length
                    ).toFixed(2);
                    return toThaiNumber(Number(avg));
                  })()}
                </td>
                <td className="p-2 border align-center text-sm"></td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                <td className="p-2 border align-top text-sm">
                  <p>4. อื่นๆ (โปรดระบุ)</p>
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => {
                      setDataValue("p4_title", e.target.value);
                    }}
                    rows={3 * 1}
                    value={data.p4_title}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <input
                    type="number"
                    value={data.p4_day}
                    onChange={(value) =>
                      setDataValue("p4_day", value.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit && !data.p4_day && " border-2 border-red-600")
                    }
                  />
                </td>
                <td className="p-2 border align-top text-sm"></td>
                <td className="p-2 border align-top text-sm"></td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p4_score}
                    label="p5_score"
                    list={scoreLabels}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => {
                      setDataValue("p4_note", e.target.value);
                    }}
                    rows={3 * 1}
                    value={data.p4_note}
                  />
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td
                  className="p-2 border align-center text-sm font-bold text-center bg-slate-100"
                  colSpan={4}
                >
                  รวมคะแนนเฉลี่ยทั้งหมด
                </td>
                <td className="p-2 border align-center text-sm font-bold text-center bg-slate-100">
                  {(() => {
                    const allScores = [
                      data.p1_1_select && data.p1_1_score
                        ? Number(data.p1_1_score)
                        : null,
                      data.p1_2_select && data.p1_2_score
                        ? Number(data.p1_2_score)
                        : null,
                      data.p1_3_select && data.p1_3_score
                        ? Number(data.p1_3_score)
                        : null,
                      data.p1_4_select && data.p1_4_score
                        ? Number(data.p1_4_score)
                        : null,
                      data.p2_1_select && data.p2_1_score
                        ? Number(data.p2_1_score)
                        : null,
                      data.p2_2_select && data.p2_2_score
                        ? Number(data.p2_2_score)
                        : null,
                      data.p2_3_select && data.p2_3_score
                        ? Number(data.p2_3_score)
                        : null,
                      data.p2_4_select && data.p2_4_score
                        ? Number(data.p2_4_score)
                        : null,
                      data.p2_5_select && data.p2_5_score
                        ? Number(data.p2_5_score)
                        : null,
                      data.p3_1_select && data.p3_1_score
                        ? Number(data.p3_1_score)
                        : null,
                      data.p3_2_select && data.p3_2_score
                        ? Number(data.p3_2_score)
                        : null,
                      data.p3_3_select && data.p3_3_score
                        ? Number(data.p3_3_score)
                        : null,
                      data.p3_4_select && data.p3_4_score
                        ? Number(data.p3_4_score)
                        : null,
                      data.p3_5_select && data.p3_5_score
                        ? Number(data.p3_5_score)
                        : null,
                      data.p3_6_select && data.p3_6_score
                        ? Number(data.p3_6_score)
                        : null,
                      data.p3_7_select && data.p3_7_score
                        ? Number(data.p3_7_score)
                        : null,
                      data.p4_score ? Number(data.p4_score) : null,
                    ].filter((s) => s !== null);

                    if (allScores.length === 0) return "-";

                    const avg = (
                      allScores.reduce((sum, s) => sum + (s || 0), 0) /
                      allScores.length
                    ).toFixed(2);
                    return toThaiNumber(Number(avg));
                  })()}
                </td>
                <td className="p-2 border align-center text-sm bg-slate-100"></td>
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
