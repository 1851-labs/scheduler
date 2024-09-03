# Development setup

You can deploy this template by setting up the following services and adding their environment variables:

1. Run `npm install` to install dependencies.
2. Run `npm run dev`. It will prompt you to log into [Convex](https://convex.dev) and create a project. Select existing app.
3. It will then ask you to supply the `CLERK_ISSUER_URL`. To do this:
   1. Make a [Clerk](https://clerk.dev) account.
   2. Copy these [API keys](https://dashboard.clerk.com/apps/app_2fmYpWjAx0KoR9NCx6rZQIxZLgt/instances/ins_2fmYph13RqJYU9V4B4BlyaIrKv1/api-keys) into `.env.local`.
   3. Do steps 1-3 [here](https://docs.convex.dev/auth/clerk) and copy the Issuer URL.
      It should look something like `https://some-animal-123.clerk.accounts.dev`.
   4. Add `CLERK_ISSUER_URL` to your [Convex Environment Variables](https://dashboard.convex.dev/deployment/settings/environment-variables?var=CLERK_ISSUER_URL)
      (deep link also available in your terminal). Paste the Issuer URL as the value and click "Save".
4. Now your frontend and backend should be running and you should be able to log in but not record.
5. Get keys for any necessary external dependencies (ie, OpenAI, TogetherAI, Replicate, Vapi.AI, Hume.AI, etc)
   - (optional) Make a [Together](https://dub.sh/together-ai) account to get your [API key](https://api.together.xyz/settings/api-keys).
   - Make a [Replicate](https://replicate.com) account to get your [API key](https://replicate.com/account/api-tokens).
6. Save any your environment variables your backend functions use in Convex [as `REPLICATE_API_KEY` and `TOGETHER_API_KEY`](https://dashboard.convex.dev/deployment/settings/environment-variables?var=REPLICATE_API_KEY&var=TOGETHER_API_KEY).
9. `npx convex dev --configure=existing --team josh-1851 --project app-template`

# Developmemt Tips
1. By default, Clerk authentication is required for all routes except '/'. To add additional routes that are free from authentication, you can update middleware.ts like so:
```
export default authMiddleware({
  publicRoutes: ['/', '/the-new-public-route'],
});
```
2. AppTemplate includes routes called /sign-in and /sign-up which serve as pages for login and signup. In order to have Clerk's Account Portal use these routes rather than the default Clerk hosted routes, set the following environment variables:
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
3. If using the custom routes described in 2., you can customize the appearance/colors by editing the props passed to `ClerkProvider` in `ConvexClientProvider.tsx`. There is a prop for appearance which controls the colors, as well as a prop called localization, which lets you control the text that appears on the sign-in/sign-up forms:
```
<ClerkProvider
   publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
   appearance={{
     variables: {
       colorPrimary: "#8b64ed"
     }
   }}
   localization={{
     signUp: {
       start: { title: "Sign up for App Template", subtitle: "Get access to our amazing template" }
     },
     signIn: {
       start: { title: "Sign in to App Template", subtitle: "Get access to our amazing template" }
     },
}} >
  //CHILDREN HERE
</ClerkProvider>
```

# Frontend Development
### Components
We leverage 2 component libraries to accelerate frontend development:
1. [Shadcn UI](https://ui.shadcn.com)
2. [Aceternity UI](https://ui.aceternity.com/)

#### Working with shadcn ui
- Several shadcn components are already defined in the `components/shadcn` folder
- To define additional components, navigation to [Shadcn UI's website](https://ui.shadcn.com/docs/components/accordion) and select a component from the sidebar
- Once you've selected a component, follow the steps under manual installation. 
- Note that these steps may or may not include installing packages with npm and updating the `tailwind.config.ts` file. 
- When the instructions state "Copy and paste the following code into your project.", paste the code into a new file in the `components/shadcn` folder.

#### Working with Aceternity
- An example Aceternity component is already defined in the `components/aceternity` folder.
- To add additional Aceternity components, navigate to [Aceternity's website](https://ui.aceternity.com/components), and select a component from the sidebar
- Once you've selected a component, follow its installation steps.
  - This usually consists of installing a package and adding some source code to the repo
- Under the step titled "Copy the source code", paste the given source code into a new file in the `components/aceternity folder`.

### Theming
- The theme used for shadcn components in defined in the `globals.css` file, within the `@layer base` class. 
- The bakcground, primary, secondary colors etc used for shadcn components can be adjusted by editing the appropriate properties in this class.
- Note that all color values must be provided in HSL format with no commas, or degree symbols.
- Example:
  - We want to apply [this color theme](https://coolors.co/palette/780000-c1121f-fdf0d5-003049-669bbc) to our components.
  - We start by converting the hex values given by this theme to HSL using [Google's color picker](https://g.co/kgs/m4jixJy)
  - Next we update the properties in `globals.css` as follows:
    - Set background color to pale yellow (56 100% 94%)
    - Set primary color to dark blue (201 100% 14%)
    - Set secondary color to light blue (203 39% 57%)
    - Set destructive color to red (356 83% 41%)
    - Set card color to slightly darker pale yellow (47 71% 90%)
  - We can now use the colors in any component. 
    - For example, we can use the background and foreground properties to style a div as follows:

    ```
    <div class="bg-primary text-primary-foreground">
    Some text here
    </div>
    ```
    - This will apply the primary color specified 
    in `globals.css` the background and the foreground color
    specified below to the foreground text.

### Logging
We currently use PostHog for logging: user actions, page loads, sessions and recording session replays. It is your responsibility to ensure all user actions are logged. 

We cannot re-create missing data!

When logging please **follow this template** to log events:
[entity performing action]-[action being performed]-[thing action is performed on]

### Examples (good)
- user-sent-message
- user-liked-post
- user-sent-friend-request
- user-sent-empty-message

### Examples (bad)
- user entered a blank message
- initial response generated
- message generated by user

### Layouts
- V0 is a great tool for generating layouts.
- Go to https://v0.dev/ and login (requires a vercel account)
- Once you've generated a design, copy the code given by v0 to your local project
- IMPORTANT: Do not add the code using the `npx v0 add` command, as this may cause unwanted changes to your local project.
- If the generated layout uses Shadcn components, you may need to install them (see instructions above).

# Launch checklist
- [ ] Deployed to Amplify
- [ ] Custom domain setup
- [ ] Monitoring
   - [ ] Sentry - Report FE & server side exceptions
- [ ] Analytics
   - [ ] PostHog - All user actions are logged!
      - [ ] Events are named consistently: [entity]-[action]-[action taken on]
   - [ ] Google Analytics is setup
   - [ ] Meta Pixel is setup
- [ ] QA
   - [ ] DNS Config, Vist: 
     - [ ] http://www.yourdomain.xyz
     - [ ] http://yourdomain.xyz
     - [ ] https://www.yourdomain.xyz
     - [ ] https://yourdomain.xyz
   - [ ] Ensure your app works: 
      - [ ] Visit all pages
      - [ ] Perform all actions    
   - [ ]  Check analytics are working
      - [ ]  Google Analytics (realtime stats)
      - [ ]  PostHog events
      - [ ]  Meta Pixel events

# Deployment: Amplify
  1. Local setup following `Local "deployment"` above
  2. AWS Amplify Deploymenta
    - Follow Amplify "Existing App" flow to connect to repo
    - Setup the environment variables so the build works: https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html
      - Grab from .env.local
    - Setup the environment variables so deployed app has access to them: https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html
      - This will pull the env vars set during build and write them to .env.production before running the app
    - Update the /App/amplify.yml with your required build settings. Note that you may need to remove required env vars from this file if there are some that you do not use.
  3. Update env vars for "mono repo" app
    - in Settings > Environment Variables
      - AMPLIFY_MONOREPO_APP_ROOT = App
      - AMPLIFY_DIFF_DEPLOY = false
  4. Setup app via CLI
    - Get `APP_ID` from = arn:aws:amplify:us-east-1:533267096043:apps/d2iwxlq3mg67mj <- `APP_ID`=d2iwxlq3mg67mj
  5. Set the app to SSR for nextjs
      - `aws amplify update-app --app-id <APP_ID> --platform WEB_COMPUTE --region us-east-1`
      - `aws amplify update-branch --app-id d2iwxlq3mg67mj --branch-name main --framework 'Next.js - SSR' --region us-east-1`

## Monitoring
  1. Sentry  
   - *1a.* Visit https://1851-labs.sentry.io/projects/
   - *1b.* Add your project if it doesn't exist: select NextJS, Alert every issue, Name it!
     - !Important: save your DSN value somewhere for later (can be fetched again if you loose it):Wq
   - *1c.* Enable error reporting for your [Convex deployment](https://docs.convex.dev/production/integrations/exception-reporting)
      - You can find your Public DSN by going to Sentry and clicking Projects & Teams > Any Project > Settings > Client Keys (DSN)
   - *1d.* Setup Sentry on the nextjs webserver
      - Copy SENTRY_AUTH_TOKEN to Amplify Env vars for your deployment
      - Copy SENTRY_DSN to Amplify Env vars for your deployment
      - NOTE: your server will fail to start on Amplify if these are not set.
      - Visit: `/sentry-example-page` to test sentry is working


## Adding a custom domain
  - These steps assume that you have deployed your app on Amplify, and purchased a domain on GoDaddy. 
  1. Follow the instructions provided here: https://docs.aws.amazon.com/amplify/latest/userguide/to-add-a-custom-domain-managed-by-a-third-party-dns-provider.html 
  2. **IMPORTANT:** At step 6 in the link above, select "Create hosted zone on Route 53". 
  3. Add the 4 nameservers given by AWS to GoDaddy. This can be done by navigation to your domain's management page in GoDaddy, selecting DNS->Nameservers. Select "Change Nameservers", remove the existing nameservers and add the 4 nameservers given by AWS.
  4. Continue following the steps outlined in the documentation linked above. Since we're using Route53, we can skip steps 10 to 15.
  5. The whole process should take about 20 minutes, with AWS requiring time to provision resources.
  6. Once you have finished all steps, your website may still be down for an additional hour since it takes time for GoDaddy to update the nameservers.

## Sentry Setup
 1. [Sentry for NextJS](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

## PostHog Setup
 1. Log in to PostHog
 2. Click Project drop-down in upper left of header
 3. Click "New project" at the bottom of dropdown you just expanded
 4. Click "Product Analytics" in middle of page (blue graph)
 5. Click on NextJs on list of frameworks
 6. Follow instructions

## Google Analytics Setup
 1. Visit GA: [https://analytics.google.com/analytics/web/#/p438819856/reports/intelligenthome?params=_u..nav%3Dmaui](https://analytics.google.com/analytics/web/?authuser=0#/a309518994p438819856/admin)
   - You should see all our apps (ask josh if you need perms)
 2. Click "Create" (Upper left)
 3. Choose property
 4. Fill out setup steps
 5. Paste Tag Id into .env.local (you will need it later)

## Meta Pixel Setup
 1. Visit Meta Business Manager: All Tools > Events Manager
 2. Make sure you're on the business account (see dropdown in upper right)
 3. Select "Data Sources" in the left menu bar
    - You should see a list of our apps, including "GenTube", "AutoCMO"
 4. Select "Connect Data Sources" from left menu bar
    - Green text with a plus symbol on left side
 5. Select "Web" & Name the Dataset w/ same name as App (keep naming consistent on Posthog, Google Analytics, etc)
 6. Choose "Connect Manually"
    - Choose Meta Pixel Only
 7. Click "See instructions" for Meta Pixel
 8. Paste the code somewhere
 9. Copy the Id from the code: `fbq('init', '<id is here>');`
 10. Add the Id to your .env.local file:
  ```
  # Meta Pixel
  NEXT_PUBLIC_META_PIXEL_ID=<put the id here>
  ```
11. Add the environment variable to relevant places: Convex, Amplify
12. You will now automatically track page views
13. Setup events, and custom events you'd like to track:
  - ReactPixel.track
  - ReactPixel.trackCustom
14. Push to production URL
15. You can now complete final step of pixel setup on the business manager page
 - FB will confirm it can find the pixel on the URL you enter
 16. Add an event to finish setting up the stream
  
### 1851 Labs use of standard events:
  - `ViewContent` <- log after primary action complete (submitted a thing / logged in)
  - `SubmitApplication` <- key action completed
  - `InitiateCheckout` <- begin some sign-up or setup process

### Custom Event Naming Template:
 [entity performing action]-[action being performed]-[thing action is performed on]

#### Examples (good)
   - user-sent-message
   - user-liked-post
   - user-sent-friend-request
   - user-sent-empty-message

### Examples (bad)
   - user entered a blank message
   - initial response generated
   - message generated by user 

### Read more:
 - Standard Events: https://www.facebook.com/business/help/402791146561655?id=1205376682832142
 - Standard vs Custom: https://www.facebook.com/business/help/964258670337005?id=1205376682832142
 
### How to install npm lib
`npm install --save react-facebook-pixel@https://github.com/jacobknighj12/react-facebook-pixel.git`


# Tech Stack

- [Convex](https://convex.dev/) for the database and backend
- [Next.js- App Router](https://nextjs.org/docs/app) for the web framework
- [ReactJS](react.dev) for ux
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [ShadCN](https://ui.shadcn.com/docs/components/accordion) for UI components
- [Aceternity](https://ui.aceternity.com/components) for fun & fancy animations 
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Feather Icons](https://feathericons.com/) for simple icons

- [OpenAI - Dall-e 3](https://openai.com/dall-e-3) for image generation
- [OpenAI - GPT-4](https://openai.com/research/gpt-4) for LLM
- [Together AI](https://www.together.ai/) for open models
- [Replicate](https://replicate.com/) for open models
- [Vapi AI](https://vapi.ai/) for phone/web chats with AI
- [11 Labs](https://elevenlabs.io/) for fancy TTS

- [AWS S3](https://aws.amazon.com/s3/) for storing the images
- [AWS Amplify](https://aws.amazon.com/amplify/) for hosting and deploying the app

- [Google Analytics 4](https://analytics.google.com/analytics/web/#/p438819856/reports/intelligenthome) for usage analytics 
- [PostHog] (https://us.posthog.com/project/66320/dashboard/162598) for usage analytics, ab testing and more
- [Sentry] (https://1851-labs.sentry.io/) for crash reporting and more
- [MetaPixel] (https://business.facebook.com/events_manager2/list/dataset/1458789684780254/overview?business_id=441273892094543) for event tracking in Meta ecosystem
- (depricated) [Uptime Robot] (https://dashboard.uptimerobot.com/monitors) for monitoring uptime of site
