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

const criteriaData = [
   {
    number: "๒",
    point: 2,
    label: "pPN1",
    title: "๑ การระบุปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ (PN)",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ สามารถเรียงลำดับความสำคัญของปัญหาที่ต้องได้รับการแก้ไขได้</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ ระบุปัญหาได้ครบถ้วน</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>สามารถระบุปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำที่เกิดขึ้นได้อย่างตรงประเด็น</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถระบุปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำได้</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "pPN2",
    title: "๒ การระบุข้อมูลที่สัมพันธ์กับปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ",
    superd: (
      <ul className="list-disc pl-4">
        <li>สามารถระบุข้อมูลที่สอดคล้องกับปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำได้อย่างถูกต้อง ตรงประเด็น และระบุได้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>สามารถระบุข้อมูลที่สอดคล้องกับปัญหาจากการเตรียม PN ได้ถูกต้องครบถ้วน แต่ยังไม่รู้ว่าข้อมูลสำคัญใดขาดไป</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>สามารถระบุข้อมูลที่มีความสอดคล้องกับปัญหาจากการเตรียม PN ได้อย่างครอบคลุมเป็นส่วนใหญ่ หรือ ไม่มีข้อมูลที่ไม่จำเป็น</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถระบุข้อมูลที่สอดคล้องกับปัญหาจากการเตรียม PN หรือระบุได้เพียงเล็กน้อย หรือ มีข้อมูลที่ไม่จำเป็นและไม่เกี่ยวข้องกับปัญหาที่เกิดขึ้น</li>
      </ul>
    ),
  },
  {
    number: "๓",
    point: 3,
    label: "pPN3",
    title: "๓ การประเมินสาเหตุ วิเคราะห์ปัญหาของปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ วิเคราะห์เชื่อมโยงสาเหตุและปัญหาที่เกิดจากการเตรียม PN ได้อย่างเข้าใจ</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ ระบุสาเหตุของปัญหาการเตรียม PN ได้ครบถ้วน</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>สามารถระบุสาเหตุของปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำได้อย่างตรงประเด็น</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถระบุสาเหตุของปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ หรือสามารถระบุได้แต่ไม่ตรงประเด็น</li>
      </ul>
    ),
  },
  {
    number: "๒",
    point: 2,
    label: "pPN4",
    title: "๔ แผนการแก้ไขปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ มีความเหมาะสม และสอดคล้องกับบริบทในสถานการณ์จริง</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ สามารถระบุแผนการแก้ไขปัญหาได้ครบถ้วน ตรงประเด็น และทำได้จริง</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>สามารถระบุแผนการแก้ไขปัญหาที่สอดคล้องกับสาเหตุของปัญหาจากการเตรียม PN ที่ประเมินไว้ และเป็นไปตามหลักฐานวิชาการ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถระบุแผนการแก้ไขปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ หรือระบุได้แต่ไม่เป็นไปตามหลักฐานอ้างอิงทางวิชาการ</li>
      </ul>
    ),
  },
  {
    number: "๒",
    point: 2,
    label: "pPN5",
    title: "๕ แผนการติดตามการแก้ไขปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ มีความเหมาะสมและสอดคล้องกับบริบทในสถานการณ์จริง</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ วางแผนติดตามได้อย่างครบถ้วน ตรงประเด็น และกำหนดแผนตัวชี้วัดที่ใช้ติดตามได้จริง</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>สามารถวางแผนการติดตามการแก้ไขปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำได้อย่างครอบคลุม</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถวางแผนการติดตามการแก้ไขปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำได้อย่างครอบคลุม ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "pPN6",
    title: "๖ แผนการป้องกันปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำ",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับมีความเหมาะสม และสอดคล้องกับบริบทในสถานการณ์จริง</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ ระบุแผนได้ครบถ้วน ตรงประเด็น และทำได้จริง</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>ระบุแผนการป้องกันปัญหาจากการเตรียมสารอาหารทางหลอดเลือดดำได้อย่างครอบคลุม</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถ หรือทำแต่ไม่ครบถ้วนในการวางแผนป้องกันปัญหาจากการเตรียม PN</li>
      </ul>
    ),
  },{
  number: "๑",
  point: 1,
  label: "pPN7",
  title: "๗ การใช้หลักฐานทางวิชาการ",
  superd: (
    <ul className="list-disc pl-4">
      <li>ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง ทันสมัย และครบถ้วน เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับปัญหาที่เสนอ</li>
    </ul>
  ),
  good: (
    <ul className="list-disc pl-4">
      <li>ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง ทันสมัย แต่ไม่ครบถ้วน เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับปัญหาที่นำเสนอ</li>
    </ul>
  ),
  pass: (
    <ul className="list-disc pl-4">
      <li>ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง แต่ไม่ทันสมัยและไม่ครบถ้วน เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับปัญหาที่นำเสนอ</li>
    </ul>
  ),
  fail: (
    <ul className="list-disc pl-4">
      <li>ใช้ข้อมูลที่ไม่น่าเชื่อถือ ไม่สอดคล้อง ไม่ทันสมัย และไม่ครบถ้วน เลือกระดับของหลักฐานทางวิชาการได้ไม่เหมาะสมกับปัญหาที่นำเสนอ</li>
    </ul>
  ),
},
{
  number: "๑",
  point: 1,
  label: "pPN8",
  title: "๘ วิธีการนำเสนอ",
  superd: (
    <ul className="list-disc pl-4">
      <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ นำเข้าสู่เนื้อหาได้น่าสนใจ และใช้เทคนิคการนำเสนอที่สามารถสร้างการมีส่วนร่วมของผู้ฟัง</li>
    </ul>
  ),
  good: (
    <ul className="list-disc pl-4">
      <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ การสื่อสารให้ผู้ฟังเข้าใจได้เหมาะสม (เสียงดัง ชัดเจน ความเร็วเหมาะสม ศัพท์ที่ใช้เข้าใจง่าย ออกเสียงถูกต้อง ท่าทาง และการประสานสายตากับผู้ฟังเหมาะสม)</li>
    </ul>
  ),
  pass: (
    <ul className="list-disc pl-4">
      <li>ปริมาณเนื้อหามีความเหมาะสมกับเวลาที่กำหนด มีความเหมาะสมของลำดับในการนำเสนอที่ง่ายต่อการติดตาม เนื้อหาเอกสารและสื่อประกอบการนำเสนอสะกดถูกต้อง ชัดเจน น่าสนใจ</li>
    </ul>
  ),
  fail: (
    <ul className="list-disc pl-4">
      <li>ปริมาณเนื้อหา/ลำดับการนำเสนอไม่เหมาะสมกับเวลาที่กำหนด เนื้อหาเอกสารและสื่อประกอบการนำเสนอสะกดผิดมาก ไม่ชัดเจน หรือขนาดตัวอักษรเล็กมาก ไม่สามารถสื่อสารให้ผู้ฟังเข้าใจได้ หรือทำให้เกิดความสับสน</li>
    </ul>
  ),
},
{
  number: "๒",
  point: 2,
  label: "pPN9",
  title: "๙ การตอบคำถาม (เน้นคุณภาพในการตอบมากกว่าปริมาณ)",
  superd: (
    <ul className="list-disc pl-4">
      <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ สามารถสังเคราะห์คำตอบได้ด้วยตนเอง โดยอ้างอิงจากองค์ความรู้พื้นฐาน เมื่อไม่มีหลักฐานชัดเจน</li>
    </ul>
  ),
  good: (
    <ul className="list-disc pl-4">
      <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ สามารถสื่อสารให้ผู้ฟังเข้าใจได้อย่างตรงประเด็น</li>
    </ul>
  ),
  pass: (
    <ul className="list-disc pl-4">
      <li>ตอบคำถามส่วนใหญ่ได้ถูกต้อง โดยมีหลักฐานทางวิชาการอ้างอิงได้อย่างเหมาะสมกับระดับความรู้ของนิสิต/นักศึกษา</li>
    </ul>
  ),
  fail: (
    <ul className="list-disc pl-4">
      <li>ไม่สามารถตอบคำถามได้อย่างถูกต้อง หรือ ตอบคำถามโดยไม่มีหลักฐานทางวิชาการ หรือไม่สัมพันธ์กับองค์ความรู้พื้นฐาน</li>
    </ul>
  ),
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

    strength: parentForm.getValues("result.strength") || "",
    improvement: parentForm.getValues("result.improvement") || "",
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
    const keyList = ["locationOther", "communicatorOther"];
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
ให้ท่านพิจารณาความสามารถของนักศึกษาตามเกณฑ์ที่กำหนดที่ตรงกับทักษะและความสามารถของนิสิต/นักศึกษาที่
ท่านดูแลมากที่สุด (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ) โดยเกณฑ์ในขั้นที่สูงกว่า (ซ้ายมือ) นักศึกษาจะต้องแสดงถึง
เกณฑ์ในขั้นที่ต่ำกว่า (ทางขวามือ) ด้วยก่อน และเมื่อนักศึกษามีความสามารถตรงตามเกณฑ์ในระดับใด จึงให้ท่านระบุคะแนน
ของนักศึกษาตามช่วงในช่วงเกณฑ์ที่ท่านพิจารณานั้น โดยทำเครื่องหมาย ✔ ลงในช่องที่อยู่ท้ายหัวข้อที่ประเมินแต่ละหัวข้อ

          
            <br />
<b>ตัวอย่างเช่น หากท่านประเมินนักศึกษาว่ามีความสามารถในหัวข้อ “วิธีการนำเสนอ” อยู่ในเกณฑ์ดี (๘–๙ คะแนน)
ท่านสามารถเลือกให้คะแนน ๘ หรือ ๙ แก่นักศึกษาได้ ทั้งนี้ขึ้นกับความเห็นของท่าน</b> 

          </p>
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
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  หัวข้อการประเมิน
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  ดีมาก <div className="text-xs">(๑๐ คะแนน)</div>
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  ดี <div className="text-xs">(๘-๙ คะแนน)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  ผ่าน <div className="text-xs">(๖-๗ คะแนน)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  ควรปรับปรุง <div className="text-xs">(๐-๕ คะแนน)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "5%" }}
                >
                  น้ําหนัก
                </th>
              </tr>
            </thead>

            {criteriaData.map((item: any, key) => {
              return (
                <tbody key={key}>
                  {item.head === 1 ? (
                    <tr className="bg-slate-100">
                      <td
                        colSpan={6}
                        className="p-2 border font-semibold text-center text-sm"
                      >
                        {item.title}
                      </td>
                    </tr>
                  ):(
                    <>
                  <tr>
                    <td className="p-2 border font-medium align-top text-sm">
                      {item.title}
                    </td>
                    <td className="p-2 border align-top text-sm">
                      {item.superd}
                    </td>
                    <td className="p-2 border align-top text-sm">
                      {item.good}
                    </td>
                    <td className="p-2 border align-top text-sm">
                      {item.pass}
                    </td>
                    <td className="p-2 border align-top text-sm">
                      {item.fail}
                    </td>
                    <td className="p-2 border align-top text-center  text-sm">
                      {item.number}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border align-top text-sm">
                      คะแนนที่ได้ x {item.number} ={" "}
                      {data[item.label as keyof typeof data] === ""
                        ? "__"
                        : data[item.label as keyof typeof data] === "N/A"
                        ? "N/A"
                        : toThaiNumber(
                            data[item.label as keyof typeof data] * item.point
                          )}
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
                          {[
                            {
                              label: "๑๐",
                              value: "10",
                            },
                          ].map((radio) => (
                            <div
                              className="flex flex-col items-center"
                              key={radio.value}
                            >
                              <RadioGroupItem
                                value={radio.value}
                                className={
                                  isSubmit &&
                                  !data[item.label as keyof typeof data]
                                    ? "border-2 border-red-600"
                                    : ""
                                }
                                aria-invalid={
                                  isSubmit &&
                                  !data[item.label as keyof typeof data]
                                }
                              />
                              <label
                                className={
                                  "text-xs mt-1" +
                                  (isSubmit &&
                                  !data[item.label as keyof typeof data]
                                    ? " text-red-600"
                                    : "")
                                }
                              >
                                {radio.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </td>
                    {/* ดี (8-9 คะแนน) */}
                    <td className="p-2 border align-top text-sm">
                      {item.dis96 || item.dis91? null : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                        onValueChange={(value) =>
                          setDataValue(item.label, value)
                        }
                        value={data[item.label as keyof typeof data]}
                        className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                        {[
                          {
                          label: "๙",
                          value: "9",
                          },
                          {
                          label: "๘",
                          value: "8",
                          },
                        ].map((radio) => (
                          <div
                          className="flex flex-col items-center"
                          key={radio.value}
                          >
                          <RadioGroupItem
                            value={radio.value}
                            className={
                            isSubmit &&
                            !data[item.label as keyof typeof data]
                              ? "border-2 border-red-600"
                              : ""
                            }
                            aria-invalid={
                            isSubmit &&
                            !data[item.label as keyof typeof data]
                            }
                          />
                          <label
                            className={
                            "text-xs mt-1" +
                            (isSubmit &&
                            !data[item.label as keyof typeof data]
                              ? " text-red-600"
                              : "")
                            }
                          >
                            {radio.label}
                          </label>
                          </div>
                        ))}
                        </RadioGroup>
                      </div>
                      )}
                    </td>
                    {/* ผ่าน (6-7 คะแนน) */}
                    <td className="p-2 border align-top text-sm">
                      {item.dis96 || item.dis91 ? null : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                        onValueChange={(value) =>
                          setDataValue(item.label, value)
                        }
                        value={data[item.label as keyof typeof data]}
                        className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                        {[
                          {
                          label: "๗",
                          value: "7",
                          },
                          {
                          label: "๖",
                          value: "6",
                          },
                        ].map((radio) => (
                          <div
                          className="flex flex-col items-center"
                          key={radio.value}
                          >
                          <RadioGroupItem
                            value={radio.value}
                            className={
                            isSubmit &&
                            !data[item.label as keyof typeof data]
                              ? "border-2 border-red-600"
                              : ""
                            }
                            aria-invalid={
                            isSubmit &&
                            !data[item.label as keyof typeof data]
                            }
                          />
                          <label
                            className={
                            "text-xs mt-1" +
                            (isSubmit &&
                            !data[item.label as keyof typeof data]
                              ? " text-red-600"
                              : "")
                            }
                          >
                            {radio.label}
                          </label>
                          </div>
                        ))}
                        </RadioGroup>
                      </div>
                      )}
                    </td>
                    <td className="p-2 border align-top text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) => setDataValue(item.label, value)}
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-2 justify-center w-full"
                        >
                          {(item.dis91
                            ? [
                                {
                                  label: "๐",
                                  value: "0",
                                },
                              ]
                            : [
                                {
                                  label: "๕",
                                  value: "5",
                                },
                                {
                                  label: "๔",
                                  value: "4",
                                },
                                {
                                  label: "๓",
                                  value: "3",
                                },
                                {
                                  label: "๒",
                                  value: "2",
                                },
                                {
                                  label: "๑",
                                  value: "1",
                                },
                                {
                                  label: "๐",
                                  value: "0",
                                },
                              ]
                          ).map((radio) => (
                            <div className="flex flex-col items-center" key={radio.value}>
                              <RadioGroupItem
                                value={radio.value}
                                className={
                                  isSubmit && !data[item.label as keyof typeof data]
                                    ? "border-2 border-red-600"
                                    : ""
                                }
                                aria-invalid={
                                  isSubmit && !data[item.label as keyof typeof data]
                                }
                              />
                              <label
                                className={
                                  "text-xs mt-1" +
                                  (isSubmit && !data[item.label as keyof typeof data]
                                    ? " text-red-600"
                                    : "")
                                }
                              >
                                {radio.label}
                              </label>
                            </div>
                          ))}
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
                          {[
                            {
                              label: "N/A",
                              value: "N/A",
                            },
                          ].map((radio) => (
                            <div
                              className="flex flex-col items-center"
                              key={radio.value}
                            >
                              <RadioGroupItem
                                value={radio.value}
                                className={
                                  isSubmit &&
                                  !data[item.label as keyof typeof data]
                                    ? "border-2 border-red-600"
                                    : ""
                                }
                                aria-invalid={
                                  isSubmit &&
                                  !data[item.label as keyof typeof data]
                                }
                              />
                              <label
                                className={
                                  "text-xs mt-1" +
                                  (isSubmit &&
                                  !data[item.label as keyof typeof data]
                                    ? " text-red-600"
                                    : "")
                                }
                              >
                                {radio.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </td>
                  </tr>
                  </>
                  )}
                </tbody>
              );
            })}
            
            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="p-2 border align-top text-center text-md"
                >
                  ปรับให้เป็นคะแนนเต็ม ๑๐ คะแนน =
                  <span className="font-mono">
                    (คะแนนที่ประเมินได้ &divide; ๑๕๐) &times; ๑๐
                  </span>
                  &nbsp;= ______ คะแนน
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="sm:col-span-12">
        <div className="pt-4 pb-4">
          <h3 className="font-semibold mb-3 text-sm">
            การสะท้อน (Feedback) ให้แก่นิสิต/นักศึกษา
          </h3>
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
                        (isSubmit && !data.strength
                          ? " border-2 border-red-600"
                          : "")
                      }
                      onChange={(e) => {
                        setDataValue("strength", e.target.value);
                      }}
                      value={data.strength}
                    />

                    {isSubmit && !data.strength && (
                      <p className="text-xs text-red-600 mt-1 text-center">
                        กรุณากรอกจุดแข็งของนิสิต/นักศึกษา
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border text-center text-sm">
                    จุดที่ควรปรับปรุง
                  </td>
                  <td className="p-2 border">
                    <Textarea
                      placeholder="จุดที่ควรปรับปรุงของนิสิต/นักศึกษา"
                      className={
                        "min-h-24 border-0 focus-visible:ring-0 resize-none text-sm" +
                        (isSubmit && !data.improvement
                          ? " border-2 border-red-600"
                          : "")
                      }
                      onChange={(e) => {
                        setDataValue("improvement", e.target.value);
                      }}
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
