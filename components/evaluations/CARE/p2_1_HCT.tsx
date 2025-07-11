import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { number } from "zod";

const locationList = [
  {
    label: "ผู้ป่วยนอก",
    value: "ผู้ป่วยนอก",
  },
  {
    label: "ผู้ป่วยใน",
    value: "ผู้ป่วยใน",
  },
  {
    label: "ร้านยา",
    value: "ร้านยา",
  },
  {
    label: "อื่น ๆ (โปรดระบุ)",
    value: "อื่นๆ",
  },
];

const communicatorList = [
  {
    label: "แพทย์",
    value: "แพทย์",
  },
  {
    label: "พยาบาล",
    value: "พยาบาล",
  },
  {
    label: "เภสัชกร",
    value: "เภสัชกร",
  },
  {
    label: "อื่น ๆ (โปรดระบุ)",
    value: "อื่นๆ",
  },
];

const levelList = [
  {
    label: "ง่าย",
    value: "ง่าย",
  },
  {
    label: "ปานกลาง",
    value: "ปานกลาง",
  },
  {
    label: "ยาก",
    value: "ยาก",
  },
];

const toThaiNumber = (number: number) => {
  const thaiNumbers = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  return number
    .toString()
    .split("")
    .map((digit) => thaiNumbers[parseInt(digit, 10)])
    .join("");
};

