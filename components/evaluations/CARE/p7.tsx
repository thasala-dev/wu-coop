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
    title: "๑.๑. ทักษะการประเมินผู้ป่วยและวิเคราะห์ใบสั่งยา",
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
    title: "๑.๒. คำนวณขนาดยาได้อย่างถูกต้อง เหมาะสม",
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
  label: "p13",
  title: "๑.๓ การเลือกสารน้ำ ความเข้ากัน ความคงตัว",
  superd: (
    <ul className="list-disc pl-4">
      <li>สามารถเลือกสารน้ำทดแทนได้อย่างถูกต้อง โดยพิจารณาทั้งข้อดี–ข้อเสีย ความเข้ากัน และความคงตัว รวมทั้งคำนึงถึงสภาวะโรคของผู้ป่วย และราคา</li>
    </ul>
  ),
  good: (
    <ul className="list-disc pl-4">
      <li>สามารถเลือกสารน้ำทดแทนได้อย่างถูกต้อง โดยพิจารณาทั้งข้อดี–ข้อเสีย ความเข้ากัน และความคงตัว</li>
    </ul>
  ),
  pass: (
    <ul className="list-disc pl-4">
      <li>สามารถเลือกสารน้ำทดแทนได้ถูกต้อง โดยพิจารณาจากข้อดี–ข้อเสีย แต่ไม่คำนึงถึงความเข้ากัน และความคงตัว</li>
    </ul>
  ),
  fail: (
    <ul className="list-disc pl-4">
      <li>ไม่สามารถระบุชนิดของสารน้ำทดแทนได้</li>
      <li>หรือสามารถระบุชนิดของสารน้ำทดแทนได้ แต่ไม่สามารถเลือกชนิดของสารน้ำที่เหมาะสมได้</li>
    </ul>
  ),
},  {
    head: 1,
    label: "p2",
    title: "๒. อุปกรณ์ในการเตรียมยาเคมีบำบัด",
  },  {
    number: "๑",
    point: 1,
    label: "pCB1",
    title: "๒.๑ การเตรียมอุปกรณ์ที่จำเป็นในการเตรียมยาเคมีบำบัด",
    superd: (
      <ul className="list-disc pl-4">
        <li>สามารถเตรียมอุปกรณ์ได้ถูกต้อง ครบถ้วน และมีความเหมาะสม</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>สามารถเตรียมอุปกรณ์ได้ถูกต้องและครบถ้วน แต่ไม่เหมาะสม</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>สามารถเตรียมอุปกรณ์ได้ถูกต้อง แต่ไม่ครบถ้วน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถเตรียมอุปกรณ์ได้ถูกต้อง</li>
      </ul>
    ),
  },{
    head: 1,
    label: "p3",
  title: "๓. การปฏิบัติตัวตามขั้นตอนการเตรียมยาเคมีบําบัดหรือยาที่มีพิษต่อเซลล์ (safe handling of cytotoxic drugs)",
  },{
    number: "๑",
    point: 1,
    label: "p31",
    dis96: true,
    title: "๓.๑ การล้างมือ",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำหรือทำไม่ถูกต้องหรือไม่ครบถ้วน</li>
      </ul>
    ),
  },{
    number: "๑",
    point: 1,
    label: "p32",
        dis96: true,

    title: "๓.๒ การสวมถุงมือ",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p33",    dis96: true,

    title: "๓.๓ เตรียมยาเคมีบำบัดด้วย aseptic technique, open window technique, critical point",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p34",    dis96: true,
    title: "๓.๔ การใช้งานและความสะอาดของ biological safety cabinet (BSC, Isolator)",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p4", dis96: true,
    title: "๔. การจัดทำฉลากและการ",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p5", dis96: true,
    title: "๕. การตรวจสอบยาเคมีบำบัดที่ทำการเตรียม",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p6", dis96: true,
    title: "๖. การขนส่งผลิตภัณฑ์ยาเคมีบำบัดได้อย่างถูกต้องตามมาตรฐานสากล",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p7", dis96: true,
    title: "๗. การเก็บรักษาผลิตภัณฑ์ยาเคมีบำบัด",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },
  {
    number: "๑",
    point: 1,
    label: "p8", dis96: true,
    title: "๘. การทำลายขยะจากการเตรียมยาเคมีบำบัด",
    superd: (
      <ul className="list-disc pl-4">
        <li>ทำได้ถูกต้อง ครบถ้วนทุกขั้นตอน</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทำ หรือทำไม่ถูกต้อง หรือไม่ครบถ้วน</li>
      </ul>
    ),
  },{
    number: "๑",
  point: 1,
  label: "pCB9",
  title: "๙ การแก้ไขปัญหาที่เกิดจากการหก ตก แตก รั่วไหลของยาเคมีบำบัด",
  superd: (
    <ul className="list-disc pl-4">
      <li>ระบุอุปกรณ์ที่เป็นองค์ประกอบของ spill kit</li>
      <li>ทราบวิธีการใช้อุปกรณ์ และขั้นตอนการจัดการปัญหา</li>
      <li>สามารถอธิบายหรือถ่ายทอดขั้นตอนการจัดการกับปัญหาให้บุคคลอื่นได้</li>
    </ul>
  ),
  good: (
    <ul className="list-disc pl-4">
      <li>ระบุอุปกรณ์ที่เป็นองค์ประกอบของ spill kit</li>
      <li>ทราบวิธีการใช้อุปกรณ์ และขั้นตอนการจัดการปัญหา</li>
    </ul>
  ),
  pass: (
    <ul className="list-disc pl-4">
      <li>ระบุอุปกรณ์ที่เป็นองค์ประกอบของ spill kit ได้</li>
      <li>แต่ไม่ทราบวิธีการใช้อุปกรณ์ และขั้นตอนการจัดการปัญหา</li>
    </ul>
  ),
  fail: (
    <ul className="list-disc pl-4">
      <li>ไม่ทราบว่ามี spill kit หรือ</li>
      <li>ทราบว่ามี spill kit แต่ยังไม่สามารถระบุอุปกรณ์ที่เป็นองค์ประกอบได้</li>
    </ul>
  ),
},{
  number: "๑๐",
  point: 1,
  label: "pCB10",
  title: "๑๐ ภาพรวมการวางแผนระบบความปลอดภัยในการปฏิบัติงานเตรียมยาเคมีบำบัด",
  superd: (
    <ul className="list-disc pl-4">
      <li>สามารถระบุปัญหา และสามารถบอกวิธี/แนวทางการแก้ปัญหาได้ รวมทั้ง</li>
      <li>สามารถเสนอความคิดเห็น หรือคำแนะนำเพื่อปรับปรุงระบบความปลอดภัยในการปฏิบัติงานเตรียมยา ซึ่งสามารถประยุกต์ใช้กับแหล่งฝึกได้จริง หรือ</li>
      <li>สามารถเสนอแนวทางป้องกันการเกิดปัญหาเชิงระบบได้</li>
    </ul>
  ),
  good: (
    <ul className="list-disc pl-4">
      <li>ระบุปัญหา และสามารถบอกวิธี/แนวทางการแก้ปัญหาได้ รวมทั้ง</li>
      <li>สามารถเสนอความคิดเห็นหรือคำแนะนำเพื่อปรับปรุงระบบความปลอดภัยในการปฏิบัติงานเตรียมยาได้ แต่ยังไม่สามารถทำได้จริงกับแหล่งฝึกนั้น ๆ</li>
    </ul>
  ),
  pass: (
    <ul className="list-disc pl-4">
      <li>สามารถระบุปัญหาของระบบความปลอดภัยในการปฏิบัติงานเตรียมยาได้ แต่</li>
      <li>ยังไม่สามารถบอกวิธีหรือแนวทางการแก้ปัญหาที่เกิดขึ้นได้</li>
    </ul>
  ),
  fail: (
    <ul className="list-disc pl-4">
      <li>ไม่สามารถค้นหาปัญหา หรือ</li>
      <li>ไม่ทราบความสำคัญของความปลอดภัยในการปฏิบัติงานเตรียมยาเคมีบำบัด</li>
    </ul>
  ),
}




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
                        className="p-2 border font-semibold  text-sm"
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
                  ปรับให้เป็นคะแนนเต็ม ๒๐ คะแนน =
                  <span className="font-mono">
                    (คะแนนที่ประเมินได้ &divide; ๒๐๐) &times; ๒๐
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
