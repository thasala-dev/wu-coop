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
    title: "1. Problem Identification and Prioritization",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ</li>
        <li>สามารถเรียงลำดับความสำคัญของปัญหาที่ต้องได้รับการแก้ไขได้</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ</li>
        <li>ระบุปัญหาได้ครบถ้วน</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>สามารถระบุปัญหาของผู้ป่วยหรือปัญหาจากการใช้ยาได้อย่างตรงประเด็น</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุปัญหาของผู้ป่วยหรือปัญหาจากการใช้ยาได้
          หรือระบุได้แต่ไม่ตรงประเด็น
        </li>
      </ul>
    ),
  },
  {
    number: "1",
    point: 1,
    label: "p2",
    title: "2. Subjective Information",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุข้อมูล S ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง
          ตรงประเด็น และสามารถระบุได้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุข้อมูล S ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง
          ครบถ้วนตามข้อมูลที่มีอยู่
          แต่ยังไม่สามารถรู้ว่าข้อมูลที่สำคัญใดที่หายไป
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุข้อมูล S
          ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครอบคลุมเป็นส่วนใหญ่
        </li>
        <li>ไม่มีข้อมูลที่ไม่จำเป็น หรือไม่เกี่ยวข้อง</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุข้อมูล S ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครบถ้วน
          หรือ ระบุได้เพียงเล็กน้อย
        </li>
        <li>มีข้อมูลที่ไม่จำเป็น และไม่เกี่ยวข้องกับปัญหาของผู้ป่วย</li>
      </ul>
    ),
  },

  {
    number: "1",
    point: 1,
    label: "p3",
    title: "3. Objective Information",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุข้อมูล O ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง
          ตรงประเด็น และสามารถระบุได้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุข้อมูล O ที่ สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง
          ครบถ้วนตามข้อมูลที่มีอยู่แต่ยังไม่สามารถรู้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุข้อมูล O
          ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครอบคลุมเป็นส่วนใหญ่
        </li>
        <li>ไม่มีข้อมูลที่ไม่จำเป็น หรือไม่เกี่ยวข้อง</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุข้อมูล O ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครบถ้วน
          หรือ ระบุได้เพียงเล็กน้อย
        </li>
        <li>มีข้อมูลที่ไม่จำเป็น และไม่เกี่ยวข้องกับปัญหาของผู้ป่วย</li>
      </ul>
    ),
  },
  {
    number: "2",
    point: 2,
    label: "p4",
    title:
      "4. Etiology / Cause / Risk factors of problem identified ที่เกี่ยวข้องกับการใช้ยาและการปฏิบัติตัว",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ</li>
        <li>
          สามารถอธิบายเชื่อมโยงสาเหตุ/ปัจจัยเสี่ยงกับปัญหาของผู้ป่วยได้อย่างเข้าใจ
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ</li>
        <li>ระบุสาเหตุ/ปัจจัยเสี่ยงของปัญหาของผู้ป่วยได้ครบถ้วน</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุสาเหตุ/ปัจจัยเสี่ยงของปัญหาของผู้ป่วยได้อย่างตรงประเด็น
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุสาเหตุ/ปัจจัยเสี่ยงของปัญหาของผู้ป่วย (เน้นปัญหาหลัก)
          หรือระบุได้แต่ไม่ตรงประเด็น
        </li>
      </ul>
    ),
  },
  {
    number: "2",
    point: 2,
    label: "p5",
    title: "5. Treatment Goals",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ</li>
        <li>เหมาะสมและสอดคล้องกับผู้ป่วยแต่ละราย และบริบทในสถานการณ์จริง</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ</li>
        <li>
          ระบุเป้าหมายที่เป็นไปตามเป้าหมายของหลักฐานอ้างอิงทางวิชาการที่เลือกใช้ได้อย่างครบถ้วน
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุเป้าหมายที่เป็นไปตามเป้าหมายของหลักฐานอ้างอิงทางวิชาการที่เลือกใช้เป็นส่วนใหญ่
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุเป้าหมายหลักที่เป็นไปตามเป้าหมายของแนวทางการรักษาที่เลือกใช้
        </li>
      </ul>
    ),
  },
  {
    number: "3",
    point: 3,
    label: "p6",
    title:
      "6. Assessment of Current Medical Condition(s) หรือ Drug Therapy-related Problem",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีรวมกับ</li>
        <li>
          เชื่อมโยงปัญหาและข้อมูลที่ระบุได้มาใช้เพื่อประเมินทางเลือกในการแก้ไขหรือจัดการปัญหาได้อย่างเหมาะสมโดยพิจารณาจากข้อมูลรอบด้าน
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านรวมกัน</li>
        <li>
          ประเมินแผนการแก้ไขปัญหาได้อย่างเหมาะสมและมีหลักฐานอ้างอิงทางวิชาการรองรับ
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถประเมินปัญหาจากการใช้ยาได้อย่างเป็นระบบ (เช่น
          การประเมินปัญหาการใช้ยาตาม IESAC)
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถประเมินปัญหาจากการใช้ยาได้อย่างเป็นระบบ</li>
      </ul>
    ),
  },
  {
    number: "1",
    point: 1,
    label: "p7",
    title: "7. Treatment Plan",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ</li>
        <li>เหมาะสมและสอดคล้องกับบริบทในสถานการณ์จริง หรือ</li>
        <li>ตรงตามสภาวะและความต้องการของผู้ป่วย</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ</li>
        <li>
          ครบถ้วน ตรงประเด็น ทำได้จริง (แนะนำรวมไปถึง ชื่อยา ขนาดยา วิธี
          การให้ยา ความถี่ และระยะเวลาในการให้ยา)
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุแผนการรักษาที่สอดคล้องกับที่ประเมินไว้ (assessment)
          และเป็นไปตามหลักฐานอ้างอิงทางวิชาการ
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุแผนการรักษาได้
          หรือระบุได้แต่ไม่เป็นไปตามหลักฐานอ้างอิงทางวิชาการ
        </li>
      </ul>
    ),
  },
  {
    number: "1",
    point: 1,
    label: "p8",
    title: "8. Monitoring & Follow-up",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีรวมกับ</li>
        <li>เหมาะสมและสอดคล้องกับบริบทในสถานการณ์จริง หรือ</li>
        <li>ตรงตามสภาวะและความต้องการของผู้ป่วย</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านรวมกับ</li>
        <li>
          วางแผนการติดตามได้อย่างครบถ้วน ตรงประเด็น ทำได้จริง
          (ระบุความถี่และระยะเวลาการติดตามได้อย่างเหมาะสม)
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถวางแผนการติดตามการรักษาได้อย่างครอบคลุมทั้งประเด็นในด้านประสิทธิภาพและความปลอดภัย
          และเป็นไปตามหลักฐานอ้างอิงทางวิชาการ
        </li>
        <li>กำหนดแผนตัวชี้วัดที่ใช้ในการติดตามได้จริง</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถวางแผนการติดตามการรักษาได้อย่างครอบคลุม ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "1",
    point: 1,
    label: "p9",
    title: "9. Patient education",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ดีร่วมกับ</li>
        <li>เหมาะสมและสอดคล้องกับบริบทในสถานการณ์จริง หรือ</li>
        <li>ตรงตามสภาวะและความต้องการของผู้ป่วย</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ ผ่านร่วมกับ</li>
        <li>ครบถ้วน ตรงประเด็น</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถให้คำปรึกษา การแก้ไข/ป้องกันปัจจัยเสี่ยงได้อย่างครอบคลุม
          และเป็นไปตามหลักฐานอ้างอิงทางวิชาการ
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถให้คำปรึกษา การแก้ไข/ป้องกันปัจจัยเสี่ยงได้</li>
      </ul>
    ),
  },
  {
    number: "1",
    point: 1,
    label: "p10",
    title: "10. วิธีการนําเสนอ",
    superd: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ดีร่วมกับ</li>
        <li>การนำเข้าสู่เนื้อหาได้น่าสนใจ</li>
        <li>การใช้เทคนิคการนำเสนอสามารถสร้างการมีส่วนร่วมของผู้ฟัง</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ</li>
        <li>
          การสื่อสารให้ผู้ฟังเข้าใจได้อย่างเหมาะสม (สื่อสารเสียงดังชัดเจน
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
        <li>เนื้อหาเอกสาร สื่อประกอบการนำเสนอ มีการสะกดผิดมาก</li>
        <li>ไม่ชัดเจนหรือขนาดอักษรเล็กมาก</li>
        <li>ไม่สามารถสื่อสารให้ผู้ฟังเข้าใจได้ หรือทำให้ผู้ฟังเกิดความสับสน</li>
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
    p7: parentForm.getValues("result.p7") || "",
    p8: parentForm.getValues("result.p8") || "",
    p9: parentForm.getValues("result.p9") || "",
    p10: parentForm.getValues("result.p10") || "",

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
            ให้ท่านพิจารณาความสามารถของนิสิต/นักศึกษาตามเกณฑ์ที่กำหนดที่ตรงกับทักษะและความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
            (ประเมินทั้งในและ นอกเวลาการฝึกปฏิบัติงานฯ) โดยเกณฑ์ในขั้นที่สูงกว่า
            (ซ้ายมือ) นิสิต/นักศึกษาจะต้องแสดงถึงเกณฑ์ในขั้นที่ต่ำกว่า
            (ทางขวามือ) ด้วยก่อน และเมื่อนิสิต/นักศึกษามี
            ความสามารถตรงตามเกณฑ์ในระดับใด
            จึงให้ท่านระบุคะแนนของนิสิต/นักศึกษาตามช่วงในช่วงเกณฑ์ที่ท่านพิจารณานั้นโดยทำเครื่องหมาย
            (✗) ลงในช่องที่อยู่ท้ายหัวข้อที่ ประเมินแต่ละหัวข้อ
            <u className="font-bold">
              กรณีไม่สามารถประเมินในหัวข้อนั้นได้ให้ทำเครื่องหมาย (✗) ลงตรงช่อง
              N/A
            </u>
            <br />
            ตัวอย่างเช่น หากท่านประเมินนิสิต/นักศึกษาว่ามีความสามารถในหัวข้อ
            “Subjective Information” อยู่ในเกณฑ์ “ดี” (8-9 คะแนน)
            ท่านสามารถเลือกให้คะแนน 8 หรือ 9 แก่นิสิต/นักศึกษาได้ ทั้งนี้
            ขึ้นกับความเห็นของท่าน
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
                  {(() => {
                    // คำนวณคะแนนรวม
                    let totalScore = 0;
                    let hasNA = false;

                    criteriaData.forEach((item) => {
                      const value = data[item.label as keyof typeof data];
                      if (value === "N/A") {
                        hasNA = true;
                      } else if (value && value !== "") {
                        totalScore += parseFloat(value) * item.point;
                      }
                    });

                    // คำนวณคะแนนเต็ม 5
                    const finalScore = (totalScore / 150) * 5;
                    const displayScore = hasNA ? "N/A" : toThaiNumber(parseFloat(finalScore.toFixed(2)));

                    return (
                      <>
                        ปรับให้เป็นคะแนนเต็ม 5 คะแนน =
                        <span className="font-mono">
                          ({totalScore > 0 ? toThaiNumber(totalScore) : "__"} &divide; 150) &times; 5
                        </span>
                        &nbsp;= <span className="font-bold">{totalScore > 0 ? displayScore : "______"}</span> คะแนน
                      </>
                    );
                  })()}
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
