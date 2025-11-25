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

const scoreLabels = [
  { label: "5", value: "5" },
  { label: "4", value: "4" },
  { label: "3", value: "3" },
  { label: "2", value: "2" },
  { label: "1", value: "1" },
];

const activityLabels = [
  { label: "ไม่มีการฝึก", value: "0" },
  { label: "1-2 กิจกรรม", value: "1" },
  { label: ">2 กิจกรรม", value: ">2" },
];

// Check if checkbox is selected but score is not provided
const checkboxScoreValidation = [
  // จุดมุ่งหมาย 1
  { select: "rd1_1_select", score: "rd1_1_score" },
  { select: "rd1_2_select", score: "rd1_2_score" },
  { select: "rd1_3_select", score: "rd1_3_score" },
  { select: "rd1_4_select", score: "rd1_4_score" },
  { select: "rd1_5_select", score: "rd1_5_score" },
  { select: "rd1_6_select", score: "rd1_6_score" },
  { select: "rd1_7_select", score: "rd1_7_score" },
  { select: "rd1_8_select", score: "rd1_8_score" },
  { select: "rd1_9_select", score: "rd1_9_score" },
  // จุดมุ่งหมาย 2
  { select: "rd2_1_select", score: "rd2_1_score" },
  { select: "rd2_2_select", score: "rd2_2_score" },
  // จุดมุ่งหมาย 3
  { select: "rd3_1_select", score: "rd3_1_score" },
  { select: "rd3_2_select", score: "rd3_2_score" },
  { select: "rd3_3_select", score: "rd3_3_score" },
  { select: "rd3_4_select", score: "rd3_4_score" },
  { select: "rd3_5_select", score: "rd3_5_score" },
  // จุดมุ่งหมาย 4
  { select: "rd4_1_select", score: "rd4_1_score" },
  { select: "rd4_2_select", score: "rd4_2_score" },
  { select: "rd4_3_select", score: "rd4_3_score" },
  { select: "rd4_4_select", score: "rd4_4_score" },
  // จุดมุ่งหมาย 5
  { select: "rd5_1_select", score: "rd5_1_score" },
  { select: "rd5_2_select", score: "rd5_2_score" },
  { select: "rd5_3_select", score: "rd5_3_score" },
  { select: "rd5_4_select", score: "rd5_4_score" },
  { select: "rd5_5_select", score: "rd5_5_score" },
  { select: "rd5_6_select", score: "rd5_6_score" },
];

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    // สัดส่วนงาน
    percentage_1: parentForm.getValues("result.percentage_1") || "",
    percentage_2: parentForm.getValues("result.percentage_2") || "",
    percentage_3: parentForm.getValues("result.percentage_3") || "",
    percentage_4: parentForm.getValues("result.percentage_4") || "",
    percentage_5: parentForm.getValues("result.percentage_5") || "",
    otherDepartment: parentForm.getValues("result.otherDepartment") || "",

    // จุดมุ่งหมาย 1: การประยุกต์หลักวิทยาศาสตร์ในการวิจัยและพัฒนา
    rd1_day: parentForm.getValues("result.rd1_day") || "",
    rd1_1_select: parentForm.getValues("result.rd1_1_select") || false,
    rd1_1_activity: parentForm.getValues("result.rd1_1_activity") || "",
    rd1_1_score: parentForm.getValues("result.rd1_1_score") || "",
    rd1_2_select: parentForm.getValues("result.rd1_2_select") || false,
    rd1_2_activity: parentForm.getValues("result.rd1_2_activity") || "",
    rd1_2_score: parentForm.getValues("result.rd1_2_score") || "",
    rd1_3_select: parentForm.getValues("result.rd1_3_select") || false,
    rd1_3_activity: parentForm.getValues("result.rd1_3_activity") || "",
    rd1_3_score: parentForm.getValues("result.rd1_3_score") || "",
    rd1_4_select: parentForm.getValues("result.rd1_4_select") || false,
    rd1_4_activity: parentForm.getValues("result.rd1_4_activity") || "",
    rd1_4_score: parentForm.getValues("result.rd1_4_score") || "",
    rd1_5_select: parentForm.getValues("result.rd1_5_select") || false,
    rd1_5_activity: parentForm.getValues("result.rd1_5_activity") || "",
    rd1_5_score: parentForm.getValues("result.rd1_5_score") || "",
    rd1_6_select: parentForm.getValues("result.rd1_6_select") || false,
    rd1_6_activity: parentForm.getValues("result.rd1_6_activity") || "",
    rd1_6_score: parentForm.getValues("result.rd1_6_score") || "",
    rd1_7_select: parentForm.getValues("result.rd1_7_select") || false,
    rd1_7_activity: parentForm.getValues("result.rd1_7_activity") || "",
    rd1_7_score: parentForm.getValues("result.rd1_7_score") || "",
    rd1_8_select: parentForm.getValues("result.rd1_8_select") || false,
    rd1_8_activity: parentForm.getValues("result.rd1_8_activity") || "",
    rd1_8_score: parentForm.getValues("result.rd1_8_score") || "",
    rd1_9_select: parentForm.getValues("result.rd1_9_select") || false,
    rd1_9_activity: parentForm.getValues("result.rd1_9_activity") || "",
    rd1_9_score: parentForm.getValues("result.rd1_9_score") || "",
    rd1_note: parentForm.getValues("result.rd1_note") || "",
    rd1_avg_score: parentForm.getValues("result.rd1_avg_score") || "",

    // จุดมุ่งหมาย 2: เทคโนโลยี และทักษะในการควบคุมการผลิต
    rd2_day: parentForm.getValues("result.rd2_day") || "",
    rd2_1_select: parentForm.getValues("result.rd2_1_select") || false,
    rd2_1_activity: parentForm.getValues("result.rd2_1_activity") || "",
    rd2_1_score: parentForm.getValues("result.rd2_1_score") || "",
    rd2_2_select: parentForm.getValues("result.rd2_2_select") || false,
    rd2_2_activity: parentForm.getValues("result.rd2_2_activity") || "",
    rd2_2_score: parentForm.getValues("result.rd2_2_score") || "",
    rd2_note: parentForm.getValues("result.rd2_note") || "",
    rd2_avg_score: parentForm.getValues("result.rd2_avg_score") || "",

    // จุดมุ่งหมาย 3: ระบบคุณภาพ และมาตรฐานสากล
    rd3_day: parentForm.getValues("result.rd3_day") || "",
    rd3_1_select: parentForm.getValues("result.rd3_1_select") || false,
    rd3_1_activity: parentForm.getValues("result.rd3_1_activity") || "",
    rd3_1_score: parentForm.getValues("result.rd3_1_score") || "",
    rd3_2_select: parentForm.getValues("result.rd3_2_select") || false,
    rd3_2_activity: parentForm.getValues("result.rd3_2_activity") || "",
    rd3_2_score: parentForm.getValues("result.rd3_2_score") || "",
    rd3_3_select: parentForm.getValues("result.rd3_3_select") || false,
    rd3_3_activity: parentForm.getValues("result.rd3_3_activity") || "",
    rd3_3_score: parentForm.getValues("result.rd3_3_score") || "",
    rd3_4_select: parentForm.getValues("result.rd3_4_select") || false,
    rd3_4_activity: parentForm.getValues("result.rd3_4_activity") || "",
    rd3_4_score: parentForm.getValues("result.rd3_4_score") || "",
    rd3_5_select: parentForm.getValues("result.rd3_5_select") || false,
    rd3_5_activity: parentForm.getValues("result.rd3_5_activity") || "",
    rd3_5_score: parentForm.getValues("result.rd3_5_score") || "",
    rd3_note: parentForm.getValues("result.rd3_note") || "",
    rd3_avg_score: parentForm.getValues("result.rd3_avg_score") || "",

    // จุดมุ่งหมาย 4: หลักการบริหารการผลิต
    rd4_day: parentForm.getValues("result.rd4_day") || "",
    rd4_1_select: parentForm.getValues("result.rd4_1_select") || false,
    rd4_1_activity: parentForm.getValues("result.rd4_1_activity") || "",
    rd4_1_score: parentForm.getValues("result.rd4_1_score") || "",
    rd4_2_select: parentForm.getValues("result.rd4_2_select") || false,
    rd4_2_activity: parentForm.getValues("result.rd4_2_activity") || "",
    rd4_2_score: parentForm.getValues("result.rd4_2_score") || "",
    rd4_3_select: parentForm.getValues("result.rd4_3_select") || false,
    rd4_3_activity: parentForm.getValues("result.rd4_3_activity") || "",
    rd4_3_score: parentForm.getValues("result.rd4_3_score") || "",
    rd4_4_select: parentForm.getValues("result.rd4_4_select") || false,
    rd4_4_activity: parentForm.getValues("result.rd4_4_activity") || "",
    rd4_4_score: parentForm.getValues("result.rd4_4_score") || "",
    rd4_note: parentForm.getValues("result.rd4_note") || "",
    rd4_avg_score: parentForm.getValues("result.rd4_avg_score") || "",

    // จุดมุ่งหมาย 5: กระบวนการขึ้นทะเบียน
    rd5_day: parentForm.getValues("result.rd5_day") || "",
    rd5_1_select: parentForm.getValues("result.rd5_1_select") || false,
    rd5_1_activity: parentForm.getValues("result.rd5_1_activity") || "",
    rd5_1_score: parentForm.getValues("result.rd5_1_score") || "",
    rd5_2_select: parentForm.getValues("result.rd5_2_select") || false,
    rd5_2_activity: parentForm.getValues("result.rd5_2_activity") || "",
    rd5_2_score: parentForm.getValues("result.rd5_2_score") || "",
    rd5_3_select: parentForm.getValues("result.rd5_3_select") || false,
    rd5_3_activity: parentForm.getValues("result.rd5_3_activity") || "",
    rd5_3_score: parentForm.getValues("result.rd5_3_score") || "",
    rd5_4_select: parentForm.getValues("result.rd5_4_select") || false,
    rd5_4_activity: parentForm.getValues("result.rd5_4_activity") || "",
    rd5_4_score: parentForm.getValues("result.rd5_4_score") || "",
    rd5_5_select: parentForm.getValues("result.rd5_5_select") || false,
    rd5_5_activity: parentForm.getValues("result.rd5_5_activity") || "",
    rd5_5_score: parentForm.getValues("result.rd5_5_score") || "",
    rd5_6_select: parentForm.getValues("result.rd5_6_select") || false,
    rd5_6_activity: parentForm.getValues("result.rd5_6_activity") || "",
    rd5_6_score: parentForm.getValues("result.rd5_6_score") || "",
    rd5_note: parentForm.getValues("result.rd5_note") || "",
    rd5_avg_score: parentForm.getValues("result.rd5_avg_score") || "",

    // คะแนนรวม
    total_score_1_5: parentForm.getValues("result.total_score_1_5") || "",

    suggestion: parentForm.getValues("result.suggestion") || "",
  });

  useEffect(() => {
    console.log("handleCheckValid():", handleCheckValid());

    setFormValidated(handleCheckValid());
  }, [isSubmit, isClick]);

  useEffect(() => {
    // Calculate average scores when component mounts
    calculateAverageScores();
  }, []);

  const setDataValue = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
    parentForm.setValue(`result.${key}`, value);

    // Calculate average scores automatically
    setTimeout(() => {
      calculateAverageScores();
    }, 100);
  };

  const calculateAverageScores = () => {
    // Get the latest values from form
    const currentData = {
      rd1_1_select: parentForm.getValues("result.rd1_1_select"),
      rd1_1_score: parentForm.getValues("result.rd1_1_score"),
      rd1_2_select: parentForm.getValues("result.rd1_2_select"),
      rd1_2_score: parentForm.getValues("result.rd1_2_score"),
      rd1_3_select: parentForm.getValues("result.rd1_3_select"),
      rd1_3_score: parentForm.getValues("result.rd1_3_score"),
      rd1_4_select: parentForm.getValues("result.rd1_4_select"),
      rd1_4_score: parentForm.getValues("result.rd1_4_score"),
      rd1_5_select: parentForm.getValues("result.rd1_5_select"),
      rd1_5_score: parentForm.getValues("result.rd1_5_score"),
      rd1_6_select: parentForm.getValues("result.rd1_6_select"),
      rd1_6_score: parentForm.getValues("result.rd1_6_score"),
      rd1_7_select: parentForm.getValues("result.rd1_7_select"),
      rd1_7_score: parentForm.getValues("result.rd1_7_score"),
      rd1_8_select: parentForm.getValues("result.rd1_8_select"),
      rd1_8_score: parentForm.getValues("result.rd1_8_score"),
      rd1_9_select: parentForm.getValues("result.rd1_9_select"),
      rd1_9_score: parentForm.getValues("result.rd1_9_score"),
      rd2_1_select: parentForm.getValues("result.rd2_1_select"),
      rd2_1_score: parentForm.getValues("result.rd2_1_score"),
      rd2_2_select: parentForm.getValues("result.rd2_2_select"),
      rd2_2_score: parentForm.getValues("result.rd2_2_score"),
      rd3_1_select: parentForm.getValues("result.rd3_1_select"),
      rd3_1_score: parentForm.getValues("result.rd3_1_score"),
      rd3_2_select: parentForm.getValues("result.rd3_2_select"),
      rd3_2_score: parentForm.getValues("result.rd3_2_score"),
      rd3_3_select: parentForm.getValues("result.rd3_3_select"),
      rd3_3_score: parentForm.getValues("result.rd3_3_score"),
      rd3_4_select: parentForm.getValues("result.rd3_4_select"),
      rd3_4_score: parentForm.getValues("result.rd3_4_score"),
      rd3_5_select: parentForm.getValues("result.rd3_5_select"),
      rd3_5_score: parentForm.getValues("result.rd3_5_score"),
      rd4_1_select: parentForm.getValues("result.rd4_1_select"),
      rd4_1_score: parentForm.getValues("result.rd4_1_score"),
      rd4_2_select: parentForm.getValues("result.rd4_2_select"),
      rd4_2_score: parentForm.getValues("result.rd4_2_score"),
      rd4_3_select: parentForm.getValues("result.rd4_3_select"),
      rd4_3_score: parentForm.getValues("result.rd4_3_score"),
      rd4_4_select: parentForm.getValues("result.rd4_4_select"),
      rd4_4_score: parentForm.getValues("result.rd4_4_score"),
      rd5_1_select: parentForm.getValues("result.rd5_1_select"),
      rd5_1_score: parentForm.getValues("result.rd5_1_score"),
      rd5_2_select: parentForm.getValues("result.rd5_2_select"),
      rd5_2_score: parentForm.getValues("result.rd5_2_score"),
      rd5_3_select: parentForm.getValues("result.rd5_3_select"),
      rd5_3_score: parentForm.getValues("result.rd5_3_score"),
      rd5_4_select: parentForm.getValues("result.rd5_4_select"),
      rd5_4_score: parentForm.getValues("result.rd5_4_score"),
      rd5_5_select: parentForm.getValues("result.rd5_5_select"),
      rd5_5_score: parentForm.getValues("result.rd5_5_score"),
      rd5_6_select: parentForm.getValues("result.rd5_6_select"),
      rd5_6_score: parentForm.getValues("result.rd5_6_score"),
    };

    // จุดมุ่งหมาย 1 (9 items)
    const rd1_scores = [
      currentData.rd1_1_select && currentData.rd1_1_score ? Number(currentData.rd1_1_score) : null,
      currentData.rd1_2_select && currentData.rd1_2_score ? Number(currentData.rd1_2_score) : null,
      currentData.rd1_3_select && currentData.rd1_3_score ? Number(currentData.rd1_3_score) : null,
      currentData.rd1_4_select && currentData.rd1_4_score ? Number(currentData.rd1_4_score) : null,
      currentData.rd1_5_select && currentData.rd1_5_score ? Number(currentData.rd1_5_score) : null,
      currentData.rd1_6_select && currentData.rd1_6_score ? Number(currentData.rd1_6_score) : null,
      currentData.rd1_7_select && currentData.rd1_7_score ? Number(currentData.rd1_7_score) : null,
      currentData.rd1_8_select && currentData.rd1_8_score ? Number(currentData.rd1_8_score) : null,
      currentData.rd1_9_select && currentData.rd1_9_score ? Number(currentData.rd1_9_score) : null,
    ].filter((score) => score !== null);

    const rd1_avg = rd1_scores.length > 0 
      ? (rd1_scores.reduce((sum, score) => sum + score, 0) / rd1_scores.length).toFixed(2)
      : "0.00";

    // จุดมุ่งหมาย 2 (2 items)
    const rd2_scores = [
      currentData.rd2_1_select && currentData.rd2_1_score ? Number(currentData.rd2_1_score) : null,
      currentData.rd2_2_select && currentData.rd2_2_score ? Number(currentData.rd2_2_score) : null,
    ].filter((score) => score !== null);

    const rd2_avg = rd2_scores.length > 0
      ? (rd2_scores.reduce((sum, score) => sum + score, 0) / rd2_scores.length).toFixed(2)
      : "0.00";

    // จุดมุ่งหมาย 3 (5 items)
    const rd3_scores = [
      currentData.rd3_1_select && currentData.rd3_1_score ? Number(currentData.rd3_1_score) : null,
      currentData.rd3_2_select && currentData.rd3_2_score ? Number(currentData.rd3_2_score) : null,
      currentData.rd3_3_select && currentData.rd3_3_score ? Number(currentData.rd3_3_score) : null,
      currentData.rd3_4_select && currentData.rd3_4_score ? Number(currentData.rd3_4_score) : null,
      currentData.rd3_5_select && currentData.rd3_5_score ? Number(currentData.rd3_5_score) : null,
    ].filter((score) => score !== null);

    const rd3_avg = rd3_scores.length > 0
      ? (rd3_scores.reduce((sum, score) => sum + score, 0) / rd3_scores.length).toFixed(2)
      : "0.00";

    // จุดมุ่งหมาย 4 (4 items)
    const rd4_scores = [
      currentData.rd4_1_select && currentData.rd4_1_score ? Number(currentData.rd4_1_score) : null,
      currentData.rd4_2_select && currentData.rd4_2_score ? Number(currentData.rd4_2_score) : null,
      currentData.rd4_3_select && currentData.rd4_3_score ? Number(currentData.rd4_3_score) : null,
      currentData.rd4_4_select && currentData.rd4_4_score ? Number(currentData.rd4_4_score) : null,
    ].filter((score) => score !== null);

    const rd4_avg = rd4_scores.length > 0
      ? (rd4_scores.reduce((sum, score) => sum + score, 0) / rd4_scores.length).toFixed(2)
      : "0.00";

    // จุดมุ่งหมาย 5 (6 items)
    const rd5_scores = [
      currentData.rd5_1_select && currentData.rd5_1_score ? Number(currentData.rd5_1_score) : null,
      currentData.rd5_2_select && currentData.rd5_2_score ? Number(currentData.rd5_2_score) : null,
      currentData.rd5_3_select && currentData.rd5_3_score ? Number(currentData.rd5_3_score) : null,
      currentData.rd5_4_select && currentData.rd5_4_score ? Number(currentData.rd5_4_score) : null,
      currentData.rd5_5_select && currentData.rd5_5_score ? Number(currentData.rd5_5_score) : null,
      currentData.rd5_6_select && currentData.rd5_6_score ? Number(currentData.rd5_6_score) : null,
    ].filter((score) => score !== null);

    const rd5_avg = rd5_scores.length > 0
      ? (rd5_scores.reduce((sum, score) => sum + score, 0) / rd5_scores.length).toFixed(2)
      : "0.00";

    // คะแนนรวม (จุดมุ่งหมาย 1-5) × 4 คะแนน
    const totalAvg = Number(rd1_avg) + Number(rd2_avg) + Number(rd3_avg) + Number(rd4_avg) + Number(rd5_avg);
    const totalScore = (totalAvg * 4).toFixed(2);

    // Update all calculated values
    setData((prev) => ({ 
      ...prev, 
      rd1_avg_score: rd1_avg,
      rd2_avg_score: rd2_avg,
      rd3_avg_score: rd3_avg,
      rd4_avg_score: rd4_avg,
      rd5_avg_score: rd5_avg,
      total_score_1_5: totalScore 
    }));
    
    parentForm.setValue("result.rd1_avg_score", rd1_avg);
    parentForm.setValue("result.rd2_avg_score", rd2_avg);
    parentForm.setValue("result.rd3_avg_score", rd3_avg);
    parentForm.setValue("result.rd4_avg_score", rd4_avg);
    parentForm.setValue("result.rd5_avg_score", rd5_avg);
    parentForm.setValue("result.total_score_1_5", totalScore);
  };

  const setCheckboxValue = (key: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      [key]: checked,
    }));
    parentForm.setValue(`result.${key}`, checked);

    const findScoreLabel = checkboxScoreValidation.find((item) => {
      return item.select === key;
    });
    if (findScoreLabel) {
      const scoreKey = findScoreLabel.score;
      setDataValue(scoreKey, "");
    }

    // Calculate average scores after checkbox change
    setTimeout(() => {
      calculateAverageScores();
    }, 100);
  };

  const ScoreForm = ({
    value,
    label,
    list,
    rows = false,
    isRequired = false,
  }: any) => {
    return (
      <RadioGroup
        onValueChange={(value) => setDataValue(label, value)}
        value={value}
        className={
          rows
            ? "flex flex-col gap-2 justify-center align-center w-full"
            : "flex flex-row items-center gap-2 justify-center w-full"
        }
      >
        {list.map((radio: any) => (
          <div
            className={
              rows
                ? "flex flex-row gap-2 items-center"
                : "flex flex-col gap-2 items-center"
            }
            key={radio.value}
          >
            <RadioGroupItem
              value={radio.value}
              className={
                isSubmit && isRequired && !value
                  ? "border-2 border-red-600"
                  : ""
              }
            />
            <label
              className={
                "text-sm" +
                (isSubmit && isRequired && !value ? " text-red-600" : "")
              }
            >
              {radio.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const handleCheckValid = () => {
    const keyList = [
      "otherDepartment",
      "rd1_note",
      "rd2_note",
      "rd3_note",
      "rd4_note",
      "rd5_note",
      "suggestion",
    ];

    // Check percentage total not exceed 100%
    const totalPercentage =
      Number(data.percentage_1 || 0) +
      Number(data.percentage_2 || 0) +
      Number(data.percentage_3 || 0) +
      Number(data.percentage_4 || 0) +
      Number(data.percentage_5 || 0);

    if (totalPercentage > 100) {
      console.log(
        `Total percentage is ${totalPercentage}%, which exceeds 100%`
      );
      return false;
    }

    // Check required fields (exclude optional fields and calculated fields)
    const hasEmptyField = Object.keys(data).some((key) => {
      if (
        !keyList.includes(key) &&
        !key.includes("_select") &&
        !key.includes("_score") &&
        !key.includes("_note") &&
        !key.includes("otherDepartment") &&
        !key.includes("suggestion")
      ) {
        const value = data[key as keyof typeof data];
        if (!value) {
          console.log(`Field ${key} is empty`);
          return true;
        }
      }
      return false;
    });

    const hasInvalidCheckboxScore = checkboxScoreValidation.some(
      ({ select, score }) => {
        const isSelected = data[select as keyof typeof data];
        const scoreValue = data[score as keyof typeof data];

        if (isSelected && !scoreValue) {
          console.log(`${select} is checked but ${score} is empty`);
          return true;
        }
        return false;
      }
    );

    if (hasEmptyField || hasInvalidCheckboxScore) {
      console.log("Form validation failed");
      return false;
    } else {
      console.log("All fields are valid");
      return true;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12 ">
      <div className="sm:col-span-12 ">
        <div className="">
          <p className="text-sm mb-2">
            การประเมินแบ่งออกเป็น 2 ส่วน ได้แก่
            การประเมินผลเชิงปริมาณและการประเมินผลสัมฤทธิ์ของการฝึกปฏิบัติงาน
            โดยทั้ง 2 ส่วนประกอบด้วยจุดมุ่งหมายหลัก 5 ข้อ
            นักศึกษาควรได้รับการฝึกปฏิบัติงานจนครบทั้ง 5 จุดมุ่งหมายหลัก
            แต่ละจุดมุ่งหมายหลักมีวัตถุประสงค์เชิงพฤติกรรมหลายส่วน
            ซึ่งอาจไม่จำเป็นต้องฝึกปฏิบัติงานจนครบทุกวัตถุประสงค์
            ทั้งนี้ขึ้นกับความพร้อมและบริบทของแต่ละแหล่งฝึก
          </p>
          <p className="text-sm mb-2">
            การประเมินผลเชิงปริมาณนั้น
            อาจารย์ประจำแหล่งฝึกสามารถกำหนดหัวข้อและกรอบการฝึกปฏิบัติงานได้ตามความเหมาะสม
            โดยอ้างอิงจากข้อมูลในแต่ละวัตถุประสงค์เชิงพฤติกรรม
            ถ้ากิจกรรมใดมีการฝึกปฏิบัติ ขอให้ระบุจำนวนกิจกรรมที่เกิดขึ้น
            พร้อมทั้งบันทึกชื่อของกิจกรรมที่ได้ฝึกปฏิบัติไว้ในช่องหมายเหตุด้วย
          </p>
          <p className="text-sm mb-2">
            สำหรับการประเมินผลสัมฤทธิ์นั้น
            อาจารย์ประจำแหล่งฝึกสามารถทำได้จากการสังเกต การสอบถาม การอภิปราย
            รวมไปถึงผลของการฝึกปฏิบัติงาน โดยมีแนวทางในการให้คะแนนดังนี้
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
                5
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดีมาก
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่ามีความรู้ ความเข้าใจ
                และทักษะครบถ้วนตามวัตถุประสงค์เชิงพฤติกรรมการฝึกปฏิบัติงาน
                เกิดความบกพร่องน้อย สามารถปฏิบัติงานได้ด้วยตนเอง
                โดยอาจได้รับคำแนะนำเป็นครั้งคราว
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                4
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ดี
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่ามีความรู้ ความเข้าใจ
                และทักษะครบถ้วนตามวัตถุประสงค์เชิงพฤติกรรมการฝึกปฏิบัติงาน
                มีความบกพร่องในระดับยอมรับได้ สามารถปฏิบัติงานได้
                แต่ต้องได้รับคำแนะนำเป็นครั้งคราว
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                3
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปานกลาง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่ามีความรู้ ความเข้าใจ
                และทักษะครบถ้วนตามวัตถุประสงค์เชิงพฤติกรรมการฝึกปฏิบัติงาน
                มีความบกพร่องในระดับยอมรับได้ สามารถปฏิบัติงานได้
                แต่ต้องได้รับคำแนะนำเป็นส่วนใหญ่
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                2
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ปรับปรุง
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่าขาดความรู้ ความเข้าใจ และทักษะ
                เกิดความผิดพลาดอยู่เสมอ
                ต้องฝึกปฏิบัติงานภายใต้การดูแลของอาจารย์ประจำแหล่งฝึกอย่างใกล้ชิด
              </td>
            </tr>
            <tr>
              <td className="p-2 border font-medium align-top text-sm text-center">
                1
              </td>
              <td className="p-2 border font-medium align-top text-sm text-center">
                ไม่ผ่าน
              </td>
              <td className="p-2 border font-medium align-top text-sm">
                นักศึกษาแสดงให้เห็นว่าขาดความรู้ ความเข้าใจ และทักษะ
                ไม่สามารถปฏิบัติงานได้ตามวัตถุประสงค์เชิงพฤติกรรมที่กำหนด
                เกิดความผิดพลาดซ้ำและไม่แก้ไขตามคำแนะนำของอาจารย์ประจำแหล่งฝึก
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sm:col-span-12">
        <table>
          <tbody>
            <tr>
              <td colSpan={2} className="text-sm">
                สัดส่วนงานที่ให้นักศึกษาได้ฝึกปฏิบัติจริง
              </td>
            </tr>

            <tr>
              <td className="pl-4 text-sm">ด้านการวิจัยและพัฒนา</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentage_1}
                  onChange={(value) =>
                    setDataValue("percentage_1", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentage_1 &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">ด้านการผลิต</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentage_2}
                  onChange={(value) =>
                    setDataValue("percentage_2", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentage_2 &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">
                ด้านการประกันคุณภาพ และควบคุมคุณภาพ
              </td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentage_3}
                  onChange={(value) =>
                    setDataValue("percentage_3", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentage_3 &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">ด้านการขึ้นทะเบียน</td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentage_4}
                  onChange={(value) =>
                    setDataValue("percentage_4", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentage_4 &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>

            <tr>
              <td className="pl-4 text-sm">
                <div className="flex flex-row items-center gap-4 w-full">
                  <div>ด้านอื่นๆ (โปรดระบุ)</div>
                  <input
                    type="text"
                    value={data.otherDepartment}
                    onChange={(value) =>
                      setDataValue("otherDepartment", value.target.value)
                    }
                    className="p-1 border rounded-md text-sm w-[150px]"
                  />
                </div>
              </td>
              <td className="flex flex-row items-center gap-2 w-full">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={data.percentage_5}
                  onChange={(value) =>
                    setDataValue("percentage_5", value.target.value)
                  }
                  className={
                    "p-1 border rounded-md text-sm w-[150px] text-center " +
                    (isSubmit &&
                      !data.percentage_5 &&
                      " border-2 border-red-600")
                  }
                />
                <span>%</span>
              </td>
            </tr>
            <tr>
              <td className="pl-4 text-sm">รวม</td>
              <td>
                <div className="flex flex-row items-center gap-2 w-full">
                  <span
                    className={
                      "w-[150px] text-center " +
                      (Number(data.percentage_1 || 0) +
                        Number(data.percentage_2 || 0) +
                        Number(data.percentage_3 || 0) +
                        Number(data.percentage_4 || 0) +
                        Number(data.percentage_5 || 0) >
                      100
                        ? "text-red-600 font-bold"
                        : Number(data.percentage_1 || 0) +
                            Number(data.percentage_2 || 0) +
                            Number(data.percentage_3 || 0) +
                            Number(data.percentage_4 || 0) +
                            Number(data.percentage_5 || 0) <
                          100
                        ? "text-orange-600 font-bold"
                        : "text-green-600 font-bold")
                    }
                  >
                    {Number(data.percentage_1 || 0) +
                      Number(data.percentage_2 || 0) +
                      Number(data.percentage_3 || 0) +
                      Number(data.percentage_4 || 0) +
                      Number(data.percentage_5 || 0)}
                  </span>
                  <span
                    className={
                      Number(data.percentage_1 || 0) +
                        Number(data.percentage_2 || 0) +
                        Number(data.percentage_3 || 0) +
                        Number(data.percentage_4 || 0) +
                        Number(data.percentage_5 || 0) >
                      100
                        ? "text-red-600 font-bold"
                        : Number(data.percentage_1 || 0) +
                            Number(data.percentage_2 || 0) +
                            Number(data.percentage_3 || 0) +
                            Number(data.percentage_4 || 0) +
                            Number(data.percentage_5 || 0) <
                          100
                        ? "text-orange-600 font-bold"
                        : "text-green-600 font-bold"
                    }
                  >
                    %
                  </span>
                  {Number(data.percentage_1 || 0) +
                    Number(data.percentage_2 || 0) +
                    Number(data.percentage_3 || 0) +
                    Number(data.percentage_4 || 0) +
                    Number(data.percentage_5 || 0) >
                    100 && (
                    <span className="text-red-600 text-xs ml-2">
                      (เกิน 100%)
                    </span>
                  )}
                  {Number(data.percentage_1 || 0) +
                    Number(data.percentage_2 || 0) +
                    Number(data.percentage_3 || 0) +
                    Number(data.percentage_4 || 0) +
                    Number(data.percentage_5 || 0) <
                    100 && (
                    <span className="text-orange-600 text-xs ml-2">
                      (ยังไม่ครบ 100%)
                    </span>
                  )}
                  {Number(data.percentage_1 || 0) +
                    Number(data.percentage_2 || 0) +
                    Number(data.percentage_3 || 0) +
                    Number(data.percentage_4 || 0) +
                    Number(data.percentage_5 || 0) ===
                    100 && (
                    <span className="text-green-600 text-xs ml-2">
                      ✓ ครบ 100%
                    </span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">
          การประเมินผลเชิงปริมาณและการประเมินผลสัมฤทธิ์
        </p>
      </div>

      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 border text-center text-sm">จุดมุ่งหมาย</th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "6%" }}
                >
                  ระยะเวลา (วัน)
                </th>
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "25%" }}
                >
                  วัตถุประสงค์เชิงพฤติกรรมที่มีการฝึกปฏิบัติ
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  ปริมาณงาน
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  ระดับของการบรรลุวัตถุประสงค์
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "15%" }}
                >
                  หมายเหตุ
                </th>
              </tr>
            </thead>
            <tbody>
              {/* แถวที่ 1: ใส่จุดมุ่งหมาย + วัน + หมายเหตุ (rowSpan ครอบทั้งหมด) */}
              <tr>
                <td className="p-2 border align-top text-sm" rowSpan={9}>
                  1.
                  การประยุกต์หลักวิทยาศาสตร์ในการวิจัยและพัฒนาสูตรตำรับเครื่องสำอางและผลิตภัณฑ์สุขภาพ
                </td>

                <td className="p-2 border align-top text-sm" rowSpan={9}>
                  <input
                    type="number"
                    value={data.rd1_day || ""}
                    onChange={(e) => setDataValue("rd1_day", e.target.value)}
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit && !data.rd1_day && " border-2 border-red-600")
                    }
                  />
                  วัน
                </td>

                {/* วัตถุประสงค์ 1 */}
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_1_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_1_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายความรู้พื้นฐานที่เกี่ยวข้องกับการพัฒนาสูตรตำรับเครื่องสำอางและผลิตภัณฑ์สุขภาพ
                      เช่น คำจำกัดความ องค์ประกอบ หลักการและกระบวนการเตรียม
                      การคำนวณที่เกี่ยวข้องกับการตั้งตำรับ
                      รวมไปถึงการประเมินผลที่เกี่ยวข้อง
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_1_activity}
                    label="rd1_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_1_score}
                    label="rd1_1_score"
                    list={scoreLabels}
                    isRequired={data.rd1_1_select}
                  />
                </td>

                {/* หมายเหตุ (ครอบ 9 แถว) */}
                <td className="p-2 border align-top text-sm" rowSpan={9}>
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => setDataValue("rd1_note", e.target.value)}
                    rows={3 * 9}
                    value={data.rd1_note || ""}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 2 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_2_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_2_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      สืบค้นและทดสอบเพื่อหาข้อมูลการศึกษาก่อนการตั้งตำรับ
                      (pre-formulation study) ของส่วนประกอบในตำรับ
                      ทั้งคุณสมบัติทางเคมีฟิสิกส์ และคุณสมบัติอื่นที่เกี่ยวข้อง
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_2_activity}
                    label="rd1_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_2_score}
                    label="rd1_2_score"
                    list={scoreLabels}
                    isRequired={data.rd1_2_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 3 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_3_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_3_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      วิเคราะห์ปัญหาและหาแนวทางในการตั้งตำรับเครื่องสำอางและผลิตภัณฑ์สุขภาพ
                      ให้ได้รูปแบบที่ต้องการ โดยอาศัยข้อมูลทางทฤษฎีพื้นฐาน
                      และผลการศึกษาก่อนการตั้งตำรับ
                      เพื่อให้ได้ตำรับที่มีประสิทธิผล มีความปลอดภัย
                      และมีความสวยงาม
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_3_activity}
                    label="rd1_3_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_3_score}
                    label="rd1_3_score"
                    list={scoreLabels}
                    isRequired={data.rd1_3_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 4 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_4_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_4_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายบทบาท ความหมาย ความสำคัญ หน้าที่ของสารช่วย
                      (excipients)
                      และสามารถเลือกชนิดและกำหนดปริมาณสารช่วยที่เหมาะสม
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_4_activity}
                    label="rd1_4_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_4_score}
                    label="rd1_4_score"
                    list={scoreLabels}
                    isRequired={data.rd1_4_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 5 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_5_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_5_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายระบบภาชนะบรรจุและการปิด (container and closure
                      system)
                      และสามารถเลือกให้เหมาะสมกับเครื่องสำอางและผลิตภัณฑ์สุขภาพแต่ละรูปแบบ
                      และแต่ละชนิดได้
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_5_activity}
                    label="rd1_5_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_5_score}
                    label="rd1_5_score"
                    list={scoreLabels}
                    isRequired={data.rd1_5_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 6 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_6_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_6_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายหลักเกณฑ์และขั้นตอนในการทดสอบทางกายภาพของเครื่องสำอางและผลิตภัณฑ์สุขภาพ
                      และสามารถนำการทดสอบทางห้องปฏิบัติการของเครื่องสำอางและผลิตภัณฑ์สุขภาพได้
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_6_activity}
                    label="rd1_6_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_6_score}
                    label="rd1_6_score"
                    list={scoreLabels}
                    isRequired={data.rd1_6_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 7 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_7_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_7_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      มีทักษะในการทดสอบและประเมินประสิทธิภาพของเครื่องสำอาง
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_7_activity}
                    label="rd1_7_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_7_score}
                    label="rd1_7_score"
                    list={scoreLabels}
                    isRequired={data.rd1_7_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 8 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_8_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_8_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>อธิบายหลักเกณฑ์ในการเลือกอาสาสมัครอย่างเหมาะสม</span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_8_activity}
                    label="rd1_8_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_8_score}
                    label="rd1_8_score"
                    list={scoreLabels}
                    isRequired={data.rd1_8_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 9 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd1_9_select}
                      onChange={(e) =>
                        setCheckboxValue("rd1_9_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      สามารถประเมินความพึงพอใจของผู้ใช้ผลิตภัณฑ์ได้อย่างถูกต้อง
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_9_activity}
                    label="rd1_9_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd1_9_score}
                    label="rd1_9_score"
                    list={scoreLabels}
                    isRequired={data.rd1_9_select}
                  />
                </td>
              </tr>

              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 1) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 1)
                </td>
                <td className="p-2 border align-top text-sm" colSpan={2}>
                  <input
                    type="number"
                    value={data.rd1_avg_score || ""}
                    readOnly
                    className="p-1 border rounded-md text-sm w-full text-center bg-gray-50"
                  />
                </td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  2. เทคโนโลยี
                  และทักษะในการควบคุมการผลิตเครื่องสำอางและผลิตภัณฑ์สุขภาพในระดับอุตสาหกรรม
                </td>

                {/* วัน */}
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  <input
                    type="number"
                    value={data.rd2_day || ""}
                    onChange={(e) => setDataValue("rd2_day", e.target.value)}
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit && !data.rd2_day && " border-2 border-red-600")
                    }
                  />
                  วัน
                </td>

                {/* วัตถุประสงค์ 1 */}
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd2_1_select}
                      onChange={(e) =>
                        setCheckboxValue("rd2_1_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      มีทักษะในการผลิตและควบคุมกระบวนการผลิตเครื่องสำอางและผลิตภัณฑ์สุขภาพรูปแบบต่าง
                      ๆ อย่างน้อยหนึ่งรูปแบบ สามารถกำหนดลำดับขั้นตอน
                      เลือกเครื่องมือที่ใช้
                      และหาสภาวะที่เหมาะสมของแต่ละกระบวนการผลิตได้
                    </span>
                  </div>
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd2_1_activity}
                    label="rd2_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd2_1_score}
                    label="rd2_1_score"
                    list={scoreLabels}
                    isRequired={data.rd2_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm" rowSpan={2}>
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => setDataValue("rd2_note", e.target.value)}
                    rows={3 * 2}
                    value={data.rd2_note || ""}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 2 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd2_2_select}
                      onChange={(e) =>
                        setCheckboxValue("rd2_2_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      ประยุกต์ความรู้เกี่ยวกับสถิติและคณิตศาสตร์ที่เกี่ยวกับการผลิต
                      เช่น การกำหนดแผนการสุ่มตัวอย่าง การทำแผนภูมิควบคุมคุณภาพ
                      (quality control chart, Cpk, RSD) เป็นต้น
                      เพื่อนำไปใช้ควบคุมการผลิต
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd2_2_activity}
                    label="rd2_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd2_2_score}
                    label="rd2_2_score"
                    list={scoreLabels}
                    isRequired={data.rd2_2_select}
                  />
                </td>
              </tr>

              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 2) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 2)
                </td>
                <td className="p-2 border align-top text-sm" colSpan={2}>
                  <input
                    type="number"
                    value={data.rd2_avg_score || ""}
                    readOnly
                    className="p-1 border rounded-md text-sm w-full text-center bg-gray-50"
                  />
                </td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm" rowSpan={5}>
                  3. ระบบคุณภาพ รวมถึงสิทธิพิเศษและวิธีการพิเศษต่าง ๆ
                  และมาตรฐานสากลที่เกี่ยวข้องกับการประเมิน
                  และการควบคุมคุณภาพสำหรับการผลิตเครื่องสำอาง
                </td>

                {/* วัน */}
                <td className="p-2 border align-top text-sm" rowSpan={5}>
                  <input
                    type="number"
                    value={data.rd3_day || ""}
                    onChange={(e) => setDataValue("rd3_day", e.target.value)}
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit && !data.rd3_day && " border-2 border-red-600")
                    }
                  />
                  วัน
                </td>

                {/* วัตถุประสงค์ 1 */}
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd3_1_select}
                      onChange={(e) =>
                        setCheckboxValue("rd3_1_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายความหมาย ความสำคัญ และวัตถุประสงค์ของข้อกำหนด
                      วัตถุดิบ วัสดุบรรจุภัณฑ์ และผลิตภัณฑ์สำเร็จรูป
                      ตลอดจนสามารถเชื่อมโยงข้อมูลที่จำเป็นของข้อกำหนด วัตถุดิบ
                      วัสดุบรรจุภัณฑ์ และผลิตภัณฑ์สำเร็จรูป
                      พร้อมทั้งวัตถุประสงค์ของการบรรจุรูป แพ็คละชนิดได้
                    </span>
                  </div>
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_1_activity}
                    label="rd3_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_1_score}
                    label="rd3_1_score"
                    list={scoreLabels}
                    isRequired={data.rd3_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm" rowSpan={5}>
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => setDataValue("rd3_note", e.target.value)}
                    rows={3 * 5}
                    value={data.rd3_note || ""}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 2 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd3_2_select}
                      onChange={(e) =>
                        setCheckboxValue("rd3_2_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      วิเคราะห์ปัญหาและเสนอแนวทางเชิงปริมาณของวัตถุดิบ
                      ผลิตภัณฑ์ระหว่างกระบวนการผลิต และผลิตภัณฑ์สำเร็จรูป
                      ทั้งในทางด้านเคมี กายภาพ และชีวภาพ
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_2_activity}
                    label="rd3_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_2_score}
                    label="rd3_2_score"
                    list={scoreLabels}
                    isRequired={data.rd3_2_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 3 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd3_3_select}
                      onChange={(e) =>
                        setCheckboxValue("rd3_3_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบาย และจัดทำเอกสาร ข้อกำหนดวัตถุดิบ วัสดุบรรจุ
                      และผลิตภัณฑ์สำเร็จรูป
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_3_activity}
                    label="rd3_3_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_3_score}
                    label="rd3_3_score"
                    list={scoreLabels}
                    isRequired={data.rd3_3_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 4 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd3_4_select}
                      onChange={(e) =>
                        setCheckboxValue("rd3_4_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายหลักการพัฒนาวิธีวิเคราะห์
                      รวมถึงตรวจสอบความถูกต้องของวิธีวิเคราะห์
                      และความสอดคล้องกับข้อกำหนด
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_4_activity}
                    label="rd3_4_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_4_score}
                    label="rd3_4_score"
                    list={scoreLabels}
                    isRequired={data.rd3_4_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 5 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd3_5_select}
                      onChange={(e) =>
                        setCheckboxValue("rd3_5_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายระบบคุณภาพ และหลักเกณฑ์ที่ดี
                      ในการผลิตเครื่องสำอางและผลิตภัณฑ์สุขภาพ
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_5_activity}
                    label="rd3_5_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd3_5_score}
                    label="rd3_5_score"
                    list={scoreLabels}
                    isRequired={data.rd3_5_select}
                  />
                </td>
              </tr>

              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 3) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 3)
                </td>
                <td className="p-2 border align-top text-sm" colSpan={2}>
                  <input
                    type="number"
                    value={data.rd3_avg_score || ""}
                    readOnly
                    className="p-1 border rounded-md text-sm w-full text-center bg-gray-50"
                  />
                </td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm" rowSpan={5}>
                  4. ความรู้เกี่ยวกับหลักการบริหารการผลิต การบริหารคุณภาพ
                  การวางแผนการผลิต และควบคุมสินค้าคงคลัง
                </td>

                {/* วัน */}
                <td className="p-2 border align-top text-sm" rowSpan={5}>
                  <input
                    type="number"
                    value={data.rd4_day || ""}
                    onChange={(e) => setDataValue("rd4_day", e.target.value)}
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit && !data.rd4_day && " border-2 border-red-600")
                    }
                  />
                  วัน
                </td>

                {/* วัตถุประสงค์ 1 */}
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd4_1_select}
                      onChange={(e) =>
                        setCheckboxValue("rd4_1_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายลักษณะผังโครงสร้างองค์กร บทบาทหน้าที่ และความรับผิดชอบ
                      ของบุคลากรฝ่ายผลิต เภสัชกรผู้ควบคุมการผลิต 
                      และอธิบายความเชื่อมโยงระหว่างฝ่ายผลิตกับฝ่ายอื่นที่เกี่ยวข้องได้
                    </span>
                  </div>
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_1_activity}
                    label="rd4_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_1_score}
                    label="rd4_1_score"
                    list={scoreLabels}
                    isRequired={data.rd4_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm" rowSpan={5}>
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => setDataValue("rd4_note", e.target.value)}
                    rows={3 * 5}
                    value={data.rd4_note || ""}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 2 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd4_2_select}
                      onChange={(e) =>
                        setCheckboxValue("rd4_2_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      จัดเตรียมเอกสาร (documentation) ที่เกี่ยวข้องกับการผลิต
                      ทั้งในด้านการจัดทำ การควบคุม การเก็บ และการใช้ประโยชน์
                      เช่น การจัดทำ SOP, BMR หรือ protocol เป็นต้น
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_2_activity}
                    label="rd4_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_2_score}
                    label="rd4_2_score"
                    list={scoreLabels}
                    isRequired={data.rd4_2_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 3 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd4_3_select}
                      onChange={(e) =>
                        setCheckboxValue("rd4_3_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายหลักการวางแผนการผลิต เช่น การวางแผนกำลังการผลิต
                      (capacity planning) การจัดทำแผนการผลิต
                      การบริหารสินค้าคงคลัง
                      การควบคุมวัตถุดิบและการจัดการซัพพลายเชน
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_3_activity}
                    label="rd4_3_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_3_score}
                    label="rd4_3_score"
                    list={scoreLabels}
                    isRequired={data.rd4_3_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 4 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd4_4_select}
                      onChange={(e) =>
                        setCheckboxValue("rd4_4_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายหลักเกณฑ์ที่เกี่ยวข้องกับระบบบริหารคุณภาพ เช่น GMP,
                      ISO หรือระบบอื่น ๆ ที่เกี่ยวข้องได้
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_4_activity}
                    label="rd4_4_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd4_4_score}
                    label="rd4_4_score"
                    list={scoreLabels}
                    isRequired={data.rd4_4_select}
                  />
                </td>
              </tr>
            </tbody>
            <tbody>
              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 4) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 4)
                </td>
                <td className="p-2 border align-top text-sm" colSpan={2}>
                  <input
                    type="number"
                    value={data.rd4_avg_score || ""}
                    readOnly
                    className="p-1 border rounded-md text-sm w-full text-center bg-gray-50"
                  />
                </td>
              </tr>
            </tbody>

            <tbody>
              <tr>
                {/* จุดมุ่งหมาย */}
                <td className="p-2 border align-top text-sm" rowSpan={6}>
                  5. กระบวนการขึ้นทะเบียนเครื่องสำอางและผลิตภัณฑ์สุขภาพ
                </td>

                {/* วัน */}
                <td className="p-2 border align-top text-sm" rowSpan={6}>
                  <input
                    type="number"
                    value={data.rd5_day || ""}
                    onChange={(e) => setDataValue("rd5_day", e.target.value)}
                    className={
                      "p-1 border rounded-md text-sm w-full text-center " +
                      (isSubmit && !data.rd5_day && " border-2 border-red-600")
                    }
                  />
                  วัน
                </td>

                {/* วัตถุประสงค์ 1 */}
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd5_1_select}
                      onChange={(e) =>
                        setCheckboxValue("rd5_1_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายสาระสําคัญของกฎ ระเบียบ
                      หรือขอบังคับที่เกี่ยวกับเครื่องสําอาง
                      และผลิตภัณฑสุขภาพ เชน
                      พระราชบัญญัติ กฎกระทรวง
                      ประกาศ คําสั่ง ระเบียบ ที่เกี่ยวของ
                      กับเครื่องสําอางและผลิตภัณฑ
                      สุขภาพ
                    </span>
                  </div>
                </td>

                {/* ปริมาณงาน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_1_activity}
                    label="rd5_1_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>

                {/* คะแนน */}
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_1_score}
                    label="rd5_1_score"
                    list={scoreLabels}
                    isRequired={data.rd5_1_select}
                  />
                </td>

                {/* หมายเหตุ */}
                <td className="p-2 border align-top text-sm" rowSpan={6}>
                  <Textarea
                    className="min-h-24 border-0 focus-visible:ring-0 resize-none text-sm"
                    onChange={(e) => setDataValue("rd5_note", e.target.value)}
                    rows={3 * 6}
                    value={data.rd5_note || ""}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 2 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd5_2_select}
                      onChange={(e) =>
                        setCheckboxValue("rd5_2_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายหลักเกณฑ์การขึ้นทะเบียนเครื่องสำอางและผลิตภัณฑ์สุขภาพภายในประเทศได้
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_2_activity}
                    label="rd5_2_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_2_score}
                    label="rd5_2_score"
                    list={scoreLabels}
                    isRequired={data.rd5_2_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 3 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd5_3_select}
                      onChange={(e) =>
                        setCheckboxValue("rd5_3_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายขั้นตอนการขึ้นทะเบียน
                      และการแก้ไขเปลี่ยนแปลงทะเบียนเครื่องสำอางและผลิตภัณฑ์สุขภาพได้
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_3_activity}
                    label="rd5_3_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_3_score}
                    label="rd5_3_score"
                    list={scoreLabels}
                    isRequired={data.rd5_3_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 4 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd5_4_select}
                      onChange={(e) =>
                        setCheckboxValue("rd5_4_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      อธิบายการจัดหมวดหมู่เอกสาร ตามข้อกำหนดของสำนักงานคณะกรรมการอาหารและยา รวมทั้งแบบคำขอ และการยื่นคำขอต่าง ๆ
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_4_activity}
                    label="rd5_4_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_4_score}
                    label="rd5_4_score"
                    list={scoreLabels}
                    isRequired={data.rd5_4_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 5 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd5_5_select}
                      onChange={(e) =>
                        setCheckboxValue("rd5_5_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      ค้นคว้าข้อมูลจากแหล่งข้อมูลต่าง ๆ
                      เพื่อประมวลข้อมูลด้านความปลอดภัย ประสิทธิผล และคุณภาพ
                      ของเครื่องสำอาง และผลิตภัณฑ์สุขภาพ
                      สำหรับการขึ้นทะเบียนเครื่องสำอางและผลิตภัณฑ์สุขภาพได้
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_5_activity}
                    label="rd5_5_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_5_score}
                    label="rd5_5_score"
                    list={scoreLabels}
                    isRequired={data.rd5_5_select}
                  />
                </td>
              </tr>

              {/* วัตถุประสงค์ 6 */}
              <tr>
                <td className="p-2 border align-top text-sm">
                  <div className="flex flex-row items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!data.rd5_6_select}
                      onChange={(e) =>
                        setCheckboxValue("rd5_6_select", e.target.checked)
                      }
                      className="mt-1"
                    />
                    <span>
                      จัดเตรียมเอกสารเพื่อขอขึ้นทะเบียนเครื่องสำอางและผลิตภัณฑ์สุขภาพ
                      ตามข้อกำหนดของสำนักงานคณะกรรมการอาหารและยา
                    </span>
                  </div>
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_6_activity}
                    label="rd5_6_activity"
                    list={activityLabels}
                    rows={true}
                    isRequired={true}
                  />
                </td>
                <td className="p-2 border align-top text-sm">
                  <ScoreForm
                    value={data.rd5_6_score}
                    label="rd5_6_score"
                    list={scoreLabels}
                    isRequired={data.rd5_6_select}
                  />
                </td>
              </tr>

              {/* คะแนนเฉลี่ย (จุดมุ่งหมาย 5) */}
              <tr>
                <td
                  className="p-2 border align-top text-sm font-bold text-right"
                  colSpan={4}
                >
                  คะแนนเฉลี่ย (จุดมุ่งหมาย 5)
                </td>
                <td className="p-2 border align-top text-sm" colSpan={2}>
                  <input
                    type="number"
                    value={data.rd5_avg_score || ""}
                    readOnly
                    className="p-1 border rounded-md text-sm w-full text-center bg-gray-50"
                  />
                </td>
              </tr>
            </tbody>
            {/* คะแนนรวม (จุดมุ่งหมาย 1-5) * 4 คะแนน */}
            <tr>
              <td
                className="p-2 border align-top text-sm font-bold text-right"
                colSpan={4}
              >
                คะแนนรวม (จุดมุ่งหมาย 1-5) * 4 คะแนน
              </td>
              <td className="p-2 border align-top text-sm" colSpan={2}>
                <input
                  type="number"
                  value={data.total_score_1_5 || ""}
                  readOnly
                  className="p-1 border rounded-md text-sm w-full text-center bg-gray-50"
                />
              </td>
            </tr>
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
