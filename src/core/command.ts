export default abstract class BaseCommand {
    static commandName: string;
    static description: string;

    abstract run(): Promise<void>;
}

export type CommandClass = {
    new (): BaseCommand;
    commandName: string;
    description: string;
};
