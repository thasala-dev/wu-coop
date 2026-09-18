import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const criteriaData = [
  {
    no: "๑.",
    title: "ความเสียสละและเอาใจใส่ต่อการฝึกปฏิบัติงานวิชาชีพ",
    description:
      "นิสิต/นักศึกษามีความตั้งใจและทุ่มเทในการฝึกปฏิบัติงานวิชาชีพ มีความเอาใจใส่ในการบริบาลทางเภสัชกรรมแก่ผู้ป่วยเป็นสำคัญ ปฏิบัติตัวต่อผู้อื่นอย่างเห็นอกเห็นใจ และเห็นต่อประโยชน์ของผู้อื่นมากกว่าประโยชน์ของตนเอง",
    key: "p1_1",
  },
  {
    no: "๒.",
    title: "ความซื่อสัตย์และจรรยาบรรณวิชาชีพ",
    description: [
      "นิสิต/นักศึกษามีความซื่อสัตย์ โดยปฏิบัติได้ครบทุกข้อดังนี้",
      "ไม่เปิดเผยความลับของผู้ป่วยไม่ว่าในกรณีใด ๆ",
      "ปฏิบัติตามคำเตือนและข้อแนะนำต่าง ๆ ของเภสัชกรพี่เลี้ยงอย่างเคร่งครัด",
      "ไม่กระทำผิดหลักของจรรยาบรรณวิชาชีพเภสัชกรรม",
      "กล้ายอมรับในสิ่งที่ปฏิบัติผิดพลาดและพร้อมที่จะปรับปรุงแก้ไข",
      "ไม่คัดลอกผลงานของผู้อื่นรวมทั้งผลงานของตนเองในอดีตมานำเสนอซ้ำในการฝึกปฏิบัติงาน",
    ],
    key: "p1_2",
  },
  {
    no: "๓.",
    title: "ความเคารพผู้อื่น",
    description: [
      "นิสิต/นักศึกษามีความประพฤติที่เหมาะสมด้วยความเคารพทั้งต่อผู้ป่วย เภสัชกรพี่เลี้ยงและทีมสหสาขาวิชาชีพ ได้ครบทุกข้อดังนี้",
      "ต้องเคารพต่อความรู้สึก ความต้องการ ความคิด และความคิดเห็นหรือข้อวิพากษ์ของผู้อื่น",
      "เป็นผู้รับฟังที่ดีต่อทั้งผู้ป่วย เภสัชกรพี่เลี้ยง และทีมสหสาขาวิชาชีพ และสามารถตอบรับต่อคำวิพากษ์ ข้อแนะนำทั้งทางด้านวิชาการและพฤติกรรมจากผู้ป่วย เภสัชกรพี่เลี้ยง และทีมสหสาขาวิชาชีพได้อย่างเหมาะสม",
      "เคารพตามสิทธิของผู้ป่วย",
      "ใช้คำพูดเหมาะสม สุภาพ ถูกกาลเทศะ",
    ],
    key: "p1_3",
  },
  {
    no: "๔.",
    title: "ความเป็นวิชาชีพเภสัชกรรม",
    description:
      "นิสิต/นักศึกษาแสดงให้เห็นถึงภาพลักษณ์ความเป็นวิชาชีพ ดูน่าเชื่อถือ มีการแต่งกายที่แสดงให้เห็นถึงความเป็นวิชาชีพเภสัชกรรมได้อย่างเหมาะสม และมีความรับผิดชอบต่อการกระทำและพฤติกรรมของตน",
    key: "p1_4",
  },
  {
    no: "๕.",
    title: "ความใฝ่รู้ และความพยายามในการฝึกปฏิบัติงานวิชาชีพ",
    description: [
      "นิสิต/นักศึกษามีความใฝ่รู้ ความพยายามในการพัฒนาตนเองให้ได้ตามวัตถุประสงค์ของการฝึก ได้ครบทุกข้อดังนี้",
      "มีการเตรียมตัวให้พร้อมสำหรับการฝึกปฏิบัติงานวิชาชีพ",
      "มีการขอคำแนะนำปรึกษากับเภสัชกรพี่เลี้ยงเมื่อพบปัญหาหรือข้อสงสัยในระหว่างการฝึกปฏิบัติงานวิชาชีพอย่างเหมาะสมกับระดับของนิสิต/นักศึกษา",
    ],
    key: "p1_5",
  },
  {
    no: "๖.",
    title: "ความรับผิดชอบในการฝึกปฏิบัติงานวิชาชีพ",
    description: [
      "นิสิต/นักศึกษามีความรับผิดชอบต่องานที่ได้รับมอบหมาย ได้ครบทุกข้อดังนี้",
      "มาฝึกปฏิบัติงานตรงต่อเวลา ไม่ขาดการฝึกปฏิบัติงานโดยไม่มีเหตุผลหรือไม่ได้แจ้งล่วงหน้า",
      "มีความรับผิดชอบต่องานที่ได้รับมอบหมาย",
    ],
    key: "p1_6",
  },
];

