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
  { label: "p1", head: true, title: "การนำเสนอผลการฝึกปฏิบัติงาน" },
  { label: "p1", head: false, title: "1. ความเข้าใจในเรื่องที่นำเสนอ" },
  {
    label: "p2",
    head: false,
    title: "2. สื่อนำเสนอมิความถูกต้อง ชัดเจน และน่าสนใจ",
  },
  {
    label: "p3",
    head: false,
    title: "3. เอกสารประกอบการนำเสนอมีความถูกต้อง ชัดเจน",
  },
  {
    label: "p4",
    head: false,
    title: "4. นำเสนอด้วยเสียงชัดเจน ความเร็วเหมาะสม ราบรื่น เข้าใจได้ง่าย",
  },
  {
    label: "p5",
    head: false,
    title: "5. นำเสนอด้วยท่าทางมั่นใจ และประสานสายตากับผู้ฟัง อย่างเหมาะสม",
  },
  { label: "p6", head: false, title: "6. การตอบคำถามถูกต้อง ชัดเจน" },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState(() => {
    const initial: Record<string, string> = {};
    criteriaData.forEach((item) => {
      if (!item.head) {
        initial[item.label] =
          parentForm.getValues(`result.${item.label}`) || "";
      }
    });
    initial.suggestion = parentForm.getValues("result.suggestion") || "";
    return initial;
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
          <b>คำชี้แจง</b>
          <br />
          ให้ท่านทำเครื่องหมายกากบาท (x)
          ในช่องระดับคะแนนของแบบประเมินที่ตรงกับทักษะและความสามารถ
          ของนักศึกษาที่ท่านดูแลมากที่สุด
          <br />
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
                5
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดีมาก
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถครบถ้วนตามวัตถุประสงค์การฝึก
                ปฏิบัติงานฯเป็นที่น่าพอใจ เกิดความบกพร่องน้อย
                สามารถปฏิบัติงานได้ด้วยตนเอง อาจได้รับคำแนะนำเป็นครั้งคราว{" "}
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
                นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถตามวัตถุประสงค์การฝึกปฏิบัติงานฯ
                มี ความบกพร่องในระดับยอมรับได้ สามารถปฏิบัติงานได้ด้วยตนเอง
                แต่ต้องได้รับ คำแนะนำเป็นครั้งคราว
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
                นักศึกษาแสดงให้เห็นว่ามีทักษะ/ความสามารถตามเกณฑ์วัตถุประสงค์การฝึก
                ปฏิบัติงานฯ มีความบกพร่องในระดับยอมรับได้
                ยังคงสามารถปฏิบัติงานได้ แต่ต้อง ได้รับคำแนะนำเป็นส่วนใหญ่
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
                นักศึกษาแสดงให้เห็นว่าขาดทักษะ/ความสามารถในระดับไม่น่าเชื่อถือ
                เกิดความ บกพร่องอยู่เสมอ
                การปฏิบัติงานอยู่ภายใต้การดูแลจากอาจารย์ประจำแหล่งฝึกอย่าง
                ใกล้ชิด
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
                นักศึกษาแสดงให้เห็นว่าขาดทักษะ/ความสามารถ
                ไม่ผ่านตามวัตถุประสงค์การฝึก ปฏิบัติงานฯ ไม่สามารถปฏิบัติงานได้
                เกิดความผิดพลาดซ้ำ และไม่ปรับปรุงตาม คำแนะนำของอาจารย์แหล่งฝึก{" "}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">
          แบบประเมินความประพฤติและทัศนคติของนักศึกษา
        </p>
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
                  รวมคะแนน /{" "}
                  {toThaiNumber(
                    criteriaData.filter((item) => {
                      const value = data[item.label as keyof typeof data];
                      return !item.head && value !== "N/A" && value !== "";
                    }).length * 5
                  )}
                </td>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={6}
                >
                  {toThaiNumber(
                    criteriaData.reduce((total, item) => {
                      const value = data[item.label as keyof typeof data];
                      if (!item.head && value && value !== "N/A") {
                        return total + parseInt(value, 10);
                      }
                      return total;
                    }, 0)
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
