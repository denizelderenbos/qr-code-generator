export type CommandArg = {
    name: string;
    description?: string;
    defaultValue?: string;
};

export default abstract class BaseCommand {
    static commandName: string;
    static description: string;
    static args?: CommandArg[];

    abstract run(): Promise<void>;
}

export type CommandClass = {
    new (): BaseCommand;
    commandName: string;
    description: string;
    args?: CommandArg[];
};
