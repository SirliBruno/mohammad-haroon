import type { SVGProps } from "react";

export function WebsitesServiceMockup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 280 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none"
      {...props}
    >
      {/* Outer Browser Frame */}
      <rect
        x="6"
        y="6"
        width="268"
        height="128"
        rx="8"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      {/* Browser Window Header */}
      <rect
        x="6"
        y="6"
        width="268"
        height="24"
        rx="8"
        fill="currentColor"
        fillOpacity="0.03"
      />
      <line x1="6" y1="30" x2="274" y2="30" stroke="var(--border)" strokeWidth="1" />

      {/* Window Controls (Traffic Dots) */}
      <circle cx="20" cy="18" r="2.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="28" cy="18" r="2.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="36" cy="18" r="2.5" fill="currentColor" fillOpacity="0.2" />

      {/* URL Address Bar */}
      <rect
        x="54"
        y="13"
        width="110"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      <rect x="62" y="16.5" width="40" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />

      {/* Mini Navbar */}
      <rect x="20" y="40" width="22" height="6" rx="2" fill="currentColor" fillOpacity="0.7" />
      <rect x="186" y="41.5" width="18" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />
      <rect x="210" y="41.5" width="22" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />
      <rect x="238" y="41.5" width="20" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />

      {/* Hero Left Column (Copy + CTA) */}
      <rect x="20" y="54" width="34" height="5" rx="1.5" fill="currentColor" fillOpacity="0.15" />
      <rect x="20" y="65" width="96" height="8" rx="2" fill="currentColor" fillOpacity="0.85" />
      <rect x="20" y="76" width="75" height="8" rx="2" fill="currentColor" fillOpacity="0.85" />
      <rect x="20" y="89" width="88" height="4" rx="1.5" fill="currentColor" fillOpacity="0.3" />

      {/* Standout Single Turquoise CTA Button */}
      <rect
        x="20"
        y="100"
        width="48"
        height="16"
        rx="4"
        fill="var(--accent)"
      />
      <rect
        x="28"
        y="106"
        width="32"
        height="4"
        rx="1"
        fill="var(--accent-foreground)"
        fillOpacity="0.95"
      />

      {/* Hero Right Column (Interactive Device / Card Visual) */}
      <rect
        x="132"
        y="54"
        width="128"
        height="64"
        rx="6"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="var(--border)"
        strokeWidth="1"
      />
      {/* Inner Preview Window */}
      <rect x="140" y="62" width="50" height="5" rx="1.5" fill="currentColor" fillOpacity="0.4" />
      <rect
        x="140"
        y="73"
        width="112"
        height="36"
        rx="4"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      {/* Visual wireframe lines inside card */}
      <rect x="148" y="81" width="40" height="4" rx="1" fill="currentColor" fillOpacity="0.3" />
      <rect x="148" y="89" width="60" height="3" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="148" y="96" width="30" height="3" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="216" y="80" width="28" height="22" rx="3" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

