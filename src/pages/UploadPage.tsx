import { useState, useRef } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, Image, X } from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const fileIcon = file?.type.includes("pdf") ? FileText : Image;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-1">Upload Brochure</h1>
          <p className="text-muted-foreground">Upload a hackathon brochure and let AI extract all the details</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${dragging ? "border-primary/50 glow-primary" : "hover:border-primary/30"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleSelect} className="hidden" />
          {file ? (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                {(() => { const Icon = fileIcon; return <Icon className="w-7 h-7 text-primary" />; })()}
              </div>
              <p className="text-foreground font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-destructive">
                <X className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <UploadIcon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">Drop your brochure here</p>
                <p className="text-sm text-muted-foreground mt-1">PDF, JPG, or PNG up to 10MB</p>
              </div>
            </div>
          )}
        </motion.div>

        {file && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button className="w-full gradient-primary text-primary-foreground font-semibold h-12 glow-primary">
              Extract with AI ✨
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
