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
    head: 1,
    label: "p0",
    title:
      "1. การประเมินความเหมาะสมของสูตรอาหารทางหลอดเลือดดำ (Parenteral Nutrition: PN)",
  },
  {
    number: "2",
    point: 2,
    label: "p1",
    title:
      "1.1 การประเมินภาวะโภชนาการของผู้ป่วย (Screening) ในผู้ป่วยที่ยังไม่ได้รับการรักษาด้วยโภชนบำบัด",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          ประเมินภาวะโภชนาการของผู้ป่วยได้ถูกต้องและเลือกวิธีการจัดการปัญหาได้อย่างเหมาะสมครบถ้วน{" "}
          <b>
            <u>ร่วมกับ</u>
          </b>
        </li>
        <li>
          สามารถให้คำแนะนำแก่ทีมสหวิชาชีพได้อย่างเหมาะสม
          เช่นการส่งต่อไปให้การรักษาโภชนบำบัด
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          ประเมินภาวะ โภชนาการของผู้ ป่วยได้ถูกต้อง{" "}
          <b>
            <u>ร่วมกับ</u>
          </b>
        </li>
        <li> สามารถเลือกวิธี จัดการปัญหาได้ อย่างเหมาะสมแต่ ยังไม่ครบถ้วน</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          ประเมินภาวะ โภชนาการของ ผู้ป่วยได้ถูกต้อง แต่ยังไม่สามารถ เลือกวิธีการ
          จัดการปัญหาที่ เกิดขึ้นได้
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ทราบวิธีการประ เมิน nutrition status (ภาวะโภชนาการ) &nbsp; </li>
        <u>
          <b>หรือ</b>
        </u>
        <li>
          {" "}
          ทราบวิธีการประเมิน nutrition status แต่ ไม่สามารถประเมินได้
          ถูกต้องตามสภาวะ ของผู้ป่วย
        </li>
      </ul>
    ),
  },
  {
    number: "2",
    point: 2,
    label: "p2",
    title: "1.2 ความต้องการพลังงานและสารอาหาร",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สามารถคำนวณได้ ถูกต้อง โดยเลือกเป้าหมาย
          ความต้องการพลังงานได้เหมาะสมกับ สภาวะโรคของผู้ป่วย
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถคำนวณ ได้ถูกต้อง เมื่อมี การกำหนดเป้าหมาย ความต้องการ พลังงานให้
          โดยเลือก stress/ activity factor ได้
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถคำนวณ ได้ถูกต้อง
          <br />
          &nbsp;{" "}
          <b>
            <u>แต่</u>
          </b>{" "}
          &nbsp;
          <br />{" "}
        </li>
        <li>ยังไม่ได้เลือก ใช้ stress หรือ activity factor</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถคำนวณได้{" "}
          <b>
            <u>หรือ</u>
          </b>
          สามารถคำนวณ ได้ แต่ไม่ถูกต้อง
        </li>
      </ul>
    ),
  },

  {
    number: "2",
    point: 2,
    label: "p3",
    title: "1.3 การเลือกชนิดของสารน้ำทดแทน ปริมาณ ความเข้ากัน และความคงตัว",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเลือกสารน้ำทดแทนและระบุปริมาณสารน้ำได้อย่าง
          <b>
            <u>ถูกต้อง</u>
          </b>
        </li>
        <li>
          โดยพิจารณาร่วมกับปัจจัยด้านอื่นแบบครบองค์รวม ทั้งในด้านความเข้ากัน
          ความคงตัว สภาวะโรคของผู้ป่วย และราคา
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเลือกสารน้ำทดแทนและระบุปริมาณสารน้ำได้อย่าง
          <b>
            <u>เหมาะสม</u>
          </b>{" "}
          โดยพิจารณาทั้งด้านความเข้ากัน และความคงตัวร่วมด้วย{" "}
          <b>
            <u>แต่</u>
          </b>{" "}
          ไม่ได้พิจารณาปัจจัยอื่น สภาวะโรคของผู้ป่วย และราคา
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเลือกสารน้ำทดแทนได้อย่างเหมาะสม
          โดยพิจารณาจากข้อดี–ข้อเสียของสารน้ำทดแทนแต่ละชนิด{" "}
          <b>
            <u>แต่</u>
          </b>{" "}
          ไม่สามารถระบุปริมาณได้
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถระบุชนิดของสารน้ำทดแทนได้{" "}
          <b>
            <u>หรือ</u>
          </b>{" "}
        </li>
        <li>
          สามารถระบุชนิดของสารน้ำทดแทนได้
          แต่ไม่สามารถเลือกชนิดของสารน้ำที่เหมาะสมได้
        </li>
      </ul>
    ),
  },
  {
    number: "2",
    point: 2,
    label: "p4",
    title: "1.4 การจัดการความผิดปกติของสมดุลอิเล็กโทรไลต์",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเลือกชนิดและระบุปริมาณของ electrolytes ทดแทนได้อย่าง{" "}
          <b>
            <u>ถูกต้อง</u>
          </b>{" "}
        </li>
        <li>
          โดยพิจารณาร่วมกับปัจจัยด้านอื่นแบบองค์รวม ทั้งด้านความเข้ากัน
          ความคงตัว และสภาวะโรคของผู้ป่วย
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเลือกชนิดและสามารถระบุปริมาณของ electrolytes ได้อย่างเหมาะสม
          โดยพิจารณาทั้งด้านความเข้ากันและความคงตัวร่วมด้วย{" "}
          <b>
            <u>แต่</u>
          </b>{" "}
        </li>
        <li>ไม่ได้พิจารณาปัจจัยอื่น ๆ เช่น สภาวะโรคของตัวผู้ป่วย เป็นต้น</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          เปรียบเทียบข้อดี–ข้อเสียของสารน้ำทดแทนแต่ละชนิดได้
          รวมทั้งสามารถเลือกชนิดของ electrolytes ทดแทนได้อย่างเหมาะสม{" "}
          <b>
            <u>แต่</u>
          </b>{" "}
        </li>
        <li>ไม่สามารถระบุปริมาณได้</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถประเมินความผิดปกติของ electrolyte ที่เกิดกับผู้ป่วยได้{" "}
          <b>
            <u>หรือ</u>
          </b>
        </li>
        <li>
          สามารถระบุความผิดปกติที่เกิดขึ้นได้ แต่ยังไม่สามารถเลือกชนิด
          electrolytes ได้อย่างเหมาะสม
        </li>
      </ul>
    ),
  },
  {
    number: "2",
    point: 2,
    label: "p5",
    title: "1.5 การจัดการความผิดปกติของสมดุลกรด-ด่าง",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเลือกชนิดและระบุปริมาณของสารละลายกรด-ด่างได้{" "}
          <b>
            <u>ถูกต้อง</u>
          </b>{" "}
          โดยพิจารณาร่วมกับปัจจัยด้านอื่นแบบครบองค์รวม ทั้งความเข้ากัน ความคงตัว
          และสภาวะโรคของผู้ป่วย
        </li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเลือกชนิดและระบุปริมาณของสารละลายกรด-ด่างได้อย่าง
          <b>
            <u>เหมาะสม</u>
          </b>{" "}
          โดยพิจารณาทั้งด้านความเข้ากันและความคงตัว{" "}
          <b>
            <u> แต่</u>
          </b>
        </li>
        <li>ไม่ได้พิจารณาปัจจัยอื่น ๆ เช่น สภาวะโรคของผู้ป่วย</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          เปรียบเทียบข้อดี–ข้อเสียของสารน้ำทดแทนแต่ละชนิดได้{" "}
          <b>
            <u>และ</u>
          </b>
          เลือกชนิดของสารละลายกรด-ด่างได้อย่างเหมาะสม{" "}
          <b>
            <u>แต่</u>
          </b>
        </li>
        <li>ไม่สามารถระบุปริมาณได้</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>
          ไม่สามารถประเมินความผิดปกติของ electrolyte ที่เกิดกับผู้ป่วยได้{" "}
          <b>
            <u>หรือ</u>
          </b>
        </li>
        <li>
          สามารถระบุความผิดปกติที่เกิดขึ้นได้
          แต่ไม่สามารถเลือกชนิดสารละลายกรด-ด่างได้อย่างเหมาะสม
        </li>
      </ul>
    ),
  },
  {
    head: 1,
    label: "p02",
    title:
      "2. การเตรียมอุปกรณ์ที่จำเป็นและเหมาะสมที่จะใช้ในการเตรียมอาหารทางหลอดเลือดดำ",
  },
  {
    number: "2",
    point: 2,
    label: "p21",
    title: "2.1 การเตรียมอุปกรณ์ที่จำเป็นในการเตรียมอาหารทางหลอดเลือดดำ",
    superd: (
      <ul className="list-disc pl-4">
        <li>สามารถเตรียมอุปกรณ์ได้ถูกต้อง ครบถ้วน และมีความเหมาะสม</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเตรียมอุปกรณ์ได้ถูกต้องและครบถ้วน{" "}
          <b>
            <u>แต่</u>
          </b>
          ไม่เหมาะสม
        </li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเตรียมอุปกรณ์ได้ถูกต้อง{" "}
          <b>
            <u>แต่</u>
          </b>
          ไม่ครบถ้วน และไม่มีความเหมาะสม
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถเตรียมอุปกรณ์ได้ถูกต้อง</li>
      </ul>
    ),
  },
  {
    head: 1,
    label: "p03",
    title:
      "3. การปฏิบัติตัวตามขั้นตอนการเตรียมอาหารทางหลอดเลือดดำ และข้อควรระวังในการเตรียม",
  },
  {
    number: "1",
    point: 1,
    label: "p31",
    dis96: true,
    title: "3.1 การล้างมือ",
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
    number: "1",
    point: 1,
    label: "p31",
    dis96: true,
    title: "3.1 การล้างมือ",
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
    number: "1",
    point: 1,
    label: "p32",
    dis96: true,
    title: "3.2 การสวมถุงมือ การแต่งกาย",
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
    number: "1",
    point: 1,
    label: "p33",
    dis96: true,
    title: "3.3 ดูดสารจาก vial และเติมใน large volume bag",
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
    number: "1",
    point: 1,
    label: "p34",
    dis96: true,
    title: "3.4 ลำดับการผสม (order of mixing)",
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
    number: "1",
    point: 1,
    label: "p35",
    dis96: true,
    title: "3.5 ทำงานด้วย aseptic techniques",
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
    number: "1",
    point: 1,
    label: "p36",
    dis96: true,
    title: "3.6 การทำความสะอาดที่เตรียมยา (hood)",
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
    number: "1",
    point: 1,
    label: "p37",
    dis96: true,
    title: "3.7 การจัดทำฉลาก techniques และ open window",
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
    head: 1,
    label: "p04",
    title: "4. การตรวจสอบสารอาหารทางหลอดเลือดดำที่เตรียม",
  },
  {
    number: "0.5",
    point: 0.5,
    label: "p41",
    dis91: true,
    title: "4.1 ปริมาตร",
    superd: (
      <ul className="list-disc pl-4">
        <li>ตรวจสอบ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ตรวจสอบ</li>
      </ul>
    ),
  },
  {
    number: "0.5",
    point: 0.5,
    label: "p42",
    dis91: true,
    title: "4.2 เศษตะกอนจากวัสดุที่ใช้ในการเตรียม ความขุ่น/ใส",
    superd: (
      <ul className="list-disc pl-4">
        <li>ตรวจสอบ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ตรวจสอบ</li>
      </ul>
    ),
  },
  {
    number: "0.5",
    point: 0.5,
    label: "p43",
    dis91: true,
    title: "4.3 ความเข้ากันได้ของสารอาหาร",
    superd: (
      <ul className="list-disc pl-4">
        <li>ตรวจสอบ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ตรวจสอบ</li>
      </ul>
    ),
  },
  {
    number: "0.5",
    point: 0.5,
    label: "p44",
    dis91: true,
    title: "4.4 ความถูกต้องของฉลาก และวันหมดอายุ",
    superd: (
      <ul className="list-disc pl-4">
        <li>ตรวจสอบ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ตรวจสอบ</li>
      </ul>
    ),
  },
  {
    number: "0.5",
    point: 0.5,
    label: "p45",
    dis91: true,
    title: "4.5 ความเรียบร้อยของบรรจุภัณฑ์",
    superd: (
      <ul className="list-disc pl-4">
        <li>ตรวจสอบ</li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่ตรวจสอบ</li>
      </ul>
    ),
  },
  {
    head: 1,
    label: "p05",
    title: "5. การเก็บรักษาผลิตภัณฑ์อาหารทางหลอดเลือดดำ",
  },
  {
    number: "1",
    point: 1,
    label: "p51",
    dis96: true,
    title: "5.1 การเก็บรักษาผลิตภัณฑ์อาหารทางหลอดเลือดดำ",
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
    head: 1,
    label: "p06",
    title:
      "6. ภาพรวมการวางแผนระบบความปลอดภัยในการปฏิบัติงานเตรียมอาหารทางหลอดเลือดดำ",
  },

  {
    number: "2",
    point: 2,
    label: "p6",
    title:
      "6.1 ภาพรวมการวางแผนระบบความปลอดภัยในการปฏิบัติงานเตรียมอาหารทางหลอดเลือดดำ",
    superd: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเสนอความคิดเห็นหรือคำแนะนำเพื่อปรับปรุงระบบความปลอดภัยในการปฏิบัติงานเตรียมสารอาหารทางหลอดเลือดดำ
          ซึ่งสามารถประยุกต์ใช้กับแหล่งฝึกได้จริง
          <b>
            <u>หรือ</u>
          </b>
        </li>
        <li>สามารถเสนอแนวทางป้องกันการเกิดปัญหาเชิงระบบ</li>
      </ul>
    ),
    good: (
      <ul className="list-disc pl-4">
        <li>
          สามารถเสนอความคิดเห็นหรือคำแนะนำเพื่อปรับปรุงระบบความปลอดภัยในการปฏิบัติงานเตรียมอาหารทางหลอดเลือดดำได้
          <b>
            <u>แต่</u>
          </b>{" "}
        </li>
        <li>ไม่สามารถทำได้จริงกับแหล่งฝึกนั้นๆ</li>
      </ul>
    ),
    pass: (
      <ul className="list-disc pl-4">
        <li>
          สามารถระบุปัญหาของระบบความปลอดภัยในการปฏิบัติงานเตรียมอาหารทางหลอดเลือดดำได้{" "}
          <b>
            <u>แต่</u>
          </b>{" "}
          ไม่สามารถบอกวิธีแก้ปัญหาได้
        </li>
      </ul>
    ),
    fail: (
      <ul className="list-disc pl-4">
        <li>ไม่สามารถค้นหาปัญหา หรือไม่ทราบความสำคัญของความปลอดภัยได้</li>
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
    p21: parentForm.getValues("result.p21") || "",
    p31: parentForm.getValues("result.p31") || "",
    p32: parentForm.getValues("result.p32") || "",
    p33: parentForm.getValues("result.p33") || "",
    p34: parentForm.getValues("result.p34") || "",
    p35: parentForm.getValues("result.p35") || "",
    p36: parentForm.getValues("result.p36") || "",
    p37: parentForm.getValues("result.p37") || "",
    p41: parentForm.getValues("result.p41") || "",
    p42: parentForm.getValues("result.p42") || "",
    p43: parentForm.getValues("result.p43") || "",
    p44: parentForm.getValues("result.p44") || "",
    p45: parentForm.getValues("result.p45") || "",
    p51: parentForm.getValues("result.p51") || "",
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
            ให้ท่านพิจารณาความสามารถของนิสิตตามเกณฑ์ที่กำหนดที่ตรงกับทักษะและความสามารถของนิสิตที่ท่านดูแลมากที่สุด
            โดยเกณฑ์ในขั้นที่สูงกว่า (ซ้ายมือ)
            นิสิตจะต้องแสดงถึงเกณฑ์ในขั้นที่ต่ำกว่า (ทางขวามือ) ด้วยก่อน
            และเมื่อนิสิตมีความสามารถตรงตามเกณฑ์ในระดับใด
            จึงให้ท่านระบุคะแนนของนิสิตตามช่วงในช่วงเกณฑ์ที่ท่านพิจารณานั้น
            โดยทำเครื่องหมาย ✔ ลงในช่องที่อยู่ท้ายหัวข้อที่ประเมินแต่ละหัวข้อ
            <br />
            <b>ตัวอย่าง:</b> หากอาจารย์ประเมินว่านิสิตมีความสามารถในหัวข้อ
            “ความต้องการพลังงานและสารอาหาร” อยู่ในเกณฑ์ “ดี” (8–9 คะแนน)
            อาจารย์สามารถเลือกให้คะแนน 8 หรือ 9 ได้ ขึ้นอยู่กับดุลยพินิจ{" "}
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
                  {item.head === 1 ? (
                    <tr className="bg-slate-100">
                      <td
                        colSpan={6}
                        className="p-2 border font-semibold text-sm"
                      >
                        {item.title}
                      </td>
                    </tr>
                  ) : (
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
                                data[item.label as keyof typeof data] *
                                  item.point
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
                        {/* ดี (8-9 คะแนน) */}
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
                          )}
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
                              {(item.dis91
                                ? [
                                    {
                                      label: "0",
                                      value: "0",
                                    },
                                  ]
                                : [
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
                                  ]
                              ).map((radio) => (
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
                  ปรับให้เป็นคะแนนเต็ม 40 คะแนน =
                  <span className="font-mono">
                    (คะแนนที่ประเมินได้ &divide; 250) &times; 40
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
