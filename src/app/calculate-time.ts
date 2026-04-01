export function CalculateTime(startDate: string) {
    const start = new Date(startDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years > 0 && months > 0) {
        return `${years} year${years > 1 ? "s" : ""} and ${months} month${months > 1 ? "s" : ""}`;
    } else if (years > 0) {
        return `${years} year${years > 1 ? "s" : ""}`;
    } else {
        return `${months} month${months > 1 ? "s" : ""}`;
    }
}


export function CalculateTimeYearOnly(startDate: string) {
    const start = new Date(startDate);
    const now = new Date();

    const years = now.getFullYear() - start.getFullYear();

    if (years > 0) {
        return `${years}`;
    } 
}