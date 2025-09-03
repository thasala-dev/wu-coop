import { Card, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

export default function Page(props: any) {
  const { id } = props;
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleCheckError = (field: string, value: any) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: "กรุณากรอกข้อมูล" }));
      return false;
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };
  const handleSubmitReport = async () => {
    const validations = [
      handleCheckError("address", formData.address),
      handleCheckError("street", formData.street),
      handleCheckError("subdistrict", formData.subdistrict),
      handleCheckError("district", formData.district),
      handleCheckError("province", formData.province),
      handleCheckError("pharmacist", formData.pharmacist),
      handleCheckError("email", formData.email),
      handleCheckError("phone", formData.phone),
    ];
    const isFormValid = validations.every(Boolean);
    if (!isFormValid) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่งรายงาน",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/advisor/visits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result: formData }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      const result = await response.json();
      if (result.success) {
        toast({
          title: "ส่งรายงานสำเร็จ",
          description: "รายงานการนิเทศถูกส่งเรียบร้อยแล้ว",
          variant: "success",
        });
        router.push("/advisor/visits");
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งรายงานได้",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  // ตัวเลือกคะแนน 4–0
const SCORE = [4, 3, 2, 1, 0] as const;

// เก็บ/อ่านคะแนนเป็น formData.ratings[key] (number)
const setRating = (key: string, value: number) =>
  setFormData((prev) => ({
    ...prev,
    ratings: { ...(prev.ratings || {}), [key]: value },
  }));

// แถวให้คะแนนแบบตาราง (ใช้ input radio ธรรมดา เพื่อไม่ต้อง import เพิ่ม)
const RatingRow = ({ label, name }: { label: string; name: string }) => (
  <tr>
    <td className="p-2 border text-sm">{label}</td>
    {SCORE.map((v) => (
      <td key={v} className="p-2 border text-center">
        <input
          type="radio"
          name={name}
          value={v}
          checked={(formData.ratings || {})[name] === v}
          onChange={() => setRating(name, v)}
          className="h-4 w-4"
        />
      </td>
    ))}
  </tr>
);


  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-4 space-y-6">
        <div> ส่วนที่ 1: ข้อมูลทั่วไปของแหล่งฝึก</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="col-span-4 space-y-1">1.1 ข้อมูลติดต่อ</div>
          <div className="space-y-1">
            <div>ที่อยู่เลขที่</div>
            <div>
              <Input
                placeholder="กรุณากรอกที่อยู่เลขที่"
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                value={formData.address || ""}
                className={errors.address && "border-2 border-red-600"}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div>ถนน</div>
            <div>
              <Input
                placeholder="กรุณากรอกชื่อถนน"
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                value={formData.street || ""}
                className={errors.street && "border-2 border-red-600"}
              />
            </div>
          </div>
          <div className="col-span-2 space-y-1">
            <div>ตำบล/แขวง</div>
            <div>
              <Input
                placeholder="กรุณากรอกชื่อตำบล/แขวง"
                onChange={(e) =>
                  setFormData({ ...formData, subdistrict: e.target.value })
                }
                value={formData.subdistrict || ""}
                className={errors.subdistrict && "border-2 border-red-600"}
              />
            </div>
          </div>
          <div className="col-span-2 space-y-1">
            <div>อำเภอ/เขต</div>
            <div>
              <Input
                placeholder="กรุณากรอกชื่ออำเภอ/เขต"
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                value={formData.district || ""}
                className={errors.district && "border-2 border-red-600"}
              />
            </div>
          </div>
          <div className="col-span-2 space-y-1">
            <div>จังหวัด</div>
            <div>
              <Input
                placeholder="กรุณากรอกชื่อจังหวัด"
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                value={formData.province || ""}
                className={errors.province && "border-2 border-red-600"}
              />
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <div>เภสัชกรผู้รับผิดชอบการฝึกปฏิบัติงาน</div>
            <div>
              <Input
                placeholder="กรุณากรอกชื่อเภสัชกร"
                onChange={(e) =>
                  setFormData({ ...formData, pharmacist: e.target.value })
                }
                value={formData.pharmacist || ""}
                className={errors.pharmacist && "border-2 border-red-600"}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div>E-mail</div>
            <div>
              <Input
                placeholder="กรุณากรอก E-mail"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                value={formData.email || ""}
                className={errors.email && "border-2 border-red-600"}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div>โทรศัพท์</div>
            <div>
              <Input
                placeholder="กรุณากรอกหมายเลขโทรศัพท์"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                value={formData.phone || ""}
                className={errors.phone && "border-2 border-red-600"}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="col-span-4 space-y-1">
            1.2. ประเภทของการฝึกปฏิบัติ
          </div>
          <div className="col-span-4 space-y-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "20%" }}
                    rowSpan={2}
                  >
                    ผลิตภัณฑ์
                  </th>
                  <th className="p-2 border text-center text-sm" colSpan={8}>
                    การฝึกปฏิบัติ
                  </th>
                </tr>
                <tr className="bg-slate-100">
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    ฝึกรวม
                  </th>
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    การผลิต
                  </th>
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    การควบคุม คุณภาพ / การประกัน คุณภาพ
                  </th>
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    การวิจัย และ พัฒนา
                  </th>
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    การขึ้น ทะเบียน
                  </th>
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    การ คุ้มครอง ผู้บริโภค
                  </th>
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    อื่น ๆ (ระบุ)
                  </th>
                  <th
                    className="p-2 border text-center text-sm"
                    style={{ width: "10%" }}
                  >
                    ไม่มีการ ฝึก ปฏิบัติ
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  "ยา",
                  "ชีววัตถุ",
                  "เครื่องสำอาง",
                  "สมุนไพร",
                  "อาหารและผลิตภัณฑ์เสริมอาหาร",
                ].map((product, index) => (
                  <tr key={index}>
                    <td className="p-2 border align-top text-sm">{product}</td>
                    {[...Array(8)].map((_, i) => (
                      <td
                        key={i}
                        className="p-2 border align-top text-sm text-center"
                      >
                        <Checkbox
                          checked={
                            formData.product?.[`${index + 1}_${i + 1}`] ===
                            `${index + 1}_${i + 1}`
                          }
                          onCheckedChange={(checked) => {
                            const key = `${index + 1}_${i + 1}`;
                            setFormData({
                              ...formData,
                              product: {
                                ...formData.product,
                                [key]: checked ? key : "",
                              },
                            });
                          }}
                          className="h-4 w-4"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="col-span-4 space-y-1">1.3. อื่น ๆ</div>

          <div className="text-sm">1) ที่พัก</div>
          <div className="text-sm flex flex-col gap-2 col-span-3">
            {[
              "ที่พักของแหล่งฝึก",
              "ที่พักเอกชนซึ่งแหล่งฝึกจัดหา/ติดต่อให้",
              "นิสิต/นักศึกษาจัดหาเอง",
              "บ้านตัวเอง/บ้านญาติ",
            ].map((acc, index) => (
              <div key={index} className="flex gap-2 ">
                <Checkbox
                  checked={formData.accommodation === index + 1}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      accommodation: checked ? index + 1 : 0,
                    });
                  }}
                  className="h-4 w-4"
                />
                <span>{acc}</span>
              </div>
            ))}
          </div>
        </div>
        {/* ===== 1.3 (ต่อ) สิ่งอำนวยความสะดวก/ความปลอดภัย ===== */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
  {/* 2) รถรับ/ส่ง */}
  <div className="text-sm">2) รถรับ/ส่ง</div>
  <div className="col-span-3 flex gap-4">
    {["ไม่มี", "มี"].map((w, i) => (
      <label key={w} className="flex items-center gap-2">
        <input
          type="radio"
          name="shuttle"
          className="h-4 w-4"
          checked={formData.shuttle === (i === 1 ? "มี" : "ไม่มี")}
          onChange={() =>
            setFormData({ ...formData, shuttle: i === 1 ? "มี" : "ไม่มี" })
          }
        />
        <span>{w}</span>
      </label>
    ))}
  </div>

  {/* 3) การเดินทาง */}
  <div className="text-sm">3) การเดินทาง</div>
  <div className="col-span-3 flex gap-4">
    {["ไม่สะดวก", "สะดวก"].map((w) => (
      <label key={w} className="flex items-center gap-2">
        <input
          type="radio"
          name="commute_easy"
          className="h-4 w-4"
          checked={formData.commute_easy === w}
          onChange={() => setFormData({ ...formData, commute_easy: w })}
        />
        <span>{w}</span>
      </label>
    ))}
  </div>

  {/* 4) ความปลอดภัย */}
  <div className="text-sm">4) ความปลอดภัย</div>
  <div className="col-span-3 flex gap-4">
    {["มาก", "ปานกลาง", "น้อย"].map((w) => (
      <label key={w} className="flex items-center gap-2">
        <input
          type="radio"
          name="safety_level"
          className="h-4 w-4"
          checked={formData.safety_level === w}
          onChange={() => setFormData({ ...formData, safety_level: w })}
        />
        <span>{w}</span>
      </label>
    ))}
  </div>

  {/* 5) ค่าที่พัก */}
  <div className="text-sm">5) ค่าที่พัก</div>
  <div className="col-span-3 flex flex-wrap items-center gap-2">
    {["ไม่มี", "มี"].map((w) => (
      <label key={w} className="flex items-center gap-2">
        <input
          type="radio"
          name="housing_fee_has"
          className="h-4 w-4"
          checked={formData.housing_fee_has === w}
          onChange={() => setFormData({ ...formData, housing_fee_has: w })}
        />
        <span>{w}</span>
      </label>
    ))}
    {formData.housing_fee_has === "มี" && (
      <>
        <span className="text-sm">เดือนละ</span>
        <Input
          className="w-36"
          placeholder="จำนวนบาท"
          value={formData.housing_fee_amt || ""}
          onChange={(e) =>
            setFormData({ ...formData, housing_fee_amt: e.target.value })
          }
        />
        <span className="text-sm">บาท</span>
      </>
    )}
  
  </div>

  {/* 6) ค่าเบี้ยเลี้ยงจากแหล่งฝึก */}
  <div className="text-sm">6) ค่าเบี้ยเลี้ยงจากแหล่งฝึก</div>
  <div className="col-span-3 flex flex-wrap items-center gap-2">
    {["ไม่มี", "มี"].map((w) => (
      <label key={w} className="flex items-center gap-2">
        <input
          type="radio"
          name="allowance_has"
          className="h-4 w-4"
          checked={formData.allowance_has === w}
          onChange={() => setFormData({ ...formData, allowance_has: w })}
        />
        <span>{w}</span>
      </label>
    ))}
    {formData.allowance_has === "มี" && (
      <>
        <Input
          className="w-36"
          placeholder="จำนวนบาท"
          value={formData.allowance_amt || ""}
          onChange={(e) =>
            setFormData({ ...formData, allowance_amt: e.target.value })
          }
        />
        <span className="text-sm">บาท/</span>
        <Input
          className="w-28"
          placeholder="ต่อวัน/เดือน"
          value={formData.allowance_per || ""}
          onChange={(e) =>
            setFormData({ ...formData, allowance_per: e.target.value })
          }
        />
      </>
    )}
  </div>

  {/* 7) Confidentiality Agreement */}
  <div className="text-sm">7) การลงนามในสัญญาห้ามเปิดเผยข้อมูล (Confidentiality Agreement)</div>
  <div className="col-span-3 flex gap-4">
    {["ไม่มี", "มี"].map((w) => (
      <label key={w} className="flex items-center gap-2">
        <input
          type="radio"
          name="conf_agree"
          className="h-4 w-4"
          checked={formData.conf_agree === w}
          onChange={() => setFormData({ ...formData, conf_agree: w })}
        />
        <span>{w}</span>
      </label>
    ))}
  </div>

  {/* 8) การนิเทศ/เข้าเยี่ยม */}
  <div className="text-sm">8) การนำเสนอการฝึกงาน</div>
  <div className="col-span-3 flex gap-4">
    {[
      { v: "ไม่มี", t: "ไม่มี" },
      { v: "มี_สะดวก", t: "มี และสะดวกให้อาจารย์เข้าฟังด้วย" },
      { v: "มี_ไม่สะดวก", t: "มี แต่ไม่สะดวกให้อาจารย์เข้าฟัง" },
    ].map(({ v, t }) => (
      <label key={v} className="flex items-center gap-2">
        <input
          type="radio"
          name="teacher_visit"
          className="h-4 w-4"
          checked={formData.teacher_visit === v}
          onChange={() => setFormData({ ...formData, teacher_visit: v })}
        />
        <span>{t}</span>
      </label>
    ))}
  </div>
