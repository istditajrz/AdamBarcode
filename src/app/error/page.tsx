import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert } from "@mantine/core";

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    return <Alert
        variant="filled"
        color="red"
        title="Error"
        icon={<FontAwesomeIcon icon={faCircleInfo} />}
    >
        {params["code"] || "Unknown"}: {params["message"] || "Failed"}
    </Alert>;
}