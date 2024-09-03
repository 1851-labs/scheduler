// CanvasComponent.js
import React, { useEffect, useRef, useState } from 'react';
import posthog from "posthog-js"
import { XCircle } from 'lucide-react';
import { Button } from '@/components/shadcn/Button';
import { Download, Share, RotateCw } from 'lucide-react';
import { Pen } from 'lucide-react';
import ImageDialog from './ImageDialog';

interface GeneratedImageProps {
  generatedImages: string[]; // array of generated images in base64 format
  postHogEventType: string;
  error: boolean
}

export default function MultiImageViewer({ postHogEventType, generatedImages, error }: GeneratedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <div>
      <div className='flex flex-row justify-between mb-4'>
      </div>
      <canvas className='hidden' ref={canvasRef} width="768px" height="768px"></canvas>
      <div className="mt-3 pb-3 pt-1 px-1 w-full h-[400px] border-2 border-gray-400 border-dashed rounded-md flex items-center justify-center text-gray-600 text-sm">
        {error ? 
          <div className='flex flex-col items-center'>
            <XCircle size={60} className='text-red-500'/>
            <h3 className='mt-5 text-xl text-black text-bold text-wrap text-center'>Ooops! There was an error generating the image.</h3>
          </div>
          : <div className='w-full flex flex-col items-center pb-5'>
            <p>Click on image to expand</p>
            <div className="flex flex-wrap justify-center">
              {generatedImages.map((image, index) => (
                <ImageDialog imageSrc={image} index={index} postHogEventType={postHogEventType} />
              ))}
            </div>
            </div>
        }
      </div>
    </div>
  )
}