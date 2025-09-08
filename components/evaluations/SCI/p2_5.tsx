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

const quantityLabels = [
  { label: "1 ครั้ง", value: "0" },
  { label: "มากกว่า 1 ครั้ง", value: "1" },
];

const activityLabels = [
  { label: "ไม่มีการฝึก", value: "0" },
  { label: "1-2 กิจกรรม", value: "1" },
  { label: ">2 กิจกรรม", value: ">2" },
];

// Check if checkbox is selected but score is not provided
const checkboxScoreValidation = [
  { select: "g1_1_select", score: "g1_1_score" },
  { select: "g1_2_select", score: "g1_2_score" },
  { select: "g2_1_select", score: "g2_1_score" },
  { select: "g2_2_select", score: "g2_2_score" },
  { select: "g3_1_select", score: "g3_1_score" },
  { select: "g3_2_select", score: "g3_2_score" },
  { select: "g3_3_select", score: "g3_3_score" },
  { select: "g4_1_select", score: "g4_1_score" },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    percentageProduction:
      parentForm.getValues("result.percentageProduction") || "",
    percentageOther: parentForm.getValues("result.percentageOther") || "",
    otherDepartment: parentForm.getValues("result.otherDepartment") || "",

    // จุดมุ่งหมายที่ 1: กฎหมาย ระเบียบ ข้อบังคับ เกี่ยวกับ การกำกับดูแล และผลิตภัณฑ์สุขภาพ
    g1_1_activity: parentForm.getValues("result.g1_1_activity") || "",
    g1_1_score: parentForm.getValues("result.g1_1_score") || "",
    g1_1_note: parentForm.getValues("result.g1_1_note") || "",
    g1_1_select: parentForm.getValues("result.g1_1_select") || false,

    g1_2_activity: parentForm.getValues("result.g1_2_activity") || "",
    g1_2_score: parentForm.getValues("result.g1_2_score") || "",
    g1_2_note: parentForm.getValues("result.g1_2_note") || "",
    g1_2_select: parentForm.getValues("result.g1_2_select") || false,

    g1_avg_score: parentForm.getValues("result.g1_avg_score") || "",

    // จุดมุ่งหมายที่ 2: กระบวนการขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพ
    g2_1_activity: parentForm.getValues("result.g2_1_activity") || "",
    g2_1_score: parentForm.getValues("result.g2_1_score") || "",
    g2_1_note: parentForm.getValues("result.g2_1_note") || "",
    g2_1_select: parentForm.getValues("result.g2_1_select") || false,

    g2_2_activity: parentForm.getValues("result.g2_2_activity") || "",
    g2_2_score: parentForm.getValues("result.g2_2_score") || "",
    g2_2_note: parentForm.getValues("result.g2_2_note") || "",
    g2_2_select: parentForm.getValues("result.g2_2_select") || false,

    g2_avg_score: parentForm.getValues("result.g2_avg_score") || "",

    // จุดมุ่งหมายที่ 3: การประมวลและจัดทำเอกสารสำหรับการขึ้นทะเบียนตามมาตรฐานและที่กฎหมายกำหนด
    g3_1_activity: parentForm.getValues("result.g3_1_activity") || "",
    g3_1_score: parentForm.getValues("result.g3_1_score") || "",
    g3_1_note: parentForm.getValues("result.g3_1_note") || "",
    g3_1_select: parentForm.getValues("result.g3_1_select") || false,

    g3_2_activity: parentForm.getValues("result.g3_2_activity") || "",
    g3_2_score: parentForm.getValues("result.g3_2_score") || "",
    g3_2_note: parentForm.getValues("result.g3_2_note") || "",
    g3_2_select: parentForm.getValues("result.g3_2_select") || false,

    g3_3_activity: parentForm.getValues("result.g3_3_activity") || "",
    g3_3_score: parentForm.getValues("result.g3_3_score") || "",
    g3_3_note: parentForm.getValues("result.g3_3_note") || "",
    g3_3_select: parentForm.getValues("result.g3_3_select") || false,

    g3_avg_score: parentForm.getValues("result.g3_avg_score") || "",

    // จุดมุ่งหมายที่ 4: การประเมินคุณภาพและความถูกต้องของข้อมูลในเอกสารด้านความปลอดภัย ประสิทธิผล และคุณภาพของผลิตภัณฑ์
    g4_1_activity: parentForm.getValues("result.g4_1_activity") || "",
    g4_1_score: parentForm.getValues("result.g4_1_score") || "",
    g4_1_note: parentForm.getValues("result.g4_1_note") || "",
    g4_1_select: parentForm.getValues("result.g4_1_select") || false,

    g4_avg_score: parentForm.getValues("result.g4_avg_score") || "",

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
      "suggestion",
      "g1_1_note",
      "g1_2_note",
      "g2_1_note",
      "g2_2_note",
      "g3_1_note",
      "g3_2_note",
      "g3_3_note",
      "g4_1_note",
    ];

    // Check required fields (exclude checkbox fields, score fields, note fields, and avg/total score fields)
    const hasEmptyField = Object.keys(data).some((key) => {
      if (
        !keyList.includes(key) &&
        !key.includes("_select") &&
        !key.includes("_score") &&
        !key.includes("_note") &&
        !key.includes("avg") &&
        !key.includes("total")
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
            โดยทั้ง 2 ส่วนประกอบด้วยจุดมุ่งหมายหลัก 4 ข้อ
            นักศึกษาควรได้รับการฝึกปฏิบัติงานจนครบทั้ง 4 จุดมุ่งหมายหลัก
            แต่ละจุดมุ่งหมายหลัก มีวัตถุประสงค์เชิงพฤติกรรมหลายส่วน
            ซึ่งอาจไม่จำเป็นต้องฝึกปฏิบัติงานจนครบทุกวัตถุประสงค์
            ทั้งนี้ขึ้นอยู่กับความพร้อมและบริบทของแต่ละแหล่งฝึก{" "}
          </p>
          <p className="text-sm mb-2">
            การประเมินผลเชิงปริมาณนั้น
            อาจารย์ประจำแหล่งฝึกสามารถกำหนดหัวข้อและกรอบการฝึกปฏิบัติงานได้ตามความเหมาะสม
            โดยอ้างอิงจากข้อมูลในแต่ละวัตถุประสงค์เชิงพฤติกรรม
            ถ้ากิจกรรมใดมีการฝึกปฏิบัติขอให้ระบุจำนวนกิจกรรมที่เกิดขึ้น
            พร้อมทั้งบันทึกชื่อของกิจกรรมที่ได้ฝึกปฏิบัติไว้ในช่องหมายเหตุด้วย{" "}
          </p>
          <p className="text-sm mb-2">
            สำหรับการประเมินผลสัมฤทธิ์นั้น
            อาจารย์ประจำแหล่งฝึกสามารถทำได้จากการสังเกต การสอบถาม การอภิปราย
            รวมไปถึงผลของการฝึกปฏิบัติงาน โดยมีแนวทางการให้คะแนนดังนี้{" "}
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
        <p className="text-center text-md font-bold">
          การประเมินผลเชิงปริมาณและการประเมินผลสัมฤทธิ์
        </p>
      </div>

      <div className="sm:col-span-12"></div>
      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border text-center text-sm">จุดมุ่งหมาย</th>

                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "25%" }}
                >
                  วัตถุประสงค์เชิงพฤติกรรม
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  กิจกรรมหรือการฝึกปฏิบัติงาน
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
                <th className="p-2 border text-center text-sm">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  1. กฎหมาย ระเบียบ ข้อบังคับ เกี่ยวกับ การกำกับดูแล
                  และผลิตภัณฑ์สุขภาพ
                </td>

                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  1. อธิบายสาระสำคัญของกฎ
                  ระเบียบหรือข้อบังคับที่เกี่ยวกับยาและผลิตภัณฑ์สุขภาพ เช่น
                  พระราชบัญญัติ กฎกระทรวง ประกาศ คำสั่ง ระเบียบ
                  ที่เกี่ยวข้องกับยาและผลิตภัณฑ์สุขภาพ
                </td>

                {/* กิจกรรมหรือการฝึกปฏิบัติงาน */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ศึกษาด้วยตนเอง ภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g1_1_activity}
                    label="g1_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g1_1_score}
                    label="g1_1_score"
                    list={scoreLabels}
                    isRequired={data.g1_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g1_1_note || ""}
                    onChange={(e) => setDataValue("g1_1_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>
              <tr>
                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  2.
                  อธิบายหลักเกณฑ์ในการขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพระหว่างประเทศ
                  เช่น ASEAN Harmonization, WHO, ICH
                  และอธิบายมาตรฐานวิชาชีพและจรรยาบรรณของนักวิชาการทะเบียน
                  และกฎหมายผลิตภัณฑ์
                </td>

                {/* กิจกรรมหรือการฝึกปฏิบัติงาน */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ศึกษาด้วยตนเอง ภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g1_2_activity}
                    label="g1_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g1_2_score}
                    label="g1_2_score"
                    list={scoreLabels}
                    isRequired={data.g1_2_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g1_2_note || ""}
                    onChange={(e) => setDataValue("g1_2_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>
              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 1) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 1)
                </td>
                <td
                  className="p-2 border align-top text-sm font-bold text-center"
                  colSpan={2}
                >
                  {toThaiNumber(
                    Number(
                      (
                        [data.g1_1_score, data.g1_2_score]
                          .filter((score) => score !== "")
                          .reduce((total, score) => {
                            return total + (score ? parseInt(score, 10) : 0);
                          }, 0) /
                          [data.g1_1_score, data.g1_2_score].filter(
                            (score) => score !== ""
                          ).length || 0
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  2. กระบวนการขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพ
                </td>

                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  1. อธิบายบทบาท อำนาจหน้าที่
                  และความรับผิดชอบขององค์กรและพนักงาน เจ้าหน้าที่ใน
                  การขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพ
                  <br />
                  1.1 โครงสร้างขององค์กร
                  โครงสร้างของงานขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพ
                  และความสัมพันธ์ของงาน
                  ขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพกับหน่วยงานอื่น ๆ ในองค์กร
                  <br />
                  1.2
                  ขอบเขตหน้าที่ความรับผิดชอบขององค์กรหรือพนักงานเจ้าหน้าที่ที่ปฏิบัติหน้าที่การขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพ
                </td>

                {/* กิจกรรมหรือการฝึกปฏิบัติงาน */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ศึกษาด้วยตนเอง ภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g2_1_activity}
                    label="g2_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g2_1_score}
                    label="g2_1_score"
                    list={scoreLabels}
                    isRequired={data.g2_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g2_1_note || ""}
                    onChange={(e) => setDataValue("g2_1_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>

              <tr>
                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  2.
                  อธิบายขั้นตอนการขึ้นทะเบียนและการแก้ไขเปลี่ยนแปลงทะเบียนยาและผลิตภัณฑ์สุขภาพ
                </td>

                {/* กิจกรรมหรือการฝึกปฏิบัติงาน */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ฝึกปฏิบัติภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g2_2_activity}
                    label="g2_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g2_2_score}
                    label="g2_2_score"
                    list={scoreLabels}
                    isRequired={data.g2_2_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g2_2_note || ""}
                    onChange={(e) => setDataValue("g2_2_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>

              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 2) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 2)
                </td>
                <td
                  className="p-2 border align-top text-sm font-bold text-center"
                  colSpan={2}
                >
                  {toThaiNumber(
                    Number(
                      (
                        [data.g2_1_score, data.g2_2_score]
                          .filter((score) => score !== "")
                          .reduce((total, score) => {
                            return total + (score ? parseInt(score, 10) : 0);
                          }, 0) /
                          [data.g2_1_score, data.g2_2_score].filter(
                            (score) => score !== ""
                          ).length || 0
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm" rowSpan={3}>
                  3.
                  การประมวลและจัดทำเอกสารสำหรับการขึ้นทะเบียนตามมาตรฐานและที่กฎหมายกำหนด
                </td>

                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  1.
                  อธิบายการจัดหมวดหมู่เอกสารราชการทั้งหมดของสำนักงานคณะกรรมการอาหารและยา
                  รวมทั้งแบบคำขอและการยื่นคำขอต่าง ๆ
                </td>

                {/* กิจกรรม */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ฝึกปฏิบัติภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g3_1_activity}
                    label="g3_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g3_1_score}
                    label="g3_1_score"
                    list={scoreLabels}
                    isRequired={data.g3_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g3_1_note || ""}
                    onChange={(e) => setDataValue("g3_1_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>

              <tr>
                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  2. ค้นคว้าข้อมูลจากแหล่งข้อมูลต่าง ๆ
                  เพื่อประกอบข้อมูลด้านความปลอดภัย ประสิทธิผล
                  และคุณภาพของยาและผลิตภัณฑ์สุขภาพ
                  สำหรับการขึ้นทะเบียนยาและผลิตภัณฑ์สุขภาพ
                </td>

                {/* กิจกรรม */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ฝึกปฏิบัติภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g3_2_activity}
                    label="g3_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g3_2_score}
                    label="g3_2_score"
                    list={scoreLabels}
                    isRequired={data.g3_2_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g3_2_note || ""}
                    onChange={(e) => setDataValue("g3_2_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>

              <tr>
                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  3.
                  จัดเตรียมเอกสารที่ต้องขึ้นทะเบียนและผลิตภัณฑ์สุขภาพต่อสำนักงานคณะกรรมการอาหารและยา
                </td>

                {/* กิจกรรม */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ฝึกปฏิบัติภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g3_3_activity}
                    label="g3_3_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g3_3_score}
                    label="g3_3_score"
                    list={scoreLabels}
                    isRequired={data.g3_3_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g3_3_note || ""}
                    onChange={(e) => setDataValue("g3_3_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>

              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 3) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 3)
                </td>
                <td
                  className="p-2 border align-top text-sm font-bold text-center"
                  colSpan={2}
                >
                  {toThaiNumber(
                    Number(
                      (
                        [data.g3_1_score, data.g3_2_score, data.g3_3_score]
                          .filter((score) => score !== "")
                          .reduce((total, score) => {
                            return total + (score ? parseInt(score, 10) : 0);
                          }, 0) /
                          [
                            data.g3_1_score,
                            data.g3_2_score,
                            data.g3_3_score,
                          ].filter((score) => score !== "").length || 0
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm">
                  4.
                  การประเมินคุณภาพและความถูกต้องของข้อมูลในเอกสารด้านความปลอดภัย
                  ประสิทธิผล และคุณภาพของผลิตภัณฑ์
                </td>

                {/* วัตถุประสงค์เชิงพฤติกรรม */}
                <td className="p-2 border align-top text-sm">
                  1. ประเมินคุณภาพและความถูกต้องของข้อมูลในเอกสารด้านความปลอดภัย
                  ประสิทธิผล และคุณภาพของผลิตภัณฑ์
                </td>

                {/* กิจกรรม */}
                <td className="p-2 border align-top text-sm">
                  1. ฟังบรรยาย
                  <br />
                  2. อภิปราย
                  <br />
                  3. สัมมนา
                  <br />
                  4. ฝึกปฏิบัติภายใต้การดูแลของอาจารย์ประจำแหล่งฝึก
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g4_1_activity}
                    label="g4_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.g4_1_score}
                    label="g4_1_score"
                    list={scoreLabels}
                    isRequired={data.g4_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.g4_1_note || ""}
                    onChange={(e) => setDataValue("g4_1_note", e.target.value)}
                    className="p-1 border rounded-md text-sm w-full"
                  />
                </td>
              </tr>

              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 4) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 4)
                </td>
                <td
                  className="p-2 border align-top text-sm font-bold text-center"
                  colSpan={2}
                >
                  {toThaiNumber(
                    Number(
                      (
                        [data.g4_1_score]
                          .filter((score) => score !== "")
                          .reduce((total, score) => {
                            return total + (score ? parseInt(score, 10) : 0);
                          }, 0) /
                          [data.g4_1_score].filter((score) => score !== "")
                            .length || 0
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>

              {/* คะแนนรวม (จุดมุ่งหมาย 1–4) × 5 คะแนน */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนรวม (จุดมุ่งหมาย 1–4) × 5 คะแนน
                </td>
                <td
                  className="p-2 border align-top text-sm font-bold text-center"
                  colSpan={2}
                >
                  {toThaiNumber(
                    Number(
                      (
                        [
                          // คะแนนเฉลี่ยจุดมุ่งหมายที่ 1
                          [data.g1_1_score, data.g1_2_score]
                            .filter((score) => score !== "")
                            .reduce((total, score) => {
                              return total + (score ? parseInt(score, 10) : 0);
                            }, 0) /
                            ([data.g1_1_score, data.g1_2_score].filter(
                              (score) => score !== ""
                            ).length || 1),

                          // คะแนนเฉลี่ยจุดมุ่งหมายที่ 2
                          [data.g2_1_score, data.g2_2_score]
                            .filter((score) => score !== "")
                            .reduce((total, score) => {
                              return total + (score ? parseInt(score, 10) : 0);
                            }, 0) /
                            ([data.g2_1_score, data.g2_2_score].filter(
                              (score) => score !== ""
                            ).length || 1),

                          // คะแนนเฉลี่ยจุดมุ่งหมายที่ 3
                          [data.g3_1_score, data.g3_2_score, data.g3_3_score]
                            .filter((score) => score !== "")
                            .reduce((total, score) => {
                              return total + (score ? parseInt(score, 10) : 0);
                            }, 0) /
                            ([
                              data.g3_1_score,
                              data.g3_2_score,
                              data.g3_3_score,
                            ].filter((score) => score !== "").length || 1),

                          // คะแนนเฉลี่ยจุดมุ่งหมายที่ 4
                          [data.g4_1_score]
                            .filter((score) => score !== "")
                            .reduce((total, score) => {
                              return total + (score ? parseInt(score, 10) : 0);
                            }, 0) /
                            ([data.g4_1_score].filter((score) => score !== "")
                              .length || 1),
                        ].reduce((total, avgScore) => {
                          return total + (isNaN(avgScore) ? 0 : avgScore);
                        }, 0) * 5
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
