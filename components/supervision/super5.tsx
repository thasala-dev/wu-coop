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
