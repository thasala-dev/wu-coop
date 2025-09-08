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
    number: "2",
    point: 2,
    label: "p1",
    title:
      "1. เชื่อมโยงแผนผังระบบงานของโรง พยาบาลกับมาตรฐานสถานพยาบาลในด้านการจัดการระบบยา",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดี ร่วมกับ</li>
        <li>
          เชื่อมโยงการจัดการระบบยากับเป้าหมาย วิสัยทัศน์
          และบริบทของโรงพยาบาลแหล่งฝึกนั้นๆ
        </li>
        <li>
          สามารถให้ข้อเสนอเพื่อเพิ่มโอกาสในการปรับปรุงและพัฒนาให้เป็นไปตามมาตรฐานสถานพยาบาล
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ผ่าน ร่วมกับ</li>
        <li>
          สามารถระบุช่องว่างของระบบงานในโรงพยาบาลที่ยังไม่สอดคล้องกับมาตรฐานสถานพยาบาลได้
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          อธิบายถึงระบบงานต่างๆ
          ที่เกี่ยวข้องกับการจัดการด้านยากับมาตรฐานสถานพยาบาลได้อย่างเข้าใจ
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถอธิบายให้เห็นถึงระบบงานต่างๆ
          ที่เกี่ยวข้องกับการจัดการด้านยากับมาตรฐานสถานพยาบาลได้อย่างเข้าใจ
        </li>
      </ul>
    ),
  },
  {
    number: "1",
    point: 1,
    label: "p2",
    title:
      "2. ตระหนักถึงปัญหาหรือความเสี่ยงของระบบยาในโรงพยาบาลที่จะส่งผลกระทบต่อความปลอดภัยของผู้ป่วย",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดี ร่วมกับ</li>
        <li>
          สามารถให้ข้อเสนอแนะในการแก้ไขปัญหาเบื้องต้นได้ตรงประเด็น
          และมีความเป็นไปได้ในการนำไปปฏิบัติ โดยคิดและวิเคราะห์ได้ด้วยตนเอง
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ “ผ่าน”</li>
        <li>เห็นความสำคัญของปัญหาหรือความเสี่ยง</li>
        <li>
          พยายามแจ้งหรือส่งต่อข้อมูลปัญหาหรือความเสี่ยงที่ไม่ควรปล่อยปละละเลยให้กับผู้ที่เกี่ยวข้อง
        </li>
        <li>มีความกระตือรือร้นในการหาทางแก้ไขหรือป้องกันปัญหาหรือความเสี่ยง</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          อธิบายให้เห็นถึงผลกระทบที่เกิดขึ้นจากปัญหาหรือความเสี่ยงของระบบยาที่ส่งผลกระทบต่อความปลอดภัยในการใช้ยาของผู้ป่วย
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่เห็นความสำคัญ
          หรือไม่สามารถอธิบายให้เห็นถึงผลกระทบที่เกิดขึ้นจากปัญหาหรือความเสี่ยงของระบบยาที่ส่งผลกระทบต่อความปลอดภัยในการใช้ยาของผู้ป่วย
        </li>
      </ul>
    ),
  },

  {
    number: "2",
    point: 2,
    label: "p3",
    title:
      "3. วิเคราะห์ถึงรากสาเหตุของปัญหาความไม่ปลอดภัยจากการใช้ยา (Riskidentification : RCA)",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดี ร่วมกับ</li>
        <li>
          สามารถตามรอยของรากปัญหาได้อย่างครบถ้วนและเชื่อมโยงข้อมูลได้ด้วยตนเองโดยอาศัยการแนะนำเพียงเล็กน้อย
        </li>
        <li>
          สามารถสื่อสารความเห็นหรือประเด็นได้อย่างเหมาะสมและไม่ก่อให้เกิดความขัดแย้ง
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ผ่าน ร่วมกับ</li>
        <li>
          อธิบายความเชื่อมโยงของปัญหากับระบบงานและหน่วยงานที่เกี่ยวข้องได้อย่างครบถ้วน
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          อธิบายผังงานเชื่อมโยงระบบความปลอดภัยด้านยาในส่วนต่างๆ ของโรงพยาบาล
        </li>
        <li>ระบุปัญหาหรือความเสี่ยงของระบบ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถอธิบายผังงานที่เชื่อมโยงระบบความปลอดภัยด้านยาในส่วนต่างๆ
          ของโรงพยาบาล
        </li>
      </ul>
    ),
  },
  {
    number: "2",
    point: 2,
    label: "p4",
    title:
      "4. วิเคราะห์ถึงผลกระทบของปัญหาความไม่ปลอดภัยจากการใช้ยา (Risk assessment)",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดี ร่วมกับ</li>
        <li>
          สามารถคาดการณ์ผลกระทบที่จะเกิดขึ้นหากเกิดเหตุการณ์นั้นซ้ำ
          หรือเหตุการณ์ความคลาดเคลื่อนทางยาอื่นที่มีโอกาสเกิดได้
        </li>
        <li>
          สามารถสื่อสารความเห็นหรือประเด็นได้อย่างเหมาะสมและไม่ก่อให้เกิดความขัดแย้ง
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ผ่าน ร่วมกับ</li>
        <li>จัดลำดับความสำคัญของปัญหาได้อย่างเหมาะสม</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>อธิบายผลกระทบจากปัญหา</li>
        <li>ระบุความรุนแรงของปัญหาได้ (A-I) และอธิบายได้อย่างถูกต้อง</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุหรืออธิบายระดับความรุนแรงและผลกระทบของปัญหาที่เกิดขึ้นได้อย่างเข้าใจ
        </li>
      </ul>
    ),
  },
  {
    number: "2",
    point: 2,
    label: "p5",
    title:
      "5. สังเคราะห์กระบวนการแก้ไขหรือป้องกันปัญหาที่สอดคล้องกับบริบทของหน่วยงาน (Risk management)",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดี ร่วมกับ</li>
        <li>
          สังเคราะห์แผนการจัดการความเสี่ยงมีความสมบูรณ์และสามารถดำเนินการได้จริงได้ด้วยตนเอง
        </li>
        <li>
          สามารถสื่อสารความเห็นหรือประเด็นได้อย่างเหมาะสมและไม่ก่อให้เกิดความขัดแย้ง
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ผ่าน ร่วมกับ</li>
        <li>
          ดำเนินการได้ด้วยตนเองโดยอาศัยคำแนะนำเพียงเล็กน้อยจากเภสัชกรแหล่งฝึก
        </li>
        <li>
          สามารถสังเคราะห์แผนการจัดการความเสี่ยงที่มีการรวบรวมข้อมูลได้อย่างเป็นปัจจุบันและถูกต้อง
        </li>
        <li>
          โดยอ้างอิงจากหลักฐานเชิงประจักษ์ที่ผ่านการวิเคราะห์และประเมินมาแล้ว
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          กำหนดวัตถุประสงค์ (purpose)
          ของการจัดการความเสี่ยงได้อย่างเหมาะสมและสอดคล้องกับบริบทของหน่วยงาน
        </li>
        <li>สังเคราะห์กระบวนการแก้ไขหรือป้องปัญหาโดยไม่แสดงอคติ</li>
        <li>
          สร้างแผน (plan) การจัดการความเสี่ยงที่สอดคล้องกับบริบทของหน่วยงานได้
        </li>
        <li>
          กำหนดตัวชี้วัด (performance)
          ที่ใช้ติดตามผลการจัดการความเสี่ยงที่สอดคล้องกับบริบทของหน่วยงานและสามารถดำเนินการได้จริง
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          กำหนดวัตถุประสงค์ของการจัดการความเสี่ยงได้ตามหลักการ
          แต่ไม่สอดคล้องกับบริบทของหน่วยงาน
        </li>
        <li>
          สร้างแผนการจัดการความเสี่ยงได้ แต่ไม่สอดคล้องกับบริบทของหน่วยงาน
        </li>
        <li>
          กำหนดตัวชี้วัดที่ใช้ติดตามผลการจัดการความเสี่ยงได้
          แต่ไม่สอดคล้องกับบริบทของหน่วยงาน
        </li>
      </ul>
    ),
  },
  {
    number: "1",
    point: 1,
    label: "p6",
    title: "6. ความเป็นวิชาชีพ (Professionalism)",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดี ร่วมกับ</li>
        <li>
          ได้รับคำชื่นชมในบทบาทวิชาชีพเภสัชกรรมจากบุคลากรสาธารณสุขหรือหน่วยงานภายนอก
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่าน ร่วมกับ</li>
        <li>แสดงออกถึงความเป็นวิชาชีพได้อย่างเหมาะสมตลอดเวลาฝึกปฏิบัติงาน</li>
        <li>
          มีความกระตือรือร้นในการทำงานในบทบาทวิชาชีพเภสัชกรรมตลอดเวลาโดยไม่ต้องได้รับความร้องขอหรือคำสั่งของเภสัชกรพี่เลี้ยง
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          มีบุคลิกภาพ การแต่งกาย
          และลักษณะท่าทางการแสดงออกที่น่าเชื่อถือเหมาะสมกับวิชาชีพเภสัชกรรม
        </li>
        <li>
          สามารถตัดสินใจโดยพิจารณาข้อมูลรอบด้านอย่างรอบคอบ
          และยอมรับความเห็นที่แตกต่างในสหวิชาชีพ
        </li>
        <li>ให้เกียรติในการร่วมปฏิบัติงานกับบุคลากรสาธารณสุข</li>
        <li>
          บริบทของหน่วยงานสังเคราะห์กระบวนการแก้ไขหรือป้องปัญหาโดยไม่แสดงอคติ
        </li>
        <li>
          สร้างแผน (plan) การจัดการความเสี่ยงที่สอดคล้องกับบริบทของหน่วยงาน
        </li>
        <li>
          กำหนดตัวชี้วัด (performance)
          ที่ใช้ติดตามผลการจัดการความเสี่ยงที่สอดคล้องกับบริบทของหน่วยงานและสามารถดำเนินการได้จริง
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่มีบุคลิกภาพ การแต่งกาย
          และลักษณะท่าทางการแสดงออกที่น่าเชื่อถือเหมาะสมกับวิชาชีพเภสัชกรรม
        </li>
        <li>ไม่สามารถตัดสินใจโดยพิจารณาข้อมูลรอบด้านอย่างรอบคอบ</li>
        <li>ไม่ให้เกียรติในการร่วมปฏิบัติงานกับบุคลากรสาธารณสุข</li>
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
    p6: parentForm.getValues("result.p6") || "",

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
            ให้อาจารย์ประจำแหล่งฝึกประเมินผลโดยสังเกตจากพฤติกรรม ผลการปฏิบัติงาน
            และ/หรือจากการ อภิปราย สอบถาม การสื่อสาร ทั้งโดยวาจา
            หรือลายลักษณ์อักษร และให้ประเมิน 2 ครั้ง คือในสัปดาห์ที่ 3 และ 6
            ของการฝึกปฏิบัติงาน ผลการประเมินในสัปดาห์ที่ 3
            ควรมีการแจ้งให้นิสิต/นักศึกษาทราบ เพื่อให้เกิด การพัฒนา
            <u className="font-bold">
              การประเมินผลการฝึกปฏิบัติงานจะคิดจากคะแนนในสัปดาห์ที่ 6
            </u>
          </p>
          <p className="text-xs sm:text-sm mb-4">
            ให้ท่านพิจารณาความสามารถของนักศึกษาตามเกณฑ์ที่กำหนดที่ตรงกับทักษะและความสามารถของ
            นิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
            (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ) โดยเกณฑ์ในขั้นที่สูงกว่า
            (ซ้ายมือ) นักศึกษาจะต้องแสดงถึงเกณฑ์ในขั้นที่ต่ำกว่า (ทางขวามือ)
            ด้วยก่อน และเมื่อนักศึกษามี ความสามารถตรงตามเกณฑ์ในระดับใด
            จึงให้ท่านระบุคะแนนของนักศึกษาตามช่วงในช่วงเกณฑ์ที่ท่าน
            พิจารณานั้นโดยทำเครื่องหมาย (✗)
            ลงในช่องที่อยู่ท้ายหัวข้อที่ประเมินแต่ละหัวข้อ
          </p>
          <p className="text-xs sm:text-sm mb-4">
            ตัวอย่างเช่น หากท่านประเมินนักศึกษาว่ามีความสามารถในหัวข้อ{" "}
            <u className="font-bold">
              “เชื่อมโยงแผนผังระบบงานของ
              โรงพยาบาลกับมาตรฐานสถานพยาบาลในด้านการจัดการระบบยา”
            </u>{" "}
            อยู่ในเกณฑ์ดี (8–9 คะแนน) ท่าน สามารถเลือกให้คะแนน 8 หรือ 9
            แก่นักศึกษาได้ ทั้งนี้ขึ้นกับความเห็นของท่าน
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
                  ดีมาก <div className="text-xs">(10 คะแนน)</div>
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  ดี <div className="text-xs">(8-9 คะแนน)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  ผ่าน <div className="text-xs">(6-7 คะแนน)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  ควรปรับปรุง <div className="text-xs">(0-5 คะแนน)</div>
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
                              label: "10",
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
                              label: "9",
                              value: "9",
                            },
                            {
                              label: "8",
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
                              label: "7",
                              value: "7",
                            },
                            {
                              label: "6",
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
                              label: "5",
                              value: "5",
                            },
                            {
                              label: "4",
                              value: "4",
                            },
                            {
                              label: "3",
                              value: "3",
                            },
                            {
                              label: "2",
                              value: "2",
                            },
                            {
                              label: "1",
                              value: "1",
                            },
                            {
                              label: "0",
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
                </tbody>
              );
            })}
            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="p-2 border align-top text-center text-md"
                >
                  ปรับให้เป็นคะแนนเต็ม 10 คะแนน =
                  <span className="font-mono">
                    (คะแนนที่ประเมินได้ &divide; 100) &times; 10
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
