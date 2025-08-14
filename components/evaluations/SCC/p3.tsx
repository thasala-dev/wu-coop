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
{ label: "p1", head: false, title: "1. บทความที่ริเริ่มทำ : ความทันสมัย ความน่าสนใจ หรือประโยชน์ของการนำไปประยุกต์ใช้" },
{ label: "p2", head: false, title: "2. แถลงที่มานำไปสู่จิตวิทยาการ : ความเหมาะสมของเอกสารวิชาการที่เลือกใช้" },
{ label: "p3", head: true, title: "3. การประเมิน และวิพากษ์บทความ" },
{ label: "p3_1", head: false, title: "3.1 คำถามและวัตถุประสงค์งานวิจัย" },
{ label: "p3_2", head: true, title: "3.2 ระเบียบวิธีวิจัย" },
{ label: "p3_2_1", head: false, title: "รูปแบบการวิจัยและการออกแบบการศึกษากับคำถามวิจัย" },
{ label: "p3_2_2", head: false, title: "ประชากรและกลุ่มตัวอย่าง : มีความสอดคล้องกับคำถามวิจัย มีการระบุเกณฑ์การคัดเข้า/คัดออก อย่างเหมาะสม" },
{ label: "p3_2_3", head: false, title: "ขนาดกลุ่มตัวอย่าง : มีการระบุที่มาที่ชัดเจนของจำนวนกลุ่มตัวอย่าง เหมาะสม มีการรายงานผู้ป่วยที่ออกจากการศึกษา (drop out) มีการระบุการวิเคราะห์ในรูปแบบ intention-to-treat" },
{ label: "p3_2_4", head: false, title: "สถิติ ความเหมาะสม และความถูกต้องของสถิติที่เลือกใช้" },
{ label: "p3_2_5", head: false, title: "จริยธรรม : มีการพิจารณาความเหมาะสมของจริยธรรมและการเก็บข้อมูล" },
{ label: "p3_2_6", head: false, title: "เครื่องมือที่ใช้ : มีความถูกต้องตามรูปแบบงานวิจัย" },
{ label: "p3_2_7", head: false, title: "ตัวแปรและการวัดผลหลัก/การวิเคราะห์ผล : มีความสอดคล้องกับคำถามและวัตถุประสงค์" },
{ label: "p3_2_8", head: false, title: "การวัดผลซ้ำ : ถูกต้อง ครบถ้วน มีขอบเขต ตีความหมายต่อความต่างของผลลัพธ์ (treatment effect และ 95% confidence interval) รูปแบบการวิเคราะห์เหมาะสม" },
{ label: "p3_3", head: false, title: "3.3 สรุปผลและการตีความ : สอดคล้องกับคำถามวิจัยและวัตถุประสงค์ มีการประเมินจุดแข็งและข้อจำกัด" },
{ label: "p3_4", head: false, title: "3.4 การประยุกต์ใช้ผลการวิจัย : การประเมินการประยุกต์ใช้ผลวิจัยกับสถานการณ์บริบทของประเทศไทย" },
{ label: "p4", head: true, title: "4. การนำเสนอ" },
{ label: "p4_1", head: false, title: "4.1 นำเสนอผลงานได้ดึงดูดน่าสนใจ" },
{ label: "p4_2", head: false, title: "4.2 อธิบายและตอบคำถามที่ชัดเจนกับการนำเสนอ ง่ายต่อการติดตาม ภายในเวลาที่กำหนด" },
{ label: "p4_3", head: false, title: "4.3 การใช้ภาษาที่เหมาะสมกับการนำเสนอ สอดคล้องกับกลุ่มเป้าหมาย ต้องเวลา" },
{ label: "p4_4", head: false, title: "4.4 การจัดทำสื่อ : มีความสวยงาม เหมาะสม และสื่อสารง่าย" },
{ label: "p5", head: true, title: "5. การตอบคำถาม" },
{ label: "p5_1", head: false, title: "5.1 การตอบข้อซักถาม : ตอบชัดเจนและถูกต้อง มีเหตุผล และมีความรู้รอบด้าน" },
{ label: "p5_2", head: false, title: "5.2 การวิจารณ์ผลงาน : มีการประเมินข้อดีข้อเสียของงานวิจัยที่นำเสนอ รวมทั้งข้อเสนอแนะที่เป็นประโยชน์ต่อการประยุกต์ใช้ และปรับปรุงงานในอนาคต" },

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
    p11: parentForm.getValues("result.p11") || "",
    p12: parentForm.getValues("result.p12") || "",


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
      <div className="sm:col-span-12">
        <p className="text-sm text-gray-600">
