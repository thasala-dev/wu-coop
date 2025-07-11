import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

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
          สื่อสารกับผู้ป่วยได้อย่างเหมาะสมและสอดคล้องตามเกณฑ์การสัมภาษณ์ผู้ป่วย
        </li>
        <li>สื่อสารซักประวัติได้อย่างครบถ้วนอย่างเป็นลำดับขั้นตอน ไม่วกวน</li>
        <li>
          สื่อสารด้วย soft skills ได้อย่างเหมาะสม เช่น การใช้น้ำเสียง สายตา
        </li>
        <li>บริหารจัดการเวลาในการสื่อสารได้อย่างเหมาะสม</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สื่อสารกับผู้ป่วยได้อย่างเหมาะสมและสอดคล้องตามเกณฑ์การสัมภาษณ์ผู้ป่วย
        </li>
        <li>สื่อสารอย่างเป็นลำดับขั้นตอน ไม่วกวน</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สื่อสารกับผู้ป่วยได้อย่างเหมาะสมและสอดคล้องตามเกณฑ์การสัมภาษณ์ผู้ป่วย
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          สื่อสารกับผู้ป่วยได้อย่างไม่เหมาะสมหรือไม่สอดคล้องตามเกณฑ์การสัมภาษณ์ผู้ป่วย
          (ดูรายละเอียดเกณฑ์การสัมภาษณ์ผู้ป่วยที่คำอธิบายด้านบน)
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
        <li>ใช้กิริยาท่าทาง และวาจาที่ให้เกียรติแก่ผู้ป่วยตลอดเวลา</li>
        <li>ระมัดระวังการพูดในสิ่งที่เป็นความลับของผู้ป่วย</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          มีบุคลิกดูน่าเชื่อถือและ แสดงออกให้เห็นถึงความ เป็นเภสัชกรมืออาชีพ
          อย่างชัดเจน
        </li>
        <li>ใช้กิริยาท่าทาง และ วาจาที่ให้เกียรติแก่ผู้ป่วย ตลอดเวลา</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>มีบุคลิกดู น่าเชื่อถือ</li>
        <li>ใช้กิริยา ท่าทาง และวาจาที่ให้ เกียรติแก่ผู้ป่วย</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>มีบุคลิกดูไม่น่าเชื่อถือ</li>
        <li>ใช้กิริยา ท่าทาง หรือวาจาที่ไม่ให้ เกียรติแก่ผู้ป่วย</li>
      </ul>
    ),
  },
  {
    number: "๒",
    point: 2,
    label: "p3",
    title: "๓. การตัดสินใจ",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          ตัดสินใจอย่างมีเหตุผล โดยนำ ข้อมูลที่เกี่ยวข้อง พร้อมทั้งยก
          หลักฐานทางวิชาการมาใช้ ประกอบการตัดสินใจ
        </li>
        <li>ตัดสินใจโดยคำนึงความต้องการ ของผู้ป่วยเป็นสำคัญ</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          ตัดสินใจอย่างมีเหตุผล โดยนำข้อมูลที่เกี่ยวข้อง พร้อมทั้งยกหลักฐานทาง
          วิชาการมาใช้ ประกอบการตัดสินใจ
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
            Mini-CEx (Mini Clinical Evaluation) เป็นการประเมินแบบ
            workplace-based assessment ชนิดหนึ่ง โดยมุ่งประเมิน
            <u className="font-medium italic">
              ทักษะทางคลินิก (clinical skill)
            </u>{" "}
            ของนิสิต/นักศึกษาในสถานการณ์จริง{" "}
            <u className="font-medium italic">(ผู้ป่วยจริง)</u>
            โดยมี
            <u className="font-medium italic">
              อาจารย์ประจำแหล่งฝึกเป็นผู้ประเมิน
            </u>
            ทักษะทางคลินิกดังกล่าวจะประเมินนิสิต/นักศึกษาใน ๒ ประเด็น คือ
            ทักษะการสัมภาษณ์ผู้ป่วย (psychomotor domain) ความเป็นวิชาชีพ
            (professional domain) โดยมุ่งเน้นทักษะใน
            <u className="font-medium italic">
              การเผชิญหน้า (encounter) กับผู้ป่วย
            </u>{" "}
            กระบวนการตัดสินใจ และ
            <u className="font-medium italic">
              การปฏิบัติตามเกณฑ์การสัมภาษณ์ผู้ป่วย
            </u>
            เพื่อให้ได้<u className="font-medium italic">ข้อมูล</u>
            ที่เภสัชกรต้องการจากผู้ป่วย เช่น
            การสัมภาษณ์ประวัติการใช้ยาได้อย่างถูกต้อง
            โดยอาจประเมินหลายครั้งในรูปแบบ formative
          </p>
          <p className="text-sm pt-2">
            <u className="font-medium italic">
              การเตรียมตัวประเมิน มีขั้นตอนดังนี้
            </u>
          </p>
          <div className="text-sm">
            <ul>
              <li>
                ๑. อาจารย์ประจำแหล่งฝึกเตรียมหาข้อมูลผู้ป่วยไว้ล่วงหน้า
                โดยขออนุญาตผู้ป่วยว่าจะมีนิสิต/นักศึกษามาฝึกปฏิบัติ
              </li>
              <li>
                ๒. อาจารย์ประจำแหล่งฝึกแนะนำขั้นตอน
                เกณฑ์การประเมินแก่นิสิต/นักศึกษาที่เข้ารับการประเมิน
                และให้นิสิต/นักศึกษาเลือกว่าจะสัมภาษณ์ผู้ป่วยในประเด็นใด เช่น
                การแพ้ยา
              </li>
              <li>
                ๓. อาจารย์ประจำแหล่งฝึกให้นิสิต/นักศึกษาปฏิบัติ
                โดยทำหน้าที่เฝ้าดูและให้การช่วยเหลือเฉพาะเมื่อจำเป็น เช่น
                ผู้ป่วยเริ่มเหนื่อยจากการให้สัมภาษณ์
                อาจารย์ประจำแหล่งฝึกไม่ควรช่วยนิสิต/นักศึกษาสัมภาษณ์
                การสัมภาษณ์จะใช้เวลาไม่เกิน ๑๕ นาที
              </li>
              <li>
                ๔. หลังเสร็จสิ้นการสื่อสาร อาจารย์ประจำแหล่งฝึกจะสะท้อน
                (reflection) หรือแจ้ง (feedback)
                ผลการประเมินให้นิสิต/นักศึกษาทราบ ใช้เวลาไม่เกิน ๕ นาที
                โดยใช้วิธีดังต่อไปนี้วิธีใดวิธีหนึ่งหรือรวมกัน
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
                เกณฑ์การสัมภาษณ์ผู้ป่วย
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border font-medium align-top text-sm">
                การกล่าวทักทายและแนะนำตนเอง
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm">
                ถามชื่อนามสกุลของผู้ป่วย อายุเท่าไร
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm">
                <div>
                  <u className="font-bold">กรณีสัมภาษณ์ความเจ็บป่วย:</u>
                  การถามอาการผิดปกติที่มาพบแพทย์/เภสัชกร
                  โดยต้องมีลักษณะของคำถามปลายเปิด ถามอาการผิดปกติหลัก
                  อาการผิดปกติอื่น ๆ อาการรุนแรงที่ต้องพบแพทย์
                  และคำถามปิดในกรณีต้องการแยกโรค,
                  การถามถึงการใช้ยาและสมุนไพรเพื่อบรรเทาอาการผิดปติก่อนมาพบเภสัชกร,
                  การถามถึงอาชีพ/สิ่งแวดล้อมที่อาจเกี่ยวข้องกับความเจ็บป่วย
                  (ทั้งนี้ รวมถึงการสูบบุหรี่ ดื่มแอลกอฮอล์ และใช้ยาเสพติด),
                  การถามถึงอาการป่วยของคนในครอบครัว
                  (เพื่อประเมินโรคติดต่อหรือโรคระบาด),
                  การถามถึงประวัติโรคประจำตัว และยาอื่น ๆ ที่ใช้ประจำ
                  (เพื่อประเมินโรค/ยาที่ทำให้เกิดอาการสำคัญนั้น
                  หรือถามเมื่อเภสัชกรนึกได้แล้วว่าจะจ่ายยาอะไรและต้องการตรวจสอบปฏิกิริยาระหว่างยา),
                  การถามประวัติการแพ้ยา,
                  การถามเพื่อประเมินโอกาสที่ผู้ป่วยท้องหรือให้นมบุตร,
                  การสรุปอาการโดยเภสัชกร และขอบคุณผู้ป่วย
                </div>
                <div>
                  <u className="font-bold">กรณีสัมภาษณ์ประวัติการแพ้ยา:</u>{" "}
                  การถามชื่อยาที่ใช้ และรายละเอียดของการใช้, มีอาการอย่างไร
                  และระยะเวลาที่เกิดอาการ, มีอาการอื่นที่เกิดขึ้น เช่น
                  อาการทางระบบทางเดินหายใจ หรือไม่,
                  ระยะเวลาที่ผู้ป่วยเกิดอาการภายหลังจากที่ผู้ป่วยได้รับยา,
                  สาเหตุที่ผู้ป่วยได้รับยา,
                  มียาชนิดอื่นที่ได้รับพร้อมกับเวลาที่เกิดอาการหรือไม่,
                  ผู้ป่วยได้รับการรักษาการแพ้ยาหรือไม่ อย่างไร,
                  ผู้ป่วยเคยมีอาการแพ้ยาจากการได้รับยาที่มี cross-reactivity
                  มาก่อนหน้านี้หรือไม่,
                  ผู้ป่วยเคยได้รับยาชนิดนี้หรือยากลุ่มนี้มาก่อนหรือไม่
                  และผู้ป่วยเคยมีอาการดังกล่าวแม้ว่าไม่ได้รับยามาก่อนหรือไม่
                  และขอบคุณผู้ป่วย
                </div>
                <div>
                  <u className="font-bold">กรณีสัมภาษณ์ประวัติการใช้ยา:</u>
                  การถามชื่อยาทั้งชื่อสามัญทางยาและชื่อการค้า วิธีใช้ยา
                  การเก็บรักษา การลืมใช้ยา ผลิตภัณฑ์เสริมอาหารหรือสมุนไพรอื่น ๆ
                  ที่ใช้ร่วม และขอบคุณผู้ป่วย
                </div>
                <div>
                  <u className="font-bold">
                    การให้คำแนะนำปรึกษาทางยาแก่ผู้ป่วย:
                  </u>{" "}
                  วันนี้มาพบแพทย์เพราะอะไร, ผลการรักษาโรคเรื้อรัง เช่น
                  ความดันโลหิต, การใช้ prime questions ๓ ข้อ, การใช้เทคนิค show
                  and tell, ให้ข้อมูลยาครบถ้วน
                  โดยเฉพาะยาใหม่หรือยาที่มีการเปลี่ยนแปลงวิธีการใช้ใหม่,
                  ให้ผู้ป่วยทวน, มีคำถามอะไรอีกหรือไม่ และขอบคุณผู้ป่วย
                </div>
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
