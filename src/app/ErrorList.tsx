'use client'
// @ts-expect-error
import "@mantine/core/styles/Alert.css"
// @ts-expect-error
import "@mantine/core/styles/Stack.css"
import { Alert, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

type ErrorMap = {
    [index: string]: any
};

export function ErrorList() {
    let index = 0;
    const [errors, setErrors] = useState<ErrorMap>({});

    function addError(e: { error: any }) {
        const i = `${index++}`;
        setErrors(errors => Object.fromEntries(
            [...Object.entries(errors), [i, e.error]]
        ));
        setTimeout(() => {
            let { [i]: _, ...new_errors } = errors;
            setErrors(new_errors);
        }, 10 * 1000);
    }

    useEffect(() => {
        window.addEventListener('error', addError);
    }, [])

    return <Stack>
        {Object.entries(errors).map(
            ([i, v]: [string, any]) => <Alert
                key={i}
                variant="filled"
                color="red"
                withCloseButton
                title="Error"
                icon={<FontAwesomeIcon icon={faCircleInfo} />}
            >
                {v.message}
            </Alert>
        )
        }
    </Stack>;
}