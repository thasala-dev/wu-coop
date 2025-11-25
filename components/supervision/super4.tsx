import { Card, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircleIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/** ---------- Types ---------- */
type Level = "มาก" | "ปานกลาง" | "น้อย" | "";
type YesNo = "เหมาะสม" | "ควรปรับปรุง" | "";
type Problem = { none?: boolean; has?: boolean; note?: string };

type FormState = {
  // 1) ข้อมูลทั่วไปของนักศึกษาและแหล่งฝึก
  siteName?: string;
  visitDate?: string;
  visitRound?: string;
  responsiblePharmacist?: string;
  students?: string[]; // 1..4

  // 2) สรุปผลจากการนิเทศ
  summary?: string;

  // 3.1 ข้อมูลแหล่งฝึก
  siteInfo?: {
    everAccepted?: boolean;
    neverAccepted?: boolean;
    hasOtherUniWithDorm?: boolean;
    hasOtherUniWithoutDorm?: boolean;
    otherUniDesc?: string; // ระบุ (รพช./จำนวน/ชั้นปี/สถาบัน)
    supervisionResult?: string; // ผลการติดตาม/นิเทศ
  };

  // 3.2 ที่พัก (รายละเอียดการเดินทาง/ความปลอดภัย)
  housing?: {
    workplaceDorm?: boolean; // ที่พักที่ทำงานจัดให้
    privateDorm?: boolean; // เอกชนที่แหล่งฝึกแนะนำ
    houseOrRelative?: boolean;
    other?: boolean;
    note?: string;
    supervisionResult?: string; // ผลการติดตาม/นิเทศ
  };

  // 3.3 การประสานงาน มหาวิทยาลัย ↔ แหล่งฝึก
  coordination?: {
    contactPersonProvided?: boolean;
    needMoreDocs?: boolean;
    viaMobile?: boolean;
    viaLandlineOrProject?: boolean;
    viaEmailOrSocial?: boolean;
    contactDetailJudge?: YesNo;
    contactDetailNote?: string;
    supervisionResult?: string; // ผลการติดตาม/นิเทศ
  };

  // 3.4 ระบบ/ความพร้อมในการฝึก (แหล่งฝึก & นักศึกษา)
  readiness?: {
    workloadFit?: Level; // 3.4.1
    workloadNote?: string;
    // 3.4.2 ความพร้อมของนักศึกษา (ตามประเด็นของอาจารย์)
    studentPersonality?: boolean;
    studentEthics?: boolean;
    studentAcademic?: boolean;
    studentResponsibility?: boolean;
    studentDiscipline?: boolean;
    studentTeamwork?: boolean;
    studentOther?: string;
    supervisionResult?: string; // ผลการติดตาม/นิเทศ
  };

  // 3.5 สิ่งที่ต้องการสนับสนุนจากมหาวิทยาลัย
  supportNeeds?: {
    books?: boolean;
    conferences?: boolean;
    trainingOrStudyVisit?: boolean;
    other?: string;
    detail?: string;
    supervisionResult?: string; // ผลการติดตาม/นิเทศ
  };

  // 3.6 ปัญหา/อุปสรรคของการฝึก
  obstacles?: {
    none?: boolean;
    has?: boolean;
    note?: string;
    supervisionResult?: string; // ผลการติดตาม/นิเทศ
  };

  // 3.7 ประเด็นอื่น ๆ
  otherTopics?: string;

  // 3.8 สรุปผลโดยรวม
  overall?: {
    shouldContinue?: boolean; // ควรเป็นแหล่งฝึกในปีต่อไป
    shouldContinueText?: string; // เนื่องจาก (สำหรับ shouldContinue)
    shouldImprove?: boolean; // ควรพัฒนาแหล่งฝึก
    shouldNotUse?: boolean; // ไม่ควรใช้แหล่งฝึก
    shouldImproveText?: string; // ควรพัฒนาแหล่งฝึกด้านนี้
    shouldNotUseText?: string; // ไม่ควรใช้แหล่งฝึก เนื่องจาก
    futurePlan?: string; // การพัฒนา/ปรับปรุงแผนการนิเทศในอนาคต
  };
};

export default function Page(props: any) {
  const { id, data } = props;
  const router = useRouter();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>(
    data
      ? data
      : {
          students: ["", "", "", ""],
          siteInfo: {},
          housing: {},
          coordination: { contactDetailJudge: "" },
          readiness: { workloadFit: "" },
          supportNeeds: {},
          obstacles: {},
          overall: {},
        }
  );

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setDeep = (path: string, v: any) => {
    setForm((p) => {
      const parts = path.split(".");
      const o: any = { ...p };
      let cur = o;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...(cur[parts[i]] || {}) };
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = v;
      return o;
    });
  };

  const handleCheckError = (field: string, value: any) => {
    if (!value) {
      let errorMessage = "กรุณากรอกข้อมูล";
      switch (field) {
        case "siteName":
          errorMessage = "กรุณากรอกชื่อแหล่งฝึก";
          break;
        case "visitDate":
          errorMessage = "กรุณาเลือกวันที่นิเทศ";
          break;
        case "visitRound":
          errorMessage = "กรุณากรอกครั้งที่นิเทศ";
          break;
        case "students":
          errorMessage = "กรุณากรอกชื่อ-สกุลนักศึกษาอย่างน้อย 1 คน";
          break;
        case "summary":
          errorMessage = "กรุณากรอกสรุปผลจากการนิเทศ";
          break;
        case "siteInfo.supervisionResult":
          errorMessage = "กรุณากรอกผลการติดตาม/นิเทศ ส่วนข้อมูลแหล่งฝึก";
          break;
        case "housing.supervisionResult":
          errorMessage = "กรุณากรอกผลการติดตาม/นิเทศ ส่วนที่พัก";
          break;
        case "coordination.supervisionResult":
          errorMessage = "กรุณากรอกผลการติดตาม/นิเทศ ส่วนการประสานงาน";
          break;
        case "readiness.supervisionResult":
          errorMessage = "กรุณากรอกผลการติดตาม/นิเทศ ส่วนความพร้อม";
          break;
        case "supportNeeds.supervisionResult":
          errorMessage = "กรุณากรอกผลการติดตาม/นิเทศ ส่วนการสนับสนุน";
          break;
        case "obstacles.supervisionResult":
          errorMessage = "กรุณากรอกผลการติดตาม/นิเทศ ส่วนปัญหา/อุปสรรค";
          break;
        case "overall.futurePlan":
          errorMessage = "กรุณากรอกแผนการพัฒนา/ปรับปรุงการนิเทศในอนาคต";
          break;
        case "coordination.contactDetailJudge":
          errorMessage = "กรุณาเลือกการประเมินรายละเอียดการติดต่อ";
          break;
        case "readiness.workloadFit":
          errorMessage = "กรุณาเลือกระดับภาระงานที่เหมาะสม";
          break;
      }
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
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

  const requireField = (k: keyof FormState, ok: boolean) => {
    setErrors((e) => {
      const n = { ...e };
      if (!ok) n[String(k)] = "กรอกข้อมูลให้ครบ";
      else delete n[String(k)];
      return n;
    });
    return ok;
  };

  const onSubmit = async () => {
    const validations = [
      handleCheckError("siteName", form.siteName),
      handleCheckError("visitDate", form.visitDate),
      handleCheckError("visitRound", form.visitRound),
      handleCheckError("summary", form.summary),
      handleCheckError(
        "students",
        form.students?.some((s) => s?.trim())
      ),
      handleCheckError(
        "siteInfo.supervisionResult",
        form.siteInfo?.supervisionResult
      ),
      handleCheckError(
        "housing.supervisionResult",
        form.housing?.supervisionResult
      ),
      handleCheckError(
        "coordination.supervisionResult",
        form.coordination?.supervisionResult
      ),
      handleCheckError(
        "readiness.supervisionResult",
        form.readiness?.supervisionResult
      ),
      handleCheckError(
        "supportNeeds.supervisionResult",
        form.supportNeeds?.supervisionResult
      ),
      handleCheckError(
        "obstacles.supervisionResult",
        form.obstacles?.supervisionResult
      ),
      handleCheckError("overall.futurePlan", form.overall?.futurePlan),
      handleCheckError(
        "coordination.contactDetailJudge",
        form.coordination?.contactDetailJudge
      ),
      handleCheckError("readiness.workloadFit", form.readiness?.workloadFit),
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
      const res = await fetch(`/api/advisor/visits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: form }),
      });
      if (!res.ok) throw new Error();
      const j = await res.json();
      if (!j.success) throw new Error();
      toast({ title: "บันทึกสำเร็จ", variant: "success" });
      router.push("/advisor/visits");
    } catch {
      toast({
        title: "ส่งไม่สำเร็จ",
        description: "ลองใหม่",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <div className="p-4 space-y-8">
        <h1 className="text-xl font-semibold">
          แบบนิเทศงาน การฝึกปฏิบัติงานวิชาชีพ งานคุ้มครองผู้บริโภค ปีการศึกษา
          2568
        </h1>

        {/* -------- 1) ข้อมูลทั่วไป -------- */}
        <section className="space-y-3">
          <div className="font-medium">
            1) ข้อมูลทั่วไปของนักศึกษา และแหล่งฝึก
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2 space-y-1">
              <Label>ชื่อแหล่งฝึก</Label>
              <Input
                value={form.siteName || ""}
                onChange={(e) => {
                  setField("siteName", e.target.value);
                  if (errors.siteName) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.siteName;
                      return newErrors;
                    });
                  }
                }}
                className={errors.siteName ? "border-2 border-red-600" : ""}
                placeholder="เช่น โรงพยาบาล/หน่วยงาน"
              />
              {errors.siteName && (
                <p className="text-red-600 text-sm mt-1">{errors.siteName}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>วันที่นิเทศ</Label>
              <Input
                type="date"
                value={form.visitDate || ""}
                onChange={(e) => {
                  setField("visitDate", e.target.value);
                  if (errors.visitDate) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.visitDate;
                      return newErrors;
                    });
                  }
                }}
                className={errors.visitDate ? "border-2 border-red-600" : ""}
              />
              {errors.visitDate && (
                <p className="text-red-600 text-sm mt-1">{errors.visitDate}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>ครั้งที่</Label>
              <Input
                value={form.visitRound || ""}
                onChange={(e) => {
                  setField("visitRound", e.target.value);
                  if (errors.visitRound) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.visitRound;
                      return newErrors;
                    });
                  }
                }}
                className={errors.visitRound ? "border-2 border-red-600" : ""}
                placeholder="เช่น 1"
              />
              {errors.visitRound && (
                <p className="text-red-600 text-sm mt-1">{errors.visitRound}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label>ชื่อ-สกุลนักศึกษา</Label>
            <div className="grid md:grid-cols-2 gap-2 mt-1">
              {form.students?.map((v, i) => (
                <Input
                  key={i}
                  placeholder={`${i + 1}. ชื่อ-สกุล`}
                  value={v}
                  onChange={(e) => {
                    setField(
                      "students",
                      (form.students || []).map((s, idx) =>
                        idx === i ? e.target.value : s
                      )
                    );
                    if (errors.students) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.students;
                        return newErrors;
                      });
                    }
                  }}
                  className={errors.students ? "border-2 border-red-600" : ""}
                />
              ))}
            </div>
            {errors.students && (
              <p className="text-red-600 text-sm mt-1">{errors.students}</p>
            )}
          </div>
        </section>
        <div className="space-y-1">
          <Label>เภสัชกรผู้รับผิดชอบการฝึกปฏิบัติงาน</Label>
          <Input
            value={form.responsiblePharmacist || ""}
            onChange={(e) => setField("responsiblePharmacist", e.target.value)}
            className={errors.responsiblePharmacist ? "border-2 border-red-600" : ""}
            placeholder="ชื่อเภสัชกร"
          />
          {errors.responsiblePharmacist && (
            <p className="text-red-600 text-sm mt-1">{errors.responsiblePharmacist}</p>
          )}
        </div>
        

        {/* -------- 2) สรุปผลจากการนิเทศ -------- */}
        <section className="space-y-2">
          <div className="font-medium">
            2) สรุปผลจากการนิเทศ (จุดเด่น/สิ่งที่ควรปรับปรุง
            ทั้งในแหล่งฝึกและในนักศึกษา)
          </div>
          <div className="space-y-1">
            <Textarea
              rows={8}
              value={form.summary || ""}
              onChange={(e) => {
                setField("summary", e.target.value);
                if (errors.summary) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.summary;
                    return newErrors;
                  });
                }
              }}
              className={errors.summary ? "border-2 border-red-600" : ""}
              placeholder="พิมพ์สรุปภาพรวม…"
            />
            {errors.summary && (
              <p className="text-red-600 text-sm mt-1">{errors.summary}</p>
            )}
          </div>
        </section>

        {/* -------- 3) ข้อมูลเกี่ยวกับแหล่งฝึกและการฝึกปฏิบัติงาน -------- */}
        <section className="space-y-4">
          <div className="font-medium">
            3) ข้อมูลเกี่ยวกับแหล่งฝึกและการฝึกปฏิบัติงาน
          </div>

          {/* 3.1 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.1 ข้อมูลแหล่งฝึก
            </div>
            <div className="p-3 grid md:grid-cols-2 gap-2">
              {[
                ["everAccepted", "เคยรับนักศึกษาฝึกงาน"],
                ["neverAccepted", "ไม่เคยรับนักศึกษาฝึกงาน"],
                [
                  "hasOtherUniWithDorm",
                  "มีนักศึกษาจากสถาบันอื่นร่วมฝึก พร้อมกับนักศึกษาจาก มวล. (ระบุ จำนวน/ชั้นปี/สถาบัน)",
                ],
                [
                  "hasOtherUniWithoutDorm",
                  "ไม่มีนักศึกษาจากสถาบันอื่นร่วมฝึก พร้อมกับนักศึกษาจาก มวล.",
                ],
              ].map(([k, label]) => (
                <label key={k} className="flex items-start gap-2">
                  <Checkbox
                    checked={(form.siteInfo as any)?.[k]}
                    onCheckedChange={(c) => setDeep(`siteInfo.${k}`, !!c)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
            <div className="p-3 pt-0">
              <Input
                placeholder="ระบุ จำนวน/ชั้นปี/สถาบัน (ถ้ามี)"
                value={form.siteInfo?.otherUniDesc || ""}
                onChange={(e) =>
                  setDeep("siteInfo.otherUniDesc", e.target.value)
                }
              />
            </div>
            <div className="p-3 pt-0 border-t">
              <Label className="text-sm font-medium">
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด) *
              </Label>
              <Textarea
                className={`mt-2 ${
                  errors["siteInfo.supervisionResult"]
                    ? "border-2 border-red-600"
                    : ""
                }`}
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.siteInfo?.supervisionResult || ""}
                onChange={(e) => {
                  setDeep("siteInfo.supervisionResult", e.target.value);
                  if (errors["siteInfo.supervisionResult"]) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["siteInfo.supervisionResult"];
                      return newErrors;
                    });
                  }
                }}
              />
              {errors["siteInfo.supervisionResult"] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors["siteInfo.supervisionResult"]}
                </p>
              )}
            </div>
          </div>

          {/* 3.2 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.2 ที่พัก (ระบุรายละเอียดเกี่ยวกับการเดินทาง ความปลอดภัย)
            </div>
            <div className="p-3 grid md:grid-cols-2 gap-2">
              {[
                ["workplaceDorm", "ที่พักที่ทำงานจัดให้"],
                ["houseOrRelative", "บ้านพัก/บ้านญาติ"],
                ["privateDorm", "ที่พักเอกชน"],
                ["other", "ที่พักอื่นๆ"],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2">
                  <Checkbox
                    checked={(form.housing as any)?.[k]}
                    onCheckedChange={(c) => setDeep(`housing.${k}`, !!c)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
            <div className="p-3 pt-0">
              <Textarea
                rows={3}
                placeholder="รายละเอียดการเดินทาง/ความปลอดภัย"
                value={form.housing?.note || ""}
                onChange={(e) => setDeep("housing.note", e.target.value)}
              />
            </div>
            <div className="p-3 pt-0 border-t">
              <Label className="text-sm font-medium">
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด) *
              </Label>
              <Textarea
                className={`mt-2 ${
                  errors["housing.supervisionResult"]
                    ? "border-2 border-red-600"
                    : ""
                }`}
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.housing?.supervisionResult || ""}
                onChange={(e) => {
                  setDeep("housing.supervisionResult", e.target.value);
                  if (errors["housing.supervisionResult"]) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["housing.supervisionResult"];
                      return newErrors;
                    });
                  }
                }}
              />
              {errors["housing.supervisionResult"] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors["housing.supervisionResult"]}
                </p>
              )}
            </div>
          </div>

          {/* 3.3 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.3 การประสานงานระหว่างมหาวิทยาลัยกับแหล่งฝึก (ระบุข้อเสนอแนะเกี่ยวกับการติดต่อประสานงาน ระบุรายละเอียด)
            </div>
            <div className="p-3 grid md:grid-cols-2 gap-2">
              {[
                ["contactPersonProvided", "แหล่งฝึกได้รับเอกสารครบถ้วน"],
                ["needMoreDocs", "ต้องส่งเอกสารเพิ่มเติม"],
                ["viaMobile", "สะดวกให้ติดต่อผ่านทางโทรศัพท์มือถือ"],
                ["viaLandlineOrProject", "สะดวกให้ติดต่อผ่านทาง โทรสาร"],
                ["viaEmailOrSocial","สะดวกให้ติดต่อผ่านทาง e-mail หรือ socialnetwork อื่นๆ",
                ],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2">
                  <Checkbox
                    checked={(form.coordination as any)?.[k]}
                    onCheckedChange={(c) => setDeep(`coordination.${k}`, !!c)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
            <div className="p-3">
              <Label className="text-sm">
                รายละเอียดหรือเนื้อหาในคู่มือฝึกปฏิบัติงาน *
              </Label>
              <RadioGroup
                className="flex gap-6 mt-1"
                value={form.coordination?.contactDetailJudge || ""}
                onValueChange={(v) => {
                  setDeep("coordination.contactDetailJudge", v as YesNo);
                  if (errors["coordination.contactDetailJudge"]) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["coordination.contactDetailJudge"];
                      return newErrors;
                    });
                  }
                }}
              >
                {(["เหมาะสม", "ควรปรับปรุง (ระบุรายละเอียด)"] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem
                      value={v}
                      className={
                        errors["coordination.contactDetailJudge"]
                          ? "border-red-600"
                          : ""
                      }
                    />
                    <span>{v}</span>
                  </label>
                ))}
              </RadioGroup>
              {errors["coordination.contactDetailJudge"] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors["coordination.contactDetailJudge"]}
                </p>
              )}
              <Input
                className="mt-2"
                placeholder="ระบุรายละเอียด/ข้อเสนอแนะ"
                value={form.coordination?.contactDetailNote || ""}
                onChange={(e) =>
                  setDeep("coordination.contactDetailNote", e.target.value)
                }
              />
            </div>
            <div className="p-3 pt-0 border-t">
              <Label className="text-sm font-medium">
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด) *
              </Label>
              <Textarea
                className={`mt-2 ${
                  errors["coordination.supervisionResult"]
                    ? "border-2 border-red-600"
                    : ""
                }`}
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.coordination?.supervisionResult || ""}
                onChange={(e) => {
                  setDeep("coordination.supervisionResult", e.target.value);
                  if (errors["coordination.supervisionResult"]) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["coordination.supervisionResult"];
                      return newErrors;
                    });
                  }
                }}
              />
              {errors["coordination.supervisionResult"] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors["coordination.supervisionResult"]}
                </p>
              )}
            </div>
          </div>

          {/* 3.4 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.4 ระบบ/ระดับความพร้อมในการฝึกของแหล่งฝึก และนักศึกษา
            </div>
            <div className="p-3 space-y-4">
              <div>
                <Label className="text-sm">
                  3.4.1 ความพร้อม
                  ความตั้งใจและการเอาใจใส่ต่อการฝึกปฏิบัติงานของเภสัชกรประจำแหล่งฝึก
                  (ความคิดเห็นจากนักศึกษาและการประเมินของอาจารย์) *
                </Label>
                <RadioGroup
                  className="flex gap-6 mt-1"
                  value={form.readiness?.workloadFit || ""}
                  onValueChange={(v) => {
                    setDeep("readiness.workloadFit", v as Level);
                    if (errors["readiness.workloadFit"]) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors["readiness.workloadFit"];
                        return newErrors;
                      });
                    }
                  }}
                >
                  {(["มาก", "ปานกลาง", "น้อย"] as const).map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm">
                      <RadioGroupItem
                        value={v}
                        className={
                          errors["readiness.workloadFit"]
                            ? "border-red-600"
                            : ""
                        }
                      />
                      <span>{v}</span>
                    </label>
                  ))}
                </RadioGroup>
                {errors["readiness.workloadFit"] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors["readiness.workloadFit"]}
                  </p>
                )}
                <Input
                  className="mt-2"
                  placeholder="หมายเหตุ"
                  value={form.readiness?.workloadNote || ""}
                  onChange={(e) =>
                    setDeep("readiness.workloadNote", e.target.value)
                  }
                />
              </div>

              <div>
                <Label className="text-sm">
                  3.4.2 ความพร้อม ของนักศึกษา
                  (ความคิดเห็นจากเภสัชกรประจำแหล่งฝึกและการประเมินของอาจารย์)
                </Label>
                <div className="grid md:grid-cols-2 gap-2 mt-1">
                  {[
                    ["studentPersonality", "บุคลิกภาพและความประพฤติ"],
                    ["studentAcademic", "ความรู้และการเตรียมตัวก่อนการฝึกงาน"],
                    [
                      "studentResponsibility",
                      "ความกระตือรือร้น ความรับผิดชอบและเอาใจใส่",
                    ],
                  ].map(([k, label]) => (
                    <label key={k} className="flex items-center gap-2">
                      <Checkbox
                        checked={(form.readiness as any)?.[k]}
                        onCheckedChange={(c) => setDeep(`readiness.${k}`, !!c)}
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
                <Input
                  className="mt-2"
                  placeholder="อื่น ๆ (ระบุ)"
                  value={form.readiness?.studentOther || ""}
                  onChange={(e) =>
                    setDeep("readiness.studentOther", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="p-3 pt-0 border-t">
              <Label className="text-sm font-medium">
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด) *
              </Label>
              <Textarea
                className={`mt-2 ${
                  errors["readiness.supervisionResult"]
                    ? "border-2 border-red-600"
                    : ""
                }`}
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.readiness?.supervisionResult || ""}
                onChange={(e) => {
                  setDeep("readiness.supervisionResult", e.target.value);
                  if (errors["readiness.supervisionResult"]) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["readiness.supervisionResult"];
                      return newErrors;
                    });
                  }
                }}
              />
              {errors["readiness.supervisionResult"] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors["readiness.supervisionResult"]}
                </p>
              )}
            </div>
          </div>

          {/* 3.5 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.5 สิ่งที่ต้องการการสนับสนุนจากมหาวิทยาลัย
            </div>
            <div className="p-3 grid md:grid-cols-2 gap-2">
              {[
                ["books", "หนังสือ/ตำรา"],
                ["conferences", "การประชุมวิชาการ"],
                ["trainingOrStudyVisit", "การอบรม/ดูงาน"],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2">
                  <Checkbox
                    checked={(form.supportNeeds as any)?.[k]}
                    onCheckedChange={(c) => setDeep(`supportNeeds.${k}`, !!c)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
              <Input
                className="md:col-span-2"
                placeholder="อื่น ๆ (ระบุ)"
                value={form.supportNeeds?.other || ""}
                onChange={(e) => setDeep("supportNeeds.other", e.target.value)}
              />
              <Textarea
                className="md:col-span-2"
                rows={3}
                placeholder="รายละเอียด/คำอธิบายเพิ่มเติม"
                value={form.supportNeeds?.detail || ""}
                onChange={(e) => setDeep("supportNeeds.detail", e.target.value)}
              />
            </div>
            <div className="p-3 pt-0 border-t">
              <Label className="text-sm font-medium">
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด) *
              </Label>
              <Textarea
                className={`mt-2 ${
                  errors["supportNeeds.supervisionResult"]
                    ? "border-2 border-red-600"
                    : ""
                }`}
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.supportNeeds?.supervisionResult || ""}
                onChange={(e) => {
                  setDeep("supportNeeds.supervisionResult", e.target.value);
                  if (errors["supportNeeds.supervisionResult"]) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["supportNeeds.supervisionResult"];
                      return newErrors;
                    });
                  }
                }}
              />
              {errors["supportNeeds.supervisionResult"] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors["supportNeeds.supervisionResult"]}
                </p>
              )}
            </div>
          </div>

          {/* 3.6 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.6 ปัญหา/อุปสรรคของการฝึกปฏิบัติงาน
            </div>
            <div className="p-3 space-y-2">
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.obstacles?.none}
                    onCheckedChange={(c) =>
                      setField("obstacles", {
                        ...(form.obstacles || {}),
                        none: !!c,
                        has: false,
                        note: "",
                      })
                    }
                  />
                  <span className="text-sm">ไม่พบปัญหา/อุปสรรค</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.obstacles?.has}
                    onCheckedChange={(c) =>
                      setField("obstacles", {
                        ...(form.obstacles || {}),
                        has: !!c,
                        none: false,
                      })
                    }
                  />
                  <span className="text-sm">พบปัญหา/อุปสรรค (ระบุ)</span>
                </label>
              </div>
              <Textarea
                rows={3}
                placeholder="รายละเอียดปัญหา/แนวทางแก้ไข"
                value={form.obstacles?.note || ""}
                onChange={(e) => setDeep("obstacles.note", e.target.value)}
              />
            </div>
            <div className="p-3 pt-0 border-t">
              <Label className="text-sm font-medium">
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด) *
              </Label>
              <Textarea
                className={`mt-2 ${
                  errors["obstacles.supervisionResult"]
                    ? "border-2 border-red-600"
                    : ""
                }`}
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.obstacles?.supervisionResult || ""}
                onChange={(e) => {
                  setDeep("obstacles.supervisionResult", e.target.value);
                  if (errors["obstacles.supervisionResult"]) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors["obstacles.supervisionResult"];
                      return newErrors;
                    });
                  }
                }}
              />
              {errors["obstacles.supervisionResult"] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors["obstacles.supervisionResult"]}
                </p>
              )}
            </div>
          </div>

          {/* 3.7 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">3.7 ประเด็นอื่น ๆ</div>
            <div className="p-3">
              <Textarea
                rows={4}
                placeholder="ระบุเพิ่มเติม"
                value={form.otherTopics || ""}
                onChange={(e) => setField("otherTopics", e.target.value)}
              />
            </div>
          </div>

          {/* 3.8 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.8 สรุปผลโดยรวมของการติดตาม/นิเทศ
            </div>
            <div className="p-3 space-y-3">
              <div>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.overall?.shouldContinue}
                    onCheckedChange={(c) =>
                      setDeep("overall.shouldContinue", !!c)
                    }
                  />
                  <span className="text-sm">ควรเป็นแหล่งฝึกในปีต่อไป</span>
                </label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  placeholder="ควรเป็นแหล่งฝึกในปีต่อไป เนื่องจาก..."
                  disabled={!form.overall?.shouldContinue}
                  value={form.overall?.shouldContinueText || ""}
                  onChange={(e) =>
                    setDeep("overall.shouldContinueText", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.overall?.shouldImprove}
                    onCheckedChange={(c) =>
                      setDeep("overall.shouldImprove", !!c)
                    }
                  />
                  <span className="text-sm">ควรมีการพัฒนาแหล่งฝึก</span>
                </label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  placeholder="ควรมีการพัฒนาแหล่งฝึกดังนี้..."
                  disabled={!form.overall?.shouldImprove}
                  value={form.overall?.shouldImproveText || ""}
                  onChange={(e) =>
                    setDeep("overall.shouldImproveText", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.overall?.shouldNotUse}
                    onCheckedChange={(c) =>
                      setDeep("overall.shouldNotUse", !!c)
                    }
                  />
                  <span className="text-sm">ไม่ควรส่งนักศึกษาฝึกงาน</span>
                </label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  placeholder="ไม่ควรส่งนักศึกษาฝึกงาน เนื่องจาก..."
                  disabled={!form.overall?.shouldNotUse}
                  value={form.overall?.shouldNotUseText || ""}
                  onChange={(e) =>
                    setDeep("overall.shouldNotUseText", e.target.value)
                  }
                />
              </div>

              <div>
                <Label className="text-sm">
                  การพัฒนารูปแบบการฝึกปฏิบัติงานในอนาคต. *
                </Label>
                <Textarea
                  className={
                    errors["overall.futurePlan"]
                      ? "border-2 border-red-600"
                      : ""
                  }
                  rows={3}
                  placeholder="ระบุแผนการพัฒนาหรือปรับปรุงการนิเทศในอนาคต..."
                  value={form.overall?.futurePlan || ""}
                  onChange={(e) => {
                    setDeep("overall.futurePlan", e.target.value);
                    if (errors["overall.futurePlan"]) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors["overall.futurePlan"];
                        return newErrors;
                      });
                    }
                  }}
                />
                {errors["overall.futurePlan"] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors["overall.futurePlan"]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
        <Link href="/advisor/visits">
          <Button variant="outline" className="border-gray-300 text-gray-600">
            ยกเลิก
          </Button>
        </Link>
        <Button
          onClick={onSubmit}
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
      </CardFooter>
    </Card>
  );
}
