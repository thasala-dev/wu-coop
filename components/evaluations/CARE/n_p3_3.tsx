import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";

const criterion = {
  key: "overallSkillScore",
  title:
    "๑. การประเมินทักษะโดยรวม เช่น การรวบรวมข้อมูลผู้ป่วย การตัดสินใจทางคลินิก discharge counselling เป็นต้น",
  weight: 10,
  excellent: [
    "มีคุณสมบัติตามเกณฑ์ดีร่วมกับ",
    "มีทักษะในการดูแลผู้ป่วย มีบุคลิกน่าเชื่อถือและแสดงออกให้เห็นถึงความเป็นเภสัชกรมืออาชีพอย่างชัดเจน",
  ],
  good: [
    "มีคุณสมบัติตามเกณฑ์ผ่านร่วมกับ",
    "มีทักษะในการดูแลผู้ป่วย หรือแก้ปัญหาผู้ป่วยเฉพาะรายได้ครบถ้วน",
  ],
  pass: [
    "มีทักษะในการดูแลผู้ป่วย หรือแก้ปัญหาผู้ป่วยเฉพาะรายได้อย่างตรงประเด็น",
  ],
  improve: [
    "ไม่มีทักษะในการดูแลผู้ป่วย หรือแก้ปัญหาผู้ป่วยเฉพาะรายได้ หรือแก้ปัญหาไม่ตรงประเด็น",
  ],
};

const requiredKeys = [criterion.key, "strength", "improvement"];
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
    const selectedScore = data[criterion.key];
    const complete = Boolean(selectedScore);
    const hasNA = selectedScore === "N/A";
    const weightedScore =
      complete && !hasNA ? Number(selectedScore) * criterion.weight : null;

    return {
      complete,
      hasNA,
      weightedScore,
      finalScore: weightedScore === null ? null : (weightedScore / 100) * 10,
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

  const renderScoreChoices = () => {
    const scoreGroups = [
      ["10"],
      ["9", "8"],
      ["7", "6"],
      ["5", "4", "3", "2", "1", "0"],
      ["N/A"],
    ];

    return scoreGroups.map((scores, groupIndex) => (
      <td className="border p-2 align-top" key={groupIndex}>
        <RadioGroup
          aria-label="คะแนนการประเมินทักษะโดยรวม"
          className="flex min-h-12 flex-wrap items-center justify-center gap-3"
          onValueChange={(value) => setDataValue(criterion.key, value)}
          value={data[criterion.key]}
        >
          {scores.map((score) => (
            <label
              className="flex cursor-pointer flex-col items-center gap-1 text-xs"
              htmlFor={`${criterion.key}-${score}`}
              key={score}
            >
              <RadioGroupItem
                aria-invalid={isInvalid(criterion.key)}
                className={
                  isInvalid(criterion.key) ? "border-2 border-red-600" : ""
                }
                id={`${criterion.key}-${score}`}
                value={score}
              />
              <span className={isInvalid(criterion.key) ? "text-red-600" : ""}>
                {score}
              </span>
            </label>
          ))}
        </RadioGroup>
      </td>
    ));
  };

  const selectedScore = data[criterion.key];
  const weightedScore =
    selectedScore && selectedScore !== "N/A"
      ? Number(selectedScore) * criterion.weight
      : selectedScore;

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
          ตัวอย่างเช่น หากประเมินหัวข้อ “การประเมินทักษะโดยรวม” อยู่ในเกณฑ์ “ดี”
          (๘-๙ คะแนน) สามารถเลือกให้คะแนน ๘ หรือ ๙ ได้
          ทั้งนี้ขึ้นกับความเห็นของผู้ประเมิน
        </p>
      </section>

      <section className="sm:col-span-12">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[1080px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-48 border p-2 text-center text-sm">
                  หัวข้อการประเมิน
                </th>
                <th className="w-56 border p-2 text-center text-sm">
                  ดีมาก
                  <br />
                  <span className="text-xs">(๑๐ คะแนน)</span>
                </th>
                <th className="w-56 border p-2 text-center text-sm">
                  ดี
                  <br />
                  <span className="text-xs">(๘-๙ คะแนน)</span>
                </th>
                <th className="w-56 border p-2 text-center text-sm">
                  ผ่าน
                  <br />
                  <span className="text-xs">(๖-๗ คะแนน)</span>
                </th>
                <th className="w-56 border p-2 text-center text-sm">
                  ควรปรับปรุง
                  <br />
                  <span className="text-xs">(๐-๕ คะแนน)</span>
                </th>
                <th className="w-20 border p-2 text-center text-sm">น้ำหนัก</th>
              </tr>
            </thead>
            <tbody>
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
                  {weightedScore || weightedScore === 0 ? weightedScore : "___"}
                  {isInvalid(criterion.key) && (
                    <p className="mt-1 text-xs text-red-600">กรุณาเลือกคะแนน</p>
                  )}
                </td>
                {renderScoreChoices()}
              </tr>
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
                  ÷ ๑๐๐) × ๑๐ ={" "}
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
