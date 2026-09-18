import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const activityData = [
  {
    no: "๑.",
    activity:
      "การเข้าร่วมทีมรักษาพยาบาลในการดูแลผู้ป่วย (patient care round or ward round)",
    criteria: "ตามแหล่งฝึกกำหนด",
    key: "activity_1_actual",
  },
  {
    no: "๒.",
    activity:
      "การจัดทำแฟ้มประวัติ สืบค้นปัญหา เสนอแนะแนวทาง แก้ไขปัญหาที่เกิดขึ้น และติดตามการใช้ยาของผู้ป่วย",
    criteria: "≥๓ ราย/วัน*",
    key: "activity_2_actual",
  },
  {
    no: "๓.",
    activity:
      "การให้คำแนะนำปรึกษาด้านยาและสุขภาพแก่ผู้ป่วย ญาติ หรือผู้เกี่ยวข้อง (ราย)",
    criteria: "≥๓ ราย/วัน",
    key: "activity_3_actual",
  },
  {
    no: "๔.",
    activity:
      "การอภิปรายร่วมกับอาจารย์ประจำแหล่งฝึกเกี่ยวกับการติดตามการใช้ยาในผู้ป่วยที่ได้รับมอบหมาย (case discussion)",
    criteria: "≥๓ ครั้ง/สัปดาห์**",
    key: "activity_4_actual",
  },
  {
    no: "๕.",
    activity: "การประเมินทักษะการดูแลผู้ป่วยโดยรวมในการฝึกปฏิบัติงาน",
    criteria: "-",
    key: "activity_5_actual",
  },
  {
    no: "๖.",
    activity: "การนำเสนอกรณีศึกษา (formal case presentation)",
    criteria: "≥๒ กรณีศึกษา",
    key: "activity_6_actual",
  },
  {
    no: "๗.",
    activity:
      "การบรรยายสอนแก่บุคลากรในโรงพยาบาลหรือนิสิต/นักศึกษา (academic in-service)",
    criteria: "≥๑ ครั้ง",
    key: "activity_7_actual",
  },
  {
    no: "๘.",
    activity: "การวิพากษ์วรรณกรรมปฐมภูมิ (journal club)",
    criteria: "≥๑ ครั้ง",
    key: "activity_8_actual",
  },
  {
    no: "๙.",
    activity: "กิจกรรมอื่น ๆ",
    criteria: "ตามที่แหล่งฝึกกำหนด",
    key: "activity_9_actual",
  },
];

