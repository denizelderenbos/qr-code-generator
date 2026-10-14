import { Command } from 'commander';
import { CommandClass } from './command';

export default class Kernel {
    private program: Command;

    constructor(commands: Map<string, CommandClass>) {
        this.program = new Command();
        this.program.exitOverride();
        this.program.name('QR code generator');
        for (const [commandName, commandClass] of commands) {
            this.program
                .command(commandName)
                .description(commandClass.description)
                .action(async () => {
                    const instance = new commandClass();
                    await instance.run();
                });
        }
    }

    async handle(argv: string[]) {
        await this.program.parseAsync(argv);
    }
}
