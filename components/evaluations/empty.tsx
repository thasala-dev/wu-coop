import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, FileQuestion, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page(props: any) {
  const { form: parentForm, isSubmit, setFormValidated, isClick } = props;

  // ส่งสัญญาณว่าฟอร์มยังไม่พร้อม
  useEffect(() => {
    if (isSubmit && setFormValidated) {
      setFormValidated(false);
      console.log("Form is not ready - validation failed");
    }
  }, [isSubmit, setFormValidated]);

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full border-yellow-200 bg-yellow-50/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-yellow-800">
            แบบฟอร์มยังไม่พร้อม
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-yellow-700">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">สถานะ: กำลังพัฒนา</span>
            </div>

            <p className="text-sm text-yellow-600 leading-relaxed">
              แบบฟอร์มการประเมินนี้ยังอยู่ระหว่างการพัฒนา
              <br />
              กรุณารอการอัปเดตในอนาคต
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
