import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/shadcn/Button';
import { Download, Share } from 'lucide-react';
import posthog from "posthog-js"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/shadcn/Dialog"

interface ImageDialogProps {
  index: number;
  imageSrc: string;
  postHogEventType: string;
  
}

export default function ImageDialog({ index, imageSrc, postHogEventType }: ImageDialogProps) {
    const [downloadOrShare, setDownloadOrShare] = useState('Download');
    useEffect(() => {
        if (navigator.canShare && navigator.canShare({title: "test"})) {
            setDownloadOrShare('Share');
        }
    }, []);
    
    function base64ToBlob(base64String: string) {
        // Split the base64 string into two parts
        const parts = base64String.split(';base64,');
        const contentType = parts[0].split(':')[1];
      
        // Decode the base64 string
        const byteCharacters = atob(parts[1]);
      
        // Create an ArrayBuffer object
        const arrayBuffer = new ArrayBuffer(byteCharacters.length);
      
        // Create a typed array to hold the arrayBuffer
        const byteArray = new Uint8Array(arrayBuffer);
      
        // Copy the decoded byte stream into the typed array
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
      
        // Create a Blob object from the typed array
        return new Blob([arrayBuffer], { type: 'image/jpeg' || contentType });
    }

    const shareImage = async () => {
        const blob = base64ToBlob(imageSrc);
        const file = new File([blob], 'image.png', { type: blob.type });
        const shareContent = {
            title: "Check out this image I made with MagicLens",
            text: "Check out this image I made with MagicLens",
            url: 'https://magiclens.app?_cid=share',
            files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareContent)) {
            posthog.capture('Share Image', { image_mode: postHogEventType })
            try {
            await navigator.share(shareContent);
            } catch (error) {
            if ((error as Error).toString().includes('AbortError')) {
                posthog.capture('Abort share error', { image_mode: postHogEventType })
            } else {
                posthog.capture('Unknown share error', { image_mode: postHogEventType })
            }
        }
            
        } else {
            posthog.capture('Download Image', { image_mode: postHogEventType })
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = 'magiclens_image.png'; // Specify the filename
            link.click();
        }
    };
    return (
        <Dialog>
            <DialogTrigger onClick={() => {posthog.capture('View Image', { image_mode: postHogEventType })}} asChild>
                <img key={index} src={imageSrc} alt={`Generated Image ${index}`} className="w-1/3 max-w-[180px] p-2" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Download and Share!</DialogTitle>
                </DialogHeader>
                <img src={imageSrc} alt={`Generated Image ${index}`} className="w-full" />
                <DialogFooter className="sm:justify-start">
                <Button
                    onClick={() => {shareImage()}}
                    variant='default'
                    size='lg'
                    className="flex w-full mb-4 mt-3 gap-3 mr-3"
                >
                    {downloadOrShare === 'Download' ? <Download width="20px" /> : <Share width="20px" />}
                    <span>{downloadOrShare}</span>
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
  );
}
