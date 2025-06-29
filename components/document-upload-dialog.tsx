import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileTextIcon, UploadIcon } from "lucide-react";
import { callUploadApi } from "@/lib/file-api";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onSuccess: () => void;
}

export function DocumentUploadDialog({ 
  open, 
  onOpenChange, 
  companyId, 
  onSuccess 
}: DocumentUploadDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "general",
    file: null as File | null,
  });
  const { toast } = useToast();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, file });
    }
  };

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.file) {
      toast({
        title: "กรุณาเลือกไฟล์",
        description: "กรุณาเลือกไฟล์ที่ต้องการอัปโหลด",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // อัปโหลดไฟล์ก่อน
      const uploadResult = await callUploadApi(
        form.file,
        `company_${companyId}`,
        false // ไม่ต้องลดขนาดรูป
      );

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "ไม่สามารถอัปโหลดไฟล์ได้");
      }

      // บันทึกข้อมูลเอกสารลงฐานข้อมูล
      const documentData = {
        name: form.name,
        description: form.description,
        file_path: uploadResult.filePath || "",
        file_type: form.file.type.split('/')[1]?.toUpperCase() || form.file.name.split('.').pop()?.toUpperCase() || "FILE",
        file_size: form.file.size,
        category: form.category,
        uploaded_by: 1, // TODO: ใช้ user ID จริง
      };

      const response = await fetch(`/api/admin/company/${companyId}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "อัปโหลดเอกสารสำเร็จ",
          description: "เอกสารได้ถูกเพิ่มเรียบร้อยแล้ว",
          variant: "default",
        });
        
        // รีเซ็ตฟอร์ม
        setForm({
          name: "",
          description: "",
          category: "general",
          file: null,
        });
        
        // ปิด dialog และรีเฟรชข้อมูล
        onOpenChange(false);
        onSuccess();
      } else {
        throw new Error(result.message || "ไม่สามารถบันทึกข้อมูลเอกสารได้");
      }
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัปโหลดเอกสารได้",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5" />
            เพิ่มเอกสารใหม่
          </DialogTitle>
          <DialogDescription>
            อัปโหลดเอกสารที่เกี่ยวข้องกับแหล่งฝึกงาน
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">ชื่อเอกสาร *</Label>
            <Input
              id="document-name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="เช่น สัญญาความร่วมมือ MOU 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-category">หมวดหมู่ *</Label>
            <Select value={form.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">ทั่วไป</SelectItem>
                <SelectItem value="contract">สัญญา</SelectItem>
                <SelectItem value="evaluation">แบบประเมิน</SelectItem>
                <SelectItem value="manual">คู่มือ</SelectItem>
                <SelectItem value="report">รายงาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-description">คำอธิบาย</Label>
            <Textarea
              id="document-description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับเอกสาร"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-file">ไฟล์ *</Label>
            <Input
              id="document-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
              required
            />
            <p className="text-xs text-gray-500">
              รองรับไฟล์: PDF, DOC, DOCX, JPG, PNG, XLSX (ขนาดไม่เกิน 10MB)
            </p>
            {form.file && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileTextIcon className="h-4 w-4" />
                <span>{form.file.name}</span>
                <span>({formatFileSize(form.file.size)})</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={uploading}>
                ยกเลิก
              </Button>
            </DialogClose>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <UploadIcon className="h-4 w-4 mr-2 animate-spin" />
                  กำลังอัปโหลด...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  อัปโหลด
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
