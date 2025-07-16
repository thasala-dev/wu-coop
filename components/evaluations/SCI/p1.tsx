import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

const toThaiNumber = (number: number) => {
  const thaiNumbers = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  return number
    .toString()
    .split("")
    .map((digit) => thaiNumbers[parseInt(digit, 10)])
    .join("");
};

const criteriaData = [
  {
    label: "p1",
    topTitle: "พฤติกรรมต่อแหล่งฝึก",
    title: "๑. การตรงต่อเวลาการมีวินัยและปฏิบัติตนตามแหล่งฝึก",
  },
  {
    label: "p2",
    title: "๒. การแต่งกายเหมาะสม แสดงถึงความเป็นวิชาชีพเภสัชกรรม",
  },
  {
    label: "p3",
    title: "๓. การปรับตัวเข้ากับแหล่งฝึกและการปรับปรุงตนเองต่อข้อเสนอแนะ",
  },
  {
    label: "p4",
    topTitle: "พฤติกรรมต่อผู้อื่น",
    title:
      "๔. การมีมนุษยสัมพันธ์ที่ดี สามารถติดต่อกับผู้อื่นได้อย่างเหมาะสม มีมารยาทในการปฏิบัติงานที่ดี",
  },
  {
    label: "p5",
    title: "๕. ความมีน้ำใจ ไม่เพิกเฉยต่อการช่วยเหลือผู้อื่น",
  },
  {
    label: "p6",
    topTitle: "พฤติกรรมต่อตนเอง",
    title: "๖. การเตรียมความพร้อมก่อนฝึกปฏิบัติงาน",
  },
  {
    label: "p7",
    title: "๗. ความตั้งใจ กระตือรือร้น และความรับผิดชอบต่องานที่ได้รับมอบหมาย",
  },
  {
    label: "p8",
    title: "๘. ความซื่อสัตย์สุจริต และการรักษาไว้ซึ่งจรรยาบรรณแห่งวิชาชีพ",
  },
  {
    label: "p9",
    title: "๙. ความคิดริเริ่มสร้างสรรค์",
  },
  {
    label: "p10",
    topTitle: "ทักษะการสื่อสาร",
    title: "๑๐. การแสดงความคิดเห็น และทักษะในการสื่อสาร",
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

    suggestion: parentForm.getValues("result.strength") || "",
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
    let isValid = false;
    Object.keys(data).forEach((key) => {
      if (key === "locationOther" || key === "communicatorOther") {
        isValid = false;
      }
      const value = data[key as keyof typeof data];
      if (!value) {
        return true;
      }
    });
    return !isValid;
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12 ">
      <div className="sm:col-span-12 ">
        <div className="">
          <p className="text-sm">
            การประเมินนักศึกษาโดยอาจารย์ประจำแหล่งฝึกสามารถทำได้จากการสังเกตพฤติกรรม
            การสอบถาม การอภิปราย รวมไปถึงผลของการปฏิบัติการงาน
            โดยมีแนวทางของการให้คะแนนดังนี้
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 ">
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
                นักศึกษามีพฤติกรรมที่เหมาะสม มีความพร้อม ความเสียสละ
                กระตือรือร้น รวมถึงทัศนคติที่ดี ต่อการฝึกงาน
                พร้อมทั้งสามารถอภิปรายและให้ข้อเสนอแนะที่เป็นประโยชน์ได้อย่างเหมาะสม
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
                นักศึกษามีพฤติกรรมที่เหมาะสม มีความพร้อม ความเสียสละ
                กระตือรือร้น รวมถึงทัศนคติที่ดี ต่อการฝึกงาน
                สามารถฝึกปฏิบัติงานได้ด้วยตนเอง
                แต่ต้องได้รับคำแนะนำเพียงเล็กน้อย
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
                นักศึกษามีพฤติกรรมอยู่ในเกณฑ์พอใช้
                สามารถฝึกปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับคำแนะนำเป็นส่วนใหญ่
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
                นักศึกษามีพฤติกรรมที่ไม่เหมาะสมบางประการ
                เกิดความผิดพลาดบ่อยครั้ง สามารถปฏิบัติงานได้
                แต่ต้องได้รับการดูแลอย่างใกล้ชิด
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
                นักศึกษามีพฤติกรรมที่ไม่เหมาะสมบางประการ
                เกิดความผิดพลาดบ่อยครั้ง
                และไม่ปรับปรุงตามคำแนะนำของอาจารย์ประจำแหล่งฝึก
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
                </tbody>
              );
            })}
            <tbody>
              <tr>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  คะแนนรวม
                </td>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={5}
                >
                  {toThaiNumber(
                    criteriaData.reduce((total, item) => {
                      const value = data[item.label as keyof typeof data];
                      return total + (value ? parseInt(value, 10) : 0);
                    }, 0)
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-center text-sm font-bold text-center">
                  เปอร์เซ็นต์ของคะแนนพฤติกรรมที่ได้ ( คะแนนรวมทั้งหมด * ๒ )
                </td>
                <td
                  className="p-2 border align-center text-sm font-bold text-center"
                  colSpan={5}
                >
                  {toThaiNumber(
                    criteriaData.reduce((total, item) => {
                      const value = data[item.label as keyof typeof data];
                      return total + (value ? parseInt(value, 10) : 0);
                    }, 0) * 2
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
            className={
              "min-h-24 border focus-visible:ring-0 resize-none text-sm" +
              (isSubmit && !data.suggestion ? " border-2 border-red-600" : "")
            }
            onChange={(e) => {
              setDataValue("strength", e.target.value);
            }}
            value={data.suggestion}
          />

          {isSubmit && !data.suggestion && (
            <p className="text-xs text-red-600 mt-1 text-center">
              กรุณากรอกข้อเสนอแนะ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
