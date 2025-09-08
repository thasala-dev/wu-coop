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
    head: false,
    title: `1. ทักษะการวิเคราะห์ ความเชื่อมโยงของข้อมูลและการผสมผสานเข้ากับการปฏิบัติงาน`,
  },
  {
    label: "p2",
    head: false,
    title: `2. ทักษะในการประยุกต์ บูรณาการ ทฤษฎี แนวคิด`,
  },
  {
    label: "p3",
    head: false,
    title: `3. ทักษะการคิดเชิงระบบ มีความคิดเป็นขั้นเป็นตอน หรือเป็นเหตุเป็นผล (Systematic Thinking)`,
  },
  { label: "p4", head: false, title: `4. ทักษะความคิดเชิงสร้างสรรค์` },
  {
    label: "p5",
    head: false,
    title: `5. ทักษะความเป็นเจ้าของธุรกิจ (ความมีเป้าหมาย ความรับผิดชอบในงานที่มอบหมาย ความเข้าใจได้ ความกระตือรือร้นในงานที่มอบหมาย)`,
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
        <h2 className="text-lg font-bold">การประเมินผลการนำเสนอ</h2>
        <p className="text-sm text-gray-600">
          ลักษณะการประเมินผล ให้อาจารย์แหล่งฝึกสังเกตจากพฤติกรรม
          ผลการปฏิบัติงานและ/หรือจากการอธิบาย สอบถาม การสื่อสาร ทั้งโดยวาจา
          หรือเอกสารอื่นๆ อีก และให้ประเมิน 2 ครั้ง คือในสัปดาห์ที่ 4
          และสัปดาห์ที่ 6 ของการ ฝึกปฏิบัติการ ผลการประเมินในสัปดาห์ที่ 4
          ควรมีการแจ้งให้นิสิต/นักศึกษาทราบเพื่อให้เกิดการพัฒนา{" "}
          <b>
            <u>
              โดยคะแนนที่ใช้ในการประเมินผลการฝึกปฏิบัติการจะคิดจากคะแนนในสัปดาห์ที่
              6{" "}
            </u>
          </b>
          <br />
          <b>คำชี้แจง</b>
          <br />
          จากระดับขั้นการประเมินข้างล่าง
          ให้ท่านเติมตัวเลขที่ตรงกับทักษะและความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
          (ประเมินทั้งในและนอกเอกสารการฝึกปฏิบัติงานฯ)
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
                ดีเยี่ยม
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นิสิต/นักศึกษามีทักษะการบริหารจัดการในเรื่องที่ประเมินได้อย่างเหมาะสมดีเยี่ยม
                พร้อมสามารถอภิปรายและให้นำเสนอแนะที่เป็นประโยชน์อย่างเหมาะสม
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
                นิสิต/นักศึกษามีทักษะการบริหารจัดการในเรื่องที่ประเมินได้อย่างเหมาะสม
                มีความพร้อม และ สามารถปฏิบัติงานได้ค่อนข้างยอดเยี่ยม
                แต่ขาดข้อเสนอแนะเพียงเล็กน้อย
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
                นิสิต/นักศึกษามีทักษะการบริหารจัดการในเรื่องที่ประเมินอยู่ในเกณฑ์รับได้
                สามารถปฏิบัติงานได้ แต่คงจะน้อยในส่วนส่วนใหญ่
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
                นิสิต/นักศึกษามีทักษะการบริหารจัดการในเรื่องที่ประเมินไม่เหมาะสม
                ไม่สามารถปฏิบัติงานได้ เกิดความผิดพลาดซ้ำ ๆ หรือ
                ต้องให้คำแนะนำตลอดเวลา
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                1
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ไม่ผ่าน
              </td>
              <td className="p-2 border font-medium align-top text-sm"></td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                N/A
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ไม่สามารถประเมินได้/ไม่มีการสังเกต
              </td>
              <td className="p-2 border font-medium align-top text-sm"></td>
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
                  รวมคะแนน (คะแนนที่ได้ x 10) /{" "}
                  {toThaiNumber(
                    criteriaData.filter((item) => {
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
                        (criteriaData.filter((item) => {
                          const value = data[item.label as keyof typeof data];
                          return value !== "N/A" && value !== "";
                        }).length *
                          5)
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
