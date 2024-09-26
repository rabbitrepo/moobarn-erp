export function formatPeriod(dateString: string) {
    const [year, month] = dateString.split('-');
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const thaiMonth = thaiMonths[parseInt(month, 10) - 1];
    const thaiYear = parseInt(year, 10) + 543;

    return `${thaiMonth} ${thaiYear}`;
}

export function formatDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);

    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    return `${day} ${thaiMonths[month - 1]} ${year + 543}`;
}

export function formatThaiDateFromTimestamp(timestamp) {
    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    const date = new Date(timestamp);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear() + 543; // Convert to Buddhist calendar year

    return `${day} ${monthNames[monthIndex]} ${year}`;
}