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

/** ===== Types ===== */
type YesNo = "ยินดี" | "ไม่ยินดี" | "";
type Level = "มาก" | "ปานกลาง" | "น้อย" | "";

type ProblemRow = {
  none?: boolean;
  has?: boolean;
  note?: string;
};

type ClinicActivity = {
  enable?: boolean;
  details?: string;
};

type ShiftRow = { period: string; count?: string };

type FormState = {
  // 1) ข้อมูลทั่วไป
  siteName?: string;
  branch?: string;
  address?: string;
  district?: string;
  amphoe?: string;
  province?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  advisorName?: string; // เกล้าฯรับชี้แจงฯ
  quality?: {
    isQuality?: boolean;
    beQuality?: boolean;
    inProgress?: boolean;
    general?: boolean;
  };
  multiTimeNotes?: { time?: string; count?: string }[];
  servePerDay?: string;

  // 2) อาจารย์นิเทศ
  advisors?: string[];

  // 3) ข้อมูลการฝึกในปัจจุบัน
  uniCounts?: { total?: string; male?: string; female?: string };
  universities?: string[];
  universitiesOther?: string;
  shifts?: ShiftRow[];

  // 4) ความปลอดภัย
  housing?: {
    hospDorm?: boolean;
    privateDorm?: boolean;
    self?: boolean;
  };
  safetyStayTravel?: Level;
  safetyStayTravelNote?: string;
  safetyEnv?: Level;
  safetyEnvNote?: string;

  // 5) กิจกรรมที่นักศึกษาได้ปฏิบัติ
  activitiesDone?: {
    history?: boolean;
    vitalSigns?: boolean;
    diseasePrev?: boolean;
    medUseHistory?: boolean;
    referSuspect?: boolean;
    counselingChronic?: boolean;
    triage?: boolean;
    referToService?: boolean;
    medicationProfile?: boolean;
    ADR?: boolean;
    usageExplain?: boolean;
    adherenceFollow?: boolean;
    healthEdu?: boolean;
    community?: boolean;
    other?: string;
    overallComment?: string; // 5.2
  };

  // 6) ปัญหา/ข้อเสนอแนะ
  p611?: {
    dress?: ProblemRow;
    nailHair?: ProblemRow;
    personality?: ProblemRow;
    time?: ProblemRow;
    acceptOrder?: ProblemRow;
    obeyRules?: ProblemRow;
  };
  p622?: {
    thaiComm?: ProblemRow;
    medicalComm?: ProblemRow;
    englishComm?: ProblemRow;
    serviceManner?: ProblemRow;
  };
  p623_other?: string;

  // 7) งานเภสัชกรรมคลินิกในร้านยา
  clinic?: {
    counseling?: ClinicActivity & {
      hasProfile?: boolean;
      hasReferral?: boolean;
      hasFollowup?: boolean;
      otherFlag?: boolean;
      otherText?: string;
      byStuPerDay?: string;
      infoFrom?: string;
    };
    stopSmoking?: ClinicActivity & { 
      level?: "A1-A3" | "A4" | "A5" | "ยังไม่มีบริการ" | "" ; 
      hasGuideline?: boolean;
      plannedYear?: string;
      products?: string;
    };
    riskScreen?: ClinicActivity & {
      targets?: { DM?: boolean; HT?: boolean; other?: string };
      timing?: "ตลอดทั้งปี" | "เฉพาะโอกาส" | "";
      timingOther?: string;
      qualityProgram?: "เข้าร่วม" | "ไม่ได้เข้าร่วม" | "";
    };
    homeCare?: ClinicActivity & {
      isService?: "เป็นกิจกรรมเฉพาะของร้านยา" | "เป็นกิจกรรมร่วมกับสถานพยาบาล" | "";
      serviceOther?: string;
      qualityProgram?: "เข้าร่วม" | "ไม่ได้เข้าร่วม" | "";
    };
    massScreen?: ClinicActivity & { plan?: string; by?: string };
    other?: string;
  };

  // 8) ความเห็นของแหล่งฝึกต่อการศึกษา
  hostComments?: {
    coordination?: ProblemRow;
    printing?: ProblemRow;
    sendStudents?: ProblemRow;
    assessmentForm?: ProblemRow;
    other?: ProblemRow;
  };

  // 9) สิ่งที่ต้องการให้คณะสนับสนุน
  support?: {
    book?: string;
    academic?: string;
    shortCourse?: string;
    researchConsult?: string;
    other?: string;
  };

  // 10) ยินยอมสำรวจข้อมูลผ่านระบบออนไลน์
  consentSurvey?: YesNo;
  consentSurveyReason?: string;

  // 11) ยินยอมส่งต่อข้อมูลผู้รับบริการ
  consentClientData?: YesNo;
  consentClientDataReason?: string;

  // 12) การประเมินแหล่งฝึกโดยอาจารย์นิเทศ
  siteEvaluation?: {
    suitable?: boolean;
    suitableSpecific?: boolean;
    suitableSpecificText?: string;
    other?: string;
    note?: string;
  };
};