export function EcommerceServiceMockup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 280 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none"
      {...props}
    >
      {/* Outer Store Canvas Frame */}
      <rect
        x="6"
        y="6"
        width="268"
        height="128"
        rx="8"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      {/* Store Header */}
      <rect
        x="6"
        y="6"
        width="268"
        height="24"
        rx="8"
        fill="currentColor"
        fillOpacity="0.03"
      />
      <line x1="6" y1="30" x2="274" y2="30" stroke="var(--border)" strokeWidth="1" />

      {/* Store Brand / Logo */}
      <rect x="20" y="15" width="30" height="7" rx="2" fill="currentColor" fillOpacity="0.75" />

      {/* Search Input */}
      <rect
        x="65"
        y="13"
        width="115"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      <rect x="73" y="16.5" width="35" height="3" rx="1" fill="currentColor" fillOpacity="0.25" />

      {/* Header Cart with Notification Dot */}
      <path
        d="M244 14.5h4l2.5 8h10l1.8-6.5h-13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="261" cy="13" r="2.5" fill="var(--accent)" />

      {/* Product Grid (2 Clean Product Bento Cards) */}
      {/* Product Card 1 */}
      <rect
        x="20"
        y="38"
        width="114"
        height="84"
        rx="6"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="var(--border)"
        strokeWidth="1"
      />
      {/* Product Image Area */}
      <rect
        x="26"
        y="44"
        width="102"
        height="40"
        rx="4"
        fill="currentColor"
        fillOpacity="0.07"
      />
      <circle cx="77" cy="64" r="9" fill="currentColor" fillOpacity="0.08" />
      {/* Product Title & Price */}
      <rect x="26" y="90" width="58" height="5" rx="1.5" fill="currentColor" fillOpacity="0.75" />
      <rect x="26" y="99" width="30" height="5" rx="1.5" fill="currentColor" fillOpacity="0.4" />
      {/* Outline Add Button */}
      <rect
        x="92"
        y="94"
        width="36"
        height="16"
        rx="3.5"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      <rect x="100" y="100" width="20" height="4" rx="1" fill="currentColor" fillOpacity="0.5" />

      {/* Product Card 2 (Featured with Single Accent CTA) */}
      <rect
        x="146"
        y="38"
        width="114"
        height="84"
        rx="6"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="var(--accent)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {/* Product Image Area */}
      <rect
        x="152"
        y="44"
        width="102"
        height="40"
        rx="4"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <circle cx="203" cy="64" r="9" fill="currentColor" fillOpacity="0.1" />
      {/* Sale Tag */}
      <rect x="156" y="48" width="22" height="6" rx="2" fill="var(--accent)" fillOpacity="0.18" />
      {/* Product Title & Price */}
      <rect x="152" y="90" width="60" height="5" rx="1.5" fill="currentColor" fillOpacity="0.85" />
      <rect x="152" y="99" width="32" height="6" rx="1.5" fill="currentColor" fillOpacity="0.9" />
      {/* Standout Single Turquoise Add to Cart Button */}
      <rect
        x="214"
        y="94"
        width="42"
        height="16"
        rx="3.5"
        fill="var(--accent)"
      />
      <rect
        x="222"
        y="100"
        width="26"
        height="4"
        rx="1"
        fill="var(--accent-foreground)"
        fillOpacity="0.95"
      />
    </svg>
  );
}

export function SystemsServiceMockup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 280 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none"
      {...props}
    >
      {/* Outer Dashboard Frame */}
      <rect
        x="6"
        y="6"
        width="268"
        height="128"
        rx="8"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      {/* Sidebar Strip */}
      <rect
        x="6"
        y="6"
        width="38"
        height="128"
        rx="8"
        fill="currentColor"
        fillOpacity="0.03"
      />
      <line x1="44" y1="6" x2="44" y2="134" stroke="var(--border)" strokeWidth="1" />

      {/* Sidebar Icons */}
      <rect x="17" y="16" width="14" height="9" rx="2.5" fill="currentColor" fillOpacity="0.4" />

      {/* Active Sidebar Item */}
      <rect x="13" y="36" width="22" height="12" rx="3.5" fill="var(--accent)" fillOpacity="0.15" />
      <circle cx="24" cy="42" r="2.5" fill="var(--accent)" />

      <circle cx="24" cy="59" r="2.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="24" cy="74" r="2.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="24" cy="89" r="2.5" fill="currentColor" fillOpacity="0.25" />

      {/* Dashboard Top Header */}
      <rect
        x="44"
        y="6"
        width="230"
        height="24"
        fill="currentColor"
        fillOpacity="0.02"
      />
      <line x1="44" y1="30" x2="274" y2="30" stroke="var(--border)" strokeWidth="1" />

      {/* Search Input */}
      <rect
        x="54"
        y="13"
        width="90"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      <rect x="62" y="16.5" width="30" height="3" rx="1" fill="currentColor" fillOpacity="0.25" />

      {/* User Profile Pill */}
      <circle cx="258" cy="18" r="4.5" fill="currentColor" fillOpacity="0.2" />

      {/* Dashboard Body */}
      {/* 2 Stat KPI Cards */}
      <rect
        x="54"
        y="38"
        width="102"
        height="26"
        rx="4"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <rect x="62" y="44" width="34" height="4" rx="1" fill="currentColor" fillOpacity="0.4" />
      <rect x="62" y="51" width="46" height="7" rx="1.5" fill="currentColor" fillOpacity="0.85" />

      <rect
        x="164"
        y="38"
        width="100"
        height="26"
        rx="4"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <rect x="172" y="44" width="34" height="4" rx="1" fill="currentColor" fillOpacity="0.4" />
      <rect x="172" y="51" width="44" height="7" rx="1.5" fill="currentColor" fillOpacity="0.85" />

      {/* Main Analytics Chart Card */}
      <rect
        x="54"
        y="70"
        width="210"
        height="54"
        rx="5"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="var(--border)"
        strokeWidth="1"
      />
      {/* Grid Lines */}
      <line x1="62" y1="84" x2="256" y2="84" stroke="var(--border)" strokeDasharray="2 2" strokeWidth="0.8" />
      <line x1="62" y1="102" x2="256" y2="102" stroke="var(--border)" strokeDasharray="2 2" strokeWidth="0.8" />

      {/* Standout Single Turquoise Area Gradient + Trend Sparkline */}
      <path
        d="M 64 108 Q 95 102 120 90 T 170 85 T 215 74 T 252 72 L 252 114 L 64 114 Z"
        fill="var(--accent)"
        fillOpacity="0.08"
      />
      <path
        d="M 64 108 Q 95 102 120 90 T 170 85 T 215 74 T 252 72"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Peak Metric Node */}
      <circle cx="252" cy="72" r="3.5" fill="var(--accent)" stroke="var(--card)" strokeWidth="1.5" />
    </svg>
  );
}

