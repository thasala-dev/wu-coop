import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Fragment, useEffect, useMemo, useState } from "react";

const locationOptions = ["ผู้ป่วยใน", "ผู้ป่วยนอก", "ร้านยา", "อื่น ๆ"];
const communicatorOptions = ["แพทย์", "พยาบาล", "เภสัชกร", "อื่น ๆ"];
const difficultyOptions = ["ง่าย", "ปานกลาง", "ยาก"];

const sbarData = [
  {
    key: "S",
    title: "Situation",
    description:
      "ผู้รายงานระบุสถานการณ์อย่างสั้น ๆ ได้แก่ การระบุตัวผู้รายงาน โดยเริ่มต้นแจ้งชื่อ ตำแหน่งของตนเอง แจ้งชื่อผู้ป่วยและจุดที่ผู้ป่วยกำลังรับการรักษา หรือหมายเลขห้อง รายงานสภาพปัญหาของผู้ป่วยที่พบแบบรวบรัดกระชับ เวลาที่เกิด และความรุนแรง",
  },
  {
    key: "B",
    title: "Background",
    description:
      "ข้อมูลภูมิหลังเกี่ยวกับสถานการณ์ ได้แก่ การให้ข้อมูลทางคลินิกหรือตอบคำถามที่เกี่ยวข้องกับสถานการณ์ เช่น วันที่เข้ารับการรักษา การวินิจฉัยโรคตอนแรกรับการรักษา รายการยาที่ผู้ป่วยใช้ สารน้ำที่กำลังให้อยู่ ประวัติแพ้ยา ประวัติการใช้ยาเดิม รายงานสัญญาณชีพล่าสุด ผลตรวจทางห้องปฏิบัติการและวันเวลาที่ทำการทดสอบ ผลการทดสอบครั้งที่แล้วเพื่อเปรียบเทียบ (ถ้ามี) และข้อมูลทางคลินิกอื่น ๆ (ถ้ามี)",
  },
  {
    key: "A",
    title: "Assessment",
    description:
      "การประเมินผู้ป่วย ได้แก่ การสรุปสิ่งที่สังเกตเกี่ยวกับสถานการณ์ในมุมมองของตนเอง รายงานสิ่งที่ตนเองสังเกตเห็น ภาวะรุนแรงของปัญหา ผลการวิเคราะห์และพิจารณาทางเลือกต่าง ๆ ของตนเอง รวมถึงพิจารณาว่าปัญหานี้รุนแรงหรืออันตรายถึงชีวิตหรือไม่",
  },
  {
    key: "R",
    title: "Recommendation",
    description:
      "ข้อเสนอแนะ ได้แก่ การให้ความเห็นหรือข้อเสนอแนะในการแก้ไขปัญหาของผู้ป่วย สิ่งที่คิดว่าจำเป็นสำหรับผู้ป่วย ทางออกที่สามารถเสนอแก่แพทย์ และสิ่งที่ต้องการจากแพทย์ในการช่วยให้อาการของผู้ป่วยดีขึ้น",
  },
];

