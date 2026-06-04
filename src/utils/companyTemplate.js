import logoIcon from '../assets/icons/logo.png';

export const defaultCompanyTemplate = {
  logoPath: '',
  logoSrc: logoIcon,
  companyName: 'GARIM Co., Ltd.',
  companyDescription: 'GARIM은 안전하고 효율적인 IT 환경을 제공하는 기술 기업입니다.',
  adminEmail: 'support@garim.com',
  adminPhone: '02-1234-5678',
};

function resolveLogoSrc(logoPath) {
  return logoPath || defaultCompanyTemplate.logoSrc;
}

export function normalizeTemplateSettings(settings = {}) {
  const logoPath = settings.logo_path ?? '';

  return {
    logoPath,
    logoSrc: resolveLogoSrc(logoPath),
    companyName: settings.company_name ?? defaultCompanyTemplate.companyName,
    companyDescription: settings.company_description ?? defaultCompanyTemplate.companyDescription,
    adminEmail: settings.support_email ?? defaultCompanyTemplate.adminEmail,
    adminPhone: settings.support_phone ?? defaultCompanyTemplate.adminPhone,
  };
}

export function createTemplateSettingsPayload(template) {
  return {
    logo_path: template.logoPath,
    company_name: template.companyName,
    company_description: template.companyDescription,
    support_email: template.adminEmail,
    support_phone: template.adminPhone,
  };
}
