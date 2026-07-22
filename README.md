# DaanBaksho

A crowdfunding platform where creators launch campaigns and supporters fund them using platform credits.

## Overview

DaanBaksho connects Supporters, Creators, and Admins in one platform. Supporters browse and contribute credits to campaigns, Creators launch and manage their own campaigns and withdraw raised funds, and Admins oversee approvals, users, and reports across the platform.

## Live Link

<https://daanbaksho.vercel.app>

## GitHub Repositories

- Client: <https://github.com/tawchifulislam/daanbaksho-client>
- Server: <https://github.com/tawchifulislam/daanbaksho-server>

## Key Features

- Three roles - Supporter, Creator, and Admin - each with a dedicated dashboard
- Campaign creation with image upload (imgBB or direct URL) and admin approval workflow
- Credit-based contribution system with pending/approved/rejected status tracking
- Stripe-powered credit purchase with multiple package tiers
- Creator withdrawal system with automatic credit-to-dollar conversion
- Real-time-style notification system for contributions, approvals, and withdrawals
- Role-based authorization securing every sensitive API route
- Fully responsive design across mobile, tablet, and desktop
- Campaign reporting system for flagging suspicious campaigns

## Tech Stack

**Frontend:** Next.js, Tailwind CSS, shadcn/ui, React Query, React Hook Form + Zod

**Backend:** Express.js, MongoDB

**Auth:** Better Auth (session + Google Sign-In), custom JWT bridge to the API

**Payments:** Stripe

**Image Hosting:** imgBB
