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
{ label: "p1", head: false, title: "1. การตรงต่อเวลา และความมีวินัย (มาก่อนเวลาที่สามารถเตรียมตัวพร้อมที่จะฝึกฯ)" },
{ label: "p2", head: false, title: "2. การแต่งกายเหมาะสม แสดงถึงความเป็นวิชาชีพเภสัชกรรม" },
{ label: "p3", head: false, title: "3. พฤติกรรมในการติดต่อสื่อสารกับผู้อื่น อย่างมีมารยาท และเหมาะสมกับกาลเทศะ" },
{ label: "p4", head: false, title: "4. การมีน้ำใจ ไม่เห็นแก่ตัว การช่วยเหลือผู้อื่นตามสมควร" },
{ label: "p5", head: false, title: "5. ความกระตือรือร้นและสนใจฝึกฯ มีคุณลักษณะที่ดีทางการศึกษาและ/หรือการเป็นบุคลากรทางสุขภาพ" },
{ label: "p6", head: false, title: "6. การมีความสามารถ/ฝีมือในการปฏิบัติงาน" },
{ label: "p7", head: false, title: "7. ความรู้ ความเข้าใจ และประเมินตนในวิชาฝึกฯ" },
{ label: "p8", head: false, title: "8. การปฏิบัติตนขณะทำหน้าที่รับผิดชอบ" },
{ label: "p9", head: false, title: "9. การปรับตัวเข้ากับสภาพฝึกฯ" },
{ label: "p10", head: false, title: "10. การปฏิบัติประชุมและข้อเสนอแนะ (ซอบรับฟัง ทบทวน ตอบข้อซักถาม และร่วมอภิปรายเสนอแนะ)" },
{ label: "p11", head: false, title: "11. การส่งงานหรือรายงานตรงต่อเวลา (เช่น ส่งข้อสอบ ไม่มีการเลื่อนหรือขาดส่งโดยไม่มีเหตุอันสมควร)" },
{ label: "p12", head: false, title: "12. ความสามารถในการประเมินตนเอง (เช่น มีความคิดปรับปรุงตนเองตามคำแนะนำของอาจารย์ประจำแหล่งฝึกฯ เพื่อพัฒนาทักษะ/สมรรถนะการปฏิบัติงาน)" },

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
        <h2 className="text-lg font-bold">การประเมินผลการนำเสนอ</h2>
        <p className="text-sm text-gray-600">
          ลักษณะการประเมินผล
ให้อาจารย์ประจำแหล่งฝึกประเมินผลจากพฤติกรรม ผลการปฏิบัติงาน และ/หรือจากการอภิปรายสอบถาม การสื่อสาร ทั้งโดยวาจา หรือเอกสาร และให้ประเมิน 2 ครั้ง คือในสัปดาห์ที่ 3 และ 6 ผลการประเมินในสัปดาห์ที่ 3 ใช้เพื่อให้คำแนะนำการพัฒนา และผลการประเมินในสัปดาห์ที่ 6 เป็นคะแนนสุดท้าย<br/>
<b>คำชี้แจง</b><br/>
ให้ทำเครื่องหมายกากบาท (x) ในช่องระดับคะแนนตามแบบประเมินที่ตรงกับทักษะและความสามารถของนักศึกษา พร้อมเหตุผลที่ดีที่สุด (ระบุเพิ่มเติมในเอกสารภาคปฏิบัติ)
<br/>
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
นักศึกษามีพฤติกรรมเหมาะสม มีความพร้อม เสียสละ กระตือรือร้น รวมถึง
ทัศนคติที่ดีต่อการฝึกปฏิบัติงานพร้อมสามารถอภิปรายและให้ข้อเสนอแนะที่เป็น
ประโยชน์อย่างเหมาะสม              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ๔
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดี
              </td>
              <td className="p-2 border font-medium align-top text-sm">
นักศึกษามีพฤติกรรมเหมาะสม มีความพร้อม เสียสละ รวมถึงทัศนคติที่ดีต่อการ
ฝึกปฏิบัติงานสามารถปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับคำแนะนำเพียง
เล็กน้อย
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
              นักศึกษามีพฤติกรรมอยู่ในเกณฑ์พอใช้ สามารถปฏิบัติงานได้ด้วยตนเอง แต่ต้องได้รับคำแนะนำเป็นส่วนใหญ่
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
นักศึกษามีพฤติกรรมไม่เหมาะสมบางประการ เกิดความผิดพลาดซ้ำ สามารถปฏิบัติงานได้แต่ต้องได้รับการติดตามอย่างใกล้ชิด
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
                นักศึกษามีพฤติกรรมไม่เหมาะสม เกิดความผิดพลาดซ้ำ และไม่ปรับปรุงตัวตามคำแนะนำของอาจารย์ประจำแหล่งฝึก
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
        <p className="text-center text-md font-bold"><u>
          นักศึกษาจะได้รับการประเมินผลการฝึกปฏิบัติงานด้านการประเมินเทคโนโลยีด้านสุขภาพ ก็ต่อเมื่อ <br/>
มีคะแนนจากการประเมินความประพฤติและทัศนคติของนักศึกษา มากกว่าหรือเท่ากับร้อยละ 50</u>
        </p>
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