export function UiUxServiceMockup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 280 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto select-none"
      {...props}
    >
      {/* Outer Figma Canvas Frame */}
      <rect
        x="6"
        y="6"
        width="268"
        height="128"
        rx="8"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1.5"
      />

      {/* Canvas Top Toolbar */}
      <rect
        x="6"
        y="6"
        width="268"
        height="24"
        rx="8"
        fill="currentColor"
        fillOpacity="0.03"
      />
      <line x1="6" y1="30" x2="274" y2="30" stroke="var(--border)" strokeWidth="1" />

      {/* Tools / Selection Actions */}
      <rect x="20" y="14" width="9" height="9" rx="2" fill="currentColor" fillOpacity="0.35" />
      <rect x="33" y="14" width="9" height="9" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="46" y="14" width="9" height="9" rx="2" fill="currentColor" fillOpacity="0.2" />

      {/* Frame Label */}
      <rect x="110" y="16" width="60" height="5" rx="1.5" fill="currentColor" fillOpacity="0.2" />

      {/* Zoom Tag */}
      <rect
        x="236"
        y="13"
        width="26"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="var(--border)"
        strokeWidth="0.8"
      />
      <rect x="242" y="16.5" width="14" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />

      {/* Design Artboards on Canvas */}
      {/* Artboard 1: Mobile Wireframe Screen */}
      <rect
        x="22"
        y="38"
        width="66"
        height="84"
        rx="6"
        fill="currentColor"
        fillOpacity="0.03"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <rect x="28" y="44" width="54" height="3" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="28" y="50" width="54" height="24" rx="3" fill="currentColor" fillOpacity="0.08" />
      <rect x="28" y="78" width="54" height="6" rx="2" fill="currentColor" fillOpacity="0.05" />
      <rect x="28" y="87" width="54" height="6" rx="2" fill="currentColor" fillOpacity="0.05" />
      <rect x="28" y="96" width="54" height="6" rx="2" fill="currentColor" fillOpacity="0.05" />

      {/* Artboard 2: Selected Component Frame (with bounding box) */}
      <rect
        x="132"
        y="38"
        width="128"
        height="84"
        rx="6"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="var(--accent)"
        strokeOpacity="0.65"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      {/* Bounding Box Anchors */}
      <rect x="130" y="36" width="4" height="4" rx="1" fill="var(--accent)" />
      <rect x="258" y="36" width="4" height="4" rx="1" fill="var(--accent)" />
      <rect x="130" y="120" width="4" height="4" rx="1" fill="var(--accent)" />
      <rect x="258" y="120" width="4" height="4" rx="1" fill="var(--accent)" />

      {/* Inside Selected Frame */}
      <circle cx="150" cy="54" r="8" fill="currentColor" fillOpacity="0.1" />
      <rect x="164" y="48" width="55" height="5" rx="1.5" fill="currentColor" fillOpacity="0.75" />
      <rect x="164" y="56" width="38" height="4" rx="1" fill="currentColor" fillOpacity="0.3" />
      <rect
        x="142"
        y="68"
        width="108"
        height="44"
        rx="4"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="var(--border)"
        strokeWidth="0.8"
      />

      {/* Figma Flow Connector Line */}
      <path
        d="M 88 62 C 104 62, 114 54, 132 54"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />

      {/* Standout Single Turquoise Vector Designer Cursor */}
      <path
        d="M 106 50 L 118 62 L 112 63 L 114 69 L 110 70 L 108 64 L 102 67 Z"
        fill="var(--accent)"
        stroke="var(--card)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServiceMockup({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case "websites":
      return <WebsitesServiceMockup className={className} />;
    case "ecommerce":
      return <EcommerceServiceMockup className={className} />;
    case "systems":
      return <SystemsServiceMockup className={className} />;
    case "uiux":
      return <UiUxServiceMockup className={className} />;
    default:
      return null;
  }
}
