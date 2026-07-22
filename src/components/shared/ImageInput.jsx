'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link2, Upload } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ImageInput({
  value,
  onChange,
  previewUrl,
  label = 'Cover Image',
}) {
  const [urlInput, setUrlInput] = useState('');
  const [preview, setPreview] = useState(previewUrl || null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === 'string' && value) {
      setPreview(value);
      setUrlInput(value);
    } else {
      setPreview(previewUrl || null);
    }
  }, [value, previewUrl]);

  const handleUrlChange = e => {
    const val = e.target.value;
    setUrlInput(val);
    onChange(val.trim());
  };

  return (
    <div className="space-y-3 w-full">
      <Label>{label}</Label>

      {preview && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-slate-50">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={value instanceof File}
          />
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="upload"
            className="flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="flex items-center justify-center gap-1.5"
          >
            <Link2 className="w-4 h-4" />
            Image URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-2 w-full shrink-0">
          <Input
            type="file"
            accept="image/*"
            onChange={e => onChange(e.target.files?.[0] || null)}
            className="w-full cursor-pointer"
          />
        </TabsContent>

        <TabsContent value="url" className="mt-2 w-full shrink-0">
          <Input
            type="url"
            placeholder="https://images.pexels.com/..."
            value={urlInput}
            onChange={handleUrlChange}
            className="w-full"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
