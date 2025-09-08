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
    label: "p1_1",
    topTitle: (
      <div>
        <u>กิจกรรมที่ 1</u> การคัดกรองความเสี่ยงทางสุขภาพ
        <div className="text-xs mt-1">
          เช่น โรคเบาหวาน ความดันโลหิตสูง โรคทางเมแทบอลิก สมรรถภาพปอด กระดูกพรุน
          โรคติดต่อทางเพศสัมพันธ์
        </div>
      </div>
    ),
    title: `1. นิสิต/นักศึกษามีทักษะในการซักประวัติและค้นหาปัญหาในการคัดกรองความเสี่ยงทางสุขภาพ`,
  },
  {
    label: "p1_2",
    title:
      "2. นิสิต/นักศึกษามีทักษะในการใช้เครื่องมือในการคัดกรอง (เครื่องวัดความดัน แบบประเมินสุขภาพต่าง ๆ)",
  },
  {
    label: "p1_3",
    title:
      "3. นิสิต/นักศึกษามีทักษะในการให้คําแนะนําและให้คําปรึกษากับผู้มีความเสี่ยงทางสุขภาพ",
  },
  {
    label: "p1_4",
    title:
      "4. นิสิต/นักศึกษาสามารถป้องกันตนเองจากความเสี่ยงในการฝึกปฏิบัติงานคัดกรองความเสี่ยงทางสุขภาพ",
  },

  {
    label: "p2_1",
    topTitle: (
      <div>
        <u>กิจกรรมที่ 2</u> การให้บริการเลิกบุหรี่
      </div>
    ),
    title: `1. นิสิต/นักศึกษามีความมั่นใจและสามารถให้คําปรึกษาเลิกบุหรี่ตามหลักการโครงสร้าง 5A`,
  },
  {
    label: "p2_2",
    title:
      "2. นิสิต/นักศึกษาสามารถสร้างแรงจูงใจในการเลิกบุหรี่ และให้คําแนะนําในการปรับเปลี่ยนพฤติกรรม",
  },
  {
    label: "p2_3",
    title:
      "3. นิสิต/นักศึกษาสามารถประเมินพฤติกรรมการสูบบุหรี่และระดับการเสพติดนิโคติน",
  },
  {
    label: "p2_4",
    title:
      "4. นิสิต/นักศึกษาสามารถเลือกใช้วิธีบําบัดได้อย่างเหมาะสม สามารถเสนอแนวทางการเลิกบุหรี่ให้ผู้รับบริการ",
  },

  {
    label: "p3_1",
    topTitle: (
      <div>
        <u>กิจกรรมที่ 3</u> การจัดทําสื่อต่างๆ/บทความสารสนเทศ
      </div>
    ),
    title: `1. นิสิต/นักศึกษาสามารถเลือกหรือเสนอแนะหัวข้อเรื่องได้น่าสนใจ ทันสมัยเป็นปัจจุบัน`,
  },
  {
    label: "p3_2",
    title: "2. นิสิต/นักศึกษาสามารถค้นหาข้อมูลจากแหล่งข้อมูลที่เหมาะสม",
  },
  {
    label: "p3_3",
    title:
      "3. นิสิต/นักศึกษาจัดทําสื่อหรือบทความโดยให้ข้อมูลที่ถูกต้อง ชัดเจน และเหมาะสมกับระดับกลุ่มเป้าหมาย",
  },
  {
    label: "p3_4",
    title: "4. นิสิต/นักศึกษามีความคิดสร้างสรรค์ในการนําเสนอ",
  },

  {
    label: "p4_1",
    topTitle: (
      <div>
        <u>กิจกรรมที่ 4</u> การตอบคําถามด้านยาและผลิตภัณฑ์สุขภาพ
      </div>
    ),
    title: `1. นิสิต/นักศึกษาสามารถรวบรวม วิเคราะห์ ข้อมูลภูมิหลังของคําถามอย่างเหมาะสม`,
  },
  {
    label: "p4_2",
    title:
      "2. นิสิต/นักศึกษาสามารถสืบค้นข้อมูลอย่างเป็นระบบจากแหล่งข้อมูลที่น่าเชื่อถือ",
  },
  {
    label: "p4_3",
    title: "3. นิสิต/นักศึกษาสามารถสรุปและตอบคําถามได้อย่างถูกต้อง เหมาะสม",
  },

  {
    label: "p5_1",
    topTitle: (
      <div>
        <u>กิจกรรมที่ 5</u> การเยี่ยมบ้าน
      </div>
    ),
    title: `1. นิสิต/นักศึกษาสามารถระบุและประเมินความทุกข์ เรียงลําดับปัญหาและแก้ปัญหาความทุกข์ของผู้ป่วยได้อย่างเหมาะสม`,
  },
  {
    label: "p5_2",
    title:
      "2. นิสิต/นักศึกษาสามารถเลือกใช้กระบวนการและเครื่องมือทางเวชศาสตร์ครอบครัว ได้อย่างถูกต้อง เหมาะสม",
  },
  {
    label: "p5_3",
    title:
      "3. นิสิต/นักศึกษาสามารถบริหารจัดการปัญหาของผู้ป่วยได้อย่างเหมาะสม ตามบริบทของผู้ป่วย",
  },
  {
    label: "p5_4",
    title:
      "4. นิสิต/นักศึกษามีทักษะการสื่อสาร เช่น ทักษะการฟัง ทักษะการเงียบ ทักษะการสะท้อน",
  },
  {
    label: "p5_5",
    title:
      "5. นิสิต/นักศึกษาสามารถสรุปปัญหาที่พบจากการเยี่ยมบ้าน วางแผนการแก้ปัญหา และติดตามผล",
  },

  {
    label: "p6_1",
    topTitle: (
      <div>
        <u>กิจกรรมที่ 6</u> การให้ความรู้เรื่องยาและสุขภาพ
      </div>
    ),
    title: `1. เนื้อหาเป็นประโยชน์และตรงความต้องการของผู้ฟัง`,
  },
  {
    label: "p6_2",
    title:
      "2. เป็นข้อมูลที่ทันสมัย น่าเชื่อถือ โดยอ้างอิงจากหลักฐานทางวิชาการที่ถูกต้องเหมาะสม",
  },
  {
    label: "p6_3",
    title: "3. วิธีการนําเสนอน่าสนใจและสร้างการมีส่วนร่วมของผู้ฟังได้",
  },
  {
    label: "p6_4",
    title: "4. นิสิต/นักศึกษาสามารถตอบคําถามถูกต้อง มีเหตุผล",
  },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    p1_1: parentForm.getValues("result.p1_1") || "",
    p1_2: parentForm.getValues("result.p1_2") || "",
    p1_3: parentForm.getValues("result.p1_3") || "",
    p1_4: parentForm.getValues("result.p1_4") || "",
    p2_1: parentForm.getValues("result.p2_1") || "",
    p2_2: parentForm.getValues("result.p2_2") || "",
    p2_3: parentForm.getValues("result.p2_3") || "",
    p2_4: parentForm.getValues("result.p2_4") || "",
    p3_1: parentForm.getValues("result.p3_1") || "",
    p3_2: parentForm.getValues("result.p3_2") || "",
    p3_3: parentForm.getValues("result.p3_3") || "",
    p3_4: parentForm.getValues("result.p3_4") || "",
    p4_1: parentForm.getValues("result.p4_1") || "",
    p4_2: parentForm.getValues("result.p4_2") || "",
    p4_3: parentForm.getValues("result.p4_3") || "",
    p5_1: parentForm.getValues("result.p5_1") || "",
    p5_2: parentForm.getValues("result.p5_2") || "",
    p5_3: parentForm.getValues("result.p5_3") || "",
    p5_4: parentForm.getValues("result.p5_4") || "",
    p5_5: parentForm.getValues("result.p5_5") || "",
    p6_1: parentForm.getValues("result.p6_1") || "",
    p6_2: parentForm.getValues("result.p6_2") || "",
    p6_3: parentForm.getValues("result.p6_3") || "",
    p6_4: parentForm.getValues("result.p6_4") || "",
    suggestion: parentForm.getValues("result.suggestion") || "",
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
    const keyList = ["suggestion"];
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
            ให้ท่านทําเครื่องหมายกากบาท (✗)
            ทับตัวเลขคะแนนของแบบประเมินที่ตรงกับทักษะและ
            ความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 ">
        <div>ระดับขั้นการประเมิน</div>
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
                นิสิต/นักศึกษามีพฤติกรรมเหมาะสม มีความพร้อม เสียสละ กระตือรือร้น
                รวมถึงมีทัศนคติที่ดี ต่อการฝึกปฏิบัติงาน
                สามารถอภิปรายและให้ข้อเสนอแนะที่เป็นประโยชน์อย่างเหมาะสม
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
                นิสิต/นักศึกษามีพฤติกรรมเหมาะสม มีความพร้อม เสียสละ
                รวมถึงทัศนคติที่ดีต่อการฝึก ปฏิบัติงาน
                สามารถปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับคําแนะนําเพียงเล็กน้อย
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
                นิสิต/นักศึกษามีพฤติกรรมอยู่ในเกณฑ์พอใช้
                สามารถปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับ คําแนะนําเป็นส่วนใหญ่
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
                นิสิต/นักศึกษามีพฤติกรรมไม่เหมาะสมบางประการ เกิดความผิดพลาดซ้ํา
                สามารถปฏิบัติงาน ได้ แต่ต้องได้รับการติดตามอย่างใกล้ชิด
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
                นิสิต/นักศึกษามีพฤติกรรมไม่เหมาะสม เกิดความผิดพลาดซ้ํา
                และไม่ปรับปรุงตัวตามคําแนะนํา ของอาจารย์แหล่งฝึก
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบฟอร์มการประเมิน</p>
      </div>

      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border text-center text-sm">
                  หัวข้อการประเมิน
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  5
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  4
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  3
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  2
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  1
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  N/A
                </th>
              </tr>
            </thead>

            {criteriaData.map((item: any, key) => {
              return (
                <tbody key={key}>
                  <tr>
                    <td className="p-2 border align-bottom text-sm">
                      {item.topTitle && (
                        <div className="font-bold mb-2">{item.topTitle}</div>
                      )}
                      <div className="ml-4">{item.title}</div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="5"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? ""
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="4"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? ""
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="3"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? ""
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="2"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? ""
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="1"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? ""
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                    <td className="p-2 border align-bottom text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) =>
                            setDataValue(item.label, value)
                          }
                          value={data[item.label as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <RadioGroupItem
                            value="N/A"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? ""
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
                        </RadioGroup>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
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