type EvaluationValue = "pass" | "fail";
type EvaluationData = Record<string, string>;

const evaluationKeys = criteriaData.flatMap(({ key }) => [
  `${key}_week3`,
  `${key}_week6`,
]);
const feedbackKeys = [
  "feedback_week3_strength",
  "feedback_week3_improvement",
  "feedback_week6_strength",
  "feedback_week6_improvement",
];
const resultKeys = [...evaluationKeys, ...feedbackKeys];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState<EvaluationData>(() =>
    Object.fromEntries(
      resultKeys.map((key) => [
        key,
        parentForm.getValues(`result.${key}`) || "",
      ]),
    ),
  );

  useEffect(() => {
    setFormValidated(resultKeys.every((key) => Boolean(data[key]?.trim())));
  }, [data, isClick, isSubmit, setFormValidated]);

  const setDataValue = (key: string, value: string) => {
    setData((previous) => ({ ...previous, [key]: value }));
    parentForm.setValue(`result.${key}`, value);
  };

  const renderDescription = (description: string | string[]) => {
    if (typeof description === "string") return <p>{description}</p>;

    const [introduction, ...items] = description;
    return (
      <div className="space-y-1.5">
        <p>{introduction}</p>
        <ul className="list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResult = (key: string, label: string) => {
    const invalid = isSubmit && !data[key];

    return (
      <div className="min-w-24">
        <RadioGroup
          aria-label={label}
          className="grid grid-cols-2 gap-2"
          onValueChange={(value) => setDataValue(key, value as EvaluationValue)}
          value={data[key]}
        >
          {[
            { value: "pass", label: "ผ่าน" },
            { value: "fail", label: "ไม่ผ่าน" },
          ].map((option) => (
            <label
              className="flex cursor-pointer flex-col items-center gap-1 text-xs"
              htmlFor={`${key}-${option.value}`}
              key={option.value}
            >
              <RadioGroupItem
                aria-invalid={invalid}
                className={invalid ? "border-2 border-red-600" : ""}
                id={`${key}-${option.value}`}
                value={option.value}
              />
              <span className={invalid ? "text-red-600" : ""}>
                {option.label}
              </span>
            </label>
          ))}
        </RadioGroup>
        {invalid && (
          <p className="mt-2 text-center text-xs text-red-600">
            กรุณาเลือกผลการประเมิน
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
      <header className="space-y-1 text-center sm:col-span-12">
        <h2 className="text-base font-bold sm:text-lg">
          แบบประเมินความประพฤติและทัศนคติของนิสิต/นักศึกษา
        </h2>
        <p className="text-sm font-semibold">สำหรับอาจารย์ประจำแหล่งฝึก</p>
      </header>

      <section className="space-y-3 text-sm leading-7 sm:col-span-12">
        <p>
          ให้อาจารย์ประจำแหล่งฝึกประเมินผลโดยสังเกตจากพฤติกรรม
          ผลการปฏิบัติงานและ/หรือจากการอภิปรายสอบถาม การสื่อสาร ทั้งโดยวาจา
          หรือลายลักษณ์อักษร และให้ประเมิน ๒ ครั้ง คือในสัปดาห์ที่ ๓ และ ๖
          ของการฝึกปฏิบัติงาน ผลการประเมินในสัปดาห์ที่ ๓
          ควรมีการแจ้งให้นิสิต/นักศึกษาทราบ เพื่อให้เกิดการพัฒนา{" "}
          <u className="font-semibold">
            การประเมินผลการฝึกปฏิบัติงานจะคิดจากผลการประเมินในสัปดาห์ที่ ๖
          </u>
        </p>
      </section>

      <section className="space-y-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-7 sm:col-span-12">
        <h3 className="font-bold">คำชี้แจง</h3>
        <p>
          ให้ท่านทำเครื่องหมายกากบาท (✕)
          ในช่องผลการประเมินที่ตรงกับทักษะและความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
          (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ)
        </p>
        <p>
          ทั้งนี้เมื่อสิ้นสุดการฝึกงาน{" "}
          <u className="font-semibold">
            นิสิต/นักศึกษาจะต้องผ่านทั้ง ๕
            หัวข้อการประเมินพฤติกรรมและความเป็นวิชาชีพ
          </u>{" "}
          ถึงจะผ่านการฝึกปฏิบัติงานวิชาชีพในผลัดนั้น ๆ
          และการประเมินในส่วนนี้จะไม่ถูกนำมาคิดเป็นคะแนนในการประเมินผลการเรียนของนิสิต/นักศึกษา
          (เกรด A-F)
        </p>
        <p>
          หากนิสิต/นักศึกษาได้รับการประเมิน{" "}
          <u className="font-semibold">“ไม่ผ่าน”</u>{" "}
          ในหัวข้อการประเมินพฤติกรรมและความเป็นวิชาชีพ{" "}
          <u className="font-semibold">ข้อใดข้อหนึ่ง</u>{" "}
          ในการประเมินเมื่อสิ้นสุดการฝึกปฏิบัติงานวิชาชีพ
          <u className="font-semibold"> จะถือว่านิสิต/นักศึกษา “ไม่ผ่าน” </u>
          การฝึกปฏิบัติงานวิชาชีพในผลัดนั้น ๆ
        </p>
      </section>

      <section className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm leading-7 sm:col-span-12">
        <h3 className="mb-1 font-bold">หมายเหตุ</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            ในสัปดาห์ที่ ๓ การประเมิน “ไม่ผ่าน” ในหัวข้อใด
            ให้เภสัชกรประจำแหล่งฝึกแจ้งนิสิต/นักศึกษาให้ปรับปรุงตัว
            และทำการประเมินอีกครั้งในสัปดาห์ที่ ๖
          </li>
          <li>
            การประเมิน “ไม่ผ่าน” ในหัวข้อใดหัวข้อหนึ่ง
            เมื่อสิ้นสุดการฝึกปฏิบัติงานวิชาชีพ (สัปดาห์ที่ ๖)
            นิสิต/นักศึกษาจะได้รับการประเมิน “ไม่ผ่าน”
            ในการฝึกปฏิบัติงานวิชาชีพในผลัดนั้น ๆ
          </li>
        </ul>
      </section>

      <section className="sm:col-span-12">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[920px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-52 border p-3 text-left text-sm" rowSpan={2}>
                  หัวข้อการประเมิน
                </th>
                <th className="border p-3 text-left text-sm" rowSpan={2}>
                  คำอธิบาย
                </th>
                <th className="border p-2 text-center text-sm" colSpan={2}>
                  ผลการประเมิน
                </th>
              </tr>
              <tr className="bg-slate-100">
                <th className="w-32 border p-2 text-center text-sm">
                  สัปดาห์ที่ ๓
                </th>
                <th className="w-32 border p-2 text-center text-sm">
                  สัปดาห์ที่ ๖
                </th>
              </tr>
            </thead>
            <tbody>
              {criteriaData.map((item) => {
                const week3Key = `${item.key}_week3`;
                const week6Key = `${item.key}_week6`;

                return (
                  <tr key={item.key}>
                    <td className="border p-3 text-sm font-medium align-top">
                      {item.no} {item.title}
                    </td>
                    <td className="border p-3 text-sm leading-6 align-top">
                      {renderDescription(item.description)}
                    </td>
                    <td className="border p-3 align-middle">
                      {renderResult(week3Key, `${item.title} สัปดาห์ที่ ๓`)}
                    </td>
                    <td className="border p-3 align-middle">
                      {renderResult(week6Key, `${item.title} สัปดาห์ที่ ๖`)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sm:col-span-12">
        <h3 className="mb-3 text-sm font-bold">
          การสะท้อน (feedback) ให้แก่นิสิต/นักศึกษา
        </h3>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-24 border p-2 text-center text-sm">
                  สัปดาห์ที่
                </th>
                <th className="border p-2 text-center text-sm">จุดแข็ง</th>
                <th className="border p-2 text-center text-sm">
                  จุดที่ควรปรับปรุง
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { week: "๓", key: "feedback_week3" },
                { week: "๖", key: "feedback_week6" },
              ].map((row) => (
                <tr key={row.key}>
                  <th className="border p-3 text-center text-sm align-top">
                    {row.week}
                  </th>
                  {[
                    { suffix: "strength", label: "จุดแข็ง" },
                    { suffix: "improvement", label: "จุดที่ควรปรับปรุง" },
                  ].map((field) => {
                    const key = `${row.key}_${field.suffix}`;
                    const invalid = isSubmit && !data[key]?.trim();

                    return (
                      <td className="border p-2 align-top" key={key}>
                        <Textarea
                          aria-invalid={invalid}
                          aria-label={`${field.label} สัปดาห์ที่ ${row.week}`}
                          className={
                            "min-h-36 resize-y border-0 text-sm focus-visible:ring-1" +
                            (invalid ? " border-2 border-red-600" : "")
                          }
                          onChange={(event) =>
                            setDataValue(key, event.target.value)
                          }
                          value={data[key]}
                        />
                        {invalid && (
                          <p className="mt-1 text-xs text-red-600">
                            กรุณากรอก{field.label}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
