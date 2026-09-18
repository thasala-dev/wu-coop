import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Fragment, useEffect, useMemo, useState } from "react";

const criteriaData = [
  {
    key: "topicSelectionScore",
    title: "๑. การคัดเลือกเรื่องที่นำเสนอโดยนิสิต/นักศึกษา",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดี (๘-๙ คะแนน) ร่วมกับ",
      "เรื่องที่คัดเลือกมานำเสนอเป็นข้อมูลวิชาการที่สามารถนำไปประยุกต์ใช้ในการแก้ปัญหาจากงานที่ทำได้จริง",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่าน (๖-๗ คะแนน) ร่วมกับ",
      "มีแนวทางในการคัดเลือกและได้มาซึ่งเรื่องที่นำเสนออย่างมีเหตุผลและเป็นระบบ (systematic searching)",
    ],
    pass: [
      "เรื่องที่นำเสนอคัดเลือกมาจากแหล่งที่น่าเชื่อถือ",
      "เรื่องที่นำเสนอมีความทันสมัย หรือตรงกับความต้องการของแหล่งฝึก หรือสอดคล้องกับบริบทการดูแลผู้ป่วย",
    ],
    improve: [
      "เรื่องที่นำเสนอมาจากแหล่งที่ไม่น่าเชื่อถือ",
      "เรื่องที่นำเสนอไม่มีความทันสมัย หรือไม่ตรงกับความต้องการของแหล่งฝึก หรือไม่สอดคล้องกับบริบทการดูแลผู้ป่วย",
    ],
  },
  {
    key: "contentScore",
    title: "๒. เนื้อหาการนำเสนอ",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดี (๘-๙ คะแนน) ร่วมกับ",
      "เนื้อหาเป็นประโยชน์และสามารถประยุกต์ใช้ตามความต้องการของผู้ฟัง",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่าน (๖-๗ คะแนน) ร่วมกับ",
      "เนื้อหาครบถ้วน ถูกต้อง และครอบคลุมประเด็นสำคัญ",
    ],
    pass: [
      "กำหนดหัวข้อและวัตถุประสงค์ได้เหมาะสมกับผู้ฟัง แต่เนื้อหาไม่ครบถ้วนหรือไม่ครอบคลุมประเด็นสำคัญ",
    ],
    improve: [
      "หัวข้อและวัตถุประสงค์ไม่สอดคล้องกัน และมีเนื้อหาไม่ครบถ้วนหรือไม่ครอบคลุมประเด็นสำคัญ",
    ],
  },
  {
    key: "evidenceScore",
    title: "๓. การใช้หลักฐานทางวิชาการ",
    weight: 1,
    excellent: [
      "ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง ทันสมัย และครบถ้วน",
      "เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับเรื่องที่นำเสนอ",
    ],
    good: [
      "ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง ทันสมัย แต่ไม่ครบถ้วน",
      "เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับเรื่องที่นำเสนอ",
    ],
    pass: [
      "ใช้ข้อมูลที่น่าเชื่อถือ สอดคล้อง แต่ไม่ทันสมัยและไม่ครบถ้วน",
      "เลือกระดับของหลักฐานทางวิชาการได้เหมาะสมกับเรื่องที่นำเสนอ",
    ],
    improve: [
      "ใช้ข้อมูลที่ไม่น่าเชื่อถือ ไม่สอดคล้อง ไม่ทันสมัย และไม่ครบถ้วน",
      "เลือกระดับของหลักฐานทางวิชาการได้ไม่เหมาะสมกับเรื่องที่นำเสนอ",
    ],
  },
  {
    key: "presentationScore",
    title: "๔. วิธีการนำเสนอ",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดี (๘-๙ คะแนน) ร่วมกับ",
      "นำเข้าสู่เนื้อหาได้น่าสนใจ",
      "ใช้เทคนิคการนำเสนอที่สามารถสร้างการมีส่วนร่วมของผู้ฟัง",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่าน (๖-๗ คะแนน) ร่วมกับ",
      "สื่อสารด้วยบุคลิกท่าทางที่เหมาะสม เช่น เสียงชัดเจน ความเร็วเหมาะสม ศัพท์เข้าใจง่าย ออกเสียงถูกต้อง และประสานสายตาเหมาะสม",
    ],
    pass: [
      "ปริมาณเนื้อหาเหมาะสมกับเวลาที่กำหนด",
      "ลำดับการนำเสนอเหมาะสมและง่ายต่อการติดตาม",
      "เนื้อหา เอกสาร และสื่อประกอบการนำเสนอสะกดถูกต้อง ชัดเจน น่าสนใจ",
    ],
    improve: [
      "ปริมาณเนื้อหาไม่เหมาะสมกับเวลาที่กำหนด",
      "ลำดับการนำเสนอไม่เหมาะสม",
      "เนื้อหา เอกสาร หรือสื่อประกอบมีการสะกดผิดมาก ไม่ชัดเจน หรือขนาดอักษรเล็กมาก",
      "ไม่สามารถสื่อสารให้ผู้ฟังเข้าใจได้ หรือทำให้ผู้ฟังเกิดความสับสน",
    ],
  },
  {
    key: "questionResponseScore",
    title: "๕. การตอบคำถาม (เน้นคุณภาพในการตอบมากกว่าปริมาณ)",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดี (๘-๙ คะแนน) ร่วมกับ",
      "ในกรณีที่ไม่มีข้อมูลเชิงประจักษ์สนับสนุนคำตอบได้ชัดเจน นิสิต/นักศึกษาสามารถสังเคราะห์คำตอบได้ด้วยตนเองโดยอ้างอิงจากองค์ความรู้พื้นฐาน",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่าน (๖-๗ คะแนน) ร่วมกับ",
      "สามารถสื่อสารให้ผู้ฟังเข้าใจได้อย่างตรงประเด็น",
    ],
    pass: [
      "ตอบคำถามส่วนใหญ่ได้ถูกต้อง โดยมีหลักฐานทางวิชาการอ้างอิงได้อย่างเหมาะสมกับระดับความรู้ของนิสิต/นักศึกษา",
    ],
    improve: [
      "ไม่สามารถตอบคำถามได้อย่างถูกต้อง หรือตอบคำถามโดยไม่มีหลักฐานทางวิชาการ หรือไม่สัมพันธ์กับองค์ความรู้พื้นฐาน",
    ],
  },
];

