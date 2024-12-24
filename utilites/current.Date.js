const newDate = state => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const month = date.getMonth();
    const day = date.getDay();
    const year = date.getYear();
    const yarAray = year.toString().split("");
    if (state) {
        return `${"20" + yarAray[1] + yarAray[2]}/${+month + 1}/${
            day + 1
        } ${hours}-${minutes}-${seconds} ${Date.now()}`;
    }

    return `${"20" + yarAray[1] + yarAray[2]}/${+month + 1}/${
        day + 1
    } ${hours}-${minutes}-${seconds}`;
};
module.exports = newDate