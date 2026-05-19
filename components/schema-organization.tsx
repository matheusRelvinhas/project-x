export default function SchemaOrganization() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "REDONDO STATS",
    "url": "https://www.redondostats.site",
    "logo": "https://www.redondostats.site/img/logo-light.png",
    "description": "REDONDO STATS é uma plataforma de estatísticas avançadas de Counter-Strike 2. Analise jogadores, times, campeonatos e partidas com métricas detalhadas e insights competitivos.",
    "email": "contato@redondostats.site",
    "telephone": "+55-31-97145-1910",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}
