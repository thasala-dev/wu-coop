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
    title: `1. โครงสร้างการคุ้มครองผู้บริโภคในประเทศไทย ภาครัฐ และเอกชน`,
  },
  {
    label: "p2",
    title: "2. กรณีศึกษาระบบและกลไกคุ้มครองผู้บริโภค กฎหมายและนโยบาย",
  },
  {
    label: "p3",
    title: "3. การทำงานคุ้มครองผู้บริโภคขององค์กร และหน่วยงานคุ้มครองผู้บริโภค",
  },
  {
    label: "p4",
    title: "4. ทำคดีเรื่องร้องเรียน",
  },
  {
    label: "p5",
    title: "5. รับเรื่องขออนุญาตผลิตภัณฑ์และบริการสุขภาพก่อนออกสู่ท้องตลาด",
  },
  {
    label: "p6",
    title: "6. ตรวจสอบผลิตภัณฑ์และบริการสุขภาพหลังออกสู่ท้องตลาด",
  },
  {
    label: "p7",
    title: "7. ศึกษาระบบเฝ้าระวังความเสี่ยงด้านยาและสุขภาพในชุมชน/แหล่งฝึก",
  },
  {
    label: "p8",
    title:
      "8. เสนอแนวทางการจัดการความเสี่ยงด้านยาและผลิตภัณฑ์สุขภาพในชุมชน/พื้นที่",
  },
  {
    label: "p9",
    title:
      "9. สื่อสารความเสี่ยงเพื่อลดหรือกำจัดความเสี่ยงในงานคุ้มครองผู้บริโภค",
  },
  {
    label: "p10",
    title:
      "10. ศึกษาบริบทของชุมชนและวิเคราะห์ปัญหาด้านเภสัชสาธารณสุขของชุมชนด้วยกระบวนการศึกษาชุมชน",
  },
  {
    label: "p11",
    title: "11. นำเสนอแผนงาน/โครงการ/กิจกรรมแก้ไขปัญหาทางด้านเภสัชสาธารณสุข",
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
    p6: parentForm.getValues("result.p6") || "",
    p7: parentForm.getValues("result.p7") || "",
    p8: parentForm.getValues("result.p8") || "",
    p9: parentForm.getValues("result.p9") || "",
    p10: parentForm.getValues("result.p10") || "",
    p11: parentForm.getValues("result.p11") || "",
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
    const keyList = ["other"];
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
                  style={{ width: "8%" }}
                >
                  <div>5</div>
                  <div>(ดีมาก)</div>
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>4</div>
                  <div>(ดี)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>3</div>
                  <div>(ปานกลาง)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>2</div>
                  <div>(พอใช้)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>1</div>
                  <div>(ปรับปรุง)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>N/A</div>
                  <div>(ไม่ประเมิน)</div>
                </th>
              </tr>
            </thead>

            {criteriaData.map((item: any, key) => {
              return (
                <tbody key={key}>
                  <tr>
                    <td className="p-2 border align-top text-sm">
                      {item.topTitle && (
                        <div className="font-bold mb-2">{item.topTitle}</div>
                      )}
                      <>{item.title}</>
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
                            value="0"
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
                </tbody>
              );
            })}
            <tbody>
              <tr>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  รวมคะแนน (คะแนนที่ได้ x 20) / ฐานคะแนนที่มีการประเมินจริง
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
                          const numValue = value ? parseInt(value, 10) : 0;
                          return total + (numValue > 0 ? numValue : 0);
                        }, 0) *
                          20) /
                        criteriaData.filter((item) => {
                          const value = data[item.label as keyof typeof data];
                          return value && parseInt(value, 10) > 0;
                        }).length
                      ).toFixed(2)
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
