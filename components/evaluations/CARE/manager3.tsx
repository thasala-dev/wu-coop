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
  { label: "p1", head: true, title: `๑. การนำเสนอข้อมูลสถานการณ์ปัจจุบันของร้านยา` },
{ label: "p1_1", head: false, title: `๑.๑ Vision Mission Objective` },
{ label: "p1_2", head: false, title: `๑.๒ External Analysis` },
{ label: "p1_3", head: false, title: `๑.๓ Internal Analysis` },
{ label: "p1_4", head: false, title: `๑.๔ SWOT Analysis` },

{ label: "p2", head: true, title: `๒. การระบุปัญหาที่สำคัญอย่างถูกต้อง` },
{ label: "p2_1", head: false, title: `๒.๑ ความสำคัญของปัญหาและผลกระทบ` },
{ label: "p2_2", head: false, title: `๒.๒ แผนกลยุทธ์` },
{ label: "p2_3", head: false, title: `๒.๓ แผนปฏิบัติการฯ` },

{ label: "p3", head: true, title: `๓. โครงการ / แผน การพัฒนา` },
{ label: "p3_1", head: false, title: `๓.๑ การนำเสนอโครงการ / แผน มีเนื้อหาน่าสนใจ น่าติดตาม` },
{ label: "p3_2", head: false, title: `๓.๒ ข้อมูลที่นำมาจากโครงการ / แผน ได้จากการสืบค้นที่น่าเชื่อถือและสอดคล้องกับโครงการ / แผน` },
{ label: "p3_3", head: false, title: `๓.๓ การกำหนดวัตถุประสงค์ของโครงการ / แผนชัดเจน และมี Strategic plan และ Action Plan` },
{ label: "p3_4", head: false, title: `๓.๔ ความครอบคลุมของประเด็นที่น่าสนใจ (4W2H)` },
{ label: "p3_5", head: false, title: `๓.๕ นำเสนอด้วยความเข้าใจเนื้อหา` },
{ label: "p3_6", head: false, title: `๓.๖ สื่อการนำเสนอมีความถูกต้อง ชัดเจน น่าสนใจ` },
{ label: "p3_7", head: false, title: `๓.๗ เสนอเป็นทีม ความเรียบร้อย สมบูรณ์ เข้าใจได้ง่าย` },
{ label: "p3_8", head: false, title: `๓.๘ แบ่งบทบาทผู้นำเสนอได้ดี ท่าทาง เสียง ประสาน สายตากับผู้ฟัง` },

{ label: "p4", head: true, title: `๔. การตอบคำถาม` },
{ label: "p4_1", head: false, title: `๔.๑ ตอบอย่างมีเหตุผล อ้างอิงหลักฐาน` },
{ label: "p4_2", head: false, title: `๔.๒ สามารถขยายการอธิบาย และความเข้าใจในการพัฒนาโครงการ / แผนได้` },

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
    p3_1: parentForm.getValues("result.p3_1") || "",
    p3_2: parentForm.getValues("result.p3_2") || "",
    p3_3: parentForm.getValues("result.p3_3") || "",
    p3_4: parentForm.getValues("result.p3_4") || "",
    p3_5: parentForm.getValues("result.p3_5") || "",
    p3_6: parentForm.getValues("result.p3_6") || "",
    p3_7: parentForm.getValues("result.p3_7") || "",
    p3_8: parentForm.getValues("result.p3_8") || "",
    p4_1: parentForm.getValues("result.p4_1") || "",
    p4_2: parentForm.getValues("result.p4_2") || "",

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
                ดีเยี่ยม
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษาสามารถอธิบายเสนอ อภิปรายและ/หรือตอบคำถามได้ถูกต้อง ครบถ้วน แสดงความรู้/ความคิดเห็นอย่างเหมาะสม รวมทั้งอธิบายร่วมกับอาจารย์แหล่งฝึกประเด็นต่างๆ ได้อย่างดีเยี่ยม
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ๔
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดี
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษาสามารถดำเนินเสนอ อภิปรายและ/หรือตอบคำถามได้ถูกต้อง ครบถ้วน แสดงความรู้/ความคิดเห็นอย่างเหมาะสม แต่ยังไม่ดีเยี่ยมในบางเรื่อง


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
                นิสิต/นักศึกษาสามารถอธิบายเสนอ/หรือตอบคำถามได้ถูกต้องเพียงบางส่วน ลักษณะการนำเสนอไม่เข้าใจภาพรวมของการบริหารจัดการ และต้องได้รับแนะนำเป็นส่วนใหญ่
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
                นิสิต/นักศึกษาสื่อเสนอและ/หรือตอบคำถามไม่ถูกต้อง หรือไม่สื่อสารรู้เรื่อง การนำเสนอขาดความเข้าใจ ผู้ควบคุมเข้าใจภาพรวม ต้องได้รับคำแนะนำตลอด
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
                ไม่มีการอภิปราย ไม่สามารถนำเสนอข้อมูล หรือตอบคำถามไม่ได้
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
              </tr>
            </thead>

            {criteriaData.map((item: any, key) => {
              return (
                <tbody key={key}>
                  {item.head && (
                    <tr className="bg-slate-200">
                      <td
                        colSpan={6}
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
                  </tr>
                  )}
                </tbody>
              );
            })}
            <tbody>
              <tr>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  รวมคะแนน (คะแนนที่ได้ x ๓๐) / ๙๐
                </td>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={5}
                >
                  {toThaiNumber(
                    Number(
                      (
                        (criteriaData.reduce((total, item) => {
                          const value = data[item.label as keyof typeof data];
                          return total + (value ? parseInt(value, 10) : 0);
                        }, 0) *
                          30) /
                        90
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>
            </tbody>
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