const criteriaData = [
  {
    number: "๑",
    point: 1,
    label: "p1",
    title: "๑. ทักษะการสื่อสาร",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สื่อสารกับบุคลากรสาธารณสุขได้
          อย่างเหมาะสมและสอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วย เทคนิค SBAR
        </li>
        <li>
          สื่อสารด้วย soft skills ได้อย่าง เหมาะสม เช่น การใช้น้ำเสียง สายตา
        </li>
        <li>สื่อสารซักประวัติได้อย่างครบถ้วน อย่างเป็นลำดับขั้นตอน ไม่วกวน</li>
        <li>บริหารจัดการเวลาการสื่อสารได้ อย่างเหมาะสม</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สื่อสารกับบุคลากรสาธารณสุขได้อย่างเหมาะสมและสอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วย
          เทคนิค SBAR
        </li>
        <li>สื่อสารอย่างเป็นลำดับขั้นตอน ไม่วกวน</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สื่อสารกับบุคลากรสาธารณสุขได้อย่างเหมาะสม
          และสอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วยเทคนิค SBAR
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          สื่อสารกับบุคลากรสาธารณสุขได้อย่างไม่เหมาะสม
          หรือไม่สอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วยเทคนิค SBAR
          (ดูรายละเอียด SBAR ที่คำอธิบายด้านบน)
        </li>
      </ul>
    ),
  },
  {
    number: "๒",
    point: 2,
    label: "p2",
    title: "๒. ความเป็นวิชาชีพ",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          มีบุคลิกดูน่าเชื่อถือและแสดงออกให้เห็นถึงความเป็นเภสัชกรมืออาชีพอย่างชัดเจน
        </li>
        <li>
          ใช้กิริยาท่าทาง
          และวาจาที่ให้เกียรติเก่ียรติแก่บุคลากรสาธารณสุขตลอดเวลา
        </li>
        <li>ไม่ก้าวก่ายหน้าที่ในการปฏิบัติงานของบุคลากรสาธารณสุขอื่น</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          มีบุคลิกดูน่าเชื่อถือ
          และแสดงออกให้เห็นถึงความเป็นเภสัชกรมืออาชีพอย่างชัดเจน
        </li>
        <li>ใช้กิริยาท่าทาง และวาจาที่ให้เกียรติแก่บุคลากรสาธารณสุขตลอดเวลา</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>มีบุคลิกดูน่าเชื่อถือ</li>
        <li>ใช้กิริยาท่าทาง และวาจาที่ให้เกียรติแก่บุคลากรสาธารณสุข</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>มีบุคลิกดูไม่น่าเชื่อถือ</li>
        <li>ใช้กิริยาท่าทาง หรือวาจาที่ไม่ให้เกียรติแก่บุคลากรสาธารณสุข</li>
      </ul>
    ),
  },
  {
    number: "๒",
    point: 2,
    label: "p3",
    title: "๓. การตัดสินใจ",
    superd: (
      <ul>
        <li>
          ตัดสินใจอย่างมีเหตุผล โดยนำข้อมูลที่เกี่ยวข้อง
          พร้อมทั้งยกหลักฐานทางวิชาการมาใช้ประกอบการตัดสินใจโดยคำนึงเป้าหมายของการรักษาเป็นสำคัญ
        </li>
      </ul>
    ),
    good: (
      <ul>
        <li>
          ตัดสินใจอย่างมีเหตุผล โดยนำข้อมูลที่เกี่ยวข้อง
          พร้อมทั้งยกหลักฐานทางวิชาการมาใช้ประกอบการตัดสินใจ
        </li>
      </ul>
    ),
    pass: (
      <ul>
        <li>
          ตัดสินใจอย่างมีเหตุผล โดยนำข้อมูลที่เกี่ยวข้องมาใช้ประกอบการ ตัดสินใจ
        </li>
      </ul>
    ),
    fail: (
      <ul>
        <li>
          ตัดสินใจโดยไม่มีเหตุผล หรือไม่นําข้อมูลที่ เกี่ยวข้องมาใช้
          ประกอบการตัดสินใจ
        </li>
      </ul>
    ),
  },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    location: parentForm.getValues("result.location") || "",
    locationOther: parentForm.getValues("result.locationOther") || "",
    communicator: parentForm.getValues("result.communicator") || "",
    communicatorOther: parentForm.getValues("result.communicatorOther") || "",
    level: parentForm.getValues("result.level") || "",

    p1: parentForm.getValues("result.p1") || "",
    p2: parentForm.getValues("result.p2") || "",
    p3: parentForm.getValues("result.p3") || "",

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
    let isValid = false;
    Object.keys(data).forEach((key) => {
      if (key === "locationOther" || key === "communicatorOther") {
        isValid = false;
      }
      const value = data[key as keyof typeof data];
      if (!value) {
        return true;
      }
    });
    return !isValid;
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12 ">
      <div className="sm:col-span-12 ">
        <div className="">
          <p className="text-sm pt-2">
            <u className="font-medium italic">คําอธิบาย</u>
          </p>
          <p className="text-sm">
            Mini-CEx (Mini Clinical Evaluation Exercise) เป็นการประเมินแบบ
            Workplace-based Assessment ที่มุ่งเน้นการประเมิน{" "}
            <u className="font-medium italic">
              ทักษะทางคลินิก (Clinical Skill)
            </u>{" "}
            ของนิสิต/นักศึกษาในสถานการณ์จริงร่วม{" "}
            <u className="font-medium italic">(บุคลากรสาธารณสุข)</u> โดยมี{" "}
            <u className="font-medium italic">
              อาจารย์ประจำแหล่งฝึกเป็นผู้ประเมิน
            </u>{" "}
            โดยประเมินใน 2 ประเด็น ได้แก่ ทักษะการสื่อสารกับบุคลากรสาธารณสุข
            (Psychomotor Domain) ความเป็นวิชาชีพ (Professional Domain)
            การประเมินนี้มุ่งเน้นทักษะใน
            <u className="font-medium italic">
              การเผชิญหน้า (Encounter) กับบุคลากรสาธารณสุข
            </u>{" "}
            การตัดสินใจ และ
            <u className="font-medium italic">
              การปฏิบัติตามหลักเกณฑ์การสื่อสาร
            </u>
            เพื่อให้เกิดผลลัพธ์การสื่อสารที่มีประสิทธิภาพ
            โดยอาจมีการประเมินหลายครั้ง และเป็นการประเมินในลักษณะ Formative
            Assessment
          </p>
          <p className="text-sm pt-2">
            <u className="font-medium italic">
              การเตรียมตัวประเมิน Mini-CEx มีขั้นตอนดังนี้
            </u>
          </p>
          <div className="text-sm">
            <ul>
              <li>
                ๑.
                อาจารย์ประจำแหล่งฝึกเตรียมความพร้อมกับบุคลากรสาธารณสุขไว้ล่วงหน้า
                โดยขออนุญาตบุคลากรสาธารณสุขว่าจะมีนิสิต/นักศึกษามาฝึกปฏิบัติ
              </li>
              <li>
                ๒. อาจารย์ประจำแหล่งฝึกแนะนำขั้นตอน
                เกณฑ์การประเมินแก่นิสิต/นักศึกษาที่เข้ารับการประเมิน
                และให้นิสิต/นักศึกษาเลือกว่าจะสื่อสารกับบุคลากรสาธารณสุขในประเด็นใด
              </li>
              <li>
                ๓. อาจารย์ประจำแหล่งฝึกให้นิสิต/นักศึกษาปฏิบัติ
                โดยทำหน้าที่เฝ้าดูและให้การช่วยเหลือเฉพาะเมื่อจำเป็น
                อาจารย์ประจำแหล่งฝึกไม่ควรช่วยนิสิต/นักศึกษาในการสื่อสาร
                การสื่อสารจะใช้เวลาไม่เกิน ๑๕ นาที
              </li>
              <li>
                ๔. หลังเสร็จสิ้นการสื่อสาร
                อาจารย์ประจำแหล่งฝึกให้นิสิต/นักศึกษาสะท้อนกลับ (reflection)
                และอาจารย์ประจำแหล่งฝึกให้การป้อนกลับ (feedback)
                ผลการประเมินให้นิสิต/นักศึกษาทราบ ใช้เวลาไม่เกิน ๕ นาที ดังนี้
              </li>
              <li className="pl-4">
                ๔.๑ Reflection: ให้อาจารย์ประจำแหล่งฝึกถาม ๓
                คำถามเพื่อให้นิสิต/นักศึกษาสะท้อนกลับ ดังนี้ ๑)
                เมื่อสักครู่นี้ได้ทำอะไรบ้าง รู้สึกอย่างไร ๒)
                ได้เรียนรู้อะไรบ้าง ๓) จะนำไปใช้ประโยชน์ในอนาคตได้อย่างไร
                เน้นให้นิสิต/นักศึกษาพรรณนา
                และอาจารย์ประจำแหล่งฝึกคอยปรับแก้ไขหากมีความเข้าใจผิด
              </li>
              <li className="pl-4">
                ๔.๒ Feedback:
                โดยแจ้งสิ่งที่นิสิต/นักศึกษาปฏิบัติทั้งข้อดีและข้อควรปรับปรุงสลับกัน
                (feedback sandwich) ในส่วนที่ระบุข้อที่ควรปรับปรุง
                ควรมีลักษณะดังนี้ เป็นความจริง ไม่มีการเพิ่มเติมความคิดเห็น
                บอกวิธีการแก้ไขที่ชัดเจน
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="sm:col-span-12 ">
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <p className="text-sm mb-2">
            <strong>คำชี้แจง</strong>
          </p>
          <p className="text-xs sm:text-sm mb-4">
            ให้ท่านพิจารณาความสามารถของนิสิต/นักศึกษาตามเกณฑ์ที่ระบุที่ตรงกับทักษะและความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
            (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ)
            จากนั้นจึงให้ระบุคะแนนในช่วงเกณฑ์ที่ตรงตามความสามารถของนิสิต/นักศึกษาโดยทำเครื่องหมาย
            (✗) ลงในช่องตัวเลขของหัวข้อที่ประเมิน
            กรณีไม่สามารถประเมินในหัวข้อนั้นได้ให้ทำเครื่องหมาย (✗) ลงตรงช่อง
            N/A{" "}
            <u className="font-bold">
              ทั้งนี้ ควรทำการประเมินนิสิต/นักศึกษาอย่างน้อย ๒ ครั้ง และควรให้
              feedback นิสิต/นักศึกษาทุกครั้ง
              โดยจะคิดคะแนนจากครั้งที่ทำได้สูงสุด
            </u>
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 ">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border text-left text-sm">
                เกณฑ์การสื่อสารกับสหวิชาชีพด้วย SBAR เทคนิค
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border font-medium align-top text-sm">
                <u className="font-bold">S - Situation</u>{" "}
                ผู้รายงานระบุสถานการณ์อย่างสั้น ๆ ได้แก่ การระบุตัวผู้รายงาน
                โดยเริ่มต้นแจ้งชื่อ ตำแหน่งของตนเอง
                แจ้งชื่อผู้ป่วยและจุดที่ผู้ป่วยกำลังรับการรักษาหรือหมายเลขห้อง
                รายงานสภาพปัญหาของผู้ป่วยที่พบแบบรวบรัดกระชับ เวลาที่เกิด
                ความรุนแรง
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm">
                <u className="font-bold">B - Background</u>{" "}
                ข้อมูลภูมิหลังเกี่ยวกับสถานการณ์ ได้แก่
                การให้ข้อมูลทางคลินิกหรือตอบคำถามที่เกี่ยวข้องกับสถานการณ์ เช่น
                วันที่เข้ารับการรักษา การวินิจฉัยโรคตอนแรกรับการรักษา
                รายการยาที่ผู้ป่วยใช้ สารน้ำที่กำลังให้อยู่ ประวัติแพ้ยา
                ประวัติการใช้ยาเดิม เป็นต้น รายงานสัญญาณชีปล่าสุด
                ผลตรวจทางห้องปฏิบัติการ และวันเวลาที่ทำการทดสอบ
                ผลการทดสอบครั้งที่แล้วเพื่อเปรียบเทียบ (ถ้ามี)
                ข้อมูลทางคลินิกอื่น ๆ (ถ้ามี)
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm">
                <u className="font-bold">A - Assessment</u> การประเมินผู้ป่วย
                ได้แก่ การสรุปสิ่งที่สังเกตเกี่ยวกับสถานการณ์ในมุมมองของตนเอง
                รายงานสิ่งที่ตนเองสังเกตเห็น ภาวะรุนแรงของปัญหา เช่น
                ผู้ป่วยมีปัสสาวะสีน้ำตาลอ่อน ผลการวิเคราะห์
                และพิจารณาทางเลือกต่าง ๆ ของตนเอง
                ปัญหานี้รุนแรงหรืออันตรายถึงชีวิตหรือไม่
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm">
                <u className="font-bold">R - Recommendation</u> ข้อเสนอแนะ
                ได้แก่ การให้ความเห็นหรือข้อเสนอแนะในการแก้ไขปัญหาของผู้ป่วย
                สิ่งที่คิดว่าจำเป็นสำหรับผู้ป่วย
                ข้อเสนอแนะหรือสิ่งที่จำเป็นในการแก้ไขปัญหาของผู้ป่วย
                สิ่งที่ต้องเสนอแพทย์
                สิ่งที่ต้องการจากแพทย์ในการช่วยให้อาการของผู้ป่วยดีขึ้น
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบฟอร์มการประเมิน</p>
      </div>

      <div className="sm:col-span-12">
        <div>
          <RadioGroup
            onValueChange={(value) => setDataValue("location", value)}
            value={data.location}
            className="flex flex-row items-center gap-4 w-full"
          >
            <label className="text-sm">สถานที่ประเมิน</label>
            {locationList.map((item) => (
              <div
                className="flex flex-row items-center gap-2 justify-center"
                key={item.value}
              >
                <RadioGroupItem
                  value={item.value}
                  className={
                    isSubmit && !data.location ? "border-2 border-red-600" : ""
                  }
                  aria-invalid={isSubmit && !data.location}
                />
                <label
                  className={
                    "text-sm" +
                    (isSubmit && !data.location ? " text-red-600" : "")
                  }
                >
                  {item.label}
                </label>
              </div>
            ))}
            <div className="flex flex-row items-center gap-2 justify-center">
              <input
                type="text"
                value={data.locationOther}
                onChange={(value) =>
                  setDataValue("locationOther", value.target.value)
                }
                disabled={data.location !== "อื่นๆ"}
                placeholder="โปรดระบุ"
                aria-invalid={isSubmit && !data.locationOther}
                className={
                  "w-full p-1 border rounded-md text-sm " +
                  (data.location == "อื่นๆ" && isSubmit && !data.locationOther
                    ? "border-red-600  border-2"
                    : "")
                }
              />
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div>
          <RadioGroup
            onValueChange={(value) => setDataValue("communicator", value)}
            value={data.communicator}
            className="flex flex-row items-center gap-4 w-full"
          >
            <label className="text-sm">
              บุคลากรที่นิสิต/นักศึกษาสื่อสารด้วย
            </label>
            {communicatorList.map((item) => (
              <div
                className="flex flex-row items-center gap-2 justify-center"
                key={item.value}
              >
                <RadioGroupItem
                  value={item.value}
                  className={
                    isSubmit && !data.communicator
                      ? "border-2 border-red-600"
                      : ""
                  }
                  aria-invalid={isSubmit && !data.communicator}
                />
                <label
                  className={
                    "text-sm" +
                    (isSubmit && !data.communicator ? " text-red-600" : "")
                  }
                >
                  {item.label}
                </label>
              </div>
            ))}
            <div className="flex flex-row items-center gap-2 justify-center">
              <input
                type="text"
                value={data.communicatorOther}
                onChange={(value) =>
                  setDataValue("communicatorOther", value.target.value)
                }
                disabled={data.communicator !== "อื่นๆ"}
                placeholder="โปรดระบุ"
                aria-invalid={isSubmit && !data.communicatorOther}
                className={
                  "w-full p-1 border rounded-md text-sm " +
                  (data.communicator == "อื่นๆ" &&
                  isSubmit &&
                  !data.communicatorOther
                    ? "border-red-600  border-2"
                    : "")
                }
              />
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div>
          <RadioGroup
            onValueChange={(value) => setDataValue("level", value)}
            value={data.level}
            className="flex flex-row items-center gap-4 w-full"
          >
            <label className="text-sm">
              ความยาก/ง่าย{" "}
              <i>(ผู้ประเมินเป็นผู้ตัดสินใจว่ามีความยาก/ง่ายในระดับใด)</i>
            </label>
            {levelList.map((item) => (
              <div
                className="flex flex-row items-center gap-2 justify-center"
                key={item.value}
              >
                <RadioGroupItem
                  value={item.value}
                  className={
                    isSubmit && !data.level ? "border-2 border-red-600" : ""
                  }
                  aria-invalid={isSubmit && !data.level}
                />
                <label
                  className={
                    "text-sm" + (isSubmit && !data.level ? " text-red-600" : "")
                  }
                >
                  {item.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "10%" }}
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
                  style={{ width: "10%" }}
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
