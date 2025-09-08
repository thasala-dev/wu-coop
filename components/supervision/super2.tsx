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

/** ======== Types ======== */
type FormState = {
  // 1) ข้อมูลทั่วไปของนักศึกษาและแหล่งฝึก
  siteName?: string;
  informedBrief?: boolean; // “เคล้า/ได้รับชี้แจง…”
  visitDate?: string; // วันที่นิเทศ
  visitRound?: string; // ครั้งที่
  students?: string[]; // ชื่อ-สกุลนักศึกษา 1..4

  // 2) สรุปผลจากการนิเทศ
  summary?: string;

  // 3.1 ข้อมูลแหล่งฝึก
  acceptIntern?: "รับ" | "ไม่รับ" | "";
  withDormFromUni?: boolean; // มีนักศึกษาจากสถาบันอื่น...
  withDormFromUni_desc?: string; // (ระบุ จำนวน/ชั้นปี/สถาบัน)
  withoutDormFromUni?: boolean;
  supervisionResult_section1?: string; // ผลการติดตาม/นิเทศ ส่วนที่ 3.1

  // 3.2 ที่พัก
  housing_opts?: {
    hospitalDorm?: boolean;
    privateDorm?: boolean;
    house?: boolean;
    others?: boolean;
  };
  housing_note?: string;
  supervisionResult_section2?: string; // ผลการติดตาม/นิเทศ ส่วนที่ 3.2

  // 3.3 การประสานงานระหว่างมหาวิทยาลัยกับแหล่งฝึก
  coord?: {
    gotContactPerson?: boolean;
    needMoreInfo?: boolean;
    useMobile?: boolean;
    usePhone?: boolean;
    useEmailSocial?: boolean;
    contactDetailProper?: "เหมาะสม" | "ควรปรับปรุง" | "";
    contactDetail_note?: string;
  };
  supervisionResult_section3?: string; // ผลการติดตาม/นิเทศ ส่วนที่ 3.3

  // 3.4 ความพร้อมในการฝึก (แหล่งฝึก & นักศึกษา)
  readiness_site?: {
    workloadFit?: "มาก" | "ปานกลาง" | "น้อย" | "";
    workload_note?: string;
  };
  readiness_student?: {
    personality?: boolean;
    ethics?: boolean;
    academic?: boolean;
    responsibility?: boolean;
    teamwork?: boolean;
    selfDiscipline?: boolean;
    other?: string;
  };
  supervisionResult_section4?: string; // ผลการติดตาม/นิเทศ ส่วนที่ 3.4

  // 3.5 สิ่งที่ต้องการสนับสนุนจากมหาวิทยาลัย
  needSupport?: {
    books?: boolean;
    conferences?: boolean;
    trainingStudyVisit?: boolean;
    other?: string;
  };
  supervisionResult_section5?: string; // ผลการติดตาม/นิเทศ ส่วนที่ 3.5

  // 3.6 ปัญหา/อุปสรรคของการฝึก
  issues?: {
    none?: boolean;
    found?: boolean;
    found_note?: string;
  };
  supervisionResult_section6?: string; // ผลการติดตาม/นิเทศ ส่วนที่ 3.6

  // 3.7 ประเด็นอื่น ๆ
  otherTopics?: string;
  supervisionResult_section7?: string; // ผลการติดตาม/นิเทศ ส่วนที่ 3.7

  // 3.8 สรุปผลโดยรวม
  overall?: {
    shouldContinue?: boolean; // ควรเป็นแหล่งฝึกฯ ต่อไป
    shouldImprove?: string; // ควรพัฒนาแหล่งฝึกฯ ด้านนี้
    shouldNotUse?: string; // ไม่ควรใช้ฯ เนื่องจาก
    futurePlan?: string; // การพัฒนาแผนการนิเทศในอนาคต
  };
};

