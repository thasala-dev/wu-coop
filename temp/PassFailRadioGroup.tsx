"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PassFailRadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  keyPrefix: string;
  isVisible: boolean;
}

export function PassFailRadioGroup({
  value,
  onValueChange,
  keyPrefix,
  isVisible,
}: PassFailRadioGroupProps) {
  return (
    <RadioGroup
      onValueChange={onValueChange}
      value={value}
      className={`flex flex-col items-center gap-3 ${
        isVisible ? "visible" : "invisible"
      }`}
    >
      <div className="flex items-center justify-center gap-1">
        <Label htmlFor={`${keyPrefix}-pass`} className="text-xs mr-1">
          ผ่าน
        </Label>
        <RadioGroupItem value="pass" id={`${keyPrefix}-pass`} />
      </div>
      <div className="flex items-center justify-center gap-1">
        <Label htmlFor={`${keyPrefix}-fail`} className="text-xs mr-1">
          ไม่ผ่าน
        </Label>
        <RadioGroupItem value="fail" id={`${keyPrefix}-fail`} />
      </div>
    </RadioGroup>
  );
}
