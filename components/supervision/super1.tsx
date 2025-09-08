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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

export default function Page(props: any) {
  type ProductFlags = {
    [key: string]: string;
  };

  type FormState = {
    // === ส่วนที่ 1
    siteName?: string;
    province?: string;
    fullname?: string;
    email?: string;
    phone?: string;

    // === ส่วนที่ 2
    uniSelected?: string[]; // รายชื่อมหาลัยที่ติ๊ก
    uniOther?: string;

    // === ส่วนที่ 3
    accommodation?: number; // 1..4
    safety_travel?: "มาก" | "ปานกลาง" | "น้อย" | "";
    safety_travel_note?: string;
    safety_env?: "มาก" | "ปานกลาง" | "น้อย" | "";
    safety_env_note?: string;

    // === ส่วนที่ 1.2 ในตัวอย่างเดิม (ตารางผลิตภัณฑ์)
    product?: ProductFlags;

    // === ส่วนที่ 4
    support_has?: "ไม่มี" | "มี" | "";
    support_count?: string;
    support_device?: string; // ชื่ออุปกรณ์
    support_detail?: string; // รายละเอียดเพิ่มเติม
    ref_foreign_drugHB?: boolean;
    ref_foreign_pharmacotherapy?: boolean;
    ref_foreign_other?: string;
    ref_thai?: string; // ช่องบันทึกตำราไทย/อื่น ๆ

    // === ส่วนที่ 5–7
    issues?: string;
    needsFromFaculty?: string;
    siteEvaluation_isSuitable?: boolean;
    siteEvaluation_other?: string;
    siteEvaluation_note?: string;

    // จากตัวอย่างก่อนหน้า (ที่อยู่ ฯลฯ) — ใส่มาให้ด้วยเผื่อใช้ต่อ
    address?: string;
    street?: string;
    subdistrict?: string;
    district?: string;
    pharmacist?: string;
  };

  const UNIVERSITIES = [
    "จุฬา",
    "มหิดล",
    "เชียงใหม่",
    "สงขลา",
    "ขอนแก่น",
    "ศิลปากร",
    "นเรศวร",
    "อุบลราชธานี",
    "ศรีนครินทรวิโรฒ",
    "มหาสารคาม",
    "รังสิต",
    "หัวเฉียวฯ",
    "สยาม",
    "พายัพ",
    "วลัยลักษณ์",
    "พะเยา",
    "อัสสัมชัญ",
  ] as const;

  const { id, data } = props;
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, any>>(
    data ? data : {}
  );

  const toggleUni = (uni: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        uniSelected: [...(prev.uniSelected || []), uni],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        uniSelected: (prev.uniSelected || []).filter((u: string) => u !== uni),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission if needed
  };

  const handleCheckError = (
    field: string,
    value: any,
    customMessage?: string
  ) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      setErrors((prev) => ({
        ...prev,
        [field]: customMessage || "กรุณากรอกข้อมูล",
      }));
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
      // ส่วนที่ 1: ข้อมูลทั่วไป
      handleCheckError("siteName", formData.siteName, "กรุณากรอกชื่อแหล่งฝึก"),
      handleCheckError("province", formData.province, "กรุณากรอกจังหวัด"),
      handleCheckError(
        "fullname",
        formData.fullname,
        "กรุณากรอกชื่อ-สกุล ผู้ติดต่อ"
      ),
      handleCheckError("email", formData.email, "กรุณากรอก E-mail"),
      handleCheckError("phone", formData.phone, "กรุณากรอกเบอร์โทรศัพท์"),

      // ส่วนที่ 2: ข้อมูลการฝึกของนิสิต (ต้องเลือกอย่างน้อย 1 มหาวิทยาลัย)
      handleCheckError(
        "uniSelected",
        formData.uniSelected,
        "กรุณาเลือกมหาวิทยาลัยอย่างน้อย 1 แห่ง"
      ),

      // ส่วนที่ 3: ความปลอดภัย
      handleCheckError(
        "accommodation",
        formData.accommodation,
        "กรุณาเลือกประเภทที่พัก"
      ),
      handleCheckError(
        "safety_travel",
        formData.safety_travel,
        "กรุณาประเมินความปลอดภัยของที่พักและการเดินทาง"
      ),
      handleCheckError(
        "safety_env",
        formData.safety_env,
        "กรุณาประเมินความปลอดภัยของสิ่งแวดล้อมโดยรอบ"
      ),

      // ส่วนที่ 4: สิ่งสนับสนุนพื้นฐาน
      handleCheckError(
        "support_has",
        formData.support_has,
        "กรุณาระบุว่ามีคอมพิวเตอร์/อุปกรณ์เกี่ยวข้องหรือไม่"
      ),

      // ส่วนที่ 5: ปัญหาและข้อเสนอแนะ
      handleCheckError(
        "issues",
        formData.issues,
        "กรุณากรอกปัญหาและข้อเสนอแนะเกี่ยวกับงาน/กิจกรรม"
      ),

      // ส่วนที่ 6: ความต้องการการสนับสนุน
      handleCheckError(
        "needsFromFaculty",
        formData.needsFromFaculty,
        "กรุณากรอกความต้องการการสนับสนุนจากคณะเภสัชศาสตร์"
      ),

      // ส่วนที่ 7: การประเมินแหล่งฝึก (ต้องมีการประเมิน)
      handleCheckError(
        "siteEvaluation",
        formData.siteEvaluation_isSuitable || formData.siteEvaluation_other,
        "กรุณาทำการประเมินแหล่งฝึก"
      ),
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

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <form onSubmit={handleSubmit} className="p-4 space-y-8">
        <h1 className="text-xl font-semibold">
          แบบนิเทศงานการฝึกปฏิบัติงานเชิงวิชาชีพ สาขาโรงพยาบาล
        </h1>

        {/* ===== ส่วนที่ 1: ข้อมูลทั่วไป ===== */}
        <section className="space-y-3">
          <div className="font-medium">ส่วนที่ 1: ข้อมูลทั่วไป</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 space-y-1">
              <Label>1) ชื่อแหล่งฝึก</Label>
              <Input
                placeholder="กรอกชื่อแหล่งฝึก"
                value={formData.siteName || ""}
                onChange={(e) => {
                  setFormData({ ...formData, siteName: e.target.value });
                  if (errors.siteName) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.siteName;
                      return newErrors;
                    });
                  }
                }}
                className={errors.siteName ? "border-2 border-red-600" : ""}
              />
              {errors.siteName && (
                <p className="text-red-600 text-sm mt-1">{errors.siteName}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>จังหวัด</Label>
              <Input
                placeholder="เช่น นครศรีธรรมราช"
                value={formData.province || ""}
                onChange={(e) => {
                  setFormData({ ...formData, province: e.target.value });
                  if (errors.province) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.province;
                      return newErrors;
                    });
                  }
                }}
                className={errors.province ? "border-2 border-red-600" : ""}
              />
              {errors.province && (
                <p className="text-red-600 text-sm mt-1">{errors.province}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>ชื่อ-สกุล ผู้ติดต่อ/ผู้รับผิดชอบ</Label>
              <Input
                placeholder="ชื่อ-สกุล"
                value={formData.fullname || ""}
                onChange={(e) => {
                  setFormData({ ...formData, fullname: e.target.value });
                  if (errors.fullname) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.fullname;
                      return newErrors;
                    });
                  }
                }}
                className={errors.fullname ? "border-2 border-red-600" : ""}
              />
              {errors.fullname && (
                <p className="text-red-600 text-sm mt-1">{errors.fullname}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input
                type="email"
                placeholder="example@domain.com"
                value={formData.email || ""}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.email;
                      return newErrors;
                    });
                  }
                }}
                className={errors.email ? "border-2 border-red-600" : ""}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>โทรศัพท์</Label>
              <Input
                placeholder="0xx-xxx-xxxx"
                value={formData.phone || ""}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.phone;
                      return newErrors;
                    });
                  }
                }}
                className={errors.phone ? "border-2 border-red-600" : ""}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </section>

        {/* ===== ส่วนที่ 2: ข้อมูลการฝึกของนิสิต/นักศึกษา ณ ปัจจุบัน ===== */}
        <section className="space-y-3">
          <div className="font-medium">
            ส่วนที่ 2: ข้อมูลการฝึกปฏิบัติงานที่เกี่ยวกับแหล่งฝึกในปัจจุบัน
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-2 p-3 rounded-md ${
              errors.uniSelected
                ? "border-2 border-red-600 bg-red-50"
                : "border border-gray-200"
            }`}
          >
            {UNIVERSITIES.map((u) => (
              <label key={u} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={!!formData.uniSelected?.includes(u)}
                  onCheckedChange={(c) => {
                    toggleUni(u, !!c);
                    if (errors.uniSelected) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.uniSelected;
                        return newErrors;
                      });
                    }
                  }}
                  className="h-4 w-4"
                />
                <span>{u}</span>
              </label>
            ))}
          </div>
          {errors.uniSelected && (
            <p className="text-red-600 text-sm mt-1">{errors.uniSelected}</p>
          )}
          <div className="md:w-1/2 space-y-1">
            <Label>อื่น ๆ (ระบุ)</Label>
            <Input
              placeholder="กรอกชื่อสถาบันอื่น ๆ"
              value={formData.uniOther || ""}
              onChange={(e) =>
                setFormData({ ...formData, uniOther: e.target.value })
              }
            />
          </div>
        </section>

        {/* ===== ส่วนที่ 3: ความปลอดภัย ===== */}
        <section className="space-y-3">
          <div className="font-medium">
            ส่วนที่ 3: ความปลอดภัยของสถานที่ในการฝึกปฏิบัติงาน
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-start">
            <div className="md:col-span-2">
              <Label>1) ที่พัก</Label>
            </div>
            <div className="md:col-span-4">
              <RadioGroup
                className={`space-y-2 p-3 rounded-md ${
                  errors.accommodation
                    ? "border-2 border-red-600 bg-red-50"
                    : ""
                }`}
                value={formData.accommodation?.toString() || ""}
                onValueChange={(v) => {
                  setFormData({ ...formData, accommodation: parseInt(v) });
                  if (errors.accommodation) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.accommodation;
                      return newErrors;
                    });
                  }
                }}
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="1" id="acc-1" />
                  <span>เป็นที่พักของโรงพยาบาล</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="2" id="acc-2" />
                  <span>เป็นที่พักของเอกชนที่แหล่งฝึกแนะนำ</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="3" id="acc-3" />
                  <span>นิสิต/นักศึกษาจัดหาเอง</span>
                </label>
              </RadioGroup>
              {errors.accommodation && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.accommodation}
                </p>
              )}
            </div>
          </div>

          {/* 3.2 ความปลอดภัยที่พักและการเดินทาง */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-start">
            <div className="md:col-span-2">
              <Label>2) ความปลอดภัยของที่พักและการเดินทาง</Label>
            </div>
            <div className="md:col-span-4">
              <RadioGroup
                className={`grid grid-cols-3 gap-2 p-3 rounded-md ${
                  errors.safety_travel
                    ? "border-2 border-red-600 bg-red-50"
                    : ""
                }`}
                value={formData.safety_travel || ""}
                onValueChange={(v) => {
                  setFormData({ ...formData, safety_travel: v as any });
                  if (errors.safety_travel) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.safety_travel;
                      return newErrors;
                    });
                  }
                }}
              >
                {["มาก", "ปานกลาง", "น้อย"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={v} id={`st-${v}`} />
                    <span>{v}</span>
                  </label>
                ))}
              </RadioGroup>
              {errors.safety_travel && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.safety_travel}
                </p>
              )}
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">
                  หมายเหตุ
                </Label>
                <Input
                  placeholder="ระบุเหตุผล/ข้อสังเกต"
                  value={formData.safety_travel_note || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      safety_travel_note: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 3.3 ความปลอดภัยสิ่งแวดล้อมโดยรอบ */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-start">
            <div className="md:col-span-2">
              <Label>3) ความปลอดภัยของสิ่งแวดล้อมโดยรอบ</Label>
            </div>
            <div className="md:col-span-4">
              <RadioGroup
                className={`grid grid-cols-3 gap-2 p-3 rounded-md ${
                  errors.safety_env ? "border-2 border-red-600 bg-red-50" : ""
                }`}
                value={formData.safety_env || ""}
                onValueChange={(v) => {
                  setFormData({ ...formData, safety_env: v as any });
                  if (errors.safety_env) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.safety_env;
                      return newErrors;
                    });
                  }
                }}
              >
                {["มาก", "ปานกลาง", "น้อย"].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={v} id={`se-${v}`} />
                    <span>{v}</span>
                  </label>
                ))}
              </RadioGroup>
              {errors.safety_env && (
                <p className="text-red-600 text-sm mt-1">{errors.safety_env}</p>
              )}
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">
                  หมายเหตุ
                </Label>
                <Input
                  placeholder="ระบุเหตุผล/ข้อสังเกต"
                  value={formData.safety_env_note || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      safety_env_note: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== ส่วนที่ 4: สิ่งสนับสนุนพื้นฐาน/ตำรา ===== */}
        <section className="space-y-3">
          <div className="font-medium">
            ส่วนที่ 4: สิ่งสนับสนุนพื้นฐานในการฝึกปฏิบัติงาน
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-4 items-center">
              <Label className="min-w-36">คอมพิวเตอร์/อุปกรณ์เกี่ยวข้อง</Label>
              <label className="flex items-center gap-2">
                <RadioGroup
                  className={`flex gap-4 p-2 rounded-md ${
                    errors.support_has
                      ? "border-2 border-red-600 bg-red-50"
                      : ""
                  }`}
                  value={formData.support_has || ""}
                  onValueChange={(v) => {
                    setFormData({ ...formData, support_has: v as any });
                    if (errors.support_has) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.support_has;
                        return newErrors;
                      });
                    }
                  }}
                >
                  <label className="flex items-center gap-2">
                    <RadioGroupItem value="ไม่มี" id="has0" />
                    <span>ไม่มี</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <RadioGroupItem value="มี" id="has1" />
                    <span>มี</span>
                  </label>
                </RadioGroup>
              </label>
              {formData.support_has === "มี" && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Label>จำนวน</Label>
                  <Input
                    className="w-24"
                    placeholder="เช่น 3"
                    value={formData.support_count || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        support_count: e.target.value,
                      })
                    }
                  />
                  <Label>เครื่อง / ชื่ออุปกรณ์</Label>
                  <Input
                    className="w-64"
                    placeholder="เช่น Wireless, Printer, ฯลฯ"
                    value={formData.support_device || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        support_device: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            {errors.support_has && (
              <p className="text-red-600 text-sm mt-1">{errors.support_has}</p>
            )}
            <Textarea
              placeholder="ระบุรายละเอียดเพิ่มเติม..."
              value={formData.support_detail || ""}
              onChange={(e) =>
                setFormData({ ...formData, support_detail: e.target.value })
              }
            />
          </div>

          {/* ตารางตำรา/ฐานข้อมูล */}
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-2 bg-slate-100 text-sm font-medium">
              <div className="p-2 border-r">ที่จำเป็น</div>
              <div className="p-2">เพิ่มเติม</div>
            </div>

            {/* ตำราต่างประเทศ */}
            <div className="grid grid-cols-2">
              <div className="p-3 border-r space-y-2">
                <div className="font-medium">ตำราต่างประเทศ</div>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={!!formData.ref_foreign_drugHB}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, ref_foreign_drugHB: !!c })
                    }
                  />
                  <span>Drug information handbook</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={!!formData.ref_foreign_pharmacotherapy}
                    onCheckedChange={(c) =>
                      setFormData({
                        ...formData,
                        ref_foreign_pharmacotherapy: !!c,
                      })
                    }
                  />
                  <span>Pharmacotherapy</span>
                </label>
                <div className="space-y-1">
                  <Label className="text-sm">อื่น ๆ (ระบุ)</Label>
                  <Input
                    placeholder="พิมพ์ชื่อหนังสือ/ฐานข้อมูล"
                    value={formData.ref_foreign_other || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ref_foreign_other: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="p-3">
                <Label className="text-sm">เพิ่มเติม</Label>
                <Textarea
                  placeholder="เช่น e-book/ฐานข้อมูล electronic ที่ใช้"
                  value={formData.ref_thai || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ref_thai: e.target.value })
                  }
                />
              </div>
            </div>

            {/* ตำราไทย */}
            <div className="grid grid-cols-2 border-t">
              <div className="p-3 border-r space-y-2">
                <div className="font-medium">ตำรา bahasa ไทย</div>
                <p className="text-xs text-muted-foreground">
                  ระบุชื่อหนังสือ/แหล่งข้อมูลที่ใช้ (ถ้ามี)
                </p>
                <Textarea
                  placeholder="ตำรา..."
                  value={formData.support_detail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, support_detail: e.target.value })
                  }
                />
              </div>
              <div className="p-3">
                <Textarea
                  placeholder="เพิ่มเติม (ตำราไทย/e-book/ฐานข้อมูล)"
                  value={formData.ref_thai || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ref_thai: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== ส่วนที่ 5–6 ข้อเสนอแนะ/ความต้องการ ===== */}
        <section className="space-y-3">
          <div className="font-medium">
            ส่วนที่ 5: ปัญหาข้อเสนอแนะเกี่ยวกับงาน/กิจกรรมและการฝึกปฏิบัติงาน
          </div>
          <Textarea
            rows={5}
            placeholder="พิมพ์รายละเอียด…"
            value={formData.issues || ""}
            onChange={(e) => {
              setFormData({ ...formData, issues: e.target.value });
              if (errors.issues) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.issues;
                  return newErrors;
                });
              }
            }}
            className={errors.issues ? "border-2 border-red-600" : ""}
          />
          {errors.issues && (
            <p className="text-red-600 text-sm mt-1">{errors.issues}</p>
          )}

          <div className="font-medium">
            ส่วนที่ 6: ความต้องการการสนับสนุนจากคณะเภสัชศาสตร์
          </div>
          <Textarea
            rows={5}
            placeholder="ระบุสิ่งที่ต้องการสนับสนุน…"
            value={formData.needsFromFaculty || ""}
            onChange={(e) => {
              setFormData({ ...formData, needsFromFaculty: e.target.value });
              if (errors.needsFromFaculty) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.needsFromFaculty;
                  return newErrors;
                });
              }
            }}
            className={errors.needsFromFaculty ? "border-2 border-red-600" : ""}
          />
          {errors.needsFromFaculty && (
            <p className="text-red-600 text-sm mt-1">
              {errors.needsFromFaculty}
            </p>
          )}
        </section>

        {/* ===== ส่วนที่ 7 การประเมินแหล่งฝึก โดยอาจารย์นิเทศ ===== */}
        <section className="space-y-3">
          <div className="font-medium">
            ส่วนที่ 7: การประเมินแหล่งฝึก โดยอาจารย์นิเทศ
          </div>
          <div
            className={`space-y-2 p-3 rounded-md ${
              errors.siteEvaluation
                ? "border-2 border-red-600 bg-red-50"
                : "border border-gray-200"
            }`}
          >
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={!!formData.siteEvaluation_isSuitable}
                onCheckedChange={(c) => {
                  setFormData({ ...formData, siteEvaluation_isSuitable: !!c });
                  if (errors.siteEvaluation) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.siteEvaluation;
                      return newErrors;
                    });
                  }
                }}
              />
              <span>
                เป็นแหล่งฝึกที่เหมาะสมสำหรับนิสิต/นักศึกษาสาขาเภสัชกรรมโรงพยาบาล
              </span>
            </label>
            <div className="flex items-start gap-2">
              <Checkbox
                checked={!!formData.siteEvaluation_other}
                onCheckedChange={(c) => {
                  if (!c) {
                    setFormData({ ...formData, siteEvaluation_other: "" });
                  } else {
                    setFormData({
                      ...formData,
                      siteEvaluation_other: formData.siteEvaluation_other || "",
                    });
                  }
                  if (errors.siteEvaluation) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.siteEvaluation;
                      return newErrors;
                    });
                  }
                }}
              />
              <div className="grow">
                <Label className="text-sm">อื่น ๆ โปรดระบุ</Label>
                <Input
                  placeholder="ระบุข้อความ"
                  value={formData.siteEvaluation_other || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      siteEvaluation_other: e.target.value,
                    });
                    if (errors.siteEvaluation) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.siteEvaluation;
                        return newErrors;
                      });
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm">หมายเหตุ</Label>
              <Textarea
                rows={4}
                placeholder="บันทึกหมายเหตุเพิ่มเติม"
                value={formData.siteEvaluation_note || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    siteEvaluation_note: e.target.value,
                  })
                }
              />
            </div>
          </div>
          {errors.siteEvaluation && (
            <p className="text-red-600 text-sm mt-1">{errors.siteEvaluation}</p>
          )}
        </section>
      </form>

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
