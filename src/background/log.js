const getLocalTimeString = () => new Date().toLocaleTimeString();

export default message => {
    const time = getLocalTimeString();
    const res = `[${time}] [Crawler] ${message}\n`;
    console.log(res);
};