export default function Page(props: any) {
  const { id, data } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>(
    data
      ? data
      : {
          students: ["", "", "", ""],
          housing_opts: {},
          coord: { contactDetailProper: "" },
          readiness_site: { workloadFit: "" },
          readiness_student: {},
          needSupport: {},
          issues: {},
          overall: {},
        }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const checkReq = (k: keyof FormState, ok: boolean) => {
    setErrors((e) => {
      const n = { ...e };
      if (!ok) n[String(k)] = "กรอก/เลือกข้อมูลให้ครบ";
      else delete n[String(k)];
      return n;
    });
    return ok;
  };

  const submit = async () => {
    // ตรวจขั้นต่ำ: ชื่อแหล่งฝึก, วันที่นิเทศ, รายชื่อนศ.อย่างน้อย 1, สรุปผล
    const ok =
      checkReq("siteName", !!form.siteName) &&
      checkReq("visitDate", !!form.visitDate) &&
      checkReq("students", !!form.students?.some((s) => s?.trim())) &&
      checkReq("summary", !!form.summary);

    if (!ok) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรอกหัวข้อที่จำเป็นก่อนส่งรายงาน",
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
      if (!res.ok) throw new Error("submit failed");
      const j = await res.json();
      if (j.success) {
        toast({ title: "ส่งรายงานสำเร็จ", variant: "success" });
        router.push("/advisor/visits");
      } else throw new Error("bad payload");
    } catch (e) {
      toast({
        title: "ส่งไม่สำเร็จ",
        description: "ลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
      <div className="p-4 space-y-8">
        <h1 className="text-xl font-semibold">
          แบบนิเทศงานการฝึกปฏิบัติงานเชิงวิชาชีพ (เภสัชกรรมปฐมภูมิ) )
        </h1>

        {/* ===== 1. ข้อมูลทั่วไป ===== */}
        <section className="space-y-3">
          <div className="font-medium">
            1) ข้อมูลทั่วไปของนักศึกษาและแหล่งฝึก
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 space-y-1">
              <Label>ชื่อแหล่งฝึก</Label>
              <Input
                value={form.siteName || ""}
                onChange={(e) => set("siteName", e.target.value)}
                className={errors.siteName ? "border-2 border-red-600" : ""}
                placeholder="เช่น โรงพยาบาลวลัยลักษณ์"
              />
            </div>
            <div className="space-y-1">
              <Label>วันที่นิเทศ</Label>
              <Input
                type="date"
                value={form.visitDate || ""}
                onChange={(e) => set("visitDate", e.target.value)}
                className={errors.visitDate ? "border-2 border-red-600" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>ครั้งที่</Label>
              <Input
                placeholder="เช่น 1"
                value={form.visitRound || ""}
                onChange={(e) => set("visitRound", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>ชื่อ-สกุลนักศึกษา (สูงสุด 4 คน)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
              {form.students?.map((v, i) => (
                <Input
                  key={i}
                  placeholder={`${i + 1}. ชื่อ-สกุล`}
                  value={v}
                  onChange={(e) =>
                    set(
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

        {/* ===== 2. สรุปผลจากการนิเทศ ===== */}
        <section className="space-y-2">
          <div className="font-medium">
            2) สรุปผลจากการนิเทศ (จุดเด่น/สิ่งที่ควรปรับปรุง
            ทั้งในแหล่งฝึกและในนักศึกษา)
          </div>
          <Textarea
            rows={6}
            value={form.summary || ""}
            onChange={(e) => set("summary", e.target.value)}
            className={errors.summary ? "border-2 border-red-600" : ""}
            placeholder="พิมพ์สรุปภาพรวม…"
          />
        </section>

        {/* ===== 3.1 ข้อมูลแหล่งฝึก ===== */}
        <section className="space-y-3">
          <div className="font-medium">
            3) ข้อมูลเกี่ยวกับแหล่งฝึกและการฝึกปฏิบัติงาน
          </div>

          {/* ===== 3.1 ข้อมูลแหล่งฝึก ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">
              3.1 ข้อมูลแหล่งฝึก
            </div>
            <div className="p-3 space-y-3">
              <div>
                <Label className="text-sm">การรับนักศึกษาฝึกงาน</Label>
                <RadioGroup
                  className="flex gap-6 mt-1"
                  value={form.acceptIntern || ""}
                  onValueChange={(v) => set("acceptIntern", v as any)}
                >
                  {["เคยรับ", "ไม่เคยรับ"].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value={v} />
                      <span>{v}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <label className="flex items-start gap-2">
                  <Checkbox
                    checked={!!form.withDormFromUni}
                    onCheckedChange={(c) => set("withDormFromUni", !!c)}
                  />
                  <div className="space-y-1">
                    <span className="text-sm">
                      มีนักศึกษาจากสถาบันอื่นร่วมฝึก พร้อมกับนักศึกษาฯ
                    </span>
                    <Input
                      disabled={!form.withDormFromUni}
                      placeholder="ระบุ จำนวน/ชั้นปี/สถาบัน"
                      value={form.withDormFromUni_desc || ""}
                      onChange={(e) =>
                        set("withDormFromUni_desc", e.target.value)
                      }
                    />
                  </div>
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.withoutDormFromUni}
                    onCheckedChange={(c) => set("withoutDormFromUni", !!c)}
                  />
                  <span className="text-sm">
                    ไม่มีนักศึกษาจากสถาบันอื่นร่วม
                  </span>
                </label>
              </div>

              {/* ผลการติดตาม/นิเทศ ส่วนที่ 3.1 */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-medium text-blue-700">
                  ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="ระบุผลการติดตาม/นิเทศเกี่ยวกับข้อมูลแหล่งฝึก..."
                  value={form.supervisionResult_section1 || ""}
                  onChange={(e) =>
                    set("supervisionResult_section1", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 3.2 ที่พัก ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">
              3.2 ที่พัก (ระบุรายละเอียดเกี่ยวกับการเดินทาง/ความปลอดภัย)
            </div>
            <div className="p-3 grid md:grid-cols-2 gap-2">
              {[
                { key: "hospitalDorm", label: "ที่พักของโรงพยาบาล" },
                { key: "privateDorm", label: "ที่พักเอกชนที่แหล่งฝึกแนะนำ" },
                { key: "house", label: "บ้านพัก/บ้านญาติ" },
                { key: "others", label: "ที่พักอื่นๆ" },
              ].map((o) => (
                <label key={o.key} className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      !!form.housing_opts?.[
                        o.key as keyof typeof form.housing_opts
                      ]
                    }
                    onCheckedChange={(c) =>
                      set("housing_opts", {
                        ...form.housing_opts,
                        [o.key]: !!c,
                      })
                    }
                  />
                  <span className="text-sm">{o.label}</span>
                </label>
              ))}
            </div>
            <div className="p-3 pt-0 space-y-3">
              <Textarea
                placeholder="บันทึกเรื่องการเดินทาง/ความปลอดภัยของที่พัก"
                value={form.housing_note || ""}
                onChange={(e) => set("housing_note", e.target.value)}
              />

              {/* ผลการติดตาม/นิเทศ ส่วนที่ 3.2 */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-medium text-blue-700">
                  ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="ระบุผลการติดตาม/นิเทศเกี่ยวกับที่พักและความปลอดภัย..."
                  value={form.supervisionResult_section2 || ""}
                  onChange={(e) =>
                    set("supervisionResult_section2", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 3.3 การประสานงาน ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">
              3.3 การประสานงานระหว่างมหาวิทยาลัยกับแหล่งฝึก
            </div>
            <div className="p-3 space-y-3">
              <div className="grid md:grid-cols-2 gap-2">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.coord?.gotContactPerson}
                    onCheckedChange={(c) =>
                      set("coord", { ...form.coord!, gotContactPerson: !!c })
                    }
                  />
                  <span className="text-sm">แหล่งฝึกได้รับเอกสารครบถ้วน</span>
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.coord?.needMoreInfo}
                    onCheckedChange={(c) =>
                      set("coord", { ...form.coord!, needMoreInfo: !!c })
                    }
                  />
                  <span className="text-sm">ต้องส่งเอกสารเพิ่มเติม</span>
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.coord?.useMobile}
                    onCheckedChange={(c) =>
                      set("coord", { ...form.coord!, useMobile: !!c })
                    }
                  />
                  <span className="text-sm">
                    สะดวกให้ติดต่อผ่านหมายเลขโทรศัพท์มือถือ
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.coord?.usePhone}
                    onCheckedChange={(c) =>
                      set("coord", { ...form.coord!, usePhone: !!c })
                    }
                  />
                  <span className="text-sm">สะดวกให้ติดต่อผ่านโทรสาร</span>
                </label>

                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.coord?.useEmailSocial}
                    onCheckedChange={(c) =>
                      set("coord", { ...form.coord!, useEmailSocial: !!c })
                    }
                  />
                  <span className="text-sm">
                    สะดวกให้ติดต่อผ่าน e-mail / social network อื่นๆ
                  </span>
                </label>
              </div>

              <div className="pt-1">
                <Label className="text-sm">รายละเอียดช่องทางติดต่อ</Label>
                <RadioGroup
                  className="flex gap-6 mt-1"
                  value={form.coord?.contactDetailProper || ""}
                  onValueChange={(v) =>
                    set("coord", {
                      ...form.coord!,
                      contactDetailProper: v as any,
                    })
                  }
                >
                  {["เหมาะสม", "ควรปรับปรุง"].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value={v} />
                      <span>{v}</span>
                    </label>
                  ))}
                </RadioGroup>
                <Input
                  className="mt-2"
                  placeholder="ระบุรายละเอียดเพิ่มเติมหาก 'ควรปรับปรุง'"
                  value={form.coord?.contactDetail_note || ""}
                  onChange={(e) =>
                    set("coord", {
                      ...form.coord!,
                      contactDetail_note: e.target.value,
                    })
                  }
                />
              </div>

              {/* ผลการติดตาม/นิเทศ ส่วนที่ 3.3 */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-medium text-blue-700">
                  ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="ระบุผลการติดตาม/นิเทศเกี่ยวกับการประสานงาน..."
                  value={form.supervisionResult_section3 || ""}
                  onChange={(e) =>
                    set("supervisionResult_section3", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 3.4 ความพร้อม ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">
              3.4 ระบบหรือความพร้อมในการฝึกปฏิบัติงานของแหล่งฝึกและนักศึกษา
            </div>

            <div className="p-3 space-y-3">
              <div>
                <Label className="text-sm">
                  3.4.1 ความพร้อม/ความตั้งใจและการเอาใจใส่ต่อการฝึกงาน
                  <b>
                    <u>ของเภสัชกรประจำแหล่งฝึก</u>
                  </b>
                  (ความเห็นจากนักศึกษาและการประเมินของอาจารย์นิเทศ)
                </Label>
                <Input
                  className="mt-2"
                  placeholder="หมายเหตุ"
                  value={form.readiness_site?.workload_note || ""}
                  onChange={(e) =>
                    set("readiness_site", {
                      ...form.readiness_site!,
                      workload_note: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label className="text-sm">3.4.2 ความพร้อมของนักศึกษา</Label>
                <div className="grid md:grid-cols-2 gap-2 mt-1">
                  {[
                    ["personality", "บุคลิกภาพและความประพฤติ"],
                    ["academic", "ความรู้และการเตรียมตัวก่อนการฝึกงาน"],
                    [
                      "responsibility",
                      "ความกระตือรือร้น ความรับผิดชอบและเอาใจใส่",
                    ],
                  ].map(([k, label]) => (
                    <label key={k} className="flex items-center gap-2">
                      <Checkbox
                        checked={!!(form.readiness_student as any)?.[k]}
                        onCheckedChange={(c) =>
                          set("readiness_student", {
                            ...form.readiness_student!,
                            [k]: !!c,
                          } as any)
                        }
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
                <Input
                  className="mt-2"
                  placeholder="อื่น ๆ (ระบุ)"
                  value={form.readiness_student?.other || ""}
                  onChange={(e) =>
                    set("readiness_student", {
                      ...form.readiness_student!,
                      other: e.target.value,
                    })
                  }
                />
              </div>

              {/* ผลการติดตาม/นิเทศ ส่วนที่ 3.4 */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-medium text-blue-700">
                  ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="ระบุผลการติดตาม/นิเทศเกี่ยวกับความพร้อมในการฝึก..."
                  value={form.supervisionResult_section4 || ""}
                  onChange={(e) =>
                    set("supervisionResult_section4", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 3.5 สนับสนุนจากมหาวิทยาลัย ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">
              3.5 สิ่งที่ต้องการการสนับสนุนจากมหาวิทยาลัย
            </div>
            <div className="p-3 grid md:grid-cols-2 gap-2">
              {[
                ["books", "หนังสือ/ตำรา"],
                ["conferences", "การประชุมวิชาการ"],
                ["trainingStudyVisit", "การอบรม/ดูงาน"],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2">
                  <Checkbox
                    checked={!!(form.needSupport as any)?.[k]}
                    onCheckedChange={(c) =>
                      set("needSupport", {
                        ...form.needSupport!,
                        [k]: !!c,
                      } as any)
                    }
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
              <Input
                className="md:col-span-2"
                placeholder="อื่น ๆ (ระบุ)"
                value={form.needSupport?.other || ""}
                onChange={(e) =>
                  set("needSupport", {
                    ...form.needSupport!,
                    other: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* ===== 3.6 ปัญหา/อุปสรรค ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">
              3.6 ปัญหา/อุปสรรคของการฝึกปฏิบัติงาน
            </div>
            <div className="p-3 space-y-3">
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.issues?.none}
                    onCheckedChange={(c) =>
                      set("issues", {
                        ...form.issues!,
                        none: !!c,
                        found: false,
                        found_note: "",
                      })
                    }
                  />
                  <span className="text-sm">ไม่พบปัญหา/อุปสรรค</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={!!form.issues?.found}
                    onCheckedChange={(c) =>
                      set("issues", {
                        ...form.issues!,
                        found: !!c,
                        none: false,
                      })
                    }
                  />
                  <span className="text-sm">พบปัญหา/อุปสรรค</span>
                </label>
              </div>
              <Textarea
                placeholder="ระบุถ้ามีปัญหา/อุปสรรค"
                value={form.issues?.found_note || ""}
                onChange={(e) =>
                  set("issues", { ...form.issues!, found_note: e.target.value })
                }
              />

              {/* ผลการติดตาม/นิเทศ ส่วนที่ 3.6 */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-medium text-blue-700">
                  ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="ระบุผลการติดตาม/นิเทศเกี่ยวกับปัญหา/อุปสรรค..."
                  value={form.supervisionResult_section6 || ""}
                  onChange={(e) =>
                    set("supervisionResult_section6", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 3.7 ประเด็นอื่น ๆ ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">3.7 ประเด็นอื่น ๆ</div>
            <div className="p-3 space-y-3">
              <Textarea
                rows={4}
                placeholder="ระบุเพิ่มเติม"
                value={form.otherTopics || ""}
                onChange={(e) => set("otherTopics", e.target.value)}
              />

              {/* ผลการติดตาม/นิเทศ ส่วนที่ 3.7 */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-medium text-blue-700">
                  ผลการติดตาม/นิเทศ (ระบุรายละเอียด)
                </Label>
                <Textarea
                  rows={3}
                  placeholder="ระบุผลการติดตาม/นิเทศเกี่ยวกับประเด็นอื่น ๆ..."
                  value={form.supervisionResult_section7 || ""}
                  onChange={(e) =>
                    set("supervisionResult_section7", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 3.8 สรุปโดยรวม ===== */}
          <div className="rounded-md border">
            <div className="p-3 font-medium bg-slate-50">
              3.8 สรุปผลโดยรวมของการติดตาม/นิเทศ
            </div>
            <div className="p-3 space-y-3">
              <label className="flex items-start gap-2">
                <Checkbox
                  checked={!!form.overall?.shouldContinue}
                  onCheckedChange={(c) =>
                    set("overall", { ...form.overall!, shouldContinue: !!c })
                  }
                />
                <div className="flex-1 space-y-1">
                  <span className="text-sm">
                    ควรเป็นแหล่งฝึกในปีถัดไป เนื่องจาก
                  </span>
                  <Textarea
                    rows={2}
                    placeholder="ระบุเหตุผล..."
                    disabled={!form.overall?.shouldContinue}
                    value={
                      form.overall?.shouldContinue
                        ? form.overall?.shouldImprove || ""
                        : ""
                    }
                    onChange={(e) =>
                      set("overall", {
                        ...form.overall!,
                        shouldImprove: e.target.value,
                      })
                    }
                  />
                </div>
              </label>

              <label className="flex items-start gap-2">
                <Checkbox
                  checked={!!form.overall?.shouldImprove}
                  onCheckedChange={(c) => {
                    if (!c) {
                      set("overall", { ...form.overall!, shouldImprove: "" });
                    } else {
                      set("overall", {
                        ...form.overall!,
                        shouldImprove: form.overall?.shouldImprove || " ",
                      });
                    }
                  }}
                />
                <div className="flex-1 space-y-1">
                  <span className="text-sm">ควรมีการพัฒนาแหล่งฝึก ดังนี้</span>
                  <Textarea
                    rows={2}
                    placeholder="ระบุรายละเอียดการพัฒนา..."
                    disabled={!form.overall?.shouldImprove}
                    value={form.overall?.shouldImprove || ""}
                    onChange={(e) =>
                      set("overall", {
                        ...form.overall!,
                        shouldImprove: e.target.value,
                      })
                    }
                  />
                </div>
              </label>

              <label className="flex items-start gap-2">
                <Checkbox
                  checked={!!form.overall?.shouldNotUse}
                  onCheckedChange={(c) => {
                    if (!c) {
                      set("overall", { ...form.overall!, shouldNotUse: "" });
                    } else {
                      set("overall", {
                        ...form.overall!,
                        shouldNotUse: form.overall?.shouldNotUse || " ",
                      });
                    }
                  }}
                />
                <div className="flex-1 space-y-1">
                  <span className="text-sm">
                    ไม่ควรส่งนักศึกษาฝึก เนื่องจาก
                  </span>
                  <Textarea
                    rows={2}
                    placeholder="ระบุเหตุผล..."
                    disabled={!form.overall?.shouldNotUse}
                    value={form.overall?.shouldNotUse || ""}
                    onChange={(e) =>
                      set("overall", {
                        ...form.overall!,
                        shouldNotUse: e.target.value,
                      })
                    }
                  />
                </div>
              </label>

              <div className="space-y-1">
                <Label className="text-sm">
                  การพัฒนารูปแบบการปฏิบัติงานในอนาคต
                </Label>
                <Textarea
                  rows={3}
                  placeholder="ระบุแนวทางการพัฒนา..."
                  value={form.overall?.futurePlan || ""}
                  onChange={(e) =>
                    set("overall", {
                      ...form.overall!,
                      futurePlan: e.target.value,
                    })
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
          onClick={submit}
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
