'use client';

import { useEffect } from "react";
import ReactPixel from 'react-facebook-pixel';

export const MetaPixel = ({pixelId}:{pixelId:string}) => {
    if (!pixelId) throw new Error("No Meta Pixel ID provided! Please set NEXT_PUBLIC_META_PIXEL_ID environment variable.");
    console.log("Setting up Meta Pixel with ID: ", pixelId);
    useEffect(() => { 
        ReactPixel.init(pixelId, undefined, { autoConfig: true, debug: false });
        ReactPixel.pageView();
    }, []);
    return (<div id="meta-pixel-setup"></div>);

    /*
    return (
        <div>
            <Script
                id="facebook-pixel"
                strategy="afterInteractive"
            >
                {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
                `}
            </Script>
            <noscript>
                <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                />
            </noscript>
        </div>
    );
    */
}