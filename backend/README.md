SoukPay PayPay Backend 👋

## Get Started

Install Dependencies
- cd backend 
- npm install

## Environment Configuration

PORT=
DATABASE_URL=""
JWT_SECRET=""

## Then run docker (run docker desktop)
- commands as follows 

<!-- in same run -->

docker-compose up -d
sleep 10

npm run db:push or  prisma migrate dev
npm run db:seed

# run the project 
npm run dev

- use  npx prisma studio  to check data


<!-- With More Time -->

- Strict Validation -> Add Zod to validate all incoming requests.
- Full Dockerization ->  Adding a Dockerfile for my express app (App & Db) to spin up with a single command.


## Thank You