const fieldLabels = {
  studentName: "ชื่อนิสิต/นักศึกษา",
  studentId: "รหัสประจำตัว",
  trainingSite: "แหล่งฝึก",
  startDate: "วันที่เริ่มฝึก",
  endDate: "วันที่สิ้นสุดฝึก",
  totalDays: "รวมวันฝึก",
};

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    studentName: parentForm.getValues("result.studentName") || "",
    studentId: parentForm.getValues("result.studentId") || "",
    trainingSite: parentForm.getValues("result.trainingSite") || "",
    startDate: parentForm.getValues("result.startDate") || "",
    endDate: parentForm.getValues("result.endDate") || "",
    totalDays: parentForm.getValues("result.totalDays") || "",
    activity_1_actual: parentForm.getValues("result.activity_1_actual") || "",
    activity_2_actual: parentForm.getValues("result.activity_2_actual") || "",
    activity_3_actual: parentForm.getValues("result.activity_3_actual") || "",
    activity_4_actual: parentForm.getValues("result.activity_4_actual") || "",
    activity_5_actual: parentForm.getValues("result.activity_5_actual") || "",
    activity_6_actual: parentForm.getValues("result.activity_6_actual") || "",
    activity_7_actual: parentForm.getValues("result.activity_7_actual") || "",
    activity_8_actual: parentForm.getValues("result.activity_8_actual") || "",
    activity_9_actual: parentForm.getValues("result.activity_9_actual") || "",
    suggestion: parentForm.getValues("result.suggestion") || "",
  });

  useEffect(() => {
    setFormValidated(handleCheckValid());
  }, [isSubmit, isClick, data]);

  const setDataValue = (key: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
    parentForm.setValue(`result.${key}`, value);
  };

  const handleCheckValid = () => {
    const optionalFields = ["suggestion"];

    return !Object.keys(data).some((key) => {
      if (optionalFields.includes(key)) {
        return false;
      }

      const value = data[key as keyof typeof data];
      return !value;
    });
  };

  const getInvalidClass = (key: keyof typeof data) => {
    return isSubmit && !data[key] ? " border-2 border-red-600" : "";
  };

  const renderRequiredMessage = (key: keyof typeof data, label: string) => {
    if (!isSubmit || data[key]) {
      return null;
    }

    return <p className="mt-1 text-xs text-red-600">กรุณากรอก{label}</p>;
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-12">
      <div className="sm:col-span-12">
        <div className="space-y-1 text-center">
          <p className="text-base font-bold">
            แบบบันทึกสรุปกิจกรรมการฝึกปฏิบัติงานการบริบาลทางเภสัชกรรม
          </p>
          <p className="text-base font-bold">ในผู้ป่วยโรคไต</p>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-8">
            <label className="mb-1 block text-sm font-medium">
              ชื่อนิสิต/นักศึกษา
            </label>
            <Input
              className={"text-sm" + getInvalidClass("studentName")}
              onChange={(e) => setDataValue("studentName", e.target.value)}
              value={data.studentName}
            />
            {renderRequiredMessage("studentName", fieldLabels.studentName)}
          </div>
          <div className="sm:col-span-4">
            <label className="mb-1 block text-sm font-medium">
              รหัสประจำตัว
            </label>
            <Input
              className={"text-sm" + getInvalidClass("studentId")}
              onChange={(e) => setDataValue("studentId", e.target.value)}
              value={data.studentId}
            />
            {renderRequiredMessage("studentId", fieldLabels.studentId)}
          </div>
          <div className="sm:col-span-5">
            <label className="mb-1 block text-sm font-medium">แหล่งฝึก</label>
            <Input
              className={"text-sm" + getInvalidClass("trainingSite")}
              onChange={(e) => setDataValue("trainingSite", e.target.value)}
              value={data.trainingSite}
            />
            {renderRequiredMessage("trainingSite", fieldLabels.trainingSite)}
          </div>
          <div className="sm:col-span-3">
            <label className="mb-1 block text-sm font-medium">
              ระหว่างวันที่
            </label>
            <Input
              className={"text-sm" + getInvalidClass("startDate")}
              onChange={(e) => setDataValue("startDate", e.target.value)}
              value={data.startDate}
            />
            {renderRequiredMessage("startDate", fieldLabels.startDate)}
          </div>
          <div className="sm:col-span-3">
            <label className="mb-1 block text-sm font-medium">ถึง</label>
            <Input
              className={"text-sm" + getInvalidClass("endDate")}
              onChange={(e) => setDataValue("endDate", e.target.value)}
              value={data.endDate}
            />
            {renderRequiredMessage("endDate", fieldLabels.endDate)}
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium">รวมวัน</label>
            <Input
              className={"text-sm" + getInvalidClass("totalDays")}
              onChange={(e) => setDataValue("totalDays", e.target.value)}
              value={data.totalDays}
            />
            {renderRequiredMessage("totalDays", fieldLabels.totalDays)}
          </div>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-16 border p-2 text-center text-sm">ลำดับ</th>
                <th className="border p-2 text-left text-sm">
                  กิจกรรมที่กำหนด
                </th>
                <th className="w-44 border p-2 text-center text-sm">เกณฑ์</th>
                <th className="w-64 border p-2 text-center text-sm">
                  ปฏิบัติจริง
                </th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((item) => {
                const key = item.key as keyof typeof data;

                return (
                  <tr key={item.key}>
                    <td className="border p-2 text-center text-sm align-top">
                      {item.no}
                    </td>
                    <td className="border p-2 text-sm align-top">
                      {item.activity}
                    </td>
                    <td className="border p-2 text-center text-sm align-top">
                      {item.criteria}
                    </td>
                    <td className="border p-2 align-top">
                      <Textarea
                        className={
                          "min-h-16 resize-none border-0 text-sm focus-visible:ring-0" +
                          getInvalidClass(key)
                        }
                        onChange={(e) => setDataValue(item.key, e.target.value)}
                        value={data[key]}
                      />
                      {renderRequiredMessage(key, "ปฏิบัติจริง")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-xs leading-6 sm:text-sm">
          <p className="font-semibold">หมายเหตุ:</p>
          <p>
            * การจัดกิจกรรมการฝึกปฏิบัติงานเป็นแนวทางสำหรับอาจารย์ประจำแหล่งฝึกซึ่งอาจปรับเปลี่ยนได้ตามสถานการณ์และความเหมาะสมของแหล่งฝึก
          </p>
          <p>
            ** รูปแบบของ case discussion
            เป็นการอภิปรายเกี่ยวกับความก้าวหน้าในแต่ละวันของผู้ป่วย ประกอบด้วย
          </p>
          <p>
            - การสรุปข้อมูลเกี่ยวกับประวัติ การสืบค้นปัญหา
            การเสนอแนะแนวทางแก้ไขปัญหาที่เกิดขึ้น
            และการติดตามการใช้ยาของผู้ป่วย
            โดยพยายามทำทุกกรณีศึกษาในแต่ละครั้งที่อภิปรายกับอาจารย์ประจำแหล่งฝึก
          </p>
          <p>
            - การนำเสนอข้อมูลที่ได้สืบค้นเพิ่มเติม
            ซึ่งเกี่ยวข้องกับปัญหาของผู้ป่วยจากแหล่งอ้างอิงที่เหมาะสม
          </p>
        </div>
      </div>

      <div className="sm:col-span-12">
        <div className="pt-2 pb-4">
          <h3 className="mb-3 text-sm font-semibold">
            ข้อเสนอแนะ/ความคิดเห็นเพิ่มเติม
          </h3>
          <Textarea
            placeholder="ข้อเสนอแนะ/ความคิดเห็นเพิ่มเติม"
            className="min-h-28 resize-none border text-sm focus-visible:ring-0"
            onChange={(e) => setDataValue("suggestion", e.target.value)}
            value={data.suggestion}
          />
        </div>
      </div>
    </div>
  );
}
