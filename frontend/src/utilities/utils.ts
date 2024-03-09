export const prepareUsersPerMonth = (users: any) => {
    const seriesData = users.reduce((acc: any, user: any) => {
        const month = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short' });
        if (!acc[month]) acc[month] = 0;
        acc[month]++;
        return acc;
    }, {});
    return Object.entries(seriesData).map(([month, count]) => [month, count]);
}
export const calculateTickPositions = (data: any, index: number = 1, ticks = 6) => {
    const maxValue = Math.max(...data.map((d: any) => d[index]));
    const tickInterval = Math.ceil(maxValue / ticks);
    const tickPositions = [];
    for (let i = 0; i <= maxValue; i += tickInterval) {
        tickPositions.push(i);
    }
    return tickPositions;
};
export const prepareByDay = (data: any) => {
    let n: any = {};
    let f = []
    for (let d of data) {
        let date = new Date(d.createdAt).getDate();
        if (n[date]) n[date] = n[date] + Number(d.purchasePrice)
        else n[date] = Number(d.purchasePrice)
    }
    for (let d in n) {
        f.push([parseInt(d), parseInt(n[d])])
    }
    return f
}
export const prepareVisitorsByDay = (data: any) => {
    let n: any = {};
    let f = []
    for (let d of data) {
        let date = new Date(d.createdAt).getDate();
        if (n[date]) n[date] = { v: n[date].v + 1, u: n[date].u + (d.totalVisits === 1 ? 1 : 0) }
        else n[date] = { v: 1, u: d.totalVisits === 1 ? 1 : 0 }
    }
    for (let d in n) {
        f.push([parseInt(d), n[d].v, n[d].u])
    }
    return f
}
export const prepareUsersPerDay = (users: any) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000));
    const seriesData = users.reduce((acc: any, user: any) => {
        const userDate = new Date(user.createdAt);
        if (userDate >= sevenDaysAgo && userDate <= today) {
            const formattedDate = userDate.toLocaleDateString('en-US', { weekday: 'short' })[0];
            if (!acc[formattedDate]) acc[formattedDate] = Number(Object.values(user)[1]);
            acc[formattedDate] = Number(Object.values(user)[1]);
        }
        return acc;
    }, {});
    return Object.entries(seriesData).map(([date, count]) => [date, count]);
};