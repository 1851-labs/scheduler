"use client"
import { useState } from 'react';
import posthog from "posthog-js"
import { Button } from '@/components/shadcn/Button';
import { Pen } from 'lucide-react';

interface ImageUploaderProps {
  previewSrc: any; // the source of the preview image (typically created via const [previewSrc, setPreviewSrc] = useState(''))
  setPreviewSrc: any; // function to store the preview image (typically created via const [previewSrc, setPreviewSrc] = useState(''))
  setResizedSrc: any; // function to store the resized image (typically created via const [resizedSrc, setResizedSrc] = useState(''))
  setOriginalImgHeight?: any; // optioal function to store the original image height
  setOriginalImgWidth?: any; // optional function to store the original image width.
  postHogEventType?: string; // optional image mode to log to PostHog.
}

export default function ImageUploader({ postHogEventType = '', previewSrc, setPreviewSrc, setResizedSrc, setOriginalImgHeight = () => {}, setOriginalImgWidth = () => {}} : ImageUploaderProps) {
  const handleImageChange = (uploaded:any) => {
    const file = uploaded.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(reader.result);
        const img = new Image();
        img.onload = () => {
          const landscape = { width: 500, height: 350 };
          const portrait = { width: 350, height: 500 };

          // Downscale the image if it is larger than the maximum dimensions
          const MAX_WIDTH = 1500;
          const MAX_HEIGHT = 1500;
          if (img.width > MAX_WIDTH) {
            const scaleFactor = MAX_WIDTH / img.width;
            img.width = MAX_WIDTH;
            img.height *= scaleFactor;
          }

          if (img.height > MAX_HEIGHT) {
            const scaleFactor = MAX_HEIGHT / img.height;
            img.height = MAX_HEIGHT;
            img.width *= scaleFactor;
          }

          // Determine the orientation of the original image
          setOriginalImgHeight(img.height);
          setOriginalImgWidth(img.width);

          // Create an off-screen canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          // Set the canvas dimensions to the target dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas with the new dimensions
          context!.drawImage(img, 0, 0, img.width, img.height);

          // Get the base64 encoded image from the canvas
          const resizedImage = canvas.toDataURL('image/png');

          // Update the preview source
          setResizedSrc(resizedImage);
        };

        // Set the image source to the file reader result
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    
  };

  const triggerFileInput = () => {
    if (typeof document !== 'undefined') {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      fileInput.click();
    }
  };

  
  return (
    <div>
      <input
        id="fileInput"
        type="file"
        accept="image/*,text/plain"
        onChange={handleImageChange}
        className="hidden"
      />
      <div className="mt-3 pt-1 pb-3 px-1 w-full h-[400px] border-2 border-gray-400 border-dashed rounded-md flex items-center justify-center text-gray-600 text-sm">
        {previewSrc ? 
          <div className='w-full flex flex-col items-center'>
            <div className='w-full flex flex-col items-end'>
             <Button
                onClick={() => {
                  posthog.capture('Edit Image', { image_mode: postHogEventType })
                  triggerFileInput()
                }}
                variant='secondary'
                size='icon'
                className="mb-2 mr-2 bg-white text-black hover:bg-primary hover:text-white"
                >
                <Pen/>
              </Button>
            </div>
            <img src={previewSrc} alt="Image Preview" className='max-h-[320px] max-w-full object-contain' />
          </div> : 
          <div>
            <Button
              onClick={() => {
                posthog.capture('Select Image', { image_mode: postHogEventType })
                triggerFileInput()
              }}
              variant='secondary'
              className="w-full mt-2"
            >
              Add Image
            </Button>
          </div>
        }
      </div>
    </div>
  );
}