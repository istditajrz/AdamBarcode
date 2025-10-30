// @ts-expect-error
import "@mantine/core/styles/Input.css"

import { faHashtag, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { type AssetType } from "./assets";

export type Success = { res: boolean, error?: string };

export type HandleTagProps = {
    project_id: string | number;
    assetTypes: AssetType[];
    setAssetTypes: Dispatch<SetStateAction<AssetType[]>>,
}

type ComponentProps = HandleTagProps & {
    handleTag: (props: HandleTagProps, tag: string) => Promise<Success>
    className?: string
};

export function TagInput(props: ComponentProps) {
    const [success, setSuccess] = useState<Success>({ res: true });
    const tag = useRef<HTMLInputElement>(null);

    useEffect(() => {
        tag.current!.onkeydown = async (e) => {
            if (e.key == 'Enter') {
                const res = await props.handleTag(props, tag.current!.value);
                if (!res) {
                    // Fire "failure"
                    setSuccess(res);
                    // Reset
                    setTimeout(() => {
                        setSuccess({ res: true });
                        tag.current!.value = "";
                    }, 500);
                }
            }
        }
    }, [tag]);
    return (
        <TextInput
            ref={tag}
            // label="Tag:"
            aria-label="Tag Input"
            placeholder="A-1234"
            leftSection={
                <FontAwesomeIcon icon={success ? faHashtag : faCircleExclamation} />
            }
            error={success.res ? false : success.error || true}
            className={props.className || ""}
        />
    );
}