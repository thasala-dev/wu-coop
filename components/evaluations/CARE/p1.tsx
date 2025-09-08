import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

const criteriaData = {
  p1_1: {
    title: "1. ความสนใจและเอาใจใส่ต่อการฝึกปฏิบัติงานวิชาชีพ",
    description:
      "นิสิต/นักศึกษามีความสนใจและมุ่งมั่นในการฝึกปฏิบัติงานวิชาชีพ มีความเอาใจใส่ในการรับฟังคำแนะนำผู้สอนเป็นสำคัญ ปฏิบัติตัวอยู่ในสถานที่ที่กำหนดให้และเขียนรายงานตรงเวลามากกว่าร้อยละ 80 ของช่วงเวลาของการฝึกปฏิบัติงานวิชาชีพทั้งหมด",
  },
  p1_2: {
    title: "2. ความซื่อสัตย์และจรรยาบรรณวิชาชีพ",
    description:
      "นิสิต/นักศึกษามีความซื่อสัตย์ โดยปฏิบัติตามหลักจรรยาบรรณดังนี้\n- ไม่เปิดเผยความลับของผู้ป่วยในวงกว้าง ๆ\n- ปฏิบัติตามคำสั่งและเชื่อฟังอย่าง ๆ ขององค์กรประจำแหล่งฝึกอย่างเคร่งครัด\n- ไม่กระทำผิดวิชาชีพตามจรรยาบรรณวิชาชีพ\n- กรอกยาให้แก่ผู้ป่วยตรงกับชนิด ขนาด จำนวน และฉลากยา\n- ไม่คัดลอกผลงานของผู้อื่นมาเป็นของตนเองรวมทั้งความบกพร่องในการอ้างอิง",
  },
  p1_3: {
    title: "3. ความเคารพผู้อื่น",
    description:
      "นิสิต/นักศึกษามีความประพฤติอ่อนน้อม เหมาะสมกับความเคารพที่พึงมีต่อผู้ป่วย อาจารย์ประจำแหล่งฝึกและสหสาขาวิชาชีพ โดยพฤติกรรมดังนี้\n- ต้องแสดงกิริยา มารยาท ความสุภาพ ความคิด ความเห็นและความรักเกียรติหรือศักดิ์ศรีของตนเองที่พึงมี\n- เป็นผู้รับฟังที่ดีตั้งใจฟังผู้ป่วย อาจารย์ประจำแหล่งฝึกและสหสาขาวิชาชีพและสามารถเรียบเรียงคำถามที่ชัดเจน เข้าใจง่ายง่าย มีเหตุผลที่ถูกกาละเทศะ อาจารย์ประจำแหล่งฝึกและสหสาขาวิชาชีพพึงสอบถาม\n- ใช้ถ้อยคำเหมาะสม สุภาพ อุดมสภาพดี",
  },
  p1_4: {
    title: "4. ความเป็นวิชาชีพ มนุษยธรรม",
    description:
      "นิสิต/นักศึกษาแสดงให้เห็นถึงความเห็นอกเห็นใจและความรับผิดชอบ ตุ่นตัวที่ดีในการสะท้อนให้เห็นถึงความเป็นวิชาชีพและจริยธรรมในการปฏิบัติอย่างเหมาะสม และศึกษาหาความรู้ตลอดเวลาเพื่อการพัฒนาทางวิชาชีพ",
  },
  p1_5: {
    title: "5. ความใฝ่รู้และความพยายามในการฝีกปฏิบัติงานวิชาชีพ",
    description:
      "นิสิต/นักศึกษามีความใฝ่รู้ ความพยายามในการพัฒนาตนเองให้ได้ตามวัตถุประสงค์ของการฝึก โดยครบถ้วนดังนี้\n- มีการเตรียมตัวให้พร้อมสำหรับการฝึกปฏิบัติงานวิชาชีพ\n- มีการขอคำแนะนำปรึกษากับอาจารย์ประจำแหล่งฝึกเมื่อพบปัญหาหรือข้อสงสัยในระหว่างการฝึกปฏิบัติงานวิชาชีพอย่างเหมาะสมกับระดับของนิสิต/นักศึกษา",
  },
  p1_6: {
    title: "6. ความรับผิดชอบในการฝึกปฏิบัติงานวิชาชีพ",
    description:
      "นิสิต/นักศึกษามีความรับผิดชอบต่องานที่ได้รับมอบหมาย โดยครบถ้วนดังนี้\n- มาถึงปฏิบัติงานตรงตามเวลา ไม่ขาดการฝึกปฏิบัติงานโดยไม่มีเหตุผลหรือไม่แจ้งล่วงหน้า\n- มีความรับผิดชอบต่องานที่ได้รับมอบหมาย",
  },
};

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    p1_1: parentForm.getValues("result.p1_1") || "",
    p1_2: parentForm.getValues("result.p1_2") || "",
    p1_3: parentForm.getValues("result.p1_3") || "",
    p1_4: parentForm.getValues("result.p1_4") || "",
    p1_5: parentForm.getValues("result.p1_5") || "",
    p1_6: parentForm.getValues("result.p1_6") || "",
    strength: parentForm.getValues("result.strength") || "",
    improvement: parentForm.getValues("result.improvement") || "",
  });

  useEffect(() => {
    setFormValidated(handleCheckValid());
    // }
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
        <div className="">
          <p className="text-sm">
            ให้อาจารย์ประจำแหล่งฝึกประเมินผลโดยสังเกตจากพฤติกรรม
            ผลการปฏิบัติงานและ/หรือจากการ อภิปรายสอบถาม การสื่อสาร ทั้งโดยวาจา
            หรือลายลักษณ์อักษร และให้ประเมิน 2 ครั้ง คือในสัปดาห์ที่ 3 และ 6
            ของการฝึกปฏิบัติงาน ผลการประเมินในสัปดาห์ที่ 3
            ควรมีการแจ้งให้นิสิต/นักศึกษาทราบเพื่อให้เกิดการพัฒนา
            <u className="font-medium italic">
              การประเมินผลการฝึกปฏิบัติงานจะถือจากผลการประเมินในสัปดาห์ที่ 6
            </u>
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 ">
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <p className="text-sm mb-2">
            <strong>คำชี้แจง</strong>
          </p>
          <p className="text-xs sm:text-sm mb-4">
            ให้ทำเครื่องหมายกากบาท (✗)
            ในช่องผลการประเมินที่ตรงกับทักษะและความสามารถของนิสิต/
            นักศึกษาที่ท่านดูแลมากที่สุด
            (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ)
          </p>
          <p className="text-xs sm:text-sm mb-2">
            ทั้งนี้ เมื่อสิ้นสุดการศึกษา{" "}
            <u className="font-bold">
              นิสิต/นักศึกษาจะต้องผ่านทั้ง 6
              หัวข้อการประเมินพฤติกรรมและความเป็นวิชาชีพ
            </u>{" "}
            จึงจะผ่านการฝึกปฏิบัติงานวิชาชีพในสถานนั้น ๆ
            และการประเมินในส่วนนี้จะไม่ถูกนำมาคิดเป็น
            คะแนนในการประเมินผลการเรียนของนิสิต/นักศึกษา (เกรด A-F)
          </p>
          <p className="text-xs sm:text-sm mt-4">
            หากนิสิต/นักศึกษาได้รับการประเมิน{" "}
            <u className="font-bold">"ไม่ผ่าน"</u>{" "}
            ในหัวข้อการประเมินพฤติกรรมและความเป็นวิชาชีพ
            <u className="font-bold"> ข้อใดข้อหนึ่ง</u>{" "}
            ในการประเมินเมื่อสิ้นสุดการฝึกปฏิบัติงานวิชาชีพ{" "}
            <u className="font-bold">จะถือว่านิสิต/นักศึกษา "ไม่ผ่าน"</u>{" "}
            การฝึกปฏิบัติงานวิชาชีพในสถานนั้น ๆ
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 ">
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm mb-2">
            <strong>หมายเหตุ</strong>
          </p>
          <p className="text-xs sm:text-sm mb-4">
            - ในสัปดาห์ที่ 3 การประเมิน <u className="font-bold">"ไม่ผ่าน"</u>{" "}
            ในหัวข้อใด ให้อาจารย์ประจําแหล่งฝากแจ้งนิสิต/นักศึกษาให้ปรับปรุง ตัว
            และทําการประเมินอีกครั้งในสัปดาห์ที่ 6
          </p>
          <p className="text-xs sm:text-sm">
            - การประเมิน <u className="font-bold">"ไม่ผ่าน"</u>{" "}
            ในหัวข้อใดหัวข้อหนึ่ง เมื่อสิ้นสุดการฝึกปฏิบัติงานวิชาชีพ
            (สัปดาห์ที่ 6) นิสิต/ นักศึกษาจะได้รับการประเมิน{" "}
            <u className="font-bold">"ไม่ผ่าน"</u>
            ในการฝึกปฏิบัติงานวิชาชีพในผลัดนั้น ๆ
          </p>
        </div>
      </div>
      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบฟอร์มการประเมิน</p>
      </div>

      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border text-left text-sm">
                  หัวข้อการประเมิน
                </th>
                <th
                  className="hidden sm:table-cell p-2 border text-left text-sm"
                  style={{ width: "50%" }}
                >
                  คำอธิบาย
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "150px" }}
                >
                  ผลการประเมิน
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(criteriaData).map(([key, item]) => {
                return (
                  <tr key={key}>
                    <td className="p-2 border font-medium align-top text-sm">
                      <div className="mb-2">{item.title}</div>
                      <div
                        className="flex sm:hidden text-xs text-gray-500"
                        dangerouslySetInnerHTML={{
                          __html: item.description.replace(/\n/g, "<br/>"),
                        }}
                      />
                    </td>
                    <td className="hidden sm:table-cell p-2 border text-sm">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.description.replace(/\n/g, "<br/>"),
                        }}
                      />
                    </td>
                    <td className="p-2 border align-top text-sm">
                      <div className="flex flex-col items-center justify-center h-full">
                        <RadioGroup
                          onValueChange={(value) => setDataValue(key, value)}
                          value={data[key as keyof typeof data]}
                          className="flex flex-row items-center gap-8 justify-center w-full"
                        >
                          <div className="flex flex-col items-center">
                            <RadioGroupItem
                              value="pass"
                              id={`${key}-pass`}
                              className={
                                isSubmit && !data[key as keyof typeof data]
                                  ? "border-2 border-red-600"
                                  : ""
                              }
                              aria-invalid={
                                isSubmit && !data[key as keyof typeof data]
                              }
                            />
                            <label
                              htmlFor={`${key}-pass`}
                              className={
                                "text-xs mt-1" +
                                (isSubmit && !data[key as keyof typeof data]
                                  ? " text-red-600"
                                  : "")
                              }
                            >
                              ผ่าน
                            </label>
                          </div>
                          <div className="flex flex-col items-center">
                            <RadioGroupItem
                              value="fail"
                              id={`${key}-fail`}
                              className={
                                isSubmit && !data[key as keyof typeof data]
                                  ? "border-2 border-red-600"
                                  : ""
                              }
                              aria-invalid={
                                isSubmit && !data[key as keyof typeof data]
                              }
                            />
                            <label
                              htmlFor={`${key}-fail`}
                              className={
                                "text-xs mt-1" +
                                (isSubmit && !data[key as keyof typeof data]
                                  ? " text-red-600"
                                  : "")
                              }
                            >
                              ไม่ผ่าน
                            </label>
                          </div>
                        </RadioGroup>
                        {isSubmit && !data[key as keyof typeof data] && (
                          <p className="text-xs text-red-600 mt-1 text-center">
                            กรุณาเลือกผลการประเมิน
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="sm:col-span-12">
        <div className="pt-4 pb-4">
          <h3 className="font-semibold mb-3 text-sm">
            การสะท้อน (Feedback) ให้แก่นิสิต/นักศึกษา
          </h3>
          <div className="border rounded-md">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 border text-center text-sm" width="100px">
                    จุดแข็ง
                  </td>
                  <td className="p-2 border">
                    <Textarea
                      placeholder="จุดแข็งของนิสิต/นักศึกษา"
                      className={
                        "min-h-24 border-0 focus-visible:ring-0 resize-none text-sm" +
                        (isSubmit && !data.strength
                          ? " border-2 border-red-600"
                          : "")
                      }
                      onChange={(e) => {
                        setDataValue("strength", e.target.value);
                      }}
                      value={data.strength}
                    />

                    {isSubmit && !data.strength && (
                      <p className="text-xs text-red-600 mt-1 text-center">
                        กรุณากรอกจุดแข็งของนิสิต/นักศึกษา
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border text-center text-sm">
                    จุดที่ควรปรับปรุง
                  </td>
                  <td className="p-2 border">
                    <Textarea
                      placeholder="จุดที่ควรปรับปรุงของนิสิต/นักศึกษา"
                      className={
                        "min-h-24 border-0 focus-visible:ring-0 resize-none text-sm" +
                        (isSubmit && !data.improvement
                          ? " border-2 border-red-600"
                          : "")
                      }
                      onChange={(e) => {
                        setDataValue("improvement", e.target.value);
                      }}
                      value={data.improvement}
                    />
                    {isSubmit && !data.improvement && (
                      <p className="text-xs text-red-600 mt-1 text-center">
                        กรุณากรอกจุดที่ควรปรับปรุง
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