const scoreKeys = criteriaData.map(({ key }) => key);
const requiredKeys = [...scoreKeys, "strength", "improvement"];
type FormData = Record<string, string>;

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;
  const [data, setData] = useState<FormData>(() =>
    Object.fromEntries(
      [...requiredKeys, "weightedScore", "finalScore"].map((key) => [
        key,
        parentForm.getValues(`result.${key}`) || "",
      ]),
    ),
  );

  const scoreResult = useMemo(() => {
    const selected = criteriaData.map((criterion) => ({
      value: data[criterion.key],
      weight: criterion.weight,
    }));
    const complete = selected.every(({ value }) => Boolean(value));
    const hasNA = selected.some(({ value }) => value === "N/A");
    const weightedScore = selected.reduce(
      (total, item) =>
        item.value && item.value !== "N/A"
          ? total + Number(item.value) * item.weight
          : total,
      0,
    );
    return {
      complete,
      hasNA,
      weightedScore,
      finalScore: complete && !hasNA ? (weightedScore / 50) * 10 : null,
    };
  }, [data]);

  useEffect(() => {
    setFormValidated(requiredKeys.every((key) => Boolean(data[key]?.trim())));
  }, [data, isClick, isSubmit, setFormValidated]);

  useEffect(() => {
    const weightedScore = scoreResult.complete
      ? scoreResult.hasNA
        ? "N/A"
        : String(scoreResult.weightedScore)
      : "";
    const finalScore =
      scoreResult.finalScore === null
        ? scoreResult.complete && scoreResult.hasNA
          ? "N/A"
          : ""
        : scoreResult.finalScore.toFixed(2);
    parentForm.setValue("result.weightedScore", weightedScore);
    parentForm.setValue("result.finalScore", finalScore);
  }, [parentForm, scoreResult]);

  const setDataValue = (key: string, value: string) => {
    setData((previous) => ({ ...previous, [key]: value }));
    parentForm.setValue(`result.${key}`, value);
  };
  const isInvalid = (key: string) => isSubmit && !data[key]?.trim();
  const renderCriteriaList = (items: string[]) => (
    <ul className="list-disc space-y-1 pl-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );

  const renderScoreChoices = (criterionKey: string) => {
    const scoreGroups = [
      ["10"],
      ["9", "8"],
      ["7", "6"],
      ["5", "4", "3", "2", "1", "0"],
      ["N/A"],
    ];
    return scoreGroups.map((scores, groupIndex) => (
      <td
        className="border p-2 align-top"
        key={`${criterionKey}-${groupIndex}`}
      >
        <RadioGroup
          aria-label={`คะแนน ${criterionKey}`}
          className="flex min-h-12 flex-wrap items-center justify-center gap-3"
          onValueChange={(value) => setDataValue(criterionKey, value)}
          value={data[criterionKey]}
        >
          {scores.map((score) => (
            <label
              className="flex cursor-pointer flex-col items-center gap-1 text-xs"
              htmlFor={`${criterionKey}-${score}`}
              key={score}
            >
              <RadioGroupItem
                aria-invalid={isInvalid(criterionKey)}
                className={
                  isInvalid(criterionKey) ? "border-2 border-red-600" : ""
                }
                id={`${criterionKey}-${score}`}
                value={score}
              />
              <span className={isInvalid(criterionKey) ? "text-red-600" : ""}>
                {score}
              </span>
            </label>
          ))}
        </RadioGroup>
      </td>
    ));
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
      <section className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-7 sm:col-span-12">
        <h2 className="font-bold">คำชี้แจง</h2>
        <p>
          ให้ท่านพิจารณาความสามารถของนิสิต/นักศึกษาตามเกณฑ์ที่กำหนดที่ตรงกับทักษะและความสามารถของนิสิต/นักศึกษาที่ท่านดูแลมากที่สุด
          (ประเมินทั้งในและนอกเวลาการฝึกปฏิบัติงานฯ) โดยเกณฑ์ในขั้นที่สูงกว่า
          (ซ้ายมือ) นิสิต/นักศึกษาจะต้องแสดงถึงเกณฑ์ในขั้นที่ต่ำกว่า (ทางขวามือ)
          ด้วยก่อน และเมื่อนิสิต/นักศึกษามีความสามารถตรงตามเกณฑ์ในระดับใด
          จึงให้ท่านระบุคะแนนตามช่วงเกณฑ์ที่พิจารณา
        </p>
        <p>
          ตัวอย่างเช่น หากประเมินหัวข้อ “เนื้อหาการนำเสนอ” อยู่ในเกณฑ์ “ดี” (๘-๙
          คะแนน) สามารถเลือกให้คะแนน ๘ หรือ ๙ ได้
          ทั้งนี้ขึ้นกับความเห็นของผู้ประเมิน
        </p>
      </section>

      <section className="sm:col-span-12">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[1180px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-44 border p-2 text-center text-sm">
                  หัวข้อการประเมิน
                </th>
                <th className="w-60 border p-2 text-center text-sm">
                  ดีมาก
                  <br />
                  <span className="text-xs">(๑๐ คะแนน)</span>
                </th>
                <th className="w-60 border p-2 text-center text-sm">
                  ดี
                  <br />
                  <span className="text-xs">(๘-๙ คะแนน)</span>
                </th>
                <th className="w-60 border p-2 text-center text-sm">
                  ผ่าน
                  <br />
                  <span className="text-xs">(๖-๗ คะแนน)</span>
                </th>
                <th className="w-60 border p-2 text-center text-sm">
                  ควรปรับปรุง
                  <br />
                  <span className="text-xs">(๐-๕ คะแนน)</span>
                </th>
                <th className="w-20 border p-2 text-center text-sm">น้ำหนัก</th>
              </tr>
            </thead>
            <tbody>
              {criteriaData.map((criterion) => {
                const selected = data[criterion.key];
                const weighted =
                  selected && selected !== "N/A"
                    ? Number(selected) * criterion.weight
                    : selected;
                return (
                  <Fragment key={criterion.key}>
                    <tr>
                      <th className="border p-3 text-left text-sm align-top">
                        {criterion.title}
                      </th>
                      <td className="border p-3 text-sm leading-6 align-top">
                        {renderCriteriaList(criterion.excellent)}
                      </td>
                      <td className="border p-3 text-sm leading-6 align-top">
                        {renderCriteriaList(criterion.good)}
                      </td>
                      <td className="border p-3 text-sm leading-6 align-top">
                        {renderCriteriaList(criterion.pass)}
                      </td>
                      <td className="border p-3 text-sm leading-6 align-top">
                        {renderCriteriaList(criterion.improve)}
                      </td>
                      <td className="border p-3 text-center text-sm align-top">
                        {criterion.weight}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-3 text-sm font-medium">
                        คะแนนที่ได้ × {criterion.weight} ={" "}
                        {weighted || weighted === 0 ? weighted : "___"}
                        {isInvalid(criterion.key) && (
                          <p className="mt-1 text-xs text-red-600">
                            กรุณาเลือกคะแนน
                          </p>
                        )}
                      </td>
                      {renderScoreChoices(criterion.key)}
                    </tr>
                  </Fragment>
                );
              })}
              <tr>
                <td
                  className="border p-3 text-center text-sm font-semibold"
                  colSpan={6}
                >
                  คะแนนที่ประเมินได้{" "}
                  {scoreResult.complete
                    ? scoreResult.hasNA
                      ? "N/A"
                      : scoreResult.weightedScore
                    : "_____"}{" "}
                  คะแนน
                  <br />
                  ปรับให้เป็นคะแนนเต็ม ๑๐ คะแนน = (
                  {scoreResult.complete && !scoreResult.hasNA
                    ? scoreResult.weightedScore
                    : "_____"}{" "}
                  ÷ ๕๐) × ๑๐ ={" "}
                  <span className="font-bold">
                    {scoreResult.finalScore === null
                      ? scoreResult.complete && scoreResult.hasNA
                        ? "N/A"
                        : "_____"
                      : scoreResult.finalScore.toFixed(2)}
                  </span>{" "}
                  คะแนน
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="sm:col-span-12">
        <h3 className="mb-3 text-sm font-bold">
          การสะท้อนให้แก่นิสิต/นักศึกษา
        </h3>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-1/2 border p-2 text-center text-sm">
                  จุดแข็ง
                </th>
                <th className="w-1/2 border p-2 text-center text-sm">
                  จุดที่ควรปรับปรุง
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {[
                  { key: "strength", label: "จุดแข็ง" },
                  { key: "improvement", label: "จุดที่ควรปรับปรุง" },
                ].map((field) => (
                  <td className="border p-2 align-top" key={field.key}>
                    <Textarea
                      aria-invalid={isInvalid(field.key)}
                      aria-label={field.label}
                      className={`min-h-56 resize-y border-0 text-sm focus-visible:ring-1 ${isInvalid(field.key) ? "border-2 border-red-600" : ""}`}
                      onChange={(event) =>
                        setDataValue(field.key, event.target.value)
                      }
                      value={data[field.key]}
                    />
                    {isInvalid(field.key) && (
                      <p className="mt-1 text-xs text-red-600">
                        กรุณากรอก{field.label}
                      </p>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
