// app/[locale]/(dev)/dev/campaign-suite/_config/previews.mock-data.ts
/**
 * @file previews.mock-data.ts
 * @description SSoT para los datos de mock de alta fidelidad utilizados en la
 *              generación de vistas previas de componentes.
 *              v1.1.0: Añadidos los datos para BenefitsSection.
 * @version 1.1.0
 * @author RaZ Podestá - MetaShark Tech
 */

export const mockHeader = {
  logoUrl: "/img/layout/header/globalfitwell-logo-v2.svg",
  logoAlt: "Logo",
  navLinks: [
    { label: "Home", href: "#" },
    { label: "Store", href: "#" },
    { label: "About", href: "#" },
  ],
  ctaButton: { label: "Get Started", href: "#" },
};

export const mockFooter = {
  newsletter: {
    title: "Stay Updated",
    description: "Get wellness tips and special offers.",
    placeholder: "Your email",
    buttonText: "Subscribe",
  },
  linkColumns: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
      ],
    },
  ],
  socialLinks: [
    { name: "X", url: "#", icon: "Twitter" as const },
    { name: "Instagram", url: "#", icon: "Instagram" as const },
  ],
  copyright: `© ${new Date().getFullYear()} Global Fitwell`,
  disclaimer: "Informational purposes only.",
  developerLink: { text: "MetaShark Tech", href: "#" },
};

export const mockBenefitsSection = {
  eyebrow: "Beneficios",
  title: "Resultados Visibles",
  subtitle: "Una fórmula diseñada para un impacto real.",
  benefits: [
    {
      icon: "ShieldCheck" as const,
      title: "Confort Articular",
      description: "Soporte para la flexibilidad y el movimiento.",
    },
    {
      icon: "Sparkles" as const,
      title: "Acción Antioxidante",
      description: "Protege tus células del estrés oxidativo.",
    },
    {
      icon: "Grape" as const,
      title: "Bienestar Digestivo",
      description: "Promueve un equilibrio intestinal saludable.",
    },
    {
      icon: "Rocket" as const,
      title: "Absorción Potenciada",
      description: "Máxima eficacia gracias a nuestra sinergia.",
    },
  ],
};
// app/[locale]/(dev)/dev/campaign-suite/_config/previews.mock-data.ts
