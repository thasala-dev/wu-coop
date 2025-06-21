"use client";
import Avatar, { genConfig } from "react-nice-avatar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Shuffle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const options = {
  sex: ["man", "woman"],
  hairStyle: ["normal", "thick", "mohawk", "womanLong", "womanShort"],

  faceColor: [
    "#F9C9B6", // light peach
    "#AC6651", // medium brown
    "#F28B67", // warm tan
    "#FFD7C2", // pale
    "#A8755A", // deep brown
    "#F7E7CE", // fair
  ],
  hairColor: [
    "#2C1B18", // dark brown
    "#705446", // medium brown
    "#B58143", // light brown/blonde
    "#D6B370", // golden blonde
    "#A55728", // auburn
    "#4B3F2A", // ash brown
  ],
  hatColor: [
    "#1E293B", // navy blue
    "#F59E42", // orange
    "#E11D48", // pink/red
    "#10B981", // teal green
    "#FACC15", // yellow
    "#64748B", // slate gray
  ],
  shirtColor: [
    "#2563EB", // blue
    "#F87171", // red
    "#34D399", // green
    "#FBBF24", // yellow
    "#A78BFA", // purple
    "#6B7280", // gray
  ],
  bgColor: [
    "#F3F4F6", // light gray
    "#E0E7FF", // soft blue
    "#FEF9C3", // pale yellow
    "#D1FAE5", // mint green
    "#FDE68A", // light gold
    "#FECACA", // soft pink
  ],

  earSize: ["small", "big"],
  hatStyle: ["none", "beanie", "turban"],
  eyeStyle: ["circle", "oval", "smile"],
  glassesStyle: ["none", "round", "square"],
  noseStyle: ["short", "long", "round"],
  mouthStyle: ["laugh", "smile", "peace"],
  shirtStyle: ["hoody", "short", "polo"],
};
const random = (int: number) => {
  return Math.floor(Math.random() * int);
};

const randomize = () => {
  const randomConfig = {
    sex: options.sex[random(options.sex.length)],
    faceColor: options.faceColor[random(options.faceColor.length)],
    earSize: options.earSize[random(options.earSize.length)],
    hairColor: options.hairColor[random(options.hairColor.length)],
    hairStyle: options.hairStyle[random(options.hairStyle.length)],
    hatColor: options.hatColor[random(options.hatColor.length)],
    hatStyle: options.hatStyle[random(options.hatStyle.length)],
    eyeStyle: options.eyeStyle[random(options.eyeStyle.length)],
    glassesStyle: options.glassesStyle[random(options.glassesStyle.length)],
    noseStyle: options.noseStyle[random(options.noseStyle.length)],
    mouthStyle: options.mouthStyle[random(options.mouthStyle.length)],
    shirtColor: options.shirtColor[random(options.shirtColor.length)],
    shirtStyle: options.shirtStyle[random(options.shirtStyle.length)],
    bgColor: options.bgColor[random(options.bgColor.length)],
  };
  return randomConfig;
};

const fromQueryString = (queryString: any) => {
  return queryString
    .replace(/^\?/, "")
    .split("&")
    .reduce((acc: any, pair: string) => {
      const [key, value] = pair.split("=").map(decodeURIComponent);
      acc[key] = value;
      return acc;
    }, {});
};

const toQueryString = (obj: any) => {
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
};

interface Props {
  value: any;
  setValue?: any;
  size?: string;
}

