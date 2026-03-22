"use client";
import dynamic from "next/dynamic";
const JuriCallApp = dynamic(() => import("@/app/components/juriCallHero"), { ssr: false });
export default function Home() { return <JuriCallApp />; }