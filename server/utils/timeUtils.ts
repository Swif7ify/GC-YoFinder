import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getTimeInTimezoneExpire(tz = "Asia/Manila", minutesToAdd = 0) {
	return dayjs().tz(tz).add(minutesToAdd, "minute").format("YYYY-MM-DD HH:mm:ss");
}

export async function getCurrentTimeInTimezone(tz = "Asia/Manila") {
	return dayjs().tz(tz).format("YYYY-MM-DD HH:mm:ss");
}
