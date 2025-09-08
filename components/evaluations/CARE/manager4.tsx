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
    label: "p1",
    head: true,
    title: `1. การนำเสนอข้อมูลสถานการณ์ปัจจุบันของร้านยา`,
  },
  { label: "p1_1", head: false, title: `1.1 Vision Mission Objective` },
  { label: "p1_2", head: false, title: `1.2 External Analysis` },
  { label: "p1_3", head: false, title: `1.3 Internal Analysis` },
  { label: "p1_4", head: false, title: `1.4 SWOT Analysis` },

  { label: "p2", head: true, title: `2. การระบุปัญหาที่สำคัญอย่างถูกต้อง` },
  { label: "p2_1", head: false, title: `2.1 ความสำคัญของปัญหาและผลกระทบ` },
  { label: "p2_2", head: false, title: `2.2 แผนกลยุทธ์` },
  { label: "p2_3", head: false, title: `2.3 แผนปฏิบัติการฯ` },

  { label: "p3", head: true, title: `3. โครงการ / แผน การพัฒนา` },
  {
    label: "p3_1",
    head: false,
    title: `3.1 การนำเสนอโครงการ / แผน มีเนื้อหาน่าสนใจ น่าติดตาม`,
  },
  {
    label: "p3_2",
    head: false,
    title: `3.2 ข้อมูลที่นำมาจากโครงการ / แผน ได้จากการสืบค้นที่น่าเชื่อถือและสอดคล้องกับโครงการ / แผน`,
  },
  {
    label: "p3_3",
    head: false,
    title: `3.3 กำหนดวัตถุประสงค์ของโครงการ / แผนชัดเจน และมี Strategic plan และ Action Plan`,
  },
  {
    label: "p3_4",
    head: false,
    title: `3.4 ความครอบคลุมของประเด็นที่น่าสนใจ (4W2H)`,
  },
  { label: "p3_5", head: false, title: `3.5 นำเสนอด้วยความเข้าใจเนื้อหา` },

  { label: "p4", head: true, title: `4. การสรุปทั้งหมด` },
  {
    label: "p4_1",
    head: false,
    title: `4.1 สามารถขยายการอธิบาย และความเข้าใจในภาพรวมของโครงการ / แผนได้`,
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
    p3_1: parentForm.getValues("result.p3_1") || "",
    p3_2: parentForm.getValues("result.p3_2") || "",
    p3_3: parentForm.getValues("result.p3_3") || "",
    p3_4: parentForm.getValues("result.p3_4") || "",
    p3_5: parentForm.getValues("result.p3_5") || "",
    p4_1: parentForm.getValues("result.p4_1") || "",

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
                5
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดีเยี่ยม
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษาสามารถนำเสนอในรายงาน ได้ถูกต้อง
                ครบถ้วนแสดงความรู้/ความคิดเห็นอย่างเหมาะสมดีเยี่ยม
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
                นิสิต/นักศึกษาสามารถนำเสนอในรายงาน ได้ถูกต้อง ครบถ้วน
                แสดงความรู้/ความคิดเห็นอย่างเหมาะสม แต่การปรับปรุงน้อยเล็กๆ
                น้อยๆ
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
                นิสิต/นักศึกษาสามารถนำเสนอในรายงานได้ถูกต้องเพียงบางส่วน
                ลักษณะการนำเสนอ ยังไม่เข้าใจภาพรวมของการบริหารจัดการ
                และต้องได้รับการปรับปรุงเป็นส่วนใหญ่
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
                นิสิต/นักศึกษานำเสนอในรายงานไม่ถูกต้อง หรือไม่สมบูรณ์
                การนำเสนอขาดข้อมูลสำคัญ ขาดความเข้าใจภาพรวม
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
                ไม่มีการส่งรายงาน
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
                  รวมคะแนน (คะแนนที่ได้ x 20) / 65
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
                          20) /
                        65
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
