"use client";

import { FiGrid, FiUsers, FiBriefcase, FiShield } from "react-icons/fi";
import { DashboardSidebar, type DashboardSectionConfig } from "@/components/DashboardSidebar";

export type AdminSection = "overview" | "users" | "companies" | "nda-audit";

const ADMIN_SECTIONS: DashboardSectionConfig<AdminSection>[] = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "users", label: "Users", icon: FiUsers },
  { id: "companies", label: "Companies", icon: FiBriefcase },
  { id: "nda-audit", label: "NDA Audit", icon: FiShield },
];

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}

export function AdminSidebar({ active, onChange }: AdminSidebarProps) {
  return <DashboardSidebar sections={ADMIN_SECTIONS} active={active} onChange={onChange} />;
}
