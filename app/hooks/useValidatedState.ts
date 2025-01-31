import {useState} from "react";

export default function useValidatedState<T,>(initalValue: T, validate: (value: T) => boolean, defaultValue: T) {
    const [state, setState] = useState<T>(initalValue);

    const setValidatedState = (updater: T | ((prev: T) => T)) => {
        setState((prev) => {
            const newValue = typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
            const isValid = validate(newValue);

            if (!isValid) {
                return defaultValue;
            }

            return newValue;
        });
    };

    return [state, setValidatedState] as const;
}