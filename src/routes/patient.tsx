import { createFileRoute } from "@tanstack/react-router";
import { PatientLayout } from "@/features/shared";
export const Route = createFileRoute("/patient")({ component: PatientLayout });
