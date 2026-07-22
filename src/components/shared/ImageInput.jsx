'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link2, Upload } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// value: File object (upload mode) or a string URL (url mode) or null
export default function ImageInput({
  value,
  onChange,
  previewUrl,
  label = 'Cover Image',
}) {
  const [urlInput, setUrlInput] = useState('');

  const preview =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === 'string' && value
        ? value
        : previewUrl;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {preview && (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={value instanceof File}
          />
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link2 className="w-3.5 h-3.5 mr-1.5" />
            Image URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-2">
          <Input
            type="file"
            accept="image/*"
            onChange={e => onChange(e.target.files?.[0] || null)}
          />
        </TabsContent>

        <TabsContent value="url" className="pt-2 flex gap-2">
          <Input
            type="url"
            placeholder="https://images.pexels.com/..."
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onBlur={() => urlInput && onChange(urlInput.trim())}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
