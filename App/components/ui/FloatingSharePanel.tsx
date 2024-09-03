"use client"
import { useState } from 'react';
import posthog from "posthog-js"
import { Button } from '@/components/shadcn/Button';
import { Pen } from 'lucide-react';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, XIcon, RedditShareButton, RedditIcon, WhatsappShareButton, WhatsappIcon } from "react-share";
import Link from 'next/link';
import { Link as Link2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CirclePlus } from 'lucide-react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingSharePanel() {
    const pathname = usePathname()
    const [currentUrl, setCurrentUrl] = useState('');

    function copyLink() {
        const url = currentUrl + '?_cid=share-link';
        navigator.clipboard.writeText(url);
        posthog.capture('share comic link', { })
        toast("🤙 Link copied to clipboard", { id: 'link' });
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const fullUrl = `${window.location.origin}${pathname}`;
            setCurrentUrl(fullUrl);
        }
    }, [pathname]);
    return (
        <div className='fixed bottom-7 left-1/2 transform -translate-x-1/2 z-50'>
            <div className='bg-white rounded-3xl flex flex-col items-center shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]'>
                <div className='flex flex-row items-center'>
                    <div className='p-5'>
                        <h4 className='font-bold'>Share this comic!</h4>
                        <p className="text-xs">Others won't be able to edit</p>
                        <div className='flex space-x-2 pt-3'>
                            <FacebookShareButton url={currentUrl + '?_cid=share-facebook'} onClick={() => { posthog.capture('share comic facebook', {  }) }}>
                                <FacebookIcon size={50} round={true} />
                            </FacebookShareButton>
                            <TwitterShareButton url={currentUrl + '?_cid=share-x'} onClick={() => { posthog.capture('share commic x', {  }) }}>
                                <XIcon size={50} round={true} />
                            </TwitterShareButton>
                            <WhatsappShareButton url={currentUrl + '?_cid=share-whatsapp'} onClick={() => { posthog.capture('share comic whatsapp', {  }) }}>
                                <WhatsappIcon size={50} round={true} />
                            </WhatsappShareButton>
                            <div>
                                <Button onClick={copyLink} variant='default' size='icon' className='w-[50px] h-[50px] text-white hover:bg-primary hover:text-white rounded-full bg-gray-600'>
                                    <Link2 />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Link href='' target="_blank">
                            <Button variant='default' className='h-36 font-bold rounded-r-3xl rounded-l-none' onClick={() => {  }}>
                                <div className='flex flex-col items-center'>
                                    <CirclePlus size={30} />
                                    <p className='mt-1'>Do some action</p>
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>

        </div>
    );
}