</div>

{/* ===== ส่วนที่ 2: ข้อมูลจากนิสิต/นักศึกษา ===== */}
<div className="space-y-2 pt-6">
  <div className="font-medium">ส่วนที่ 2: ข้อมูลจากนิสิต/นักศึกษา</div>
  <div className="grid md:grid-cols-3 gap-2">
    <Input
      placeholder="ผลัดที่ ..."
      value={formData.stu_round || ""}
      onChange={(e) => setFormData({ ...formData, stu_round: e.target.value })}
    />
    <Input
      placeholder="มหาวิทยาลัย ..."
      value={formData.stu_uni || ""}
      onChange={(e) => setFormData({ ...formData, stu_uni: e.target.value })}
    />
    <Input
      placeholder="รวมจำนวนนิสิต/นักศึกษา (คน)"
      value={formData.stu_total || ""}
      onChange={(e) => setFormData({ ...formData, stu_total: e.target.value })}
    />
  </div>

  {/* 2.1 ตารางให้คะแนน */}
  <div className="border rounded-md overflow-hidden mt-2">
    <div className="p-2 bg-slate-100 font-medium">
      2.1 ความคิดเห็นของนิสิต/นักศึกษาก่อนแหล่งฝึก (ให้คะแนน 4–0)
    </div>
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="p-2 border text-left">รายละเอียด</th>
          {SCORE.map((s) => (
            <th key={s} className="p-2 border w-10 text-center">
              {s}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <RatingRow
          label="นิสิต/นักศึกษามีความพร้อมในการฝึกปฏิบัติงาน"
          name="s21_ready"
        />
        <RatingRow
          label="อาจารย์แหล่งฝึกใส่ใจดูแลการฝึกปฏิบัติงาน"
          name="s21_care"
        />
        <RatingRow
          label="แหล่งฝึกมีการวางแผนการฝึกปฏิบัติงานอย่างเป็นระบบ"
          name="s21_systematic"
        />
        <RatingRow
          label="แหล่งฝึกมีความหลากหลายของหน่วยงานที่เหมาะสมกับการฝึกปฏิบัติงาน"
          name="s21_variety"
        />
        <tr>
          <td className="p-2 border text-sm">
            จำนวนนิสิต/นักศึกษาที่ฝึกปฏิบัติงานในช่วงเดียวกัน
            <Input
              className="inline-block w-20 mx-2"
              placeholder="จำนวน"
              value={formData.student_count || ""}
              onChange={(e) => setFormData({ ...formData, student_count: e.target.value })}
            />
            คน/ผลัด
          </td>
          {SCORE.map((v) => (
            <td key={v} className="p-2 border text-center">
              <input
                type="radio"
                name="s21_student_count"
                value={v}
                checked={(formData.ratings || {})["s21_student_count"] === v}
                onChange={() => setRating("s21_student_count", v)}
                className="h-4 w-4"
              />
            </td>
          ))}
        </tr>
        <RatingRow
          label="จำนวนดังกล่าวเหมาะสมต่อการฝึกปฏิบัติงาน"
          name="s21_student_appropriate"
        />
        <tr>
          <td className="p-2 border text-sm">
            จำนวนอาจารย์ที่ดูแลการฝึกปฏิบัติงาน
            <Input
              className="inline-block w-20 mx-2"
              placeholder="จำนวน"
              value={formData.teacher_count || ""}
              onChange={(e) => setFormData({ ...formData, teacher_count: e.target.value })}
            />
            คน/ผลัด
          </td>
          {SCORE.map((v) => (
            <td key={v} className="p-2 border text-center">
              <input
                type="radio"
                name="s21_teacher_count"
                value={v}
                checked={(formData.ratings || {})["s21_teacher_count"] === v}
                onChange={() => setRating("s21_teacher_count", v)}
                className="h-4 w-4"
              />
            </td>
          ))}
        </tr>
        <RatingRow
          label="จำนวนดังกล่าวเหมาะสมต่อการฝึกปฏิบัติงาน"
          name="s21_teacher_appropriate"
        />
      </tbody>
    </table>
  </div>
</div>




{/* ===== ส่วนที่ 3: ข้อมูลจากอาจารย์ประจำแหล่งฝึก ===== */}
<div className="space-y-4 pt-6">
  <div className="font-medium">ส่วนที่ 3: ข้อมูลจากอาจารย์ประจำแหล่งฝึก</div>

  {/* 3.1.1 บุคลิกภาพ/ความประพฤติ */}
  <div className="border rounded-md overflow-hidden">
    <div className="p-2 bg-slate-100 font-medium">
      3.1.1 บุคลิกภาพและความประพฤติระหว่างการฝึก
    </div>
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="p-2 border text-left">รายละเอียด</th>
          {SCORE.map((s) => (
            <th key={s} className="p-2 border w-10 text-center">
              {s}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <RatingRow label="แต่งกายสุภาพ เรียบร้อย" name="s311_dress" />
        <RatingRow
          label="มีกิริยา พูดจาสุภาพ วางตัวเหมาะสม ถูกต้องตามกาลเทศะ"
          name="s311_manner"
        />
        <RatingRow
          label="ปฏิบัติตัวตามระเบียบ ข้อบังคับของแหล่งฝึก"
          name="s311_rules"
        />
        <RatingRow label="มีความตรงต่อเวลา" name="s311_punctual" />
        <RatingRow
          label="มีความนอบน้อม และมีสัมมาคารวะต่ออาจารย์แหล่งฝึก"
          name="s311_respect"
        />
        <RatingRow
          label="มีความรับผิดชอบต่องานที่ได้รับมอบหมาย"
          name="s311_responsible"
        />
        <RatingRow
          label="มีความกระตือรือร้นในการฝึกปฏิบัติงาน"
          name="s311_integrity"
        />
      </tbody>
    </table>
  </div>

  {/* 3.1.2 ความรู้/การเตรียมตัว */}
  <div className="border rounded-md overflow-hidden">
    <div className="p-2 bg-slate-100 font-medium">
      3.1.2 ความรู้และการเตรียมตัวก่อนรับการฝึก
    </div>
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="p-2 border text-left">รายละเอียด</th>
          {SCORE.map((s) => (
            <th key={s} className="p-2 border w-10 text-center">
              {s}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <RatingRow label="มีความรู้เพียงพอและเหมาะสม" name="s312_knowledge" />
        <RatingRow label="มีการเตรียมตัวก่อนการฝึกปฏิบัติงาน" name="s312_prepare" />
        <RatingRow label="มีความคิดเชิงวิเคราะห์และสังเคราะห์" name="s312_critical" />
        <RatingRow label="มีการเรียนรู้แบบ active learning" name="s312_active" />
        <RatingRow label="มีความสามารถในการประสานงาน และทำงานเป็นทีม" name="s312_team" />
        <RatingRow label="มีทักษะในการสื่อสาร และการใช้เทคโนโลยีสารสนเทศ" name="s312_it" />
        <RatingRow label="มีความสามารถในการใช้ภาษาอังกฤษ" name="s312_eng" />
      </tbody>
    </table>
  </div>

  {/* 3.2 กิจกรรม/ประเมินผล */}
  <div className="space-y-3">
    <div className="font-medium">3.2 กิจกรรมการฝึกปฏิบัติงานและการประเมินผล</div>

    <div>
      <div className="text-sm mb-1">
        3.2.1 กิจกรรมฝึกที่หน่วยงานให้กับนักศึกษา (สรุป)
      </div>
      <Textarea
        rows={4}
        value={formData.s321_text || ""}
        onChange={(e) =>
          setFormData({ ...formData, s321_text: e.target.value })
        }
      />
    </div>

    <div>
      <div className="text-sm mb-1">
        3.2.2 กิจกรรมที่ทำได้เทียบกับคู่มือการฝึก
      </div>
      <div className="flex flex-wrap gap-4">
        {[
          ["ฝึกได้ครบทุกหัวข้อในคู่มือ", "ครบ"],
          ["ฝึกน้อยกว่าที่ระบุในคู่มือ", "น้อยกว่า"],
          ["ฝึกมากกว่าที่ระบุในคู่มือ", "มากกว่า"],
        ].map(([t, v]) => (
          <label key={v} className="flex items-center gap-2">
            <input
              type="radio"
              name="s322_mode"
              className="h-4 w-4"
              checked={formData.s322_mode === v}
              onChange={() => setFormData({ ...formData, s322_mode: v })}
            />
            <span className="text-sm">{t}</span>
          </label>
        ))}
      </div>
      <Textarea
        rows={3}
        className="mt-2"
        placeholder="ข้อเสนอแนะ"
        value={formData.s322_note || ""}
        onChange={(e) =>
          setFormData({ ...formData, s322_note: e.target.value })
        }
      />
    </div>

    <div>
      <div className="text-sm mb-1">
        3.2.3 ระยะเวลาการฝึกที่เหมาะสม (ต่อประเภท)
      </div>
      <div className="flex flex-wrap gap-4">
        {[
          ["6 สัปดาห์", "6w"],
          ["12 สัปดาห์", "12w"],
          ["มากกว่า 12 สัปดาห์", "gt12w"],
        ].map(([t, v]) => (
          <label key={v} className="flex items-center gap-2">
            <input
              type="radio"
              name="s323_duration"
              className="h-4 w-4"
              checked={formData.s323_duration === v}
              onChange={() => setFormData({ ...formData, s323_duration: v })}
            />
            <span className="text-sm">{t}</span>
          </label>
        ))}
      </div>
      <Input
        className="mt-2"
        placeholder="ช่วงเวลาที่เหมาะสม"
        value={formData.s323_when || ""}
        onChange={(e) =>
          setFormData({ ...formData, s323_when: e.target.value })
        }
      />
      <Textarea
        rows={3}
        className="mt-2"
        placeholder="ข้อเสนอแนะเพิ่มเติม"
        value={formData.s323_note || ""}
        onChange={(e) =>
          setFormData({ ...formData, s323_note: e.target.value })
        }
      />
    </div>

    <div>
      <div className="text-sm mb-1">
        3.2.4 หัวข้อและรูปแบบการประเมินผลตามคู่มือเหมาะสมหรือไม่
      </div>
      <div className="flex gap-6">
        {["เหมาะสม", "ควรปรับปรุง"].map((w) => (
          <label key={w} className="flex items-center gap-2">
            <input
              type="radio"
              name="s324_fit"
              className="h-4 w-4"
              checked={formData.s324_fit === w}
              onChange={() => setFormData({ ...formData, s324_fit: w })}
            />
            <span className="text-sm">{w}</span>
          </label>
        ))}
      </div>
      <Textarea
        rows={3}
        className="mt-2"
        placeholder="ข้อเสนอแนะ"
        value={formData.s324_note || ""}
        onChange={(e) =>
          setFormData({ ...formData, s324_note: e.target.value })
        }
      />
    </div>
  </div>

  {/* 3.3 การประสานงานของคณะอนุกรรมการ ฯ */}
  <div className="space-y-3">
    <div className="font-medium">
      3.3 การประสานงานของคณะอนุกรรมการการฝึกปฏิบัติงานวิชาชีพสาย
      Pharmaceutical Sciences
    </div>

    {[
      ["c_survey", "การสำรวจการรับนิสิต/นักศึกษา"],
      ["c_brief", "การนัดหมายแหล่งฝึกและการชี้แจงรายละเอียดการฝึกปฏิบัติงานวิชาชีพ"],
      ["c_list", "การแจ้งรายชื่อนิสิต/นักศึกษาฝึกงาน (โดยผู้ประสานงานโซน)"],
      ["c_register", "การยืนยันการฝึกงานของนิสิต/นักศึกษาของแต่ละมหาวิทยาลัย"],
      ["c_travel", "การประสานงานทั่วไปเกี่ยวกับการเดินทางของนิสิต/นักศึกษา และที่พัก"],
      ["c_issue", "การประสานงานในกรณีที่เกิดปัญหาในระหว่างการฝึกปฏิบัติงาน"],
      ["c_comm", "การติดต่อนิเทศงาน/สรุปการฝึกปฏิบัติงาน"],
    ].map(([k, label]) => (
      <div key={k} className="grid md:grid-cols-5 gap-2 items-center">
        <div className="md:col-span-2 text-sm">{label}</div>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={k}
            className="h-4 w-4"
            checked={formData[k] === "เหมาะสม"}
            onChange={() => setFormData({ ...formData, [k]: "เหมาะสม" })}
          />
          <span className="text-sm">เหมาะสม</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={k}
            className="h-4 w-4"
            checked={formData[k] === "ควรปรับปรุง"}
            onChange={() => setFormData({ ...formData, [k]: "ควรปรับปรุง" })}
          />
          <span className="text-sm">ควรปรับปรุง</span>
        </label>
        <Input
          placeholder="หมายเหตุ/ข้อเสนอแนะ"
          value={formData[`${k}_note`] || ""}
          onChange={(e) =>
            setFormData({ ...formData, [`${k}_note`]: e.target.value })
          }
        />
      </div>
    ))}

    <div>
      <div className="text-sm mb-1">ข้อเสนอแนะอื่น ๆ</div>
      <Textarea
        rows={4}
        value={formData.c_other || ""}
        onChange={(e) => setFormData({ ...formData, c_other: e.target.value })}
      />
    </div>
  </div>
</div>

      </div>
      

      <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
        <Link href="/advisor/visits">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            ยกเลิก
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button
            onClick={handleSubmitReport}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                บันทึกและส่งรายงาน
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
