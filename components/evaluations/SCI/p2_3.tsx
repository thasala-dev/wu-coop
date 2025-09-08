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
    p2_1_quantity_other:
      parentForm.getValues("result.p2_1_quantity_other") || "",
    p2_1_score: parentForm.getValues("result.p2_1_score") || "",
    p2_1_select: parentForm.getValues("result.p2_1_select") || false,

    p2_2_quantity: parentForm.getValues("result.p2_2_quantity") || "",
    p2_2_quantity_other:
      parentForm.getValues("result.p2_2_quantity_other") || "",
    p2_2_score: parentForm.getValues("result.p2_2_score") || "",
    p2_2_select: parentForm.getValues("result.p2_2_select") || false,

    p2_3_quantity: parentForm.getValues("result.p2_3_quantity") || "",
    p2_3_quantity_other:
      parentForm.getValues("result.p2_3_quantity_other") || "",
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
                  วัตถุประสงค์เชิงพฤติกรรมที่มีการฝึกปฏิบัติ
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  กิจกรรม
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
              </tr>
            </thead>
            <tbody>
              {/* 1. ทักษะพื้นฐานในการวิจัย */}
              <tr>
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  1. ทักษะพื้นฐานในการวิจัย
                </td>
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  อธิบายกระบวนการการ
                  <br />
                  วิจัยและพัฒนา
                  <br />
                  ผลิตภัณฑ์
                </td>
                <td className="p-2 border align-top text-sm">
                  ฟังการบรรยาย/อภิปราย
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p1_quantity}
                    label="p1_quantity"
                    list={quantityLabels}
                    rows={true}
                    isRequired={true}
                  />
                  ระบุ
                  <input
                    type="number"
                    value={data.p1_quantity_other || ""}
                    onChange={(e) =>
                      setDataValue("p1_quantity_other", e.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit &&
                        !data.p1_quantity_other &&
                        " border-2 border-red-600")
                    }
                  />
                  ครั้ง
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p1_1_score}
                    label="p1_1_score"
                    list={scoreLabels}
                    isRequired={data.p1_1_select}
                  />
                </td>
              </tr>
            </tbody>
            <tbody>
              {/* 2. ประยุกต์ใช้หลักวิทยาศาสตร์ในการพัฒนาตำรับยา */}
              <tr>
                <td className="p-2 border align-top text-sm" rowSpan={3}>
                  2. ประยุกต์ใช้หลักวิทยาศาสตร์ในการพัฒนาตำรับยา
                </td>
                <td className="p-2 border align-top text-sm" rowSpan={3}>
                  พัฒนา หรือแก้ไขปัญหา
                  <br />
                  ในการจัดทำตำรับยา
                </td>
                <td className="p-2 border align-top text-sm">
                  1. ฟังการบรรยาย/อภิปราย
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p2_1_quantity}
                    label="p2_1_quantity"
                    list={quantityLabels}
                    rows={true}
                    isRequired={true}
                  />
                  ระบุ
                  <input
                    type="number"
                    value={data.p2_1_quantity_other || ""}
                    onChange={(e) =>
                      setDataValue("p2_1_quantity_other", e.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit &&
                        !data.p2_1_quantity_other &&
                        " border-2 border-red-600")
                    }
                  />
                  ครั้ง
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p2_1_score}
                    label="p2_1_score"
                    list={scoreLabels}
                    isRequired={data.p2_1_select}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-sm">
                  2. พัฒนาตำรับยา หรือผลิตภัณฑ์ใหม่/ มีส่วนร่วมในการพัฒนาตำรับยา
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p2_2_quantity}
                    label="p2_2_quantity"
                    list={quantityLabels}
                    rows={true}
                    isRequired={true}
                  />
                  ระบุ
                  <input
                    type="number"
                    value={data.p2_2_quantity_other || ""}
                    onChange={(e) =>
                      setDataValue("p2_2_quantity_other", e.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit &&
                        !data.p2_2_quantity_other &&
                        " border-2 border-red-600")
                    }
                  />
                  ครั้ง
                </td>
                <td className="p-2 border align-top text-sm"></td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-sm">3. นำเสนอ</td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p2_3_quantity}
                    label="p2_3_quantity"
                    list={quantityLabels}
                    rows={true}
                    isRequired={true}
                  />
                  ระบุ
                  <input
                    type="number"
                    value={data.p2_3_quantity_other || ""}
                    onChange={(e) =>
                      setDataValue("p2_3_quantity_other", e.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit &&
                        !data.p2_3_quantity_other &&
                        " border-2 border-red-600")
                    }
                  />
                  ครั้ง
                </td>
                <td className="p-2 border align-top text-sm"></td>
              </tr>

              {/* 3. ทักษะพื้นฐานในการถ่ายทอดเทคโนโลยี */}
              <tr>
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  3. ทักษะพื้นฐานในการถ่ายทอดเทคโนโลยี
                </td>
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  มีความรู้พื้นฐานในการถ่ายทอดเทคโนโลยี
                </td>
                <td className="p-2 border align-top text-sm">
                  ฟังการบรรยาย/อภิปราย/ดูการสาธิต/
                  ฝึกปฏิบัติในส่วนการขยายการผลิต (scale up)
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p3_quantity}
                    label="p3_quantity"
                    list={quantityLabels}
                    rows={true}
                    isRequired={true}
                  />
                  ระบุ
                  <input
                    type="number"
                    value={data.p3_quantity_other || ""}
                    onChange={(e) =>
                      setDataValue("p3_quantity_other", e.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit &&
                        !data.p3_quantity_other &&
                        " border-2 border-red-600")
                    }
                  />
                  ครั้ง
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p3_1_score}
                    label="p3_1_score"
                    list={scoreLabels}
                    isRequired={data.p3_1_select}
                  />
                </td>
              </tr>
            </tbody>
            <tbody>
              {/* 4. ทักษะเกี่ยวกับระบบคุณภาพและหลักปฏิบัติที่ดีที่เกี่ยวข้องกับการวิจัยและพัฒนา */}
              <tr>
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  4.
                  ทักษะเกี่ยวกับระบบคุณภาพและหลักปฏิบัติที่ดีที่เกี่ยวข้องกับการวิจัยและพัฒนา
                </td>
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  มีความรู้พื้นฐานเกี่ยวกับระบบคุณภาพและหลักปฏิบัติที่ดีที่เกี่ยวข้องกับการวิจัยและพัฒนา
                </td>
                <td className="p-2 border align-top text-sm">
                  ฟังการบรรยาย/อภิปราย/ดูการสาธิต/
                  ฝึกปฏิบัติในส่วนระบบประกันคุณภาพและหลักปฏิบัติที่ดีที่เกี่ยวข้องกับการวิจัยและพัฒนา
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p4_quantity}
                    label="p4_quantity"
                    list={quantityLabels}
                    rows={true}
                    isRequired={true}
                  />
                  ระบุ
                  <input
                    type="number"
                    value={data.p4_quantity_other || ""}
                    onChange={(e) =>
                      setDataValue("p4_quantity_other", e.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit &&
                        !data.p4_quantity_other &&
                        " border-2 border-red-600")
                    }
                  />
                  ครั้ง
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p4_1_score}
                    label="p4_1_score"
                    list={scoreLabels}
                    isRequired={data.p4_1_select}
                  />
                </td>
              </tr>
            </tbody>
            <tbody>
              {/* 5. อื่น ๆ (โปรดระบุ) */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  5. อื่น ๆ (โปรดระบุ)
                </td>
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.p5_detail || ""}
                    onChange={(e) => setDataValue("p5_detail", e.target.value)}
                    className={
                      "p-1 border rounded-md text-sm w-full " +
                      (isSubmit &&
                        !data.p5_detail &&
                        " border-2 border-red-600")
                    }
                    placeholder="โปรดระบุรายละเอียด"
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <input
                    type="text"
                    value={data.p5_activity || ""}
                    onChange={(e) =>
                      setDataValue("p5_activity", e.target.value)
                    }
                    className="p-1 border rounded-md text-sm w-full"
                    placeholder="กิจกรรม"
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p5_quantity}
                    label="p5_quantity"
                    list={quantityLabels}
                    rows={true}
                    isRequired={true}
                  />
                  ระบุ
                  <input
                    type="number"
                    value={data.p5_quantity_other || ""}
                    onChange={(e) =>
                      setDataValue("p5_quantity_other", e.target.value)
                    }
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit &&
                        !data.p5_quantity_other &&
                        " border-2 border-red-600")
                    }
                  />
                  ครั้ง
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.p5_score}
                    label="p5_score"
                    list={scoreLabels}
                    isRequired={data.p5_select}
                  />
                </td>
              </tr>
            </tbody>

            {/* คะแนนรวม */}
            <tr>
              <td
                className="p-2 border align-top text-sm font-bold text-right"
                colSpan={4}
              >
                คะแนนรวม (จุดมุ่งหมาย 1–5) × 5 คะแนน
              </td>
              <td className="p-2 border align-top text-sm font-bold text-center">
                {toThaiNumber(
                  Number(
                    (
                      [
                        data.p1_1_score,
                        data.p2_1_score,
                        data.p3_1_score,
                        data.p4_1_score,
                        // จุดมุ่งหมายที่ 5 เฉพาะที่มีการกรอก p5_detail เท่านั้น
                        data.p5_detail && data.p5_detail.trim() !== ""
                          ? data.p5_score
                          : null,
                      ]
                        .filter((score) => score !== null && score !== "")
                        .reduce((total, score) => {
                          return total + (score ? parseInt(score, 10) : 0);
                        }, 0) * 5
                    ).toFixed(0)
                  )
                )}
              </td>
            </tr>
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
