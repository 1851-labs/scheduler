npm ci
env | grep -e CONVEX_DEPLOYMENT >> .env.production
env | grep -e NEXT_PUBLIC_CONVEX_URL >> .env.production
env | grep -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY >> .env.production
env | grep -e CLERK_SECRET_KEY >> .env.production
env | grep -e CLERK_ISSUER_URL >> .env.production
env | grep -e ELEVENLABS_API_KEY >> .env.production
env | grep -e OPENAI_API_KEY >> .env.production
env | grep -e REPLICATE_API_KEY >> .env.production
npm run build