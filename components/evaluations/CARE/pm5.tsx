import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { use, useEffect, useState } from "react";
import { set } from "date-fns";

const toThaiNumber = (number: number) => {
  const thaiNumbers = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  return number
    .toString()
    .split("")
    .map((digit) => thaiNumbers[parseInt(digit, 10)])
    .join("");
};

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  const [data, setData] = useState({
    p1: parentForm.getValues("result.p1") || "",
    p2: parentForm.getValues("result.p2") || "",
    p3: parentForm.getValues("result.p3") || "",
    p3_1: parentForm.getValues("result.p3_1") || "",
    p3_2: parentForm.getValues("result.p3_2") || "",
    p3_3: parentForm.getValues("result.p3_3") || "",
  });

  useEffect(() => {
    let total3 = 0;
    if (data.p3_1) total3 += parseInt(data.p3_1, 10);
    if (data.p3_2) total3 += parseInt(data.p3_2, 10);
    if (data.p3_3) total3 += parseInt(data.p3_3, 10);

    setDataValue("p3", total3 > 0 ? total3.toString() : "");
  }, [data.p3_1, data.p3_2, data.p3_3]);

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
      <div className="sm:col-span-12 py-2">
        <p className="text-center text-md font-bold">แบบฟอร์มการประเมิน</p>
      </div>

      <div className="sm:col-span-12">
        <div className="border rounded-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th
                  className="p-2 border text-center text-sm"
                  style={{ width: "80%" }}
                >
                  หัวข้อการประเมิน
                </th>
                <th
                  className="=p-2 border text-center text-sm"
                  style={{ width: "20%" }}
                >
                  คะแนน
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-2 border align-top text-md">
                  1. พฤติกรรมและการปฏิบัติตนของนักศึกษา (10 คะแนน)
                </td>
                <td className="p-2 border align-top text-md">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={data.p1}
                    onChange={(value) => setDataValue("p1", value.target.value)}
                    placeholder="โปรดระบุ 0-10"
                    aria-invalid={isSubmit && !data.p1}
                    className={
                      "w-full p-1 border rounded-md text-sm text-center text-center " +
                      (isSubmit && !data.p1 ? "border-red-600  border-2" : "")
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-md">
                  2. ทักษะการเรียนรู้ด้วยตนเอง เช่น
                  การประเมินจากการทำแบบกิจกรรมในคู่มือ การส่งงานสม่ำเสมอ
                  ความกระตือรือร้นในการเรียนรู้ (20 คะแนน)
                </td>
                <td className="p-2 border align-top text-md">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={data.p2}
                    onChange={(value) => setDataValue("p2", value.target.value)}
                    placeholder="โปรดระบุ 0-20"
                    aria-invalid={isSubmit && !data.p2}
                    className={
                      "w-full p-1 border rounded-md text-sm text-center " +
                      (isSubmit && !data.p2 ? "border-red-600  border-2" : "")
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-md">
                  3. ความรู้และทักษะในการฝึกปฏิบัติงาน (70 คะแนน)
                </td>
                <td className="p-2 border align-top text-md text-center">
                  {data.p3 || ""}
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-md">
                  - ความรู้และทักษะการปฏิบัติงานระดับบุคคล (30)
                </td>
                <td className="p-2 border align-top text-md">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={data.p3_1}
                    onChange={(value) =>
                      setDataValue("p3_1", value.target.value)
                    }
                    placeholder="โปรดระบุ 0-30"
                    aria-invalid={isSubmit && !data.p3_1}
                    className={
                      "w-full p-1 border rounded-md text-sm text-center " +
                      (isSubmit && !data.p3_1 ? "border-red-600  border-2" : "")
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-md">
                  - ความรู้และทักษะการปฏิบัติงานระดับครอบครัว (20)
                </td>
                <td className="p-2 border align-top text-md">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={data.p3_2}
                    onChange={(value) =>
                      setDataValue("p3_2", value.target.value)
                    }
                    placeholder="โปรดระบุ 0-20"
                    aria-invalid={isSubmit && !data.p3_2}
                    className={
                      "w-full p-1 border rounded-md text-sm text-center " +
                      (isSubmit && !data.p3_2 ? "border-red-600  border-2" : "")
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-md">
                  - ความรู้และทักษะการปฏิบัติงานระดับชุมชน (20)
                </td>
                <td className="p-2 border align-top text-md">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={data.p3_3}
                    onChange={(value) =>
                      setDataValue("p3_3", value.target.value)
                    }
                    placeholder="โปรดระบุ 0-20"
                    aria-invalid={isSubmit && !data.p3_3}
                    className={
                      "w-full p-1 border rounded-md text-sm text-center " +
                      (isSubmit && !data.p3_3 ? "border-red-600  border-2" : "")
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border align-top text-md text-center">
                  คะแนนรวม 100 คะแนน
                </td>
                <td className="p-2 border align-top text-md text-center font-bold">
                  {Number(data.p1) + Number(data.p2) + Number(data.p3)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