const criteriaData = [
  {
    key: "communicationScore",
    title: "๑. ทักษะการสื่อสาร",
    weight: 1,
    excellent: [
      "สื่อสารกับบุคลากรสาธารณสุขได้อย่างเหมาะสมและสอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วยเทคนิค SBAR",
      "สื่อสารด้วย soft skills ได้อย่างเหมาะสม เช่น การใช้น้ำเสียงและสายตา",
      "สื่อสารซักประวัติได้อย่างครบถ้วน เป็นลำดับขั้นตอน ไม่วกวน",
      "บริหารจัดการเวลาการสื่อสารได้อย่างเหมาะสม",
    ],
    good: [
      "สื่อสารกับบุคลากรสาธารณสุขได้อย่างเหมาะสมและสอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วยเทคนิค SBAR",
      "สื่อสารอย่างเป็นลำดับขั้นตอน ไม่วกวน",
    ],
    pass: [
      "สื่อสารกับบุคลากรสาธารณสุขได้อย่างเหมาะสม และสอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วยเทคนิค SBAR",
    ],
    improve: [
      "สื่อสารกับบุคลากรสาธารณสุขได้อย่างไม่เหมาะสม หรือไม่สอดคล้องตามเกณฑ์การสื่อสารกับสหวิชาชีพด้วยเทคนิค SBAR",
    ],
  },
  {
    key: "professionalScore",
    title: "๒. ความเป็นวิชาชีพ",
    weight: 2,
    excellent: [
      "มีบุคลิกดูน่าเชื่อถือและแสดงออกให้เห็นถึงความเป็นเภสัชกรมืออาชีพอย่างชัดเจน",
      "ใช้กิริยาท่าทางและวาจาที่ให้เกียรติแก่บุคลากรสาธารณสุขตลอดเวลา",
      "ไม่ก้าวก่ายหน้าที่ในการปฏิบัติงานของบุคลากรสาธารณสุขอื่น",
    ],
    good: [
      "มีบุคลิกดูน่าเชื่อถือและแสดงออกให้เห็นถึงความเป็นเภสัชกรมืออาชีพอย่างชัดเจน",
      "ใช้กิริยาท่าทางและวาจาที่ให้เกียรติแก่บุคลากรสาธารณสุขตลอดเวลา",
    ],
    pass: [
      "มีบุคลิกดูน่าเชื่อถือ",
      "ใช้กิริยาท่าทางและวาจาที่ให้เกียรติแก่บุคลากรสาธารณสุข",
    ],
    improve: [
      "มีบุคลิกดูไม่น่าเชื่อถือ",
      "ใช้กิริยาท่าทางหรือวาจาที่ไม่ให้เกียรติแก่บุคลากรสาธารณสุข",
    ],
  },
  {
    key: "decisionScore",
    title: "๓. การตัดสินใจ",
    weight: 2,
    excellent: [
      "ตัดสินใจอย่างมีเหตุผล โดยนำข้อมูลที่เกี่ยวข้องพร้อมทั้งยกหลักฐานทางวิชาการมาใช้ประกอบการตัดสินใจ โดยคำนึงถึงเป้าหมายของการรักษาเป็นสำคัญ",
    ],
    good: [
      "ตัดสินใจอย่างมีเหตุผล โดยนำข้อมูลที่เกี่ยวข้องพร้อมทั้งยกหลักฐานทางวิชาการมาใช้ประกอบการตัดสินใจ",
    ],
    pass: [
      "ตัดสินใจอย่างมีเหตุผล โดยนำข้อมูลที่เกี่ยวข้องมาใช้ประกอบการตัดสินใจ",
    ],
    improve: [
      "ตัดสินใจโดยไม่มีเหตุผล หรือไม่นำข้อมูลที่เกี่ยวข้องมาใช้ประกอบการตัดสินใจ",
    ],
  },
];

const requiredKeys = [
  "communicationObjective",
  "location",
  "communicator",
  "difficulty",
  "communicationScore",
  "professionalScore",
  "decisionScore",
  "strength",
  "improvement",
];

