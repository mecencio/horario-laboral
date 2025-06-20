export interface IOptions {
    /**
     * The name of the option.
     */
    name: string;

    /**
     * The value of the option.
     */
    value: any;

    /**
     * Indicates whether the option is enabled.
     */
    enabled?: boolean;

    /**
     * Indicates whether the option is visible.
     */
    visible?: boolean;

    /**
     * Indicates whether the option is editable.
     */
    editable?: boolean;

    /**
     * Indicates whether the option is required.
     */
    required?: boolean;
}