const UNIVERSITIES = [
  "จุฬา","มหิดล","เชียงใหม่","สงขลา","ศิลปากร","นเรศวร","ขอนแก่น","อุบลราชธานี",
  "ศรีนครินทรวิโรฒ","มหาสารคาม","รังสิต","หัวเฉียวฯ","สยาม","พายัพ","วลัยลักษณ์",
  "พะเยา","อัสสัมชัญ","บูรพา","ธรรมศาสตร์","อื่น ๆ (ระบุ)"
] as const;

const SHIFT_PERIODS: string[] = [
  "ผลัดที่ 1",
  "ผลัดที่ 2",
  "ผลัดที่ 3",
  "ผลัดที่ 4",
  "ผลัดที่ 5",
  "ผลัดที่ 6",
  "ผลัดที่ 7",
  "ผลัดที่ 8",
];

export default function Page(props: any) {
  const { id } = props;
  const { toast } = useToast();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    advisors: ["", "", ""],
    universities: [],
    shifts: SHIFT_PERIODS.map((p) => ({ period: p })),
    p611: {
      dress: {}, nailHair: {}, personality: {}, time: {}, acceptOrder: {}, obeyRules: {},
    },
    p622: {
      thaiComm: {}, medicalComm: {}, englishComm: {}, serviceManner: {},
    },
    clinic: {
      counseling: {}, stopSmoking: {}, riskScreen: {targets:{}}, homeCare: {}, massScreen: {},
    },
    hostComments: { coordination:{}, printing:{}, sendStudents:{}, assessmentForm:{}, other:{} },
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setNested = (path: string, v: any) => {
    setForm((p) => {
      const parts = path.split(".");
      const obj: any = { ...p };
      let cur = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...(cur[parts[i]] || {}) };
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = v;
      return obj;
    });
  };

  const toggleArray = (arr: string[] | undefined, value: string) => {
    const setArr = new Set(arr || []);
    setArr.has(value) ? setArr.delete(value) : setArr.add(value);
    return Array.from(setArr);
  };

  const submit = async () => {
    if (!form.siteName) {
      toast({ title: "กรอกชื่อแหล่งฝึก", variant: "destructive" });
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
        toast({ title: "บันทึกแล้ว", variant: "success" });
        router.push("/advisor/visits");
      } else throw new Error();
    } catch {
      toast({ title: "ส่งไม่สำเร็จ", description: "ลองใหม่", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
      <div className="p-4 space-y-8">
        <h1 className="text-xl font-semibold">
          แบบนิเทศการฝึกปฏิบัติงานเชิงวิชาชีพ (ร้านยา ปี 6)
        </h1>

        {/* 1. ข้อมูลทั่วไป */}
        <section className="space-y-3">
          <div className="font-medium">1) ข้อมูลทั่วไป</div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>ชื่อสถานปฏิบัติงาน</Label>
              <Input value={form.siteName || ""} onChange={(e) => set("siteName", e.target.value)} />
            </div>
            <div>
              <Label>สาขา</Label>
              <Input value={form.branch || ""} onChange={(e) => set("branch", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>ที่อยู่</Label>
              <Input value={form.address || ""} onChange={(e) => set("address", e.target.value)} />
            </div>
            <Input placeholder="ตำบล/แขวง" value={form.district || ""} onChange={(e)=>set("district", e.target.value)} />
            <Input placeholder="อำเภอ/เขต" value={form.amphoe || ""} onChange={(e)=>set("amphoe", e.target.value)} />
            <Input placeholder="จังหวัด" value={form.province || ""} onChange={(e)=>set("province", e.target.value)} />
            <Input placeholder="รหัสไปรษณีย์" value={form.postcode || ""} onChange={(e)=>set("postcode", e.target.value)} />
            <Input placeholder="โทรศัพท์" value={form.phone || ""} onChange={(e)=>set("phone", e.target.value)} />
            <Input placeholder="E-mail" value={form.email || ""} onChange={(e)=>set("email", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>แหล่งฝึกได้รับการรับรองเป็นร้านยาคุณภาพ</Label>
            <div className="grid md:grid-cols-4 gap-2">
              {[
                ["isQuality","เป็นร้านยาคุณภาพ"],
                ["inProgress","กำลังดำเนินการ"],
                ["general","ร้านยาทั่วไป"],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2">
                  <Checkbox
                    checked={(form.quality as any)?.[k]}
                    onCheckedChange={(c)=> set("quality", { ...(form.quality||{}), [k]: !!c } as any)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>กรณีรับมากกว่า 1 คน ระบุช่วงเวลาและจำนวนที่ปฏิบัติงาน</Label>
            {(form.multiTimeNotes || [{},{},{}]).map((row, i)=>(
              <div key={i} className="grid md:grid-cols-3 gap-2">
                <Input placeholder={`เวลา ...`} value={row.time||""}
                  onChange={(e)=> {
                    const arr = [...(form.multiTimeNotes||[])];
                    arr[i] = { ...(arr[i]||{}), time:e.target.value };
                    set("multiTimeNotes", arr);
                  }}/>
                <Input placeholder="มีนักศึกษาฝึกงาน ... คน" value={row.count||""}
                  onChange={(e)=> {
                    const arr = [...(form.multiTimeNotes||[])];
                    arr[i] = { ...(arr[i]||{}), count:e.target.value };
                    set("multiTimeNotes", arr);
                  }}/>
                <div />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-2">
            <div>
              <Label>จำนวนผู้รับบริการเฉลี่ยต่อวัน (คน)</Label>
              <Input value={form.servePerDay || ""} onChange={(e)=>set("servePerDay", e.target.value)} />
            </div>
          </div>
        </section>

        {/* 2. อาจารย์นิเทศ */}
        <section className="space-y-3">
          <div className="font-medium">2) อาจารย์นิเทศ</div>
          <div className="grid md:grid-cols-3 gap-2">
            {(form.advisors||[]).map((v,i)=>(
              <Input key={i} placeholder={`${i+1}. ชื่ออาจารย์นิเทศ`} value={v}
                onChange={(e)=> {
                  const a=[...(form.advisors||[])]; a[i]=e.target.value; set("advisors", a);
                }}/>
            ))}
          </div>
        </section>

        {/* 3. ข้อมูลการฝึกที่เกี่ยวกับแหล่งฝึกในปัจจุบัน */}
        <section className="space-y-3">
          <div className="font-medium">3) ข้อมูลการฝึกที่เกี่ยวกับแหล่งฝึกในปัจจุบัน</div>
          <div className="grid md:grid-cols-3 gap-2">
            {UNIVERSITIES.map((u)=>(
              <label key={u} className="flex items-center gap-2">
                <Checkbox
                  checked={!!form.universities?.includes(u as string)}
                  onCheckedChange={()=> set("universities", toggleArray(form.universities, u as string))}
                />
                <span className="text-sm">{u}</span>
              </label>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-2">
            <Input placeholder="อื่น ๆ (ระบุ)" value={form.universitiesOther||""}
              onChange={(e)=>set("universitiesOther", e.target.value)} />
            <Input placeholder="จำนวนรวม (คน)" value={form.uniCounts?.total||""}
              onChange={(e)=>set("uniCounts", { ...(form.uniCounts||{}), total: e.target.value })}/>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="ชาย" value={form.uniCounts?.male||""}
                onChange={(e)=>set("uniCounts", { ...(form.uniCounts||{}), male: e.target.value })}/>
              <Input placeholder="หญิง" value={form.uniCounts?.female||""}
                onChange={(e)=>set("uniCounts", { ...(form.uniCounts||{}), female: e.target.value })}/>
            </div>
          </div>

          {/* ตารางจำนวนรับในแต่ละผลัด */}
          <div className="rounded-md border overflow-x-auto">
            <div className="p-2 font-medium bg-slate-50">จำนวนรับนักศึกษาในแต่ละผลัด</div>
            <div className="min-w-[720px] grid grid-cols-9 text-sm">
              <div className="p-2 border">ช่วงวันที่/จำนวนรับ(คน)</div>
              {form.shifts?.map((s, i)=>(
                <div key={i} className="p-2 border">
                  <div className="text-xs">{s.period}</div>
                  <Input className="mt-1" placeholder="คน" value={s.count||""}
                    onChange={(e)=> {
                      const arr=[...(form.shifts||[])]; arr[i]={...arr[i], count:e.target.value};
                      set("shifts", arr);
                    }}/>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. ความปลอดภัย */}
        <section className="space-y-3">
          <div className="font-medium">4) ความปลอดภัยของสถานที่ในการฝึกปฏิบัติงาน</div>
          <div className="space-y-2">
            <Label>1) ที่พัก</Label>
            <div className="grid md:grid-cols-3 gap-2">
              {[
                ["hospDorm","เป็นที่พักของร้านยา"],
                ["privateDorm","เป็นของเอกชนที่แหล่งฝึกแนะนำ"],
                ["self","นิสิต/นักศึกษาจัดหาเอง"],
              ].map(([k,label])=>(
                <label key={k} className="flex items-center gap-2">
                  <Checkbox
                    checked={(form.housing as any)?.[k]}
                    onCheckedChange={(c)=> set("housing",{...(form.housing||{}), [k]: !!c} as any)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>2) ความปลอดภัยของที่พักและการเดินทาง</Label>
              <RadioGroup
                className="flex gap-6 mt-1"
                value={form.safetyStayTravel || ""}
                onValueChange={(v)=> set("safetyStayTravel", v as Level)}
              >
                {["มาก","ปานกลาง","น้อย"].map(v=>(
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={v}/>
                    <span>{v}</span>
                  </label>
                ))}
              </RadioGroup>
              <Input className="mt-2" placeholder="หมายเหตุ" value={form.safetyStayTravelNote||""}
                onChange={(e)=>set("safetyStayTravelNote", e.target.value)} />
            </div>
            <div>
              <Label>3) ความปลอดภัยของสิ่งแวดล้อมโดยรอบร้าน</Label>
              <RadioGroup
                className="flex gap-6 mt-1"
                value={form.safetyEnv || ""}
                onValueChange={(v)=> set("safetyEnv", v as Level)}
              >
                {["มาก","ปานกลาง","น้อย"].map(v=>(
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={v}/>
                    <span>{v}</span>
                  </label>
                ))}
              </RadioGroup>
              <Input className="mt-2" placeholder="หมายเหตุ" value={form.safetyEnvNote||""}
                onChange={(e)=>set("safetyEnvNote", e.target.value)} />
            </div>
          </div>
        </section>

        {/* 5) กิจกรรมที่นักศึกษาได้ปฏิบัติ + 5.2 */}
        <section className="space-y-3">
          <div className="font-medium">5) การฝึกปฏิบัติงานที่นิสิต/นักศึกษาได้ปฏิบัติ</div>
          <Label> 5.1 กิจกรรมการฝึกงานที่นิสิตนักศึกษาได้ปฏิบัติ (เลือกได้มากกว่า 1 ข้อ)</Label>
          <div className="grid md:grid-cols-1 gap-2">
            {[
              ["history","การสอบถามประวัติ"],
              ["vitalSigns","การประเมินร่างกายเบื้องต้น"],
              ["diseaseDiagnosis","การวิเคราะห์แยกโรค และวินิจฉัยทางเภสัชกรรม"],
              ["chronicHistory","การสอบถามประวัติและติดตามในผู้ป่วยโรคเรื้อรัง"],
              ["riskScreening","การคัดกรองผู้ป่วยที่มีความเสี่ยงในการเป็นโรคเรื้อรังหรืออื่นๆ เช่น โปรดระบุ"],
              ["medicationSelection","การเลือกยาเพื่อรักษาโรค/อาการ"],
              ["medicationDispensing","การส่งมอบยาให้กับผู้มารับบริการ"],
              ["medicationProfile","การจัดทำประวัติการใช้ยาของผู้มารับบริการ (Medication Profile)"],
              ["drugProblemResolution","การสืบค้นปัญหาจากการใช้ยา และเสนอแนะแนวทางการแก้ไขปัญหาที่เกิดขึ้น"],
              ["medicationMonitoring","การติดตามและประเมินผลการใช้ยาของผู้ป่วย/อาการไม่พึงประสงค์จากการใช้ยา"],
              ["patientCounseling","การให้คำแนะนำ/ปรึกษาผู้มารับบริการเรื่องโรค การใช้ยา การป้องกันการกลับเป็นซ้ำ การปรับเปลี่ยนพฤติกรรมสุขภาพ"],
              ["specialTechnique","การแนะนำวิธีใช้ยาเทคนิคพิเศษ"],
              ["healthProductInfo","การให้บริการสารสนเทศเกี่ยวกับผลิตภัณฑ์สุขภาพ"],
              ["patientReferral","การส่งต่อผู้ป่วยและผู้รับบริการเพื่อรับการรักษาที่เหมาะสมในสถานพยาบาล"],
              ["pharmacyManagement","การบริหารร้านยา เช่น การบริหารเวชภัณฑ์"],
              ["communityActivities","กิจกรรมอื่นๆ เช่น การเยี่ยมบ้านผู้ป่วย บริการเลิกบุหรี่ การให้ความรู้หรือการแก้ไขปัญหาสุขภาพในชุมชน การให้บริการผลิตภัณฑ์สุขภาพอื่นๆ โปรดระบุ"],
            ].map(([k,l])=>(
              <label key={k} className="flex items-start gap-2">
                <Checkbox
                  checked={(form.activitiesDone as any)?.[k]}
                  onCheckedChange={(c)=> set("activitiesDone", { ...(form.activitiesDone||{}), [k]: !!c } as any)}
                />
                <span className="text-sm">{l}</span>
              </label>
            ))}
          </div>
          <Input placeholder="อื่น ๆ (ระบุ)" value={form.activitiesDone?.other||""}
            onChange={(e)=> set("activitiesDone", { ...(form.activitiesDone||{}), other:e.target.value })}/>
          <div>
            <Label>5.2 ความคิดเห็นและคุณภาพของการศึกษาฝึกงานในแหล่งฝึก (โดยรวม)</Label>
            <Textarea rows={4} value={form.activitiesDone?.overallComment||""}
              onChange={(e)=> set("activitiesDone", { ...(form.activitiesDone||{}), overallComment:e.target.value })}/>
          </div>
        </section>

        {/* 6) ปัญหา/ข้อเสนอแนะ (6.1.1 & 6.2.2 & 6.2.3) */}
        <section className="space-y-3">
          <div className="font-medium">6) ปัญหาที่เกี่ยวข้องกับการฝึกปฏิบัติงาน *สามารถระบุคำแนะนำเพิ่มเติมลงในท้ายของแต่ละปัญหา</div>

          {/* 6.1.1 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">6.1.1 บุคลิกภาพและความประพฤติระหว่างการฝึกปฏิบัติงาน</div>
            {[
              ["dress","สุขภาพเรียบร้อย"],
              ["nailHair","แต่งกายเหมาะสม"],
              ["personality","บุคลิกภาพเหมาะสม"],
              ["time","มีความตรงต่อเวลา"],
              ["acceptOrder","มีความรับผิดชอบต่อภารกิจที่ได้รับมอบหมาย"],
              ["obeyRules","มีความกระตือรือร้นในการฝึกปฏิบัติงาน"],
            ].map(([k,label])=>(
              <div key={k} className="grid md:grid-cols-6 gap-2 p-3 border-t">
                <div className="md:col-span-2 text-sm">{label}</div>
                <label className="flex items-center gap-2">
                  <Checkbox checked={(form.p611 as any)?.[k]?.none}
                    onCheckedChange={(c)=> setNested(`p611.${k}.none`, !!c)}/>
                  <span className="text-sm">ไม่พบปัญหา</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={(form.p611 as any)?.[k]?.has}
                    onCheckedChange={(c)=> setNested(`p611.${k}.has`, !!c)}/>
                  <span className="text-sm">มีข้อเสนอแนะ</span>
                </label>
                <div className="md:col-span-2">
                  <Input placeholder="รายละเอียด" value={(form.p611 as any)?.[k]?.note || ""}
                    onChange={(e)=> setNested(`p611.${k}.note`, e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* 6.2.2 */}
          <div className="rounded-md border">
            <div className="p-2 font-medium bg-slate-50">6.2.2 ความสามารถของนิสิต/นักศึกษา</div>
            {[
              ["thaiComm","มีความรู้เพียงพอและเหมาะสม"],
              ["medicalComm","มีทักษะในการสื่อสารทางการแพทย์กับผู้รับบริการ"],
              ["englishComm","มีความสามารถในการสื่อสารภาษาอังกฤษ"],
              ["serviceManner","มีความรับผิดชอบในการให้บริการในร้านยา"],
            ].map(([k,label])=>(
              <div key={k} className="grid md:grid-cols-6 gap-2 p-3 border-t">
                <div className="md:col-span-2 text-sm">{label}</div>
                <label className="flex items-center gap-2">
                  <Checkbox checked={(form.p622 as any)?.[k]?.none}
                    onCheckedChange={(c)=> setNested(`p622.${k}.none`, !!c)}/>
                  <span className="text-sm">ไม่พบปัญหา</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={(form.p622 as any)?.[k]?.has}
                    onCheckedChange={(c)=> setNested(`p622.${k}.has`, !!c)}/>
                  <span className="text-sm">มีข้อเสนอแนะ</span>
                </label>
                <div className="md:col-span-2">
                  <Input placeholder="รายละเอียด" value={(form.p622 as any)?.[k]?.note || ""}
                    onChange={(e)=> setNested(`p622.${k}.note`, e.target.value)} />
                </div>
              </div>
            ))}
            <div className="p-3 border-t">
              <Label>6.2.3 อื่น ๆ</Label>
              <Textarea rows={3} value={form.p623_other||""}
                onChange={(e)=> set("p623_other", e.target.value)} />
            </div>
          </div>
        </section>

        {/* 7) งานเภสัชกรรมคลินิกในร้านยา */}
        <section className="space-y-3">
          <div className="font-medium">7) งานทางเภสัชกรรมคลินิกที่มีในร้านยา</div>

          {/* 1. counseling */}
          <div className="rounded-md border p-3 space-y-2">
            <div className="font-medium">1) การให้บริการผู้ป่วยโรคเรื้อรัง (counseling)</div>
            <div className="text-sm text-muted-foreground mb-2">ลักษณะกิจกรรม</div>
            <div className="grid md:grid-cols-1 gap-2">
              {[
                ["reviewMedication","ทบทวนการใช้ยาของผู้ป่วยและประเมินปัญหาการใช้ยา & อื่น ๆ"],
                ["hasProfile","มีการบันทึกข้อมูลผู้ป่วย (patient profile)"],
                ["hasReferral","มีการประเมิน/ส่งต่อผู้ป่วยไปสถานพยาบาล (เช่น ทำบันทึกข้อความถึงแพทย์)"],
                ["hasFollowup","มีการติดตามผู้ป่วยต่อเนื่อง"],
              ].map(([k,l])=>(
                <label key={k} className="flex items-start gap-2">
                  <Checkbox checked={(form.clinic?.counseling as any)?.[k]}
                    onCheckedChange={(c)=> setNested(`clinic.counseling.${k}`, !!c)} />
                  <span className="text-sm">{l}</span>
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-sm">อื่น ๆ</Label>
              <Input placeholder="ระบุรายละเอียดเพิ่มเติม..." value={form.clinic?.counseling?.otherText||""}
                onChange={(e)=> setNested("clinic.counseling.otherText", e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-sm">จำนวนผู้รับบริการโดยเฉลี่ยต่อสัปดาห์ (คน)</Label>
                <Input placeholder="จำนวน..." value={form.clinic?.counseling?.byStuPerDay||""}
                  onChange={(e)=> setNested("clinic.counseling.byStuPerDay", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">ข้อมูลอื่น ๆ</Label>
                <Input placeholder="ข้อมูลเพิ่มเติม..." value={form.clinic?.counseling?.infoFrom||""}
                  onChange={(e)=> setNested("clinic.counseling.infoFrom", e.target.value)} />
              </div>
            </div>
          </div>

          {/* 2. stop smoking */}
          <div className="rounded-md border p-3 space-y-2">
            <div className="font-medium">2) การให้บริการเลิกบุหรี่ (smoking cessation) ในที่นี้รวมได้แม้ว่าจะไม่ได้ทำครบ 5A</div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">ให้บริการ</Label>
                <RadioGroup 
                  className="flex flex-wrap gap-4 mt-1"
                  value={form.clinic?.stopSmoking?.level||""}
                  onValueChange={(val)=> setNested("clinic.stopSmoking.level", val as any)}
                >
                  {["A1-A3","A4","A5","ยังไม่มีบริการ"].map(v=>(
                    <label key={v} className="flex items-center gap-2">
                      <RadioGroupItem value={v} />
                      <span className="text-sm">{v}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

                <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-sm">มีแผนจะเริ่มในปี</Label>
                  <Input placeholder="ระบุปี..." value={form.clinic?.stopSmoking?.plannedYear||""}
                  onChange={(e)=> setNested("clinic.stopSmoking.plannedYear", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">มีผลิตภัณฑ์ช่วยเลิกบุหรี่จำหน่าย ได้แก่</Label>
                  <Input placeholder="ระบุผลิตภัณฑ์..." value={form.clinic?.stopSmoking?.products||""}
                  onChange={(e)=> setNested("clinic.stopSmoking.products", e.target.value)} />
                </div>
                </div>

              <div className="space-y-2">
                <Label className="text-sm">ข้อมูลอื่น ๆ</Label>
                <Textarea placeholder="ข้อมูลเพิ่มเติม..." rows={3}
                  value={form.clinic?.stopSmoking?.details||""}
                  onChange={(e)=> setNested("clinic.stopSmoking.details", e.target.value)} />
              </div>
            </div>
          </div>

          {/* 3. health risk screening */}
          <div className="rounded-md border p-3 space-y-2">
            <div className="font-medium">3) การให้บริการคัดกรองความเสี่ยงด้านสุขภาพ (health risk screening)</div>
            
            <div className="space-y-2">
              <Label className="text-sm">หัวข้อ</Label>
              <div className="flex flex-wrap gap-4">
                {[
                  ["DM","DM"],
                  ["HT","HT"],
                ].map(([k,l])=>(
                  <label key={k} className="flex items-center gap-2">
                    <Checkbox checked={(form.clinic?.riskScreen?.targets as any)?.[k]}
                      onCheckedChange={(c)=> setNested(`clinic.riskScreen.targets.${k}`, !!c)} />
                    <span className="text-sm">{l}</span>
                  </label>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-sm">อื่น ๆ</span>
                  <Input className="w-56" value={form.clinic?.riskScreen?.targets?.other||""}
                    onChange={(e)=> setNested("clinic.riskScreen.targets.other", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">ระยะเวลาให้บริการ</Label>
              <RadioGroup 
                className="flex flex-wrap gap-4"
                value={form.clinic?.riskScreen?.timing||""}
                onValueChange={(val)=> setNested("clinic.riskScreen.timing", val as any)}
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="ตลอดทั้งปี" />
                  <span className="text-sm">มีบริการตลอดทั้งปี</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="เฉพาะโอกาส" />
                  <span className="text-sm">เฉพาะโอกาส เช่น สัปดาห์เภสัช</span>
                </label>
              </RadioGroup>
              <div className="flex items-center gap-2">
                <span className="text-sm">อื่น ๆ</span>
                <Input className="w-56" value={form.clinic?.riskScreen?.timingOther||""}
                  onChange={(e)=> setNested("clinic.riskScreen.timingOther", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">เข้าร่วมโครงการร้านยาคุณภาพกับสปสช</Label>
              <RadioGroup 
                className="flex gap-4"
                value={form.clinic?.riskScreen?.qualityProgram||""}
                onValueChange={(val)=> setNested("clinic.riskScreen.qualityProgram", val as any)}
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="เข้าร่วม" />
                  <span className="text-sm">เข้าร่วม</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="ไม่ได้เข้าร่วม" />
                  <span className="text-sm">ไม่ได้เข้าร่วม</span>
                </label>
              </RadioGroup>
            </div>

            <Textarea placeholder="รายละเอียด" rows={3}
              value={form.clinic?.riskScreen?.details||""}
              onChange={(e)=> setNested("clinic.riskScreen.details", e.target.value)} />
          </div>

          {/* 4. home health care */}
          <div className="rounded-md border p-3 space-y-2">
            <div className="font-medium">4) การเยี่ยมติดตามดูแลผู้ป่วยที่บ้าน (home health care)</div>
            
            <div className="space-y-2">
              <Label className="text-sm">ลักษณะกิจกรรม</Label>
              <RadioGroup 
                className="flex flex-wrap gap-4"
                value={form.clinic?.homeCare?.isService||""}
                onValueChange={(val)=> setNested("clinic.homeCare.isService", val as any)}
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="เป็นกิจกรรมเฉพาะของร้านยา" />
                  <span className="text-sm">เป็นกิจกรรมเฉพาะของร้านยา</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="เป็นกิจกรรมร่วมกับสถานพยาบาล" />
                  <span className="text-sm">เป็นกิจกรรมร่วมกับสถานพยาบาล</span>
                </label>
              </RadioGroup>
              <div className="flex items-center gap-2">
                <span className="text-sm">อื่น ๆ</span>
                <Input className="w-56" value={form.clinic?.homeCare?.serviceOther||""}
                  onChange={(e)=> setNested("clinic.homeCare.serviceOther", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">เข้าร่วมโครงการร้านยาคุณภาพกับสปสชหรือไม่</Label>
              <RadioGroup 
                className="flex gap-4"
                value={form.clinic?.homeCare?.qualityProgram||""}
                onValueChange={(val)=> setNested("clinic.homeCare.qualityProgram", val as any)}
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="เข้าร่วม" />
                  <span className="text-sm">เข้าร่วม</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="ไม่ได้เข้าร่วม" />
                  <span className="text-sm">ไม่ได้เข้าร่วม</span>
                </label>
              </RadioGroup>
            </div>

            <Textarea rows={3} placeholder="รายละเอียด"
              value={form.clinic?.homeCare?.details||""}
              onChange={(e)=> setNested("clinic.homeCare.details", e.target.value)} />
          </div>

          {/* 5. mass screening */}
          <div className="rounded-md border p-3 space-y-2">
            <div className="font-medium">5) การมีกิจกรรมรณรงค์เรื่องสุขภาพหรือการใช้ยาในชุมชน</div>
            ในปีที่ผ่านมา จัดหรือเข้าร่วมจัดกิจกรรมใดบ้าง
ลักษณะกิจกรรม<Textarea rows={3} placeholder="รายละเอียดกิจกรรม/วันที่/สถานที่ วันเวลาที่จัดงาน" 
              value={form.clinic?.massScreen?.details||""}
              onChange={(e)=> setNested("clinic.massScreen.details", e.target.value)} />
          </div>

          <div className="rounded-md border p-3">
            <Label>6) อื่น ๆ โปรดระบุ</Label>
            <Input value={form.clinic?.other||""}
              onChange={(e)=> setNested("clinic.other", e.target.value)} />
          </div>
        </section>

        {/* 8) ความเห็นของแหล่งฝึก */}
        <section className="space-y-3">
          <div className="font-medium">8) ความเห็นของแหล่งฝึกต่อการศึกษา</div>
          {[
            ["coordination","1.การประสานงาน"],
            ["printing","2. คู่มือการฝึกงาน สิ่งที่ต้องการให้เพิ่มเติม"],
            ["sendStudents","สิ่งที่ควรตัดออก"],
            ["assessmentForm","แบบประเมิน"],
            ["other","ข้อเสนอแนะอื่น ๆ"],
          ].map(([k,title])=>(
            <div key={k} className="grid md:grid-cols-6 gap-2 p-3 border rounded-md">
              <div className="md:col-span-2 font-medium text-sm">{title}</div>
              <label className="flex items-center gap-2">
                <Checkbox checked={(form.hostComments as any)?.[k]?.none}
                  onCheckedChange={(c)=> setNested(`hostComments.${k}.none`, !!c)} />
                <span className="text-sm">ไม่พบปัญหา</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={(form.hostComments as any)?.[k]?.has}
                  onCheckedChange={(c)=> setNested(`hostComments.${k}.has`, !!c)} />
                <span className="text-sm">มีข้อเสนอแนะ</span>
              </label>
              <div className="md:col-span-2">
                <Textarea rows={2} placeholder="Comment"
                  value={(form.hostComments as any)?.[k]?.note || ""}
                  onChange={(e)=> setNested(`hostComments.${k}.note`, e.target.value)} />
              </div>
            </div>
          ))}
        </section>

        {/* 9) ขอการสนับสนุน */}
        <section className="space-y-3">
          <div className="font-medium">9) สิ่งที่ต้องการให้คณะสนับสนุน</div>
          {[
            ["book","1. หนังสือ"],
            ["academic","2. การอบรมทางวิชาการ"],
            ["shortCourse","3. Short course training"],
            ["researchConsult","4. ปรึกษางานวิจัย"],
            ["other","5. อื่น ๆ"],
          ].map(([k, label])=>(
            <div key={k} className="grid md:grid-cols-4 gap-2">
              <div className="md:col-span-1 text-sm flex items-center">{label}</div>
              <div className="md:col-span-3">
                <Input value={(form.support as any)?.[k] || ""} onChange={(e)=> setNested(`support.${k}`, e.target.value)} />
              </div>
            </div>
          ))}
        </section>

        {/* 10–11) ยินยอม */}
        <section className="grid md:grid-cols-2 gap-3">
          <div className="rounded-md border p-3">
            <div className="font-medium space-y-1">
              <div>10) ถ้ามีการสำรวจการฝึกงานโดยการใช้โปรแกรมการสำรวจการฝึกงานผ่านทางออนไลน์</div>
              <div>ท่านยินดีจะให้ข้อมูลผ่านทางระบบหรือไม่</div>
            </div>
            <RadioGroup value={form.consentSurvey||""} onValueChange={(v)=> set("consentSurvey", v as YesNo)}
              className="flex gap-6 mt-2">
              {["ยินดี","ไม่ยินดี"].map(v=>(
                <label key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v}/><span className="text-sm">{v}</span>
                </label>
              ))}
            </RadioGroup>
            <Input className="mt-2" placeholder="เหตุผล" value={form.consentSurveyReason||""}
              onChange={(e)=> set("consentSurveyReason", e.target.value)} />
          </div>
          <div className="rounded-md border p-3">
            <div className="font-medium space-y-1">
              <div>11) ถ้ามีโปรแกรมลงข้อมูลผู้รับบริการ ได้แก่ โปรแกรมการให้บริการคัดกรองความเสี่ยงด้านสุขภาพ หรือ การให้บริการเลิกบุหรี่</div>
              <div>ท่านมีความต้องการใช้โปรแกรมดังกล่าวเพื่อการลงข้อมูลผู้ป่วยหรือไม่</div>
            </div>
            <RadioGroup value={form.consentClientData||""} onValueChange={(v)=> set("consentClientData", v as YesNo)}
              className="flex gap-6 mt-2">
              {["ยินดี","ไม่ยินดี"].map(v=>(
                <label key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v}/><span className="text-sm">{v}</span>
                </label>
              ))}
            </RadioGroup>
            <Input className="mt-2" placeholder="เหตุผล" value={form.consentClientDataReason||""}
              onChange={(e)=> set("consentClientDataReason", e.target.value)} />
          </div>
        </section>

        {/* 12) การประเมินแหล่งฝึก */}
        <section className="space-y-3">
          <div className="font-medium">12) การประเมินแหล่งฝึก โดยอาจารย์นิเทศ</div>
          <div className="grid md:grid-cols-2 gap-2">
            <label className="flex items-center gap-2">
              <Checkbox checked={!!form.siteEvaluation?.suitable}
                onCheckedChange={(c)=> set("siteEvaluation", { ...(form.siteEvaluation||{}), suitable: !!c })}/>
              <span className="text-sm">เป็นแหล่งฝึกที่เหมาะสำหรับเป็นแหล่งฝึกทางบริบาลเภสัชกรรม</span>
            </label>
            <div className="flex items-start gap-2">
              <Checkbox checked={!!form.siteEvaluation?.suitableSpecific}
                onCheckedChange={(c)=> set("siteEvaluation", { ...(form.siteEvaluation||{}), suitableSpecific: !!c })}/>
              <Input placeholder="เหมาะสมสำหรับ... (ระบุ)"
                value={form.siteEvaluation?.suitableSpecificText||""}
                onChange={(e)=> set("siteEvaluation", { ...(form.siteEvaluation||{}), suitableSpecificText: e.target.value })}/>
            </div>
            <Input className="md:col-span-2" placeholder="อื่น ๆ โปรดระบุ"
              value={form.siteEvaluation?.other||""}
              onChange={(e)=> set("siteEvaluation", { ...(form.siteEvaluation||{}), other: e.target.value })}/>
          </div>
          <div>
            <Label>หมายเหตุ</Label>
            <Textarea rows={3} value={form.siteEvaluation?.note||""}
              onChange={(e)=> set("siteEvaluation", { ...(form.siteEvaluation||{}), note: e.target.value })}/>
          </div>
        </section>
      </div>

      <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
        <Link href="/advisor/visits">
          <Button variant="outline" className="border-gray-300 text-gray-600">ยกเลิก</Button>
        </Link>
        <Button onClick={submit} disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
          {isSaving ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />กำลังส่ง...</>) : (
            <><CheckCircleIcon className="h-4 w-4 mr-2" />บันทึกและส่งรายงาน</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
