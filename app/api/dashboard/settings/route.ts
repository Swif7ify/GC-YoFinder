import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/services/Access";
import { getUserSettingsByID, updateUserSettingsByID } from "@/server/handlers/DashboardHandlers";

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userID = user.userID;
        if (!userID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const response = await getUserSettingsByID(userID);
        const statusCode = response.status_code;
        if (response.status.remarks !== "success") {
            return NextResponse.json({ error: response.status.message }, { status: statusCode });
        }
        return NextResponse.json({ settings: response.payload }, { status: statusCode });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userID = user.userID;
        if (!userID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const response = await updateUserSettingsByID(userID, body);
        const statusCode = response.status_code;
        if (response.status.remarks !== "success") {
            return NextResponse.json({ error: response.status.message }, { status: statusCode });
        }
        return NextResponse.json({ message: response.status.message }, { status: statusCode });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