<b>คำชี้แจง</b><br/>
ให้ท่านทำเครื่องหมายกากบาท (x) ในช่องระดับคะแนนของแบบประเมินที่ตรงกับทักษะและความสามารถ
ของนักศึกษาที่ท่านดูแลมากที่สุด<br/>
        </p>
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
                ๕
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดีมาก
              </td>
              <td className="p-2 border font-medium align-top text-sm">
นักศึกษาสามารถประเมิน วิเคราะห์และวิพากษ์ รวมถึงการสังเคราะห์องค์ความรู้
ปัจจุบัน วรรณกรรมอื่นๆที่เกี่ยวข้อง และสามารถประยุกต์ใช้ในการปฏิบัติงานได้       </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ๔
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดี
              </td>
              <td className="p-2 border font-medium align-top text-sm">
นักศึกษาสามารถประเมิน วิเคราะห์และวิพากษ์ รวมถึงการสังเคราะห์องค์ความรู้
จากวรรณกรรมที่วิพากษ์ และสามารถประยุกต์ใช้ในการปฏิบัติงานได้ อาจต้องให้
คำแนะนำบ้าง
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ๓
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปานกลาง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
              นักศึกษาสามารถประเมิน วิเคราะห์และวิพากษ์วรรณกรรม ยังไม่สามารถ
สังเคราะห์องค์ความรู้ และนำประยุกต์ใช้ในการปฏิบัติงานได้ ต้องได้รับคำแนะนำ
บ้าง
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ๒
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปรับปรุง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
นักศึกษาสามารถประเมิน วิเคราะห์และวิพากษ์วรรณกรรมได้เพียงบางส่วน ไม่
สามารถสังเคราะห์องค์ความรู้ และนำประยุกต์ใช้ในการปฏิบัติงานได้ ขาดความ
เข้าใจภาพรวมของวรรณกรรมที่นำเสนอ ต้องได้รับคำแนะนำเป็นส่วนใหญ่
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ๑
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ไม่ผ่าน
              </td>
              <td className="p-2 border font-medium align-top text-sm">
              นักศึกษาไม่สามารถประเมิน วิเคราะห์และวิพากษ์วรรณกรรมได้ ไม่สามารถอธิบาย
และตอบคำถามได้ ขาดความเข้าใจภาพรวมของวรรณกรรมที่นำเสนอ ต้องสอน
การวิพากษ์วรรณกรรม ปฐมภูมิใหม่
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                N/A
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center" colSpan={2}>
                ไม่สามารถประเมินได้/ไม่มีการสังเกต
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบประเมินความประพฤติและทัศนคติของนักศึกษา</p>
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
                  ๕
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  ๔
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  ๓
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  ๒
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  ๑
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
                  {item.head && (
                    <tr className="bg-slate-200">
                      <td
                        colSpan={7}
                        className="p-2 border font-semibold text-sm"
                      >
                        {item.title}
                      </td>
                    </tr>
                  )}
                  {!item.head && (
                    <tr>
                      <td className="p-2 border align-top text-sm">
                        {item.topTitle && (
                          <div className="font-bold mb-2">{item.topTitle}</div>
                        )}
                        <>{item.title}</>
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
                          <RadioGroupItem
                            value="5"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
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
                          <RadioGroupItem
                            value="4"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
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
                          <RadioGroupItem
                            value="3"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
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
                          <RadioGroupItem
                            value="2"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
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
                          <RadioGroupItem
                            value="1"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
                                : ""
                            }
                            aria-invalid={
                              isSubmit && !data[item.label as keyof typeof data]
                            }
                          />
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
                          <RadioGroupItem
                            value="N/A"
                            className={
                              isSubmit && !data[item.label as keyof typeof data]
                                ? "border-2 border-red-600"
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
                  )}
                </tbody>
              );
            })}
            <tbody>
              <tr>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  รวมคะแนน (คะแนนที่ได้ x ๑๐) / {toThaiNumber(
                    criteriaData.filter(item => {
                      const value = data[item.label as keyof typeof data];
                      return value !== "N/A" && value !== "";
                    }).length * 5
                  )}
                </td>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={6}
                >
                  {toThaiNumber(
                    Number(
                      (
                        (criteriaData.reduce((total, item) => {
                          const value = data[item.label as keyof typeof data];
                          if (value && value !== "N/A") {
                            return total + parseInt(value, 10);
                          }
                          return total;
                        }, 0) *
                          10) /
                        (criteriaData.filter(item => {
                          const value = data[item.label as keyof typeof data];
                          return value !== "N/A" && value !== "";
                        }).length * 5)
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          หมายเหตุ ในกรณีที่ไม่สามารถประเมิน ฐานคะแนนการประเมินให้ลดลงตามส่วน
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