type FormData = Record<string, string>;

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const allKeys = [
    ...requiredKeys,
    "locationOther",
    "communicatorOther",
    "weightedScore",
    "finalScore",
  ];

  const [data, setData] = useState<FormData>(() =>
    Object.fromEntries(
      allKeys.map((key) => [key, parentForm.getValues(`result.${key}`) || ""]),
    ),
  );

  const scoreResult = useMemo(() => {
    const selectedScores = criteriaData.map((criterion) => ({
      value: data[criterion.key],
      weight: criterion.weight,
    }));
    const complete = selectedScores.every(({ value }) => Boolean(value));
    const hasNA = selectedScores.some(({ value }) => value === "N/A");
    const weightedScore = selectedScores.reduce(
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
    const hasRequiredValues = requiredKeys.every((key) => data[key]?.trim());
    const hasLocationOther =
      data.location !== "อื่น ๆ" || Boolean(data.locationOther?.trim());
    const hasCommunicatorOther =
      data.communicator !== "อื่น ๆ" || Boolean(data.communicatorOther?.trim());
    setFormValidated(
      Boolean(hasRequiredValues && hasLocationOther && hasCommunicatorOther),
    );
  }, [data, isClick, isSubmit, setFormValidated]);

  useEffect(() => {
    const weightedScore = scoreResult.complete
      ? scoreResult.hasNA
        ? "N/A"
        : String(scoreResult.weightedScore)
      : "";
    const finalScore =
      scoreResult.finalScore === null
        ? scoreResult.hasNA && scoreResult.complete
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

  const renderRequiredMessage = (key: string, label: string) =>
    isInvalid(key) ? (
      <p className="mt-1 text-xs text-red-600">กรุณา{label}</p>
    ) : null;

  const renderOptionGroup = (
    field: string,
    label: string,
    options: string[],
  ) => (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <RadioGroup
        aria-label={label}
        className="flex flex-wrap gap-x-5 gap-y-2"
        onValueChange={(value) => setDataValue(field, value)}
        value={data[field]}
      >
        {options.map((option) => (
          <label
            className="flex cursor-pointer items-center gap-2 text-sm"
            htmlFor={`${field}-${option}`}
            key={option}
          >
            <RadioGroupItem
              aria-invalid={isInvalid(field)}
              className={isInvalid(field) ? "border-2 border-red-600" : ""}
              id={`${field}-${option}`}
              value={option}
            />
            <span className={isInvalid(field) ? "text-red-600" : ""}>
              {option}
            </span>
          </label>
        ))}
      </RadioGroup>
      {renderRequiredMessage(field, `เลือก${label}`)}
    </div>
  );

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
      <header className="space-y-1 text-center sm:col-span-12">
        <h2 className="text-base font-bold sm:text-lg">
          แบบประเมินทักษะการสื่อสารในงานบริบาลทางเภสัชกรรมกับบุคลากรทางการแพทย์
        </h2>
        <p className="text-sm font-semibold">สำหรับอาจารย์ประจำแหล่งฝึก</p>
      </header>

      <section className="space-y-3 text-sm leading-7 sm:col-span-12">
        <h3 className="font-bold underline">คำอธิบาย</h3>
        <p>
          Mini-CEx (Mini clinical evaluation) เป็นการประเมินแบบ workplace-based
          assessment ที่มุ่งประเมินทักษะทางคลินิก (clinical skill)
          ของนิสิต/นักศึกษาในสถานการณ์จริง (บุคลากรสาธารณสุขจริง)
          โดยมีอาจารย์แหล่งฝึกเป็นผู้ประเมินนิสิต/นักศึกษาใน ๒ ประเด็น คือ
          ทักษะการสื่อสารกับบุคลากรสาธารณสุข (psychomotor domain)
          และความเป็นวิชาชีพ (professional domain)
          โดยมุ่งเน้นทักษะในการเผชิญหน้า (encounter) กับบุคลากรสาธารณสุข
          กระบวนการตัดสินใจ และการปฏิบัติตามเกณฑ์การสื่อสาร
          เพื่อให้ได้ผลการสื่อสารที่ดี โดยอาจประเมินหลายครั้งและประเมินเป็น
          formative
        </p>
        <h3 className="font-bold underline">
          การเตรียมตัวประเมิน มีขั้นตอนดังนี้
        </h3>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            อาจารย์แหล่งฝึกเตรียมคุยกับบุคลากรสาธารณสุขไว้ล่วงหน้า
            โดยขออนุญาตว่าจะมีนิสิต/นักศึกษามาฝึกปฏิบัติ
          </li>
          <li>
            อาจารย์แหล่งฝึกแนะนำขั้นตอนและเกณฑ์การประเมิน
            และให้นิสิต/นักศึกษาเลือกประเด็นที่จะสื่อสาร
          </li>
          <li>
            อาจารย์แหล่งฝึกเฝ้าดูและให้การช่วยเหลือเฉพาะเมื่อจำเป็น
            ไม่ควรช่วยในการสื่อสาร ซึ่งใช้เวลาไม่เกิน ๑๕ นาที
          </li>
          <li>
            หลังเสร็จสิ้น ให้นิสิต/นักศึกษาสะท้อนกลับ (reflection)
            และอาจารย์แหล่งฝึกให้การป้อนกลับ (feedback) ใช้เวลาไม่เกิน ๕ นาที
          </li>
        </ol>
        <div className="space-y-2 pl-4">
          <p>
            <strong>๔.๑ Reflection:</strong>{" "}
            ถามว่าเมื่อสักครู่นี้ได้ทำอะไรบ้างและรู้สึกอย่างไร
            ได้เรียนรู้อะไรบ้าง และจะนำไปใช้ประโยชน์ในอนาคตอย่างไร
            โดยเน้นให้นิสิต/นักศึกษาพรรณนาและปรับแก้หากมีความเข้าใจผิด
          </p>
          <p>
            <strong>๔.๒ Feedback:</strong> แจ้งข้อดีและข้อควรปรับปรุงสลับกัน
            (feedback sandwich) ข้อควรปรับปรุงต้องเป็นความจริง
            ไม่เพิ่มเติมความเห็น และบอกวิธีแก้ไขที่ชัดเจน
          </p>
        </div>
      </section>

      <section className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-7 sm:col-span-12">
        <h3 className="font-bold">คำชี้แจง</h3>
        <p>
          ให้ท่านพิจารณาความสามารถของนิสิต/นักศึกษาตามเกณฑ์ที่ระบุ
          จากนั้นเลือกคะแนนในช่วงเกณฑ์ที่ตรงกับความสามารถมากที่สุด
          กรณีไม่สามารถประเมินหัวข้อนั้นได้ให้เลือก N/A
          ทั้งนี้ควรประเมินอย่างน้อย ๒ ครั้ง และควรให้ feedback ทุกครั้ง
          โดยจะคิดคะแนนจากครั้งที่ทำได้สูงสุด
        </p>
      </section>

      <section className="sm:col-span-12">
        <div className="overflow-hidden rounded-md border">
          <h3 className="border-b bg-slate-100 p-3 text-sm font-bold">
            เกณฑ์การสื่อสารกับสหวิชาชีพด้วยเทคนิค SBAR
          </h3>
          <div className="divide-y">
            {sbarData.map((item) => (
              <div className="p-3 text-sm leading-6" key={item.key}>
                <strong>
                  {item.key} - {item.title}:
                </strong>{" "}
                {item.description}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 sm:col-span-12">
        <h3 className="text-center text-base font-bold">แบบฟอร์มการประเมิน</h3>
        <div>
          <label
            className="mb-1 block text-sm font-semibold"
            htmlFor="communicationObjective"
          >
            วัตถุประสงค์การสื่อสาร
          </label>
          <Input
            aria-invalid={isInvalid("communicationObjective")}
            className={
              isInvalid("communicationObjective")
                ? "border-2 border-red-600"
                : ""
            }
            id="communicationObjective"
            onChange={(event) =>
              setDataValue("communicationObjective", event.target.value)
            }
            value={data.communicationObjective}
          />
          {renderRequiredMessage(
            "communicationObjective",
            "กรอกวัตถุประสงค์การสื่อสาร",
          )}
        </div>

        <div className="grid gap-4 rounded-md border p-4 lg:grid-cols-3">
          <div>
            {renderOptionGroup("location", "สถานที่ประเมิน", locationOptions)}
            {data.location === "อื่น ๆ" && (
              <Input
                aria-invalid={isSubmit && !data.locationOther?.trim()}
                className={`mt-2 ${isSubmit && !data.locationOther?.trim() ? "border-2 border-red-600" : ""}`}
                onChange={(event) =>
                  setDataValue("locationOther", event.target.value)
                }
                placeholder="โปรดระบุสถานที่"
                value={data.locationOther}
              />
            )}
          </div>
          <div>
            {renderOptionGroup(
              "communicator",
              "บุคลากรที่สื่อสารด้วย",
              communicatorOptions,
            )}
            {data.communicator === "อื่น ๆ" && (
              <Input
                aria-invalid={isSubmit && !data.communicatorOther?.trim()}
                className={`mt-2 ${isSubmit && !data.communicatorOther?.trim() ? "border-2 border-red-600" : ""}`}
                onChange={(event) =>
                  setDataValue("communicatorOther", event.target.value)
                }
                placeholder="โปรดระบุบุคลากร"
                value={data.communicatorOther}
              />
            )}
          </div>
          <div>
            {renderOptionGroup("difficulty", "ความยาก/ง่าย", difficultyOptions)}
          </div>
        </div>
      </section>

      <section className="sm:col-span-12">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[1180px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-40 border p-2 text-center text-sm">
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
                    <tr key={`${criterion.key}-description`}>
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
                    <tr key={`${criterion.key}-score`}>
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
                    {renderRequiredMessage(field.key, `กรอก${field.label}`)}
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
