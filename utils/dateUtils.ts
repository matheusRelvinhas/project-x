export const periodText = (period:string) => {
    if (period =='last_month') return 'Último mês';
    else if (period =='3_months') return 'Últimos 3 meses';
    else if (period =='6_months') return 'Últimos 6 meses';
    else if (period =='12_months') return 'Últimos 12 meses';
    else return period;
};