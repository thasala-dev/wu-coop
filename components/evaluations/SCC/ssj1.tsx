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
    topTitle: "๑. พฤติกรรมต่อสถาบัน",
    label: "p1_1",
    point: 6,
    title: `๑.๑. ตรงต่อเวลา`,
  },
  {
    label: "p1_2",
    point: 2,
    title: "๑.๒. การแต่งกาย",
  },
  {
    label: "p1_3",
    point: 2,
    title: "๑.๓. การปฏิบัติตามระเบียบของหน่วยงาน",
  },
  {
    topTitle: "๒. พฤติกรรมต่อผู้อื่น",
    label: "p2_1",
    point: 6,
    title: `๒.๑. การมีมนุษยสัมพันธ์`,
  },
  {
    label: "p2_2",
    point: 2,
    title: "๒.๒. ความเป็นผู้นำ",
  },
  {
    label: "p2_3",
    point: 2,
    title: "๒.๓. การรู้จักกาลเทศะ",
  },
  {
    topTitle: "๓. พฤติกรรมต่อตนเอง",
    label: "p3_1",
    point: 6,
    title: `๓.๑. ความรับผิดชอบต่องานที่ได้รับมอบหมาย`,
  },
  {
    label: "p3_2",
    point: 2,
    title: "๓.๒. ความซื่อสัตย์สุจริต",
  },
  {
    label: "p3_3",
    point: 2,
    title: "๓.๓. ความสนใจในการแสวงหาความรู้เพิ่มเติม",
  },
  {
    label: "p3_4",
    point: 2,
    title: "๓.๔. ความคิดริเริ่มสร้างสรรค์",
  },
  {
    label: "p3_5",
    point: 2,
    title: "๓.๕. ความสามารถในการแสดงความคิดเห็น",
  },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    p1_1: parentForm.getValues("result.p1_1") || "",
    p1_2: parentForm.getValues("result.p1_2") || "",
    p1_3: parentForm.getValues("result.p1_3") || "",
    p2_1: parentForm.getValues("result.p2_1") || "",
    p2_2: parentForm.getValues("result.p2_2") || "",
    p2_3: parentForm.getValues("result.p2_3") || "",
    p3_1: parentForm.getValues("result.p3_1") || "",
    p3_2: parentForm.getValues("result.p3_2") || "",
    p3_3: parentForm.getValues("result.p3_3") || "",
    p3_4: parentForm.getValues("result.p3_4") || "",
    p3_5: parentForm.getValues("result.p3_5") || "",

    other: parentForm.getValues("result.other") || "",
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
                  <div>๕</div>
                  <div>(ดีมาก)</div>
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>๔</div>
                  <div>(ดี)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>๓</div>
                  <div>(ปานกลาง)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>๒</div>
                  <div>(พอใช้)</div>
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "8%" }}
                >
                  <div>๑</div>
                  <div>(ปรับปรุง)</div>
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
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
      <div className="sm:col-span-12">
        <div className="pt-4 pb-4">
          <h3 className="font-semibold mb-3 text-sm">ผลการประเมินอื่นๆ</h3>
          <Textarea
            placeholder="ผลการประเมินอื่นๆ"
            className="min-h-24 border focus-visible:ring-0 resize-none text-sm"
            onChange={(e) => {
              setDataValue("other", e.target.value);
            }}
            value={data.other}
          />
        </div>
      </div>
    </div>
  );
}
