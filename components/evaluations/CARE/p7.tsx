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
    number: "๑",
    point: 0,
    head: 1,
    label: "p1",
    title: "๑. ทักษะการประเมินผู้ป่วยและวิเคราะห์ใบสั่งยา",
  },
  {
    number: "๒",
    point: 2,
    label: "p1",
    title: "๑. ตรวจสอบ safety factors (เช่น CBC, Scr, LFT เป็นต้น)",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทราบ safety factors ทั้งหมด <u><b>รวมทั้ง</b></u>สามารถเลือก <u><b>และ</b></u>ปรับขนาดยาได้เหมาะสมตาม safety factor</li>
        <li>สามารถให้คำแนะนำ แก้ไขปัญหาได้</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>ทราบ safety factors ทั้งหมด  <b><u>และ</u></b> สามารถเลือกได้<u>บางส่วนแต่</u>ต้องอาศัยความช่วยเหลือจากเภสัชกรประจำแหล่งฝึก</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>ทราบ safety factors ทั้งหมด แต่ต้องได้รับการชี้แนะจากเภสัชกรประจำแหล่งฝึกเป็นส่วนใหญ่</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทราบเกี่ยวกับ safety factors &nbsp; 
         <u><b>หรือ</b></u>
          ทราบเกี่ยวกับ safety factors แต่ทราบเพียงบางส่วนเท่านั้น
        </li>
      </ul>
    ),
  },
  {
    number: "๒",
    point: 2,
    label: "p2",
    title: "๒. คำนวณขนาดยาได้อย่างถูกต้อง เหมาะสม",
    superd: (
      <ul className="list-disc pl-4">
        <li>คำนวณขนาดยาได้ถูกต้อง และสามารถแนะนำขนาดยาที่เหมาะสม โดยพิจารณาจากเป้าหมายการรักษาสำหรับผู้ป่วยเฉพาะราย (เช่น เพื่อให้หายขาด เพื่อยืดชีวิต หรือเพื่อประคับประคองอาการ เป็นต้น)
</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>คำนวณขนาดยาได้ถูกต้อง <u><b>และ</b></u> สามารถแนะนำการทำ rounding dose ได้เหมาะสม

</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          คำนวณขนาดยาได้ถูกต้อง  &nbsp; <u><b>แต่</b> &nbsp; ไม่สามารถแนะนำ</u>ขนาดยาได้

        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถคำนวณขนาดยาได้ <b><u>หรือ</u></b> 
        </li>
          <li>
          รู้หลักการ/แนวทางในการคำนวณแต่ไม่สามารถคำนวณได้ถูกต้อง
        </li>
      </ul>
    ),
  },

  {
    number: "๑",
    point: 1,
    label: "p3",
    title: "๓. การใช้หลักฐานทางวิชาการ",
    superd: (
      <ul className="list-disc pl-4">
        <li>ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง ทันสมัย ครบถ้วน</li>
        <li>เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับเรื่องที่นำเสนอ</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง ทันสมัย แต่ไม่ครบถ้วน</li>
        <li>เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับเรื่องที่นำเสนอ</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง แต่ไม่ทันสมัยและไม่ครบถ้วน</li>
        <li>เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับเรื่องที่นำเสนอ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ใช้ข้อมูลที่ไม่น่าเชื่อถือ ไม่สอดคล้อง ไม่ทันสมัย และไม่ครบถ้วน</li>
        <li>เลือกระดับของหลักฐานทางวิชาการได้ไม่เหมาะสมกับเรื่องที่นำเสนอ</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p4",
    title: "๔. วิธีการนําเสนอ",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดี (๘-๙ คะแนน) ร่วมกับ</li>
        <li>นำเข้าสู่เนื้อหาได้น่าสนใจ</li>
        <li>ใช้เทคนิคการนำเสนอที่สามารถสร้างการมีส่วนร่วมของผู้ฟัง</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่าน (๖-๗ คะแนน) ร่วมกับ</li>
        <li>
          สื่อสารให้ผู้ฟังด้วยบุคลิกท่าทางที่เหมาะสม (สื่อสารเสียงดังชัดเจน
          ความเร็วเหมาะสม ศัพท์ที่ใช้เข้าใจง่าย ออกเสียงถูกต้อง
          ท่าทางการประสานสายตากับผู้ฟังเหมาะสม)
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>ปริมาณเนื้อหามีความเหมาะสมกับเวลาที่กำหนด</li>
        <li>มีความเหมาะสมของลำดับในการนำเสนอ ง่ายต่อการติดตาม</li>
        <li>เนื้อหาเอกสารและสื่อประกอบการนำเสนอสะกดถูกต้อง ชัดเจน น่าสนใจ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ปริมาณเนื้อหาไม่เหมาะสมกับเวลาที่กำหนด (มากหรือน้อยเกินไป)</li>
        <li>ลำดับการนำเสนอไม่เหมาะสม</li>
        <li>เนื้อหาเอกสารและสื่อประกอบการนำเสนอมีการสะกดผิดมาก</li>
        <li>ไม่ชัดเจนหรือขนาดอักษรเล็กมาก</li>
        <li>ไม่สามารถสื่อสารให้ผู้ฟังเข้าใจได้ หรือทำให้ผู้ฟังเกิดความสับสน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p5",
    title: "๕. การตอบคำถาม (เน้นคุณภาพในการตอบมากกว่า ปริมาณ)",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดี (๘-๙ คะแนน) ร่วมกับ</li>
        <li>
          ในกรณีที่ไม่มีข้อมูลเชิงประจักษ์ที่สนับสนุนคำตอบได้ชัดเจน
          นิสิต/นักศึกษาสามารถสังเคราะห์คำตอบได้ด้วยตนเองโดยอ้างอิงจากองค์ความรู้พื้นฐาน
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ผ่าน (๖-๗ คะแนน) ร่วมกับ</li>
        <li>สามารถสื่อสารให้ผู้ฟังเข้าใจได้อย่างตรงประเด็น</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          ตอบคำถามส่วนใหญ่ได้ถูกต้อง
          โดยมีหลักฐานทางวิชาการอ้างอิงได้อย่างเหมาะสมกับระดับความรู้ของนิสิต/นักศึกษา
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถตอบคำถามได้อย่างถูกต้อง หรือตอบคำถามโดยไม่มีหลักฐานทางวิชาการ
          หรือไม่สัมพันธ์กับองค์ความรู้พื้นฐาน
        </li>
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
            ให้ท่านพิจารณาความสามารถของนิสิตตามเกณฑ์ที่กำหนดที่ตรงกับทักษะและความสามารถของนิสิตที่ท่านดูแลมากที่สุด โดยเกณฑ์ในขั้นที่สูงกว่า (ซ้ายมือ) นิสิตจะต้องแสดงถึงเกณฑ์ในขั้นที่ต่ำกว่า (ทางขวามือ) ด้วยก่อน และเมื่อนิสิตมี
ความสามารถตรงตามเกณฑ์ในระดับใด จึงให้ท่านระบุคะแนนของนิสิตตามช่วงในช่วงเกณฑ์ที่ท่านพิจารณานั้นโดยทำ

          เครื่องหมาย  (✗) ลงในช่องที่อยู่ท้ายหัวข้อที่ประเมินแต่ละหัวข้อ
            <br /><u className="font-bold">
              กรณีไม่สามารถประเมินในหัวข้อนั้นได้ให้ทำเครื่องหมาย (✗) ลงตรงช่อง
              N/A
            </u>
            <br />
            ตัวอย่างเช่น หากท่านประเมินนักศึกษาว่ามีความสามารถในหัวข้อ “ตรวจสอบ safety factors (เช่น CBC, Scr,
LFT เป็นต้น)” อยู่ในเกณฑ์ดี (๘–๙ คะแนน) ท่านสามารถเลือกให้คะแนน ๘ หรือ ๙ แก่นักศึกษาได้ ขึ้นกับความเห็นของท่าน
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
                    </td>
                    <td className="p-2 border align-top text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-2 justify-center w-full"
                        >
                          {[
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
                    (คะแนนที่ประเมินได้ &divide; ๕๐) &times; ๑๐
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
