import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Fragment, useEffect, useMemo, useState } from "react";

const criteriaData = [
  {
    key: "problemIdentificationScore",
    title: "๑. Problem Identification and Prioritization",
    weight: 2,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "สามารถเรียงลำดับความสำคัญของปัญหาที่ต้องได้รับการแก้ไขได้",
    ],
    good: ["มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ", "ระบุปัญหาได้ครบถ้วน"],
    pass: ["สามารถระบุปัญหาของผู้ป่วยหรือปัญหาจากการใช้ยาได้อย่างตรงประเด็น"],
    improve: [
      "ไม่สามารถระบุปัญหาของผู้ป่วยหรือปัญหาจากการใช้ยาได้ หรือระบุได้แต่ไม่ตรงประเด็น",
    ],
  },
  {
    key: "subjectiveInformationScore",
    title: "๒. Subjective Information",
    weight: 1,
    excellent: [
      "สามารถระบุข้อมูล S ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง ตรงประเด็น และสามารถระบุได้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป",
    ],
    good: [
      "สามารถระบุข้อมูล S ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง ครบถ้วนตามข้อมูลที่มีอยู่ แต่ยังไม่สามารถรู้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป",
    ],
    pass: [
      "สามารถระบุข้อมูล S ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครอบคลุมเป็นส่วนใหญ่",
      "ไม่มีข้อมูลที่ไม่จำเป็นหรือไม่เกี่ยวข้อง",
    ],
    improve: [
      "ไม่สามารถระบุข้อมูล S ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครบถ้วน หรือระบุได้เพียงเล็กน้อย",
      "มีข้อมูลที่ไม่จำเป็นและไม่เกี่ยวข้องกับปัญหาของผู้ป่วย",
    ],
  },
  {
    key: "objectiveInformationScore",
    title: "๓. Objective Information",
    weight: 1,
    excellent: [
      "สามารถระบุข้อมูล O ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง ตรงประเด็น และสามารถระบุได้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป",
    ],
    good: [
      "สามารถระบุข้อมูล O ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างถูกต้อง ครบถ้วนตามข้อมูลที่มีอยู่ แต่ยังไม่สามารถรู้ว่าข้อมูลที่สำคัญใดที่ขาดหายไป",
    ],
    pass: [
      "สามารถระบุข้อมูล O ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครอบคลุมเป็นส่วนใหญ่",
      "ไม่มีข้อมูลที่ไม่จำเป็นหรือไม่เกี่ยวข้อง",
    ],
    improve: [
      "ไม่สามารถระบุข้อมูล O ที่สอดคล้องกับปัญหาของผู้ป่วยได้อย่างครบถ้วน หรือระบุได้เพียงเล็กน้อย",
      "มีข้อมูลที่ไม่จำเป็นและไม่เกี่ยวข้องกับปัญหาของผู้ป่วย",
    ],
  },
  {
    key: "etiologyScore",
    title:
      "๔. Etiology/Cause/Risk factors of problem identified ที่เกี่ยวข้องกับการใช้ยาและการปฏิบัติตัว",
    weight: 2,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "สามารถอธิบายเชื่อมโยงสาเหตุ/ปัจจัยเสี่ยงกับปัญหาของผู้ป่วยได้อย่างเข้าใจ",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ",
      "ระบุสาเหตุ/ปัจจัยเสี่ยงของปัญหาของผู้ป่วยได้ครบถ้วน",
    ],
    pass: ["สามารถระบุสาเหตุ/ปัจจัยเสี่ยงของปัญหาของผู้ป่วยได้อย่างตรงประเด็น"],
    improve: [
      "ไม่สามารถระบุสาเหตุ/ปัจจัยเสี่ยงของปัญหาของผู้ป่วย (เน้นปัญหาหลัก) หรือระบุได้แต่ไม่ตรงประเด็น",
    ],
  },
  {
    key: "treatmentGoalsScore",
    title: "๕. Treatment Goals",
    weight: 2,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "เหมาะสมและสอดคล้องกับผู้ป่วยแต่ละรายและบริบทในสถานการณ์จริง",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ",
      "ระบุเป้าหมายที่เป็นไปตามหลักฐานอ้างอิงทางวิชาการที่เลือกใช้ได้อย่างครบถ้วน",
    ],
    pass: [
      "สามารถระบุเป้าหมายที่เป็นไปตามหลักฐานอ้างอิงทางวิชาการที่เลือกใช้เป็นส่วนใหญ่",
    ],
    improve: [
      "ไม่สามารถระบุเป้าหมายหลักที่เป็นไปตามเป้าหมายของแนวทางการรักษาที่เลือกใช้",
    ],
  },
  {
    key: "assessmentScore",
    title:
      "๖. Assessment of Current Medical Condition(s) หรือ Drug Therapy-related Problem",
    weight: 3,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "เชื่อมโยงปัญหาและข้อมูลที่ระบุได้มาใช้เพื่อประเมินทางเลือกในการแก้ไขหรือจัดการปัญหาได้อย่างเหมาะสม โดยพิจารณาจากข้อมูลรอบด้าน",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ",
      "ประเมินแผนการแก้ไขปัญหาได้อย่างเหมาะสมและมีหลักฐานอ้างอิงทางวิชาการรองรับ",
    ],
    pass: [
      "สามารถประเมินปัญหาจากการใช้ยาได้อย่างเป็นระบบ เช่น การประเมินปัญหาการใช้ยาตาม IESAC",
    ],
    improve: ["ไม่สามารถประเมินปัญหาจากการใช้ยาได้อย่างเป็นระบบ"],
  },
  {
    key: "treatmentPlanScore",
    title: "๗. Treatment Plan",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "เหมาะสมและสอดคล้องกับบริบทในสถานการณ์จริง หรือ",
      "ตรงตามสภาวะและความต้องการของผู้ป่วย",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ",
      "ครบถ้วน ตรงประเด็น ทำได้จริง เช่น ชื่อยา ขนาดยา วิธีให้ยา ความถี่ และระยะเวลาในการให้ยา",
    ],
    pass: [
      "สามารถระบุแผนการรักษาที่สอดคล้องกับที่ประเมินไว้ (assessment) และเป็นไปตามหลักฐานอ้างอิงทางวิชาการ",
    ],
    improve: [
      "ไม่สามารถระบุแผนการรักษาได้ หรือระบุได้แต่ไม่เป็นไปตามหลักฐานอ้างอิงทางวิชาการ",
    ],
  },
  {
    key: "monitoringScore",
    title: "๘. Monitoring & Follow-up",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "เหมาะสมและสอดคล้องกับบริบทในสถานการณ์จริง หรือ",
      "ตรงตามสภาวะและความต้องการของผู้ป่วย",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ",
      "วางแผนการติดตามได้อย่างครบถ้วน ตรงประเด็น ทำได้จริง โดยระบุความถี่และระยะเวลาการติดตามได้อย่างเหมาะสม",
    ],
    pass: [
      "สามารถวางแผนการติดตามการรักษาได้อย่างครอบคลุมทั้งประสิทธิภาพและความปลอดภัย และเป็นไปตามหลักฐานอ้างอิงทางวิชาการ",
      "กำหนดแผนตัวชี้วัดที่ใช้ในการติดตามได้จริง",
    ],
    improve: ["ไม่สามารถวางแผนการติดตามการรักษาได้อย่างครอบคลุมครบถ้วน"],
  },
  {
    key: "patientEducationScore",
    title: "๙. Patient education",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "เหมาะสมและสอดคล้องกับบริบทในสถานการณ์จริง หรือ",
      "ตรงตามสภาวะและความต้องการของผู้ป่วย",
    ],
    good: ["มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ", "ครบถ้วน ตรงประเด็น"],
    pass: [
      "สามารถให้คำปรึกษา การแก้ไข/ป้องกันปัจจัยเสี่ยงได้อย่างครอบคลุม และเป็นไปตามหลักฐานอ้างอิงทางวิชาการ",
    ],
    improve: ["ไม่สามารถให้คำปรึกษา การแก้ไข/ป้องกันปัจจัยเสี่ยงได้"],
  },
  {
    key: "presentationScore",
    title: "๑๐. วิธีการนำเสนอ",
    weight: 1,
    excellent: [
      "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
      "การนำเข้าสู่เนื้อหาได้น่าสนใจ",
      "การใช้เทคนิคการนำเสนอสามารถสร้างการมีส่วนร่วมของผู้ฟัง",
    ],
    good: [
      "มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ",
      "สื่อสารให้ผู้ฟังเข้าใจได้อย่างเหมาะสม เช่น เสียงชัดเจน ความเร็วเหมาะสม ศัพท์เข้าใจง่าย ออกเสียงถูกต้อง และประสานสายตาเหมาะสม",
    ],
    pass: [
      "ปริมาณเนื้อหาเหมาะสมกับเวลาที่กำหนด",
      "ลำดับการนำเสนอเหมาะสมและง่ายต่อการติดตาม",
      "เนื้อหา เอกสาร และสื่อประกอบสะกดถูกต้อง ชัดเจน น่าสนใจ",
    ],
    improve: [
      "ปริมาณเนื้อหาไม่เหมาะสมกับเวลาที่กำหนด",
      "ลำดับการนำเสนอไม่เหมาะสม",
      "เอกสารหรือสื่อประกอบมีการสะกดผิดมาก ไม่ชัดเจน หรืออักษรเล็กมาก",
      "ไม่สามารถสื่อสารให้ผู้ฟังเข้าใจได้ หรือทำให้ผู้ฟังสับสน",
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
      finalScore: complete && !hasNA ? (weightedScore / 150) * 10 : null,
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
          กรณีไม่สามารถประเมินในหัวข้อนั้นได้ให้เลือก N/A
        </p>
        <p>
          ตัวอย่างเช่น หากประเมินความสามารถในหัวข้อ “Subjective Information”
          อยู่ในเกณฑ์ “ดี” (๘-๙ คะแนน) สามารถเลือกให้คะแนน ๘ หรือ ๙ ได้
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
                  ÷ ๑๕๐) × ๑๐ ={" "}
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
