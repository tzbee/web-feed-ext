const getLocalTimeString = () => new Date().toLocaleTimeString();

export default message => {
	const time = getLocalTimeString();
	const res = `[${time}] [WebFeed] ${message}\n`;
	console.log(res);
};
