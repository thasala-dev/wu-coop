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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const ok =
      requireField("siteName", !!form.siteName) &&
      requireField("visitDate", !!form.visitDate) &&
      requireField("summary", !!form.summary) &&
      requireField("students", !!form.students?.some((s) => s?.trim()));
    if (!ok) {
      toast({ title: "ข้อมูลยังไม่ครบ", variant: "destructive" });
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
            <div className="md:col-span-2">
              <Label>ชื่อแหล่งฝึก</Label>
              <Input
                value={form.siteName || ""}
                onChange={(e) => setField("siteName", e.target.value)}
                className={errors.siteName ? "border-2 border-red-600" : ""}
                placeholder="เช่น โรงพยาบาล/หน่วยงาน"
              />
            </div>
            <div>
              <Label>วันที่นิเทศ</Label>
              <Input
                type="date"
                value={form.visitDate || ""}
                onChange={(e) => setField("visitDate", e.target.value)}
                className={errors.visitDate ? "border-2 border-red-600" : ""}
              />
            </div>
            <div>
              <Label>ครั้งที่</Label>
              <Input
                value={form.visitRound || ""}
                onChange={(e) => setField("visitRound", e.target.value)}
                placeholder="เช่น 1"
              />
            </div>
          </div>

          <div>
            <Label>ชื่อ-สกุลนักศึกษา</Label>
            <div className="grid md:grid-cols-2 gap-2 mt-1">
              {form.students?.map((v, i) => (
                <Input
                  key={i}
                  placeholder={`${i + 1}. ชื่อ-สกุล`}
                  value={v}
                  onChange={(e) =>
                    setField(
                      "students",
                      (form.students || []).map((s, idx) =>
                        idx === i ? e.target.value : s
                      )
                    )
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* -------- 2) สรุปผลจากการนิเทศ -------- */}
        <section className="space-y-2">
          <div className="font-medium">
            2) สรุปผลจากการนิเทศ (จุดเด่น/สิ่งที่ควรปรับปรุง
            ทั้งในแหล่งฝึกและในนักศึกษา)
          </div>
          <Textarea
            rows={8}
            value={form.summary || ""}
            onChange={(e) => setField("summary", e.target.value)}
            className={errors.summary ? "border-2 border-red-600" : ""}
            placeholder="พิมพ์สรุปผล..."
          />
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
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
              </Label>
              <Textarea
                className="mt-2"
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.siteInfo?.supervisionResult || ""}
                onChange={(e) =>
                  setDeep("siteInfo.supervisionResult", e.target.value)
                }
              />
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
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
              </Label>
              <Textarea
                className="mt-2"
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.housing?.supervisionResult || ""}
                onChange={(e) =>
                  setDeep("housing.supervisionResult", e.target.value)
                }
              />
            </div>
          </div>

          {/* 3.3 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">
              3.3 การประสานงานระหว่างมหาวิทยาลัยกับแหล่งฝึก
            </div>
            <div className="p-3 grid md:grid-cols-2 gap-2">
              {[
                ["contactPersonProvided", "แหล่งฝึกได้ให้รายชื่อการประสานงาน"],
                ["needMoreDocs", "ต้องส่งเอกสารเพิ่มเติม"],
                ["viaMobile", "สาขาติดต่อผ่านหมายเลขโทรศัพท์มือถือ"],
                ["viaLandlineOrProject", "สาขาติดต่อผ่านโทรศัพท์ภายใน/โครงการ"],
                [
                  "viaEmailOrSocial",
                  "สาขาติดต่อผ่าน e-mail หรือ social network อื่น ๆ",
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
                รายละเอียดช่องทางติดต่อในปฏิบัติงาน
              </Label>
              <RadioGroup
                className="flex gap-6 mt-1"
                value={form.coordination?.contactDetailJudge || ""}
                onValueChange={(v) =>
                  setDeep("coordination.contactDetailJudge", v as YesNo)
                }
              >
                {(["เหมาะสม", "ควรปรับปรุง"] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={v} />
                    <span>{v}</span>
                  </label>
                ))}
              </RadioGroup>
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
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
              </Label>
              <Textarea
                className="mt-2"
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.coordination?.supervisionResult || ""}
                onChange={(e) =>
                  setDeep("coordination.supervisionResult", e.target.value)
                }
              />
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
                  (ความคิดเห็นจากนักศึกษาและการประเมินของอาจารย์)
                </Label>
                <RadioGroup
                  className="flex gap-6 mt-1"
                  value={form.readiness?.workloadFit || ""}
                  onValueChange={(v) =>
                    setDeep("readiness.workloadFit", v as Level)
                  }
                >
                  {(["มาก", "ปานกลาง", "น้อย"] as const).map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value={v} />
                      <span>{v}</span>
                    </label>
                  ))}
                </RadioGroup>
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
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
              </Label>
              <Textarea
                className="mt-2"
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.readiness?.supervisionResult || ""}
                onChange={(e) =>
                  setDeep("readiness.supervisionResult", e.target.value)
                }
              />
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
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
              </Label>
              <Textarea
                className="mt-2"
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.supportNeeds?.supervisionResult || ""}
                onChange={(e) =>
                  setDeep("supportNeeds.supervisionResult", e.target.value)
                }
              />
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
                ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
              </Label>
              <Textarea
                className="mt-2"
                rows={3}
                placeholder="ระบุรายละเอียดผลการติดตาม/นิเทศ..."
                value={form.obstacles?.supervisionResult || ""}
                onChange={(e) =>
                  setDeep("obstacles.supervisionResult", e.target.value)
                }
              />
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
                  <span className="text-sm">ไม่ควรใช้แหล่งฝึก</span>
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
                  การพัฒนา/ปรับปรุงแผนการนิเทศในอนาคต
                </Label>
                <Textarea
                  rows={3}
                  value={form.overall?.futurePlan || ""}
                  onChange={(e) =>
                    setDeep("overall.futurePlan", e.target.value)
                  }
                />
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