export default function AvatarDesign({ value, setValue, size = "12" }: Props) {
  const [mounted, setMounted] = useState(false);
  const [customBox, setCustomBox] = useState(false);
  const [cfg, setCfg] = useState<any>(randomize());

  useEffect(() => {
    if (!mounted) return;
    if (value) {
      try {
        const parsedValue = fromQueryString(value);
        setCfg(parsedValue);
      } catch (error) {
        console.error("Error parsing value:", error);
      }
    } else {
      const initialConfig = randomize();
      setCfg(initialConfig);
      if (setValue) {
        handleSetValue(initialConfig);
      }
    }
  }, [value, mounted]);

  const handleSetValue = (value: any) => {
    let arrayToString = toQueryString(value);
    setValue(arrayToString);
  };

  const handleRandomize = () => {
    const randomConfig = randomize();
    setCfg(randomConfig);
    if (setValue) {
      handleSetValue(randomConfig);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-${size} h-${size} bg-gray-200 rounded-md animate-pulse`}
      ></div>
    );
  }

  return (
    <>
      <Dialog open={customBox} onOpenChange={setCustomBox}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>ปรับแต่งอวตาร</DialogTitle>
          </DialogHeader>
          <div className="py-2 grid grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col items-center">
              <Avatar
                className="w-36 h-36"
                shape="rounded"
                {...genConfig(cfg)}
              />
              <Button
                onClick={handleRandomize}
                variant="outline"
                className="mt-4"
                size="sm"
              >
                <Shuffle className="mr-2 h-4 w-4" />
                สุ่ม
              </Button>
            </div>

            <div className="col-span-2 overflow-y-auto max-h-80">
              <div className="grid grid-cols-1 gap-3">
                {/* Sex Selection */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">เพศ</label>
                  <div className="flex flex-wrap gap-2">
                    {options.sex.map((sex) => (
                      <Button
                        key={sex}
                        variant={cfg.sex === sex ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, sex };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {sex === "man" ? "ชาย" : "หญิง"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">ทรงผม</label>
                  <div className="flex flex-wrap gap-2">
                    {options.hairStyle.map((style) => (
                      <Button
                        key={style}
                        variant={
                          cfg.hairStyle === style ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, hairStyle: style };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">สีผม</label>
                  <div className="flex flex-wrap gap-2">
                    {options.hairColor.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          cfg.hairColor === color
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          const newCfg = { ...cfg, hairColor: color };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Skin Color */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">สีผิว</label>
                  <div className="flex flex-wrap gap-2">
                    {options.faceColor.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          cfg.faceColor === color
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          const newCfg = { ...cfg, faceColor: color };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Eye Style */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">รูปแบบดวงตา</label>
                  <div className="flex flex-wrap gap-2">
                    {options.eyeStyle.map((style) => (
                      <Button
                        key={style}
                        variant={cfg.eyeStyle === style ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, eyeStyle: style };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mouth Style */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">รูปแบบปาก</label>
                  <div className="flex flex-wrap gap-2">
                    {options.mouthStyle.map((style) => (
                      <Button
                        key={style}
                        variant={
                          cfg.mouthStyle === style ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, mouthStyle: style };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>{" "}
                </div>

                {/* Nose Style */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">รูปแบบจมูก</label>
                  <div className="flex flex-wrap gap-2">
                    {options.noseStyle.map((style) => (
                      <Button
                        key={style}
                        variant={
                          cfg.noseStyle === style ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, noseStyle: style };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Ear Size */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">ขนาดหู</label>
                  <div className="flex flex-wrap gap-2">
                    {options.earSize.map((size) => (
                      <Button
                        key={size}
                        variant={cfg.earSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, earSize: size };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {size === "small" ? "เล็ก" : "ใหญ่"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hat Style */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">รูปแบบหมวก</label>
                  <div className="flex flex-wrap gap-2">
                    {options.hatStyle.map((style) => (
                      <Button
                        key={style}
                        variant={cfg.hatStyle === style ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, hatStyle: style };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {style === "none" ? "ไม่มีหมวก" : style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Hat Color (only show if hat style is not none) */}
                {cfg.hatStyle !== "none" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">สีหมวก</label>
                    <div className="flex flex-wrap gap-2">
                      {options.hatColor.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            cfg.hatColor === color
                              ? "border-blue-500"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const newCfg = { ...cfg, hatColor: color };
                            setCfg(newCfg);
                            if (setValue) handleSetValue(newCfg);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Glasses Style */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">รูปแบบแว่นตา</label>
                  <div className="flex flex-wrap gap-2">
                    {options.glassesStyle.map((style) => (
                      <Button
                        key={style}
                        variant={
                          cfg.glassesStyle === style ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, glassesStyle: style };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {style === "none" ? "ไม่มีแว่น" : style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Shirt Style */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">รูปแบบเสื้อ</label>
                  <div className="flex flex-wrap gap-2">
                    {options.shirtStyle.map((style) => (
                      <Button
                        key={style}
                        variant={
                          cfg.shirtStyle === style ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const newCfg = { ...cfg, shirtStyle: style };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Shirt Color */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">สีเสื้อ</label>
                  <div className="flex flex-wrap gap-2">
                    {options.shirtColor.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          cfg.shirtColor === color
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          const newCfg = { ...cfg, shirtColor: color };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">สีพื้นหลัง</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`w-8 h-8 rounded-full border-2 ${
                        cfg.bgColor === "transparent"
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor: "white",
                        backgroundImage:
                          "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)",
                        backgroundSize: "10px 10px",
                        backgroundPosition: "0 0, 5px 5px",
                      }}
                      onClick={() => {
                        const newCfg = { ...cfg, bgColor: "transparent" };
                        setCfg(newCfg);
                        if (setValue) handleSetValue(newCfg);
                      }}
                    />
                    {options.bgColor.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          cfg.bgColor === color
                            ? "border-blue-500"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          const newCfg = { ...cfg, bgColor: color };
                          setCfg(newCfg);
                          if (setValue) handleSetValue(newCfg);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setCustomBox(false)}>เสร็จสิ้น</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="relative flex items-center justify-center">
        <Avatar
          className={`w-${size} h-${size}`}
          shape="rounded"
          {...genConfig(cfg)}
        />
        <div className="absolute -bottom-4 -center-2 gap-1 flex">
          <Button
            type="button"
            onClick={() => setCustomBox(true)}
            variant="ghost"
            size="icon"
            className=" h-7 w-7 rounded-full shadow bg-white border border-gray-200"
            title="ปรับแต่งอวตาร"
          >
            <Palette className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            type="button"
            onClick={handleRandomize}
            variant="ghost"
            size="icon"
            className=" h-7 w-7 rounded-full shadow bg-white border border-gray-200"
            title="สุ่มอวตาร"
          >
            <Shuffle className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>
    </>
  );